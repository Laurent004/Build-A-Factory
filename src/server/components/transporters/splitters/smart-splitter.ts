import { Component } from "@flamework/components";
import TransporterComponent from "../transporter";
import { OnStart } from "@flamework/core";
import { Item, ITEMS } from "shared/constants/items";
import { Object } from "@rbxts/luau-polyfill";
import { SplitterOutputDirection, splitterOutputDirections } from "./splitter";

export const splitterOutputFilters = [
	"None",
	"Any",
	"Overflow",
	"Any (undefined)",
	...Object.entries(ITEMS)
		.sort(([, itemADefinition], [, itemBDefinition]) => itemADefinition.index < itemBDefinition.index)
		.map(([itemName]) => itemName),
] as const;
export type SplitterOutputFilter = typeof splitterOutputFilters[number];

@Component({ tag: "SmartSplitter" })
export class SmartSplitterComponent extends TransporterComponent implements OnStart {
	private readonly outputsFilters = new Map<SplitterOutputDirection, SplitterOutputFilter>();
	private readonly filtersCurrentOutputTransporterIndex = new Map<SplitterOutputFilter, number>();
	private nextOutputTransporterFilter: SplitterOutputFilter | undefined;

	onStart(): void {
		super.onStart();
		this.initOutputsFilters();
	}

	private initOutputsFilters(): void {
		for (const outputDirection of splitterOutputDirections) {
			this.updateOutputFilters(outputDirection);
			this.instance.GetAttributeChangedSignal(outputDirection).Connect(() => {
				this.updateOutputFilters(outputDirection);
			});
		}
	}

	private updateOutputFilters(outputDirection: SplitterOutputDirection) {
		this.outputsFilters.set(outputDirection, this.instance.GetAttribute(outputDirection) as SplitterOutputFilter);
	}

	private getOutputTransportersOfFilter(outputFilter: SplitterOutputFilter): TransporterComponent[] {
		const outputTransporters: TransporterComponent[] = [];
		for (const outputDirection of splitterOutputDirections.filter(
			(outputDirection) => this.outputsFilters.get(outputDirection) === outputFilter,
		)) {
			const transporter = this.getTransporterInDirection(
				this.instance.GetPivot().Position,
				outputDirection === "LeftOutput"
					? this.instance.GetPivot().RightVector.mul(-1)
					: outputDirection === "ForwardOutput"
					? this.instance.GetPivot().LookVector
					: this.instance.GetPivot().RightVector,
			);

			if (
				transporter !== undefined &&
				this.outputTransporters.has(transporter) &&
				transporter.canInputItem(this.items[0])
			) {
				outputTransporters.push(transporter);
			}
		}
		return outputTransporters;
	}

	public override getOutputTransporter(): TransporterComponent | undefined {
		const itemOutputTransporters = this.getOutputTransportersOfFilter(this.items[0].name);
		const anyUndefinedOutputTransporters = this.getOutputTransportersOfFilter("Any (undefined)");
		const anyOutputTransporters = this.getOutputTransportersOfFilter("Any");
		const overflowOutputTransporters = this.getOutputTransportersOfFilter("Overflow");

		const outputTransportersCandidates: [boolean, [TransporterComponent[], SplitterOutputFilter]][] = [
			[itemOutputTransporters.size() > 0, [itemOutputTransporters, this.items[0].name as SplitterOutputFilter]],
			[
				anyUndefinedOutputTransporters.size() > 0 &&
					splitterOutputDirections.every(
						(outputDirection) => this.outputsFilters.get(outputDirection) !== this.items[0].name,
					),
				[anyUndefinedOutputTransporters, "Any (undefined)"],
			],
			[anyOutputTransporters.size() > 0, [anyOutputTransporters, "Any"]],
			[overflowOutputTransporters.size() > 0, [overflowOutputTransporters, "Overflow"]],
		];

		const result: [TransporterComponent[], SplitterOutputFilter] | undefined = outputTransportersCandidates.find(
			([condition]) => condition,
		)?.[1];
		if (result === undefined) return undefined;

		const outputTransporters: TransporterComponent[] = result[0];
		const outputTransportersFilter: SplitterOutputFilter = result[1];
		if (this.nextOutputTransporterFilter === undefined) {
			this.nextOutputTransporterFilter = outputTransportersFilter;
		}

		return outputTransporters[
			(this.filtersCurrentOutputTransporterIndex.get(outputTransportersFilter) ?? 0) % outputTransporters.size()
		];
	}

	public override outputItem(): Item | undefined {
		if (this.nextOutputTransporterFilter !== undefined) {
			this.filtersCurrentOutputTransporterIndex.set(
				this.nextOutputTransporterFilter,
				(this.filtersCurrentOutputTransporterIndex.get(this.nextOutputTransporterFilter) ?? 0) + 1,
			);
			this.nextOutputTransporterFilter = undefined;
		}
		return super.outputItem();
	}
}
