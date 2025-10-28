import { Component } from "@flamework/components";
import { OnStart } from "@flamework/core";
import { Item, ItemRecipe } from "shared/constants/items/types";
import { ITEM_RECIPES } from "shared/constants/items";
import { Object } from "@rbxts/luau-polyfill";
import TransporterComponent from "./transporter";
import { StructureState } from "shared/constants/structures";

@Component({ tag: "Manufacturer" })
export default class ManufacturerComponent extends TransporterComponent implements OnStart {
	private selectedItemRecipe: ItemRecipe | undefined;
	private productionStartTime: number | undefined;
	private productionItemRecipe: ItemRecipe | undefined;

	onStart(): void {
		super.onStart();
		this.initSelectedItemRecipe();
	}

	protected override initEvents(): void {
		super.initEvents();
		this.onStateChanged.Connect(() => {
			if (this.canStartProduction()) {
				this.startProduction();
			}
		});
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
			(itemRecipe) => itemRecipe.structureName === this.instance.Name && itemRecipe.outputItem === selectedItem,
		);
	}

	private startProduction(): void {
		this.productionStartTime = time();
		this.productionItemRecipe = this.selectedItemRecipe;
		this.items.clear();

		const productionItem = new Item(this.selectedItemRecipe!.outputItem);
		this.items.push(productionItem);
	}

	private canStartProduction(): boolean {
		return (
			this.state !== "No Connection" &&
			this.state !== "No Power" &&
			this.productionStartTime === undefined &&
			this.selectedItemRecipe !== undefined &&
			Object.entries(this.selectedItemRecipe.inputItems).every(
				([itemName, count]) =>
					[...this.items].filter((bufferedItem) => bufferedItem.name === itemName).size() === count,
			)
		);
	}

	public override inputItem(item: Item): void {
		super.inputItem(item);
		item.destroyed = true;

		if (this.canStartProduction()) {
			this.startProduction();
		}
	}

	public override outputItem(): Item | undefined {
		this.productionStartTime = undefined;
		this.productionItemRecipe = undefined;
		return super.outputItem();
	}

	public override canInputItem(item: Item): boolean {
		if (
			this.selectedItemRecipe === undefined ||
			this.productionStartTime !== undefined ||
			!(item.name in this.selectedItemRecipe.inputItems)
		)
			return false;

		const count = this.selectedItemRecipe.inputItems[item.name]!;
		return (
			this.queuedItems.filter((queuedItem) => queuedItem.name === item.name).size() < count &&
			this.items.filter((bufferedItem) => bufferedItem.name === item.name).size() < count
		);
	}

	public override canOutputItem(): boolean {
		return (
			this.productionStartTime !== undefined &&
			this.productionItemRecipe !== undefined &&
			time() - this.productionStartTime >= this.productionItemRecipe.time
		);
	}

	public override clearItems(): void {
		super.clearItems();
		this.productionStartTime = undefined;
		this.productionItemRecipe = undefined;
	}

	public override updateState(): void {
		let state: StructureState | undefined = undefined;
		if (this.selectedItemRecipe === undefined) {
			state = "No Connection";
		} else if (
			this.productionStartTime !== undefined &&
			this.productionItemRecipe !== undefined &&
			time() - this.productionStartTime > this.productionItemRecipe.time
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
