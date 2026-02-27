import { Component } from "@flamework/components";
import { ItemRecipe, Solid } from "shared/constants/items/types";
import { ITEM_RECIPES } from "shared/constants/items";
import { STRUCTURES } from "shared/constants/structures";
import { Object } from "@rbxts/luau-polyfill";
import Signal from "@rbxts/signal";
import TrackedTransporterComponent from "../logistics/tracked-transporter";
import { PowerConsumer } from "shared/services/plot";

@Component({ tag: "FluidExtractor" })
export default class FluidExtractorComponent extends TrackedTransporterComponent implements PowerConsumer {
	private readonly powerConsumption: number = STRUCTURES[this.instance.Name].constants["PowerConsumption"] as number;
	private readonly recipe: ItemRecipe = ITEM_RECIPES[STRUCTURES[this.instance.Name].constants["Recipe"] as string];
	private extractionStartTime: number | undefined;
	private extractionThread: thread | undefined;
	public state: string = "No Connection";
	public readonly OnStateChanged = new Signal<(state: string) => void>();

	protected override initEvents(): void {
		super.initEvents();
		if (this.canExtract()) {
			this.startExtraction();
		}
		for (const object of [
			this.OnStateChanged.Connect(() => {
				if (this.canExtract()) {
					this.startExtraction();
				}
			}),
			this.OnStateChanged,
		]) {
			this.janitor.Add(object);
		}
	}

	protected override onActiveChanged(active: boolean): void {
		super.onActiveChanged(active);
		if (this.canExtract()) {
			this.startExtraction();
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
					this.fluidCapacity,
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
			(this.fluids.size() === 0 || Object.values(this.fluids)[0] < this.fluidCapacity)
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

	public getPowerConsumption(): number {
		return this.state === "No Power" || this.state === "Working" ? this.powerConsumption : 0;
	}

	public getEfficiency(): number {
		print(
			this.getOutputRate("Fluid"),
			(60 / this.recipe.time) *
				Object.entries(this.recipe!.outputItems).reduce((count, [, count_]) => (count += count_), 0),
		);
		return this.recipe !== undefined
			? math.clamp(
					this.getOutputRate("Fluid") /
						((60 / this.recipe.time) *
							Object.entries(this.recipe!.outputItems).reduce(
								(count, [, count_]) => (count += count_),
								0,
							)),
					0,
					1,
			  )
			: 0;
	}

	public setState(state: string): void {
		if (this.state !== state) {
			this.state = state;
			this.OnStateChanged.Fire(state);
		}
	}

	public updateState(): void {
		this.setState(
			this.fluids.size() > 0 && Object.values(this.fluids)[0] >= this.fluidCapacity ? "Standby" : "Working",
		);
	}
}
