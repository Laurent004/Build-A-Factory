import { Component } from "@flamework/components";
import TransporterComponent from "../transporter";
import { mergerInputDirections } from "./merger";
import { Solid } from "shared/constants/items";

export const mergerPriorities: string[] = ["Low", "Medium", "High"];

@Component({ tag: "PriorityMerger" })
export class PriorityMergerComponent extends TransporterComponent {
	private readonly prioritiesInputTransporterIndex = new Map<string, number>();
	private nextInputTransporterPriority: string | undefined;

	private getInputTransportersOfPriority(priority: string): TransporterComponent[] {
		return mergerInputDirections.mapFiltered((inputDirection) => {
			if (this.instance.GetAttribute(inputDirection) !== priority) return undefined;
			const transporter = this.getTransporterInDirection(
				this.instance.GetPivot().Position,
				inputDirection === "Left"
					? this.instance.GetPivot().RightVector.mul(-1)
					: inputDirection === "Backward"
					? this.instance.GetPivot().LookVector.mul(-1)
					: this.instance.GetPivot().RightVector,
			);
			return transporter !== undefined &&
				this.inputTransporters.has(transporter) &&
				(transporter.getQueuedSolids().size() > 0 || transporter.getSolids().size() > 0) &&
				transporter.canOutputItem() &&
				transporter.getOutputTransporters("Solid").includes(this)
				? transporter
				: undefined;
		});
	}

	public override getInputTransporters(): TransporterComponent[] {
		const highPriorityInputTransporters = this.getInputTransportersOfPriority("High");
		const mediumPriorityInputTransporters = this.getInputTransportersOfPriority("Medium");
		const lowPriorityInputTransporters = this.getInputTransportersOfPriority("Low");
		const inputTransporters: [boolean, [TransporterComponent[], string]][] = [
			[highPriorityInputTransporters.size() > 0, [highPriorityInputTransporters, "High"]],
			[mediumPriorityInputTransporters.size() > 0, [mediumPriorityInputTransporters, "Medium"]],
			[lowPriorityInputTransporters.size() > 0, [lowPriorityInputTransporters, "Low"]],
		];
		const result = inputTransporters.find(([condition]) => condition)?.[1];
		if (result === undefined) return [];
		if (this.nextInputTransporterPriority === undefined) {
			this.nextInputTransporterPriority = result[1];
		}
		return [result[0][(this.prioritiesInputTransporterIndex.get(result[1]) ?? 0) % result[0].size()]];
	}

	public override inputItem(solid: Solid): void;
	public override inputItem(fluid: string, volume: number): void;
	public override inputItem(item: Solid | string, volume?: number): void {
		super.inputItem(item as Solid);
		if (this.nextInputTransporterPriority !== undefined) {
			this.prioritiesInputTransporterIndex.set(
				this.nextInputTransporterPriority,
				(this.prioritiesInputTransporterIndex.get(this.nextInputTransporterPriority) ?? 0) + 1,
			);
			this.nextInputTransporterPriority = undefined;
		}
	}
}
