import { Component } from "@flamework/components";
import TransporterComponent from "../transporter";
import { Solid } from "shared/constants/items";

export const mergerInputDirections = ["LeftInput", "BackwardInput", "RightInput"] as const;
export type MergerInputDirection = (typeof mergerInputDirections)[number];

@Component({ tag: "Merger" })
export default class MergerComponent extends TransporterComponent {
	private inputTransporterIndex: number = 0;

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
				(transporter.getQueuedSolids().size() > 0 || transporter.getSolids().size() > 0) &&
				transporter.canOutputItem() &&
				transporter.getOutputTransporters("Solid").includes(this)
			) {
				inputTransporters.push(transporter);
			}
		}
		return [inputTransporters[this.inputTransporterIndex % inputTransporters.size()]];
	}

	public override inputItem(solid: Solid): void;
	public override inputItem(fluid: string, volume: number): void;
	public override inputItem(item: Solid | string, volume?: number): void {
		super.inputItem(item as Solid);
		this.inputTransporterIndex += 1;
	}
}
