import { Component } from "@flamework/components";
import { ItemRecipe, Solid } from "shared/constants/items/types";
import { ITEM_RECIPES } from "shared/constants/items";
import { Object } from "@rbxts/luau-polyfill";
import Signal from "@rbxts/signal";
import { STRUCTURES } from "shared/constants/structures";
import TrackedTransporterComponent from "../logistics/tracked-transporter";
import { PowerConsumer } from "shared/services/plot";
import { ReplicatedStorage, RunService, Workspace } from "@rbxts/services";

@Component({ tag: "Miner" })
export default class MinerComponent extends TrackedTransporterComponent implements PowerConsumer {
	private readonly powerConsumption: number = STRUCTURES[this.instance.Name].constants["PowerConsumption"] as number;
	private recipe: ItemRecipe | undefined;
	private miningStartTime: number | undefined;
	private miningRecipe: ItemRecipe | undefined;
	private miningThread: thread | undefined;
	public state: string = "No Connection";
	public readonly OnStateChanged = new Signal<(state: string) => void>();

	protected override initEvents(): void {
		super.initEvents();
		this.updateRecipe();
		if (this.canStartMining()) {
			this.startMining();
		}
		for (const object of [
			this.OnStateChanged.Connect(() => {
				if (this.canStartMining()) {
					this.startMining();
				}
			}),
			this.instance.GetAttributeChangedSignal("Recipe").Connect(() => {
				this.updateRecipe();
			}),
			this.OnStateChanged,
		]) {
			this.janitor.Add(object);
		}
	}

	protected override onActiveChanged(active: boolean): void {
		super.onActiveChanged(active);
		if (this.canStartMining()) {
			this.startMining();
		}
	}

	private updateRecipe(): void {
		const recipe = this.instance.GetAttribute("Recipe") as string | undefined;
		this.recipe =
			recipe !== undefined
				? ITEM_RECIPES[recipe].structureName === this.instance.Name
					? ITEM_RECIPES[recipe]
					: undefined
				: undefined;
		this.clearItems();
	}

	private startMining(): void {
		this.miningStartTime = time();
		this.miningRecipe = this.recipe;
		this.miningThread = task.delay(this.miningRecipe!.time, () => {
			for (const [itemName, count] of Object.entries(this.recipe!.outputItems)) {
				for (let i = 0; i < count; i++) {
					const newSolid: Solid = {
						name: itemName,
						m: RunService.IsClient() ? this.poolService.get(itemName) : undefined,
						sp:this.instance.GetPivot().Position,
						gp:this.instance.GetPivot().Position,
						p: 0,
						g:this,
					};
					newSolid.m?.PivotTo(this.instance.GetPivot());
					this.solids.push(newSolid);
					this.transportService.registerSolid(newSolid)
				}
			}
			this.transportService.attemptTransport(this);
		});
	}

	private canStartMining(): boolean {
		return (
			this.active &&
			this.state !== "No Connection" &&
			this.state !== "No Power" &&
			this.recipe !== undefined &&
			this.miningThread === undefined
		);
	}

	public getMiningProgress(): number {
		return this.miningStartTime !== undefined && this.miningRecipe !== undefined
			? math.clamp((time() - this.miningStartTime) / this.miningRecipe.time, 0, 1)
			: 0;
	}

	public override outputItem(solid: Solid): void;
	public override outputItem(fluid: string, volume: number): void;
	public override outputItem(item: Solid | string, volume?: number): void {
		super.outputItem(item as Solid);
		if (this.solids.size() === 0) {
			this.miningStartTime = undefined;
			this.miningRecipe = undefined;
			this.miningThread = undefined;
			if (this.canStartMining()) this.startMining();
		}
	}

	protected override clearItems(): void {
		super.clearItems();
		this.miningStartTime = undefined;
		this.miningRecipe = undefined;
		if (this.miningThread !== undefined) {
			task.cancel(this.miningThread);
			this.miningThread = undefined;
		}
		if (this.canStartMining()) this.startMining();
	}

	public getPowerConsumption(): number {
		return this.state === "No Power" || this.state === "Working" ? this.powerConsumption : 0;
	}

	public getEfficiency(): number {
		return this.recipe !== undefined
			? math.clamp(
					this.getOutputRate("Solid") /
						((60 / this.recipe.time) *
							Object.entries(this.recipe!.outputItems).reduce(
								(count, [, count_]) => (count += count_),
								0,
							)),
					0,
					1,
			  )
			: 0;
	}

	public setState(state: string): void {
		if (this.state !== state) {
			this.state = state;
			this.OnStateChanged.Fire(state);
		}
	}

	public updateState(): void {
		this.setState(
			this.recipe === undefined
				? "No Connection"
				: this.miningStartTime !== undefined &&
				  this.miningRecipe !== undefined &&
				  time() - this.miningStartTime > this.miningRecipe.time
				? "Standby"
				: "Working",
		);
	}
}
