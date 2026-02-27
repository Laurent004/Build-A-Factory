import { Component } from "@flamework/components";
import TransporterComponent from "../transporter";
import { mergerInputDirections } from "./merger";
import { Solid } from "shared/constants/items";

export const mergerPriorities: string[] = ["Low", "Medium", "High"];

@Component({ tag: "PriorityMerger" })
export class PriorityMergerComponent extends TransporterComponent {
	private readonly prioritiesInputDirectionIndex = new Map<string, number>();
	private nextPriorityInputDirectionIndex: [string, number] | undefined;

	private getInputTransporterOfPriority(priority: string): [TransporterComponent, number] | undefined {
		for (const inputDirection of [
			...mergerInputDirections.filter(
				(_, index) => index >= (this.prioritiesInputDirectionIndex.get(priority) ?? 0),
			),
			...mergerInputDirections.filter(
				(_, index) => index < (this.prioritiesInputDirectionIndex.get(priority) ?? 0),
			),
		]) {
			if (this.instance.GetAttribute(inputDirection) !== priority) continue;
			const transporter = this.getTransporterInDirection(
				this.instance.GetPivot().Position,
				inputDirection === "Left"
					? this.instance.GetPivot().RightVector.mul(-1)
					: inputDirection === "Backward"
					? this.instance.GetPivot().LookVector.mul(-1)
					: this.instance.GetPivot().RightVector,
			);
			if (
				transporter !== undefined &&
				this.inputTransporters.has(transporter) &&
				transporter.getOutputTransporters("Solid").includes(this) &&
				(transporter.getQueuedSolids().size() > 0 || transporter.getSolids().size() > 0) &&
				transporter.canOutputItem()
			) {
				return [transporter, mergerInputDirections.indexOf(inputDirection)];
			}
		}
		return undefined;
	}

	public override getInputTransporters(): TransporterComponent[] {
		const highPriorityInputTransporter = this.getInputTransporterOfPriority("High");
		const mediumPriorityInputTransporter = this.getInputTransporterOfPriority("Medium");
		const lowPriorityInputTransporter = this.getInputTransporterOfPriority("Low");
		const result = (
			[
				[highPriorityInputTransporter !== undefined, [highPriorityInputTransporter, "High"]],
				[mediumPriorityInputTransporter !== undefined, [mediumPriorityInputTransporter, "Medium"]],
				[lowPriorityInputTransporter !== undefined, [lowPriorityInputTransporter, "Low"]],
			] as [boolean, [[TransporterComponent, number] | undefined, string]][]
		).find(([condition]) => condition)?.[1];
		if (result === undefined) return [];
		if (this.nextPriorityInputDirectionIndex === undefined) {
			this.nextPriorityInputDirectionIndex = [result[1], (result[0]![1] + 1) % mergerInputDirections.size()];
		}
		return [result[0]![0]];
	}

	public override inputItem(solid: Solid): void;
	public override inputItem(fluid: string, volume: number): void;
	public override inputItem(item: Solid | string, volume?: number): void {
		super.inputItem(item as Solid);
		if (this.nextPriorityInputDirectionIndex !== undefined) {
			this.prioritiesInputDirectionIndex.set(
				this.nextPriorityInputDirectionIndex[0],
				this.nextPriorityInputDirectionIndex[1],
			);
			this.nextPriorityInputDirectionIndex = undefined;
		}
	}
}
