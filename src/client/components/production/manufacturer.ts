import { Component } from "@flamework/components";
import { OnStart } from "@flamework/core";
import { ItemRecipe, Solid } from "shared/constants/items/types";
import TransporterComponent from "../logistics/transporter";
import { ITEM_RECIPES, ITEMS } from "shared/constants/items";
import { Object } from "@rbxts/luau-polyfill";
import { Events } from "client/network";
import { EventBus } from "client/event-bus";

let renderItems: number[];
Events.OnDataInitialization.connect((data) => {
	renderItems = data.settings.renderItems;
});
EventBus.OnSettingChange.Connect((settingName, settingValue) => {
	renderItems = settingName === "renderItems" ? (settingValue as number[]) : renderItems;
});

@Component({ tag: "Manufacturer" })
export default class ManufacturerComponent extends TransporterComponent implements OnStart {
	private recipe: ItemRecipe | undefined;
	private productionStartTime: number | undefined;
	private productionRecipe: ItemRecipe | undefined;
	private productionThread: thread | undefined;

	protected override initEvents(): void {
		super.initEvents();
		this.updateRecipe()
		this.connections.push(
			this.OnActiveChanged.Connect(() => {
				if (this.canStartProduction()) this.startProduction();
			}),
			this.OnStateChanged.Connect(() => {
				if (this.canStartProduction()) this.startProduction();
			}),
			this.instance.GetAttributeChangedSignal("Recipe").Connect(() => {
				this.updateRecipe()
			})
		);
	}

	private updateRecipe():void{
		const recipe = this.instance.GetAttribute("Recipe") as string | undefined;
		this.recipe =
			recipe !== undefined
				? ITEM_RECIPES[recipe].structureName === this.instance.Name
					? ITEM_RECIPES[recipe]
					: undefined
				: undefined;
		if(recipe!==undefined){
			for(const inputTransporter of this.inputTransporters){
				this.transportService.attemptTransport(inputTransporter)
			}
		}
	}

	private startProduction(): void {
		this.solids.clear();
		this.fluids.clear();
		this.productionStartTime = time();
		this.productionRecipe = this.recipe;
		this.productionThread = task.delay(this.productionRecipe!.time, () => {
			for (const [itemName, count] of Object.entries(this.recipe!.outputItems)) {
				if (ITEMS[itemName].model !== undefined) {
					for (let i = 0; i < count; i++) {
						const newSolid = new Solid(itemName, renderItems.includes(this.player.UserId));
						newSolid.model?.PivotTo(new CFrame(this.instance.GetPivot().Position));
						this.solids.push(newSolid);
					}
				} else {
					this.fluids.set(itemName, count);
				}
			}
			this.transportService.attemptTransport(this);
		});
	}

	private canStartProduction(): boolean {
		return (
			this.active &&
			this.state !== "No Connection" &&
			this.state !== "No Power" &&
			this.recipe !== undefined &&
			this.productionThread === undefined &&
			Object.entries(this.recipe.inputItems).every(
				([itemName, count]) =>
					this.solids.filter((solid) => solid.name === itemName).size() === count ||
					(this.fluids.get(itemName) ?? 0) >= count,
			)
		);
	}

	public getProductionProgress(): number {
		return this.productionStartTime !== undefined && this.productionRecipe !== undefined
			? math.clamp((time() - this.productionStartTime) / this.productionRecipe.time, 0, 1)
			: 0;
	}

	public override inputItem(solid: Solid): void;
	public override inputItem(fluid: string, volume: number): void;
	public override inputItem(item: Solid | string, volume?: number): void {
		if (item instanceof Solid) {
			super.inputItem(item);
			item.model?.Destroy();
			item.destroyed = true;
		} else {
			super.inputItem(item, volume!);
		}
		if (this.canStartProduction()) this.startProduction();
	}

	public override canInputItem(solid: Solid): boolean;
	public override canInputItem(fluid: string): boolean;
	public override canInputItem(item: Solid | string): boolean {
		return (
			this.recipe !== undefined &&
			this.productionThread === undefined &&
			(item instanceof Solid ? item.name : item) in this.recipe.inputItems &&
			(item instanceof Solid
				? this.queuedSolids.filter((solid) => solid.name === item.name).size() +
						this.solids.filter((solid) => solid.name === item.name).size() <
				  this.recipe.inputItems[item.name]!
				: (this.fluids.get(item) ?? 0) < this.recipe.inputItems[item])
		);
	}

	public override outputItem(solid: Solid): void;
	public override outputItem(fluid: string, volume: number): void;
	public override outputItem(item: Solid | string, volume?: number): void {
		if (item instanceof Solid) {
			super.outputItem(item);
		} else {
			super.outputItem(item, volume!);
		}
		if (this.solids.size() === 0 && this.fluids.size() === 0) {
			this.productionStartTime = undefined;
			this.productionRecipe = undefined;
			this.productionThread = undefined;
		}
	}

	public override canOutputItem(): boolean {
		return (
			this.active &&
			this.productionStartTime !== undefined &&
			this.productionRecipe !== undefined &&
			time() - this.productionStartTime > 0.1
		);
	}

	public override clearItems(): void {
		super.clearItems();
		this.productionStartTime = undefined;
		this.productionRecipe = undefined;
		if (this.productionThread !== undefined) {
			task.cancel(this.productionThread);
			this.productionThread = undefined;
		}
	}

	public override updateState(): void {
		this.setState(
			this.recipe === undefined
				? "No Connection"
				: this.productionStartTime !== undefined &&
				  this.productionRecipe !== undefined &&
				  time() - this.productionStartTime > this.productionRecipe.time
				? "Standby"
				: "Working",
		);
	}
}
