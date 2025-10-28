import { Component } from "@flamework/components";
import TransporterComponent from "../transporter";

export const mergerInputDirections = ["LeftInput", "BackwardInput", "RightInput"] as const;
export type MergerInputDirection = typeof mergerInputDirections[number];

@Component({ tag: "Merger" })
export default class MergerComponent extends TransporterComponent {
	private currentInputTransporterIndex: number = 0;

	public override getInputTransporters(): TransporterComponent[] {
		const inputTransporters: TransporterComponent[] = [];
		for (const inputDirection of mergerInputDirections) {
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
		return [inputTransporters[this.currentInputTransporterIndex % inputTransporters.size()]];
	}

	public override inputItem(item: Model): void {
		this.currentInputTransporterIndex += 1;
		super.inputItem(item);
	}
}
