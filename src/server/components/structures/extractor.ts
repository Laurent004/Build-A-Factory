import { Component } from "@flamework/components";
import { OnStart, OnTick } from "@flamework/core";
import { Item, ItemRecipe } from "shared/constants/items/types";
import ItemTransportationService from "server/services/plot/item-transportation-service";
import { ITEM_RECIPES } from "shared/constants/items";
import TransporterComponent from "./transporter";
import GridService from "server/services/plot/grid-service";
import { RunService } from "@rbxts/services";

@Component({ tag: "Extractor" })
export default class ExtractorComponent extends TransporterComponent implements OnStart, OnTick {
	private extractionRecipe: ItemRecipe | undefined;
	private extractionItem: Item | undefined;
	private extractionStartTime: number | undefined;

	constructor(gridService: GridService, private readonly itemTransportationService: ItemTransportationService) {
		super(gridService);
	}

	onStart(): void {
		super.onStart();
		this.initExtractionRecipe();
	}

	onTick(dt: number): void {
		if (this.canStartExtraction()) this.startExtraction();
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

	public override outputItem(): Item | undefined {
		const extractionItem = this.extractionItem;
		this.extractionStartTime = undefined;
		this.extractionItem = undefined;
		return extractionItem;
	}

	public override canOutputItem(): boolean {
		return this.extractionItem !== undefined;
	}

	protected override clearItems(): void {
		this.extractionStartTime = undefined;
		this.extractionItem = undefined;
	}

	private startExtraction() {
		this.extractionStartTime = time();
		this.extractionItem = new Item(this.extractionRecipe!.outputItem);
		const extractionRecipe = this.extractionRecipe!;
		task.spawn(() => {
			const connection = RunService.Heartbeat.Connect(() => {
				if (this.extractionStartTime === undefined || this.extractionItem) {
					connection.Disconnect();
					return;
				}

				if (time() - this.extractionStartTime! >= extractionRecipe.time) {
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
}
