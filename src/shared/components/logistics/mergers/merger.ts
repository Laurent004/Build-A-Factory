import { Component } from "@flamework/components";
import TransporterComponent from "../transporter";
import { Solid } from "shared/constants/items";

export const mergerInputDirections: string[] = ["Left", "Backward", "Right"];

@Component({ tag: "Merger" })
export default class MergerComponent extends TransporterComponent {
	private inputDirectionIndex: number = 0;

	public override getInputTransporters(): TransporterComponent[] {
		for (const inputDirection of [
			...mergerInputDirections.filter((_, index) => index >= this.inputDirectionIndex),
			...mergerInputDirections.filter((_, index) => index < this.inputDirectionIndex),
		]) {
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
				return [transporter];
			}
		}
		return [];
	}

	public override inputItem(solid: Solid): void;
	public override inputItem(fluid: string, volume: number): void;
	public override inputItem(item: Solid | string, volume?: number): void {
		super.inputItem(item as Solid);
		this.inputDirectionIndex = (this.inputDirectionIndex + 1) % mergerInputDirections.size();
	}
}
