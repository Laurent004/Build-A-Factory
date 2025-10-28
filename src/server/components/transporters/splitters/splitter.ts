import { Component } from "@flamework/components";
import TransporterComponent from "../transporter";
import { OnStart } from "@flamework/core";
import { Item } from "shared/constants/items";

export const splitterOutputDirections = ["LeftOutput", "ForwardOutput", "RightOutput"] as const;
export type SplitterOutputDirection = typeof splitterOutputDirections[number];

@Component({ tag: "Splitter" })
export class SmartSplitterComponent extends TransporterComponent implements OnStart {
	private currentOutputTransporterIndex: number = 0;

	public override getOutputTransporter(): TransporterComponent | undefined {
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
				transporter.canInputItem(this.items[0])
			) {
				outputTransporters.push(transporter);
			}
		}
		if (outputTransporters.size() === 0) return undefined;
		return outputTransporters[this.currentOutputTransporterIndex % outputTransporters.size()];
	}

	public override outputItem(): Item | undefined {
		this.currentOutputTransporterIndex += 1;
		return super.outputItem();
	}
}