import { Component } from "@flamework/components";
import TransporterComponent from "../transporter";
import { OnStart } from "@flamework/core";
import { splitterOutputDirections } from "./splitter";
import { Solid } from "shared/constants/items";
import { HttpService } from "@rbxts/services";

@Component({ tag: "ProgrammableSplitter" })
export class ProgrammableSplitterComponent extends TransporterComponent implements OnStart {
	private readonly filters = new Map<string, string[]>();
	private readonly filtersOutputDirectionIndex = new Map<string, number>();
	private nextFilterOutputDirectionIndex: [string, number] | undefined;

	onStart(): void {
		super.onStart();
	}

	protected override initEvents(): void {
		super.initEvents();
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
		this.filters.set(
			outputDirection,
			HttpService.JSONDecode(this.instance.GetAttribute(outputDirection) as string) as string[],
		);
		this.transportService.attemptTransport(this);
	}

	private getOutputTransportersOfFilter(filter: string): [TransporterComponent, number][] {
		return [
			...splitterOutputDirections.filter(
				(_, index) => index >= (this.filtersOutputDirectionIndex.get(filter) ?? 0),
			),
			...splitterOutputDirections.filter(
				(_, index) => index < (this.filtersOutputDirectionIndex.get(filter) ?? 0),
			),
		].mapFiltered((outputDirection) => {
			if (!this.filters.get(outputDirection)!.includes(filter)) return undefined;
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
				? [transporter, splitterOutputDirections.indexOf(outputDirection)]
				: undefined;
		});
	}

	public override getOutputTransporters(): TransporterComponent[] {
		if (this.solids.size() === 0) return [];
		const solidOutputTransporters = this.getOutputTransportersOfFilter(this.solids[0].name);
		const anyUndefinedOutputTransporters = this.getOutputTransportersOfFilter("Any (undefined)");
		const anyOutputTransporters = this.getOutputTransportersOfFilter("Any");
		const overflowOutputTransporters = this.getOutputTransportersOfFilter("Overflow");
		const result = (
			[
				[solidOutputTransporters.size() > 0, [solidOutputTransporters, this.solids[0].name]],
				[
					anyUndefinedOutputTransporters.size() > 0 &&
						splitterOutputDirections.every(
							(outputDirection) => !this.filters.get(outputDirection)!.includes(this.solids[0].name),
						),
					[anyUndefinedOutputTransporters, "Any (undefined)"],
				],
				[anyOutputTransporters.size() > 0, [anyOutputTransporters, "Any"]],
				[overflowOutputTransporters.size() > 0, [overflowOutputTransporters, "Overflow"]],
			] as [boolean, [[TransporterComponent, number][], string]][]
		).find(([condition]) => condition)?.[1];
		if (result === undefined) return [];
		if (this.nextFilterOutputDirectionIndex === undefined) {
			this.nextFilterOutputDirectionIndex = [result[1], (result[0][0][1] + 1) % splitterOutputDirections.size()];
		}
		return result[0].map(([transporter]) => transporter);
	}

	public override outputItem(solid: Solid): void;
	public override outputItem(fluid: string, volume: number): void;
	public override outputItem(item: Solid | string, volume?: number): void {
		super.outputItem(item as Solid);
		if (this.nextFilterOutputDirectionIndex !== undefined) {
			this.filtersOutputDirectionIndex.set(
				this.nextFilterOutputDirectionIndex[0],
				this.nextFilterOutputDirectionIndex[1],
			);
			this.nextFilterOutputDirectionIndex = undefined;
		}
	}
}
