import { Component } from "@flamework/components";
import { OnStart } from "@flamework/core";
import { ItemName, ItemRecipe } from "shared/constants/items/types";
import TransporterComponent from "./transporter";
import { createItem, ITEM_RECIPES } from "shared/constants/items";
import { getStructureItemNodeWorldCF } from "shared/constants/structures";
import { Object } from "@rbxts/luau-polyfill";
import StructureStateComponent from "./state";
import IndicatorLightComponent from "./indicator-light";

@Component({ tag: "Manufacturer" })
export default class ManufacturerComponent extends TransporterComponent implements OnStart {
	private productionRecipe: ItemRecipe | undefined;
	private productionItem: Model | undefined;
	private productionStartTime: number | undefined;

	onStart(): void {
		super.onStart();
		this.initProductionRecipe();
	}

	protected override initComponents(): void {
		super.initComponents();
		this.components.addComponent<StructureStateComponent>(this.instance);
		this.components.addComponent<IndicatorLightComponent>(this.instance.WaitForChild("IndicatorLight"));
	}

	protected override initEvents(): void {
		super.initEvents();
		this.instance.Destroying.Connect(() => {
			this.productionItem = undefined;
		});
	}

	private initProductionRecipe() {
		const selectedItem = this.attributes.selectedItem;
		if (selectedItem !== undefined) {
			this.productionRecipe = ITEM_RECIPES.find(
				(itemRecipe) =>
					itemRecipe.structureName === this.instance.Name && itemRecipe.outputItem === selectedItem,
			);
		}

		this.onAttributeChanged("selectedItem", (newSelectedItem) => {
			this.productionRecipe =
				newSelectedItem !== undefined
					? ITEM_RECIPES.find(
							(itemRecipe) =>
								itemRecipe.structureName === this.instance.Name &&
								itemRecipe.outputItem === newSelectedItem,
					  )
					: undefined;
		});
	}

	public override inputItem(item: Model): void {
		super.inputItem(item);
		item.Destroy();
		if (this.canStartProduction()) {
			this.startProduction();
		}
	}

	public override outputItem(): Model {
		const productionItem = this.productionItem;
		this.productionStartTime = undefined;
		this.productionItem = undefined;
		return productionItem!;
	}

	public override canInputItem(itemName: ItemName): boolean {
		if (this.productionRecipe === undefined) return false;
		if (itemName in this.productionRecipe.inputItems) {
			const queuedItemCount = this.queuedItems.filter((item) => item.Name === itemName).size();
			const bufferedItemCount = this.items.filter((item) => item.Name === itemName).size();
			const requiredItemCount = this.productionRecipe.inputItems[itemName as ItemName]!;
			return (
				this.productionItem === undefined &&
				queuedItemCount < requiredItemCount &&
				bufferedItemCount < requiredItemCount
			);
		}
		return false;
	}

	public override canOutputItem(): boolean {
		return (
			this.productionStartTime !== undefined &&
			this.productionRecipe !== undefined &&
			time() - this.productionStartTime >= this.productionRecipe.time
		);
	}

	private startProduction() {
		this.productionStartTime = time();
		this.productionItem = createItem(this.productionRecipe!.outputItem, getStructureItemNodeWorldCF(this.instance));
		this.items.clear();
	}

	private canStartProduction(): boolean {
		if (this.productionRecipe === undefined) return false;
		for (const [item, requiredItemCount] of Object.entries(this.productionRecipe.inputItems)) {
			const bufferedItemCount = this.items.filter((bufferedItem) => bufferedItem.Name === item).size();
			if (bufferedItemCount < requiredItemCount) return false;
		}
		return true;
	}

	public override getItem(): Model | undefined {
		return this.productionItem;
	}

	public getProductionProgress() {
		if (this.productionRecipe === undefined || this.productionStartTime === undefined) return 0;
		return math.clamp((time() - this.productionStartTime) / this.productionRecipe.time, 0, 1);
	}
}
