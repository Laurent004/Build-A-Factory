import { Component } from "@flamework/components";
import TransporterComponent from "../transporter";
import { OnStart } from "@flamework/core";
import { Solid } from "shared/constants/items";

export const splitterOutputDirections: string[] = ["Left", "Forward", "Right"];

@Component({ tag: "Splitter" })
export class SplitterComponent extends TransporterComponent implements OnStart {
	private outputTransporterIndex: number = 0;

	public override getOutputTransporters(): TransporterComponent[] {
		const outputTransporters = splitterOutputDirections.mapFiltered((outputDirection) => {
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
		return [outputTransporters[this.outputTransporterIndex % outputTransporters.size()]];
	}

	public override outputItem(solid: Solid): void;
	public override outputItem(fluid: string, volume: number): void;
	public override outputItem(item: Solid | string, volume?: number): void {
		super.outputItem(item as Solid);
		this.outputTransporterIndex += 1;
	}
}
