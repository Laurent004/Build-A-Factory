import { Component } from "@flamework/components";
import { OnStart, OnTick } from "@flamework/core";
import { ItemRecipe } from "shared/constants/items/types";
import { ITEM_RECIPES, ITEMS } from "shared/constants/items";
import { Workspace } from "@rbxts/services";
import TransporterComponent from "./transporter";
import { StructureState } from "shared/constants/structures";

@Component({ tag: "Miner" })
export default class MinerComponent extends TransporterComponent implements OnStart, OnTick {
	private selectedItemRecipe: ItemRecipe | undefined;
	private miningStartTime: number | undefined;
	private miningItemRecipe: ItemRecipe | undefined;

	onStart(): void {
		super.onStart();
		this.initSelectedItemRecipe();
	}

	onTick(): void {
		if (this.canStartMining()) this.startMining();
	}

	private initSelectedItemRecipe(): void {
		this.updateSelectedItemRecipe();
		this.instance.GetAttributeChangedSignal("SelectedItem").Connect(() => {
			this.updateSelectedItemRecipe();
		});
	}

	private updateSelectedItemRecipe(): void {
		const selectedItem = this.instance.GetAttribute("SelectedItem");
		this.selectedItemRecipe = ITEM_RECIPES.find(
			(itemRecipe) => itemRecipe.structureName === "Miner" && itemRecipe.outputItem === selectedItem,
		);
	}

	private startMining(): void {
		this.miningStartTime = time();
		this.miningItemRecipe = this.selectedItemRecipe;

		const extractionItem = ITEMS[this.selectedItemRecipe!.outputItem].model.Clone();
		extractionItem.PivotTo(new CFrame(this.instance.GetPivot().Position));
		extractionItem.Parent = Workspace;
		this.items.push(extractionItem);
		this.transportService.registerToQueue(this);
	}

	private canStartMining(): boolean {
		return (
			this.active &&
			this.state !== "No Connection" &&
			this.state !== "No Power" &&
			this.selectedItemRecipe !== undefined &&
			this.miningStartTime === undefined
		);
	}

	public getMiningProgress(): number {
		return this.miningStartTime !== undefined && this.miningItemRecipe !== undefined
			? math.clamp((time() - this.miningStartTime) / this.miningItemRecipe.time, 0, 1)
			: 0;
	}

	public override outputItem(): Model | undefined {
		this.miningStartTime = undefined;
		this.miningItemRecipe = undefined;
		return super.outputItem();
	}

	public override canOutputItem(): boolean {
		return (
			this.miningStartTime !== undefined &&
			this.miningItemRecipe !== undefined &&
			time() - this.miningStartTime >= this.miningItemRecipe.time
		);
	}

	protected override clearItems(): void {
		super.clearItems();
		this.miningStartTime = undefined;
		this.miningItemRecipe = undefined;
	}

	public override updateState(): void {
		let state: StructureState | undefined = undefined;
		if (this.selectedItemRecipe === undefined) {
			state = "No Connection";
		} else if (
			this.miningStartTime !== undefined &&
			this.miningItemRecipe !== undefined &&
			time() - this.miningStartTime > this.miningItemRecipe.time
		) {
			state = "Standby";
		} else {
			state = "Working";
		}

		if (this.state !== state) {
			this.state = state;
			this.onStateChanged.Fire(state);
		}
	}
}
