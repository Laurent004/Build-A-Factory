import { Component } from "@flamework/components";
import { OnStart } from "@flamework/core";
import { ItemRecipe } from "shared/constants/items/types";
import TransporterComponent from "./transporter";
import { ITEM_RECIPES, ITEMS } from "shared/constants/items";
import { Object } from "@rbxts/luau-polyfill";
import { Workspace } from "@rbxts/services";
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

		const productionItem = ITEMS[this.selectedItemRecipe!.outputItem].model.Clone();
		productionItem.PivotTo(new CFrame(this.instance.GetPivot().Position));
		productionItem.Parent = Workspace;
		this.items.push(productionItem);
	}

	private canStartProduction(): boolean {
		return (
			this.active &&
			this.state !== "No Connection" &&
			this.state !== "No Power" &&
			this.productionStartTime === undefined &&
			this.selectedItemRecipe !== undefined &&
			Object.entries(this.selectedItemRecipe.inputItems).every(
				([itemName, count]) =>
					this.items.filter((bufferedItem) => bufferedItem.Name === itemName).size() === count,
			)
		);
	}

	public getProductionProgress(): number {
		return this.productionStartTime !== undefined && this.productionItemRecipe !== undefined
			? math.clamp((time() - this.productionStartTime) / this.productionItemRecipe.time, 0, 1)
			: 0;
	}

	public override inputItem(item: Model): void {
		super.inputItem(item);
		item.Destroy();

		if (this.canStartProduction()) {
			this.startProduction();
		}
	}

	public override outputItem() {
		this.productionStartTime = undefined;
		this.productionItemRecipe = undefined;
		return super.outputItem();
	}

	public override canInputItem(item: Model): boolean {
		if (
			this.selectedItemRecipe === undefined ||
			this.productionStartTime !== undefined ||
			!(item.Name in this.selectedItemRecipe.inputItems)
		)
			return false;

		const count = this.selectedItemRecipe.inputItems[item.Name]!;
		return (
			this.queuedItems.filter((queuedItem) => queuedItem.Name === item.Name).size() < count &&
			this.items.filter((bufferedItem) => bufferedItem.Name === item.Name).size() < count
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
