import { Component } from "@flamework/components";
import TransporterComponent from "../transporter";
import { OnStart } from "@flamework/core";
import { ITEMS, Solid } from "shared/constants/items";
import { Object } from "@rbxts/luau-polyfill";
import { splitterOutputDirections } from "./splitter";

export const splitterFilters: string[] = [
	"None",
	"Any",
	"Overflow",
	"Any (undefined)",
	...Object.entries(ITEMS)
		.filter(([, itemDefinition]) => itemDefinition.model !== undefined)
		.sort(([, itemADefinition], [, itemBDefinition]) => itemADefinition.index < itemBDefinition.index)
		.map(([itemName]) => itemName),
];

@Component({ tag: "SmartSplitter" })
export class SmartSplitterComponent extends TransporterComponent implements OnStart {
	private readonly filters = new Map<string, string>();
	private readonly filterOutputTransporterIndex = new Map<string, number>();
	private nextOutputTransporterFilter: string | undefined;

	onStart(): void {
		super.onStart();
		this.initFilters();
	}

	private initFilters(): void {
		for (const outputDirection of splitterOutputDirections) {
			this.updateFilters(outputDirection);
			this.janitor.Add(
				this.instance.GetAttributeChangedSignal(outputDirection).Connect(() => {
					this.updateFilters(outputDirection);
				}),
			);
		}
	}

	private updateFilters(outputDirection: string): void {
		this.filters.set(outputDirection, this.instance.GetAttribute(outputDirection) as string);
		this.transportService.attemptTransport(this);
	}

	private getOutputTransportersOfFilter(filter: string): TransporterComponent[] {
		return splitterOutputDirections.mapFiltered((outputDirection) => {
			if (this.filters.get(outputDirection) !== filter) return undefined;
			const transporter = this.getTransporterInDirection(
				this.instance.GetPivot().Position,
				outputDirection === "Left"
					? this.instance.GetPivot().RightVector.mul(-1)
					: outputDirection === "Forward"
					? this.instance.GetPivot().LookVector
					: this.instance.GetPivot().RightVector,
			);
			return transporter !== undefined &&
				this.outputTransporters.has(transporter) &&
				transporter.canInputItem(this.solids[0])
				? transporter
				: undefined;
		});
	}

	public override getOutputTransporters(): TransporterComponent[] {
		if (this.solids.size() === 0) return [];
		const solidOutputTransporters = this.getOutputTransportersOfFilter(this.solids[0].name);
		const anyUndefinedOutputTransporters = this.getOutputTransportersOfFilter("Any (undefined)");
		const anyOutputTransporters = this.getOutputTransportersOfFilter("Any");
		const overflowOutputTransporters = this.getOutputTransportersOfFilter("Overflow");
		const outputTransporters: [boolean, [TransporterComponent[], string]][] = [
			[solidOutputTransporters.size() > 0, [solidOutputTransporters, this.solids[0].name as string]],
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
		const result = outputTransporters.find(([condition]) => condition)?.[1];
		if (result === undefined) return [];
		if (this.nextOutputTransporterFilter === undefined) {
			this.nextOutputTransporterFilter = result[1];
		}
		return [result[0][(this.filterOutputTransporterIndex.get(result[1]) ?? 0) % result[0].size()]];
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
