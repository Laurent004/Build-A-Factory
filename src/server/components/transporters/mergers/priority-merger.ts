import { Component } from "@flamework/components";
import TransporterComponent from "../transporter";
import { Item } from "shared/constants/items";
import { mergerInputDirections } from "./merger";

export const mergerInputPriorities = ["High", "Medium", "Low"] as const;
export type MergerInputPriority = typeof mergerInputPriorities[number];

@Component({ tag: "PriorityMerger" })
export default class PriorityMergerComponent extends TransporterComponent {
	private readonly prioritiesCurrentInputTransporterIndex = new Map<MergerInputPriority, number>();
	private nextInputTransporterPriority: MergerInputPriority | undefined;

	private getInputTransportersOfPriority(inputPriority: MergerInputPriority): TransporterComponent[] {
		const inputTransporters: TransporterComponent[] = [];
		for (const inputDirection of mergerInputDirections.filter(
			(inputDirection) => this.instance.GetAttribute(inputDirection) === inputPriority,
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
				(transporter.getQueuedItems().size() > 0 || transporter.getItems().size() > 0) &&
				transporter.canOutputItem() &&
				transporter.getOutputTransporter() === this
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

		const inputTransportersCandidates: [boolean, [TransporterComponent[], MergerInputPriority]][] = [
			[highPriorityInputTransporters.size() > 0, [highPriorityInputTransporters, "High"]],
			[mediumPriorityInputTransporters.size() > 0, [mediumPriorityInputTransporters, "Medium"]],
			[lowPriorityInputTransporters.size() > 0, [lowPriorityInputTransporters, "Low"]],
		];

		const result: [TransporterComponent[], MergerInputPriority] | undefined = inputTransportersCandidates.find(
			([condition]) => condition,
		)?.[1];
		if (result === undefined) return [];

		const inputTransporters: TransporterComponent[] = result[0];
		const inputTransportersPriority: MergerInputPriority = result[1];
		if (this.nextInputTransporterPriority === undefined) {
			this.nextInputTransporterPriority = inputTransportersPriority;
		}

		return [
			inputTransporters[
				(this.prioritiesCurrentInputTransporterIndex.get(inputTransportersPriority) ?? 0) %
					inputTransporters.size()
			],
		];
	}

	public override inputItem(item: Item): void {
		if (this.nextInputTransporterPriority !== undefined) {
			this.prioritiesCurrentInputTransporterIndex.set(
				this.nextInputTransporterPriority,
				(this.prioritiesCurrentInputTransporterIndex.get(this.nextInputTransporterPriority) ?? 0) + 1,
			);
			this.nextInputTransporterPriority = undefined;
		}
		super.inputItem(item);
	}
}
