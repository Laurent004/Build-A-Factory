import { Component } from "@flamework/components";
import { OnStart } from "@flamework/core";
import { ItemRecipe, Solid } from "shared/constants/items/types";
import { ITEM_RECIPES, ITEMS } from "shared/constants/items";
import TransporterComponent from "../logistics/transporter";
import { STRUCTURES } from "shared/constants/structures";
import { Object } from "@rbxts/luau-polyfill";

@Component({ tag: "FluidExtractor" })
export default class FluidExtractorComponent extends TransporterComponent implements OnStart {
	private readonly recipe: ItemRecipe =
		ITEM_RECIPES[Object.keys(ITEMS).find((itemName) => this.instance.Name.find(itemName)[0] !== undefined)!];
	private extractionStartTime: number | undefined;
	private extractionThread: thread | undefined;

	protected override initEvents(): void {
		super.initEvents();
		if (this.active && this.canExtract()) this.startExtraction();
		for (const connection of [
			this.OnActiveChanged.Connect(() => {
				if (this.canExtract()) this.startExtraction();
			}),
			this.OnStateChanged.Connect(() => {
				if (this.canExtract()) this.startExtraction();
			}),
		]) {
			this.janitor.Add(connection);
		}
	}

	private startExtraction(): void {
		this.extractionStartTime = time();
		this.extractionThread = task.delay(this.recipe.time, () => {
			this.fluids.set(
				Object.keys(this.recipe.outputItems)[0],
				math.min(
					(this.fluids.get(Object.keys(this.recipe.outputItems)[0]) ?? 0) +
						Object.values(this.recipe.outputItems)[0]!,
					STRUCTURES[this.instance.Name].constants["FluidCapacity"] as number,
				),
			);
			this.transportService.attemptTransport(this);

			this.extractionStartTime = undefined;
			this.extractionThread = undefined;
			if (this.canExtract()) this.startExtraction();
		});
	}

	private canExtract(): boolean {
		return (
			this.active &&
			this.state !== "No Connection" &&
			this.state !== "No Power" &&
			this.extractionThread === undefined &&
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
		super.outputItem(item as string, volume!);
		if (this.canExtract()) this.startExtraction();
	}

	public override clearItems(): void {
		super.clearItems();
		this.extractionStartTime = undefined;
		if (this.extractionThread !== undefined) {
			task.cancel(this.extractionThread);
			this.extractionThread = undefined;
		}
		if (this.canExtract()) this.startExtraction();
	}

	public override updateState(): void {
		this.setState(
			this.fluids.size() > 0 &&
				Object.values(this.fluids)[0] >= (STRUCTURES[this.instance.Name].constants["FluidCapacity"] as number)
				? "Standby"
				: "Working",
		);
	}
}
