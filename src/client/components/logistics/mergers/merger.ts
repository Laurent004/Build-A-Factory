import { Component } from "@flamework/components";
import TransporterComponent from "../transporter";
import { Solid } from "shared/constants/items";

export const mergerInputDirections: string[] = ["Left", "Backward", "Right"];

@Component({ tag: "Merger" })
export default class MergerComponent extends TransporterComponent {
	private inputTransporterIndex: number = 0;

	public override getInputTransporters(): TransporterComponent[] {
		const inputTransporters = mergerInputDirections.mapFiltered((inputDirection) => {
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
		return [inputTransporters[this.inputTransporterIndex % inputTransporters.size()]];
	}

	public override inputItem(solid: Solid): void;
	public override inputItem(fluid: string, volume: number): void;
	public override inputItem(item: Solid | string, volume?: number): void {
		super.inputItem(item as Solid);
		this.inputTransporterIndex += 1;
	}
}
