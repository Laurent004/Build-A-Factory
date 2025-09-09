import { Component } from "@flamework/components";
import { OnStart } from "@flamework/core";
import { Item, ItemName, ItemRecipe } from "shared/constants/items/types";
import { ITEM_RECIPES } from "shared/constants/items";
import { Object } from "@rbxts/luau-polyfill";
import TransporterComponent from "./transporter";
import { Events } from "server/network";

@Component({ tag: "Manufacturer" })
export default class ManufacturerComponent extends TransporterComponent implements OnStart {
	private productionRecipe: ItemRecipe | undefined;
	private productionItem: Item | undefined;
	private productionStartTime: number | undefined;

	onStart(): void {
		super.onStart();
		this.initProductionRecipe();
	}

	protected override initEvents(): void {
		super.initEvents();
		Events.StartStructuresMovement.connect((_, structuresModels) => {
			if (structuresModels.includes(this.instance)) {
				this.productionItem = undefined;
				this.productionStartTime = undefined;
			}
		});
		Events.ClearStructuresItems.connect((_, structuresModels) => {
			if (structuresModels.includes(this.instance)) {
				this.productionItem = undefined;
				this.productionStartTime = undefined;
			}
		});
		this.instance.Destroying.Connect(() => {
			this.productionItem = undefined;
			this.productionStartTime = undefined;
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

	public override inputItem(item: Item): void {
		super.inputItem(item);
		if (this.canStartProduction()) {
			this.startProduction();
		}
	}

	public override outputItem(): Item {
		const productionItem = this.productionItem;
		this.productionItem = undefined;
		this.productionStartTime = undefined;
		return productionItem!;
	}

	public override canInputItem(item: ItemName): boolean {
		if (this.productionRecipe === undefined) return false;
		if (item in this.productionRecipe.inputItems) {
			const queuedItemCount = this.queuedItems.filter((queuedItem) => queuedItem.getName() === item).size();
			const bufferedItemCount = this.items.filter((bufferedItem) => bufferedItem.getName() === item).size();
			const requiredItemCount = this.productionRecipe.inputItems[item]!;
			return (
				this.productionStartTime === undefined &&
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
		this.items.clear();
		this.productionItem = new Item(this.productionRecipe!.outputItem);
	}

	private canStartProduction(): boolean {
		if (this.productionRecipe === undefined) return false;
		for (const [itemName, requiredItemCount] of Object.entries(this.productionRecipe.inputItems)) {
			const bufferedItemCount = this.items.filter((item) => item.getName() === itemName).size();
			if (bufferedItemCount < requiredItemCount) return false;
		}
		return true;
	}

	public override getItem(): Item | undefined {
		return this.productionItem;
	}
}
