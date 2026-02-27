import { Component } from "@flamework/components";
import TransporterComponent from "../transporter";
import { OnStart } from "@flamework/core";
import { Solid } from "shared/constants/items";

export const splitterOutputDirections: string[] = ["Left", "Forward", "Right"];

@Component({ tag: "Splitter" })
export class SplitterComponent extends TransporterComponent implements OnStart {
	private outputDirectionIndex: number = 0;

	public override getOutputTransporters(): TransporterComponent[] {
		return [
			...splitterOutputDirections.filter((_, index) => index >= this.outputDirectionIndex),
			...splitterOutputDirections.filter((_, index) => index < this.outputDirectionIndex),
		].mapFiltered((outputDirection) => {
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

	public override outputItem(solid: Solid): void;
	public override outputItem(fluid: string, volume: number): void;
	public override outputItem(item: Solid | string, volume?: number): void {
		super.outputItem(item as Solid);
		this.outputDirectionIndex = (this.outputDirectionIndex + 1) % splitterOutputDirections.size();
	}
}
