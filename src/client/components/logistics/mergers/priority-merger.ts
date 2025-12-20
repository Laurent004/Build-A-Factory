import { Component } from "@flamework/components";
import TransporterComponent from "../transporter";
import { mergerInputDirections } from "./merger";
import { Solid } from "shared/constants/items";

export const mergerPriorities = ["High", "Medium", "Low"] as const;
export type MergerPriority = (typeof mergerPriorities)[number];

@Component({ tag: "PriorityMerger" })
export class PriorityMergerComponent extends TransporterComponent {
	private readonly prioritiesInputTransporterIndex = new Map<MergerPriority, number>();
	private nextInputTransporterPriority: MergerPriority | undefined;

	private getInputTransportersOfPriority(priority: MergerPriority): TransporterComponent[] {
		const inputTransporters: TransporterComponent[] = [];
		for (const inputDirection of mergerInputDirections.filter(
			(inputDirection) => this.instance.GetAttribute(inputDirection) === priority,
		)) {
			const transporter = this.getTransporterInDirection(
				this.instance.GetPivot().Position,
				inputDirection === "LeftInput"
					? this.instance.GetPivot().RightVector.mul(-1)
					: inputDirection === "BackwardInput"
					? this.instance.GetPivot().LookVector.mul(-1)
					: this.instance.GetPivot().RightVector,
			);

			if (
				transporter !== undefined &&
				this.inputTransporters.has(transporter) &&
				(transporter.getQueuedSolids().size() > 0 || transporter.getSolids().size() > 0) &&
				transporter.canOutputItem() &&
				transporter.getOutputTransporters("Solid").includes(this)
			) {
				inputTransporters.push(transporter);
			}
		}
		return inputTransporters;
	}

	public override getInputTransporters(): TransporterComponent[] {
		const highPriorityInputTransporters: TransporterComponent[] = this.getInputTransportersOfPriority("High");
		const mediumPriorityInputTransporters: TransporterComponent[] = this.getInputTransportersOfPriority("Medium");
		const lowPriorityInputTransporters: TransporterComponent[] = this.getInputTransportersOfPriority("Low");

		const inputTransportersCandidates: [boolean, [TransporterComponent[], MergerPriority]][] = [
			[highPriorityInputTransporters.size() > 0, [highPriorityInputTransporters, "High"]],
			[mediumPriorityInputTransporters.size() > 0, [mediumPriorityInputTransporters, "Medium"]],
			[lowPriorityInputTransporters.size() > 0, [lowPriorityInputTransporters, "Low"]],
		];

		const result: [TransporterComponent[], MergerPriority] | undefined = inputTransportersCandidates.find(
			([condition]) => condition,
		)?.[1];
		if (result === undefined) return [];

		const inputTransporters: TransporterComponent[] = result[0];
		const inputTransportersPriority: MergerPriority = result[1];
		if (this.nextInputTransporterPriority === undefined) {
			this.nextInputTransporterPriority = inputTransportersPriority;
		}

		return [
			inputTransporters[
				(this.prioritiesInputTransporterIndex.get(inputTransportersPriority) ?? 0) % inputTransporters.size()
			],
		];
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
