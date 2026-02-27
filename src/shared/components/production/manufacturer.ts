import { Component } from "@flamework/components";
import { ItemRecipe, Solid } from "shared/constants/items/types";
import { ITEM_RECIPES, ITEMS } from "shared/constants/items";
import { Object } from "@rbxts/luau-polyfill";
import Signal from "@rbxts/signal";
import { STRUCTURES } from "shared/constants/structures";
import { PowerConsumer } from "shared/services/plot";
import TrackedTransporterComponent from "../logistics/tracked-transporter";
import { RunService } from "@rbxts/services";

@Component({ tag: "Manufacturer" })
export default class ManufacturerComponent extends TrackedTransporterComponent implements PowerConsumer {
	private readonly powerConsumption: number =
		(STRUCTURES[this.instance.Name].constants["PowerConsumption"] as number | undefined) ?? 0;
	private recipe: ItemRecipe | undefined;
	private productionStartTime: number | undefined;
	private productionRecipe: ItemRecipe | undefined;
	private productionThread: thread | undefined;
	public state: string = "No Connection";
	public readonly OnStateChanged = new Signal<(state: string) => void>();

	protected override initEvents(): void {
		super.initEvents();
		this.updateRecipe();
		for (const object of [
			this.OnStateChanged.Connect(() => {
				if (this.canStartProduction()) {
					this.startProduction();
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
		if (this.canStartProduction()) {
			this.startProduction();
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

	private startProduction(): void {
		this.solids.clear();
		this.fluids.clear();
		this.productionStartTime = time();
		this.productionRecipe = this.recipe;
		this.productionThread = task.delay(this.productionRecipe!.time, () => {
			for (const [itemName, count] of Object.entries(this.recipe!.outputItems)) {
				if (ITEMS[itemName].value !== undefined) {
					for (let i = 0; i < count; i++) {
						const newSolid: Solid = {
							name: itemName,
							m: RunService.IsClient() ? this.poolService.get(itemName) : undefined,
							sp: this.instance.GetPivot().Position,
							gp: this.instance.GetPivot().Position,
							p: 0,
							g: this,
						};
						newSolid.m?.PivotTo(this.instance.GetPivot());
						this.solids.push(newSolid);
						this.transportService.registerSolid(newSolid);
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
			(this.powerConsumption === 0 || (this.state !== "No Connection" && this.state !== "No Power")) &&
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
		if (typeIs(item, "table")) {
			super.inputItem(item);
			if (item.m?.Parent !== undefined) {
				this.poolService.add(item.m);
			}
			item.p = -1;
		} else {
			this.fluids.set(item, math.min((this.fluids.get(item) ?? 0) + volume!, this.recipe!.inputItems[item]));
			this.OnInput.Fire(item);
		}
		if (this.canStartProduction()) {
			this.startProduction();
		}
	}

	public override canInputItem(solid: Solid): boolean;
	public override canInputItem(fluid: string): boolean;
	public override canInputItem(item: Solid | string): boolean {
		const itemName = typeIs(item, "table") ? item.name : item;
		return (
			this.recipe !== undefined &&
			this.productionThread === undefined &&
			itemName in this.recipe.inputItems &&
			(typeIs(item, "table")
				? this.queuedSolids.filter((solid) => solid.name === itemName).size() +
						this.solids.filter((solid) => solid.name === itemName).size() <
				  this.recipe.inputItems[itemName]
				: (this.fluids.get(item) ?? 0) < this.recipe.inputItems[item])
		);
	}

	public override outputItem(solid: Solid): void;
	public override outputItem(fluid: string, volume: number): void;
	public override outputItem(item: Solid | string, volume?: number): void {
		if (typeIs(item, "table")) {
			super.outputItem(item);
		} else {
			super.outputItem(item, volume!);
		}
		if (this.solids.size() === 0 && this.fluids.size() === 0) {
			this.productionStartTime = undefined;
			this.productionRecipe = undefined;
			this.productionThread = undefined;
			for (const inputTransporter of this.inputTransporters) {
				this.transportService.attemptTransport(inputTransporter);
			}
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
		this.productionStartTime = undefined;
		this.productionRecipe = undefined;
		if (this.productionThread !== undefined) {
			task.cancel(this.productionThread);
			this.productionThread = undefined;
		}
		super.clearItems();
	}

	public getPowerConsumption(): number {
		return this.state === "No Power" || this.state === "Working" ? this.powerConsumption : 0;
	}

	public getEfficiency(): number {
		if (this.recipe === undefined) return 0;
		const solids = Object.entries(this.recipe!.outputItems).reduce(
			(count, [itemName, count_]) => (count += ITEMS[itemName].value !== undefined ? count_ : 0),
			0,
		);
		const fluids = Object.entries(this.recipe!.outputItems).reduce(
			(count, [itemName, count_]) => (count += ITEMS[itemName].value !== undefined ? 0 : count_),
			0,
		);
		return math.clamp(
			(solids > 0 ? this.getOutputRate("Solid") / ((60 / this.recipe.time) * solids) : 0) +
				(fluids > 0 ? this.getOutputRate("Fluid") / ((60 / this.recipe.time) * fluids) : 0) /
					((solids > 0 ? 1 : 0) + (fluids > 0 ? 1 : 0)),
			0,
			1,
		);
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
				: this.productionStartTime !== undefined &&
				  this.productionRecipe !== undefined &&
				  time() - this.productionStartTime > this.productionRecipe.time
				? "Standby"
				: "Working",
		);
	}
}
