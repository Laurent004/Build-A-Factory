import { Component } from "@flamework/components";
import TransporterComponent from "../transporter";
import { OnStart } from "@flamework/core";
import { Solid } from "shared/constants/items";

export const splitterOutputDirections = ["LeftOutput", "ForwardOutput", "RightOutput"] as const;
export type SplitterOutputDirection = (typeof splitterOutputDirections)[number];

@Component({ tag: "Splitter" })
export class SplitterComponent extends TransporterComponent implements OnStart {
	private outputTransporterIndex: number = 0;

	public override getOutputTransporters(): TransporterComponent[] {
		const outputTransporters: TransporterComponent[] = [];
		for (const outputDirection of splitterOutputDirections) {
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
		return outputTransporters.size() > 0
			? [outputTransporters[this.outputTransporterIndex % outputTransporters.size()]]
			: [];
	}

	public override outputItem(solid: Solid): void;
	public override outputItem(fluid: string, volume: number): void;
	public override outputItem(item: Solid | string, volume?: number): void {
		super.outputItem(item as Solid);
		this.outputTransporterIndex += 1;
	}
}
