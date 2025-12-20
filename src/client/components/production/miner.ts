import { Component } from "@flamework/components";
import { OnStart } from "@flamework/core";
import { ItemRecipe, Solid } from "shared/constants/items/types";
import { ITEM_RECIPES } from "shared/constants/items";
import TransporterComponent from "../logistics/transporter";
import { StructureState } from "shared/constants/structures";
import { Object } from "@rbxts/luau-polyfill";
import { Events } from "client/network";
import { EventBus } from "client/event-bus";

let renderItems: number[];
Events.OnDataInitialization.connect((data) => {
	renderItems = data.settings.renderItems;
});
EventBus.OnSettingChange.Connect((settingName, settingValue) => {
	if (settingName !== "renderItems") return;
	renderItems = settingValue as number[];
});

@Component({ tag: "Miner" })
export default class MinerComponent extends TransporterComponent implements OnStart {
	private recipe: ItemRecipe | undefined;
	private miningStartTime: number | undefined;
	private miningRecipe: ItemRecipe | undefined;

	onStart(): void {
		super.onStart();
		this.initRecipe();
	}

	protected override initEvents(): void {
		super.initEvents();
		if (this.active && this.canStartMining()) this.startMining();
		this.connections.push(
			this.onActiveChanged.Connect(() => {
				if (this.canStartMining()) this.startMining();
			}),
			this.onStateChanged.Connect(() => {
				if (this.canStartMining()) this.startMining();
			}),
		);
	}

	private initRecipe(): void {
		this.updateRecipe();
		this.instance.GetAttributeChangedSignal("Recipe").Connect(() => {
			this.updateRecipe();
		});
	}

	private updateRecipe(): void {
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
		for (const [itemName, count] of Object.entries(this.recipe!.outputItems)) {
			for (let i = 0; i < count; i++) {
				const newSolid = new Solid(itemName, renderItems.includes(this.player.UserId));
				newSolid.model?.PivotTo(new CFrame(this.instance.GetPivot().Position));
				this.inputItem(newSolid);
			}
		}
		this.transportService.registerToQueue(this);
	}

	private canStartMining(): boolean {
		return (
			this.active &&
			this.state !== "No Connection" &&
			this.state !== "No Power" &&
			this.recipe !== undefined &&
			this.miningStartTime === undefined
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
			if (this.canStartMining()) this.startMining();
		}
	}

	public override canOutputItem(): boolean {
		return (
			this.active &&
			this.miningStartTime !== undefined &&
			this.miningRecipe !== undefined &&
			time() - this.miningStartTime >= this.miningRecipe.time
		);
	}

	protected override clearItems(): void {
		super.clearItems();
		this.miningStartTime = undefined;
		this.miningRecipe = undefined;
		if (this.canStartMining()) this.startMining();
	}

	public override updateState(): void {
		let state: StructureState | undefined;
		if (this.recipe === undefined) {
			state = "No Connection";
		} else if (
			this.miningStartTime !== undefined &&
			this.miningRecipe !== undefined &&
			time() - this.miningStartTime > this.miningRecipe.time
		) {
			state = "Standby";
		} else {
			state = "Working";
		}
		this.setState(state);
	}
}
