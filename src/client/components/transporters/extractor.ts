import { Component } from "@flamework/components";
import { OnStart, OnTick } from "@flamework/core";
import { ItemRecipe } from "shared/constants/items/types";
import { createItem, ITEM_RECIPES } from "shared/constants/items";
import ItemTransportationService from "client/services/plot/item-transportation-service";
import { getStructureItemNodeWorldCF } from "shared/constants/structures";
import { RunService } from "@rbxts/services";
import IndicatorLightComponent from "./indicator-light";
import StructureStateComponent from "./state";
import TransporterComponent from "./transporter";

@Component({ tag: "Extractor" })
export default class ExtractorComponent extends TransporterComponent implements OnStart, OnTick {
	private readonly itemTransportationService = ItemTransportationService.getInst();
	private extractionRecipe: ItemRecipe | undefined;
	private extractionStartTime: number | undefined;
	private extractionItem: Model | undefined;

	onStart(): void {
		super.onStart();
		this.initExtractionRecipe();
	}

	onTick(dt: number): void {
		if (this.canStartExtraction()) this.startExtraction();
	}

	protected override initComponents(): void {
		super.initComponents();
		this.components.addComponent<StructureStateComponent>(this.instance);
		this.components.addComponent<IndicatorLightComponent>(this.instance.WaitForChild("IndicatorLight"));
	}

	private initExtractionRecipe() {
		const selectedItem = this.attributes.selectedItem;
		if (selectedItem !== undefined) {
			this.extractionRecipe = ITEM_RECIPES.find(
				(itemRecipe) => itemRecipe.structureName === "Extractor" && itemRecipe.outputItem === selectedItem,
			);
		}

		this.onAttributeChanged("selectedItem", (newSelectedItem) => {
			this.extractionRecipe =
				newSelectedItem !== undefined
					? ITEM_RECIPES.find(
							(itemRecipe) =>
								itemRecipe.structureName === "Extractor" && itemRecipe.outputItem === newSelectedItem,
					  )
					: undefined;
		});
	}

	public override outputItem(): Model | undefined {
		const extractionItem = this.extractionItem;
		this.extractionItem = undefined;
		this.extractionStartTime = undefined;
		return extractionItem;
	}

	public override canOutputItem(): boolean {
		return this.extractionItem !== undefined;
	}

	protected override clearItems(): void {
		this.extractionStartTime = undefined;
		this.extractionItem?.Destroy();
		this.extractionItem = undefined;
	}

	private startExtraction() {
		this.extractionStartTime = time();
		this.extractionItem = createItem(this.extractionRecipe!.outputItem, getStructureItemNodeWorldCF(this.instance));
		const extractionRecipe = this.extractionRecipe!;
		task.spawn(() => {
			const connection = RunService.Heartbeat.Connect(() => {
				if (this.extractionStartTime === undefined || this.extractionItem === undefined) {
					connection.Disconnect();
					return;
				}

				if (time() - this.extractionStartTime >= extractionRecipe.time) {
					const outputTransporter = this.getOutputTransporter();
					if (
						outputTransporter !== undefined &&
						outputTransporter.getInputsTransporters().includes(this) &&
						outputTransporter.canInputItem(extractionRecipe.outputItem)
					) {
						this.itemTransportationService.addTransporter(this, outputTransporter);
						connection.Disconnect();
					}
				}
			});
		});
	}

	private canStartExtraction() {
		return (
			this.extractionRecipe !== undefined &&
			this.extractionStartTime === undefined &&
			this.extractionItem === undefined
		);
	}

	public getExtractionProgress() {
		if (this.extractionRecipe === undefined || this.extractionStartTime === undefined) return 0;
		return math.clamp((time() - this.extractionStartTime) / this.extractionRecipe.time, 0, 1);
	}
}
