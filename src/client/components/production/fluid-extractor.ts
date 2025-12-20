import { Component } from "@flamework/components";
import { OnStart } from "@flamework/core";
import { ItemRecipe, Solid } from "shared/constants/items/types";
import { ITEM_RECIPES, ITEMS } from "shared/constants/items";
import TransporterComponent from "../logistics/transporter";
import { STRUCTURES } from "shared/constants/structures";
import { Object } from "@rbxts/luau-polyfill";
import { RunService } from "@rbxts/services";

@Component({ tag: "FluidExtractor" })
export default class FluidExtractorComponent extends TransporterComponent implements OnStart {
	private readonly recipe: ItemRecipe =
		ITEM_RECIPES[Object.keys(ITEMS).find((itemName) => this.instance.Name.find(itemName)[0] !== undefined)!];
	private extractionStartTime: number | undefined;

	protected override initEvents(): void {
		super.initEvents();
		if (this.active && this.canExtract()) this.startExtraction();
		this.connections.push(
			this.onActiveChanged.Connect(() => {
				if (this.canExtract()) this.startExtraction();
			}),
			this.onStateChanged.Connect(() => {
				if (this.canExtract()) this.startExtraction();
			}),
		);
	}

	private startExtraction(): void {
		this.extractionStartTime = time();
		task.delay(this.recipe.time, () => {
			if (time() - (this.extractionStartTime ?? time()) < this.recipe.time) return;
			this.inputItem(Object.keys(this.recipe.outputItems)[0], Object.values(this.recipe.outputItems)[0]!);
			this.extractionStartTime = undefined;
			if (this.canExtract()) this.startExtraction();
		});
		this.transportService.registerToQueue(this);
	}

	private canExtract(): boolean {
		return (
			this.active &&
			this.state !== "No Connection" &&
			this.state !== "No Power" &&
			this.extractionStartTime === undefined &&
			(this.fluids.size() === 0 ||
				Object.values(this.fluids)[0] < (STRUCTURES[this.instance.Name].constants["FluidCapacity"] as number))
		);
	}

	public getExtractionProgress(): number {
		return this.extractionStartTime !== undefined
			? math.clamp((time() - this.extractionStartTime) / this.recipe.time, 0, 1)
			: 0;
	}

	public override outputItem(solid: Solid): void;
	public override outputItem(fluid: string, volume: number): void;
	public override outputItem(item: Solid | string, volume?: number): void {
		if (!typeIs(item, "string")) return;
		super.outputItem(item, volume!);
		if (this.canExtract()) this.startExtraction();
	}

	public override clearItems(): void {
		super.clearItems();
		this.extractionStartTime = undefined;
		if (this.canExtract()) this.startExtraction();
	}

	public override updateState(): void {
		this.setState(
			this.fluids.size() === 0 ||
				Object.values(this.fluids)[0] < (STRUCTURES[this.instance.Name].constants["FluidCapacity"] as number)
				? "Working"
				: "Standby",
		);
	}
}
