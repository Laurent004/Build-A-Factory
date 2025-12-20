import { Component } from "@flamework/components";
import TransporterComponent from "../transporter";
import { OnStart } from "@flamework/core";
import { ITEMS, Solid } from "shared/constants/items";
import { Object } from "@rbxts/luau-polyfill";
import { SplitterOutputDirection, splitterOutputDirections } from "./splitter";

export const splitterFilters = [
	"None",
	"Any",
	"Overflow",
	"Any (undefined)",
	...Object.entries(ITEMS)
		.sort(([, itemADefinition], [, itemBDefinition]) => itemADefinition.index < itemBDefinition.index)
		.map(([itemName]) => itemName),
] as const;
export type SplitterFilter = (typeof splitterFilters)[number];

@Component({ tag: "SmartSplitter" })
export class SmartSplitterComponent extends TransporterComponent implements OnStart {
	private readonly filters = new Map<SplitterOutputDirection, SplitterFilter>();
	private readonly filterOutputTransporterIndex = new Map<SplitterFilter, number>();
	private nextOutputTransporterFilter: SplitterFilter | undefined;

	onStart(): void {
		super.onStart();
		this.initFilters();
	}

	private initFilters(): void {
		for (const outputDirection of splitterOutputDirections) {
			this.updateFilters(outputDirection);
			this.connections.push(
				this.instance.GetAttributeChangedSignal(outputDirection).Connect(() => {
					this.updateFilters(outputDirection);
				}),
			);
		}
	}

	private updateFilters(outputDirection: SplitterOutputDirection) {
		this.filters.set(outputDirection, this.instance.GetAttribute(outputDirection) as SplitterFilter);
	}

	private getOutputTransportersOfFilter(filter: SplitterFilter): TransporterComponent[] {
		const outputTransporters: TransporterComponent[] = [];
		for (const outputDirection of splitterOutputDirections.filter(
			(outputDirection) => this.filters.get(outputDirection) === filter,
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
				transporter.canInputItem(this.solids[0])
			) {
				outputTransporters.push(transporter);
			}
		}
		return outputTransporters;
	}

	public override getOutputTransporters(): TransporterComponent[] {
		const solidOutputTransporters = this.getOutputTransportersOfFilter(this.solids[0].name);
		const anyUndefinedOutputTransporters = this.getOutputTransportersOfFilter("Any (undefined)");
		const anyOutputTransporters = this.getOutputTransportersOfFilter("Any");
		const overflowOutputTransporters = this.getOutputTransportersOfFilter("Overflow");

		const outputTransportersCandidates: [boolean, [TransporterComponent[], SplitterFilter]][] = [
			[solidOutputTransporters.size() > 0, [solidOutputTransporters, this.solids[0].name as SplitterFilter]],
			[
				anyUndefinedOutputTransporters.size() > 0 &&
					splitterOutputDirections.every(
						(outputDirection) => this.filters.get(outputDirection) !== this.solids[0].name,
					),
				[anyUndefinedOutputTransporters, "Any (undefined)"],
			],
			[anyOutputTransporters.size() > 0, [anyOutputTransporters, "Any"]],
			[overflowOutputTransporters.size() > 0, [overflowOutputTransporters, "Overflow"]],
		];

		const result: [TransporterComponent[], SplitterFilter] | undefined = outputTransportersCandidates.find(
			([condition]) => condition,
		)?.[1];
		if (result === undefined) return [];

		const outputTransporters: TransporterComponent[] = result[0];
		const outputTransportersFilter: SplitterFilter = result[1];
		if (this.nextOutputTransporterFilter === undefined) {
			this.nextOutputTransporterFilter = outputTransportersFilter;
		}

		return [
			outputTransporters[
				(this.filterOutputTransporterIndex.get(outputTransportersFilter) ?? 0) % outputTransporters.size()
			],
		];
	}

	public override outputItem(solid: Solid): void;
	public override outputItem(fluid: string, volume: number): void;
	public override outputItem(item: Solid | string, volume?: number): void {
		super.outputItem(item as Solid);
		if (this.nextOutputTransporterFilter !== undefined) {
			this.filterOutputTransporterIndex.set(
				this.nextOutputTransporterFilter,
				(this.filterOutputTransporterIndex.get(this.nextOutputTransporterFilter) ?? 0) + 1,
			);
			this.nextOutputTransporterFilter = undefined;
		}
	}
}
