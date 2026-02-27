import { Component } from "@flamework/components";
import { ItemRecipe, Solid } from "shared/constants/items/types";
import { ITEM_RECIPES } from "shared/constants/items";
import TransporterComponent from "../logistics/transporter";
import { Object } from "@rbxts/luau-polyfill";
import { store } from "client/store";

@Component({ tag: "Miner" })
export default class MinerComponent extends TransporterComponent {
	private recipe: ItemRecipe | undefined;
	private miningStartTime: number | undefined;
	private miningRecipe: ItemRecipe | undefined;
	private miningThread: thread | undefined;

	protected override initEvents(): void {
		super.initEvents();
		this.updateRecipe()
		if (this.active && this.canStartMining()) this.startMining();
		for(const connection of [
			this.OnActiveChanged.Connect(() => {
				if (this.canStartMining()) this.startMining();
			}),
			this.OnStateChanged.Connect(() => {
				if (this.canStartMining()) this.startMining();
			}),
			this.instance.GetAttributeChangedSignal("Recipe").Connect(() => {
				this.updateRecipe()
			})
		]){
			this.janitor.Add(connection);
		}
	}

	private updateRecipe():void{
		const recipe = this.instance.GetAttribute("Recipe") as string | undefined;
		this.recipe =
			recipe !== undefined
				? ITEM_RECIPES[recipe].structureName === this.instance.Name
					? ITEM_RECIPES[recipe]
					: undefined
				: undefined;
		if (this.canStartMining()) this.startMining();
	}


	private startMining(): void {
		this.miningStartTime = time();
		this.miningRecipe = this.recipe;
		this.miningThread = task.delay(this.miningRecipe!.time, () => {
			for (const [itemName, count] of Object.entries(this.recipe!.outputItems)) {
				for (let i = 0; i < count; i++) {
					const newSolid = new Solid(itemName, store.getState().settings.settings.renderItems.includes(this.player.UserId));
					newSolid.model?.PivotTo(new CFrame(this.instance.GetPivot().Position));
					this.solids.push(newSolid);
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

	public override updateState(): void {
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
