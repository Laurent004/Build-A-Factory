import { Component } from "@flamework/components";
import { MergerInputDirection, mergerInputDirections } from "shared/constants/structures";
import TransporterComponent from "./transporter";

@Component({ tag: "Merger" })
export default class MergerComponent extends TransporterComponent {
	private currentInputDirectionIndex: number = 0;

	public override inputItem(item: Model): void {
		const connectedOutputsTransporters = this.getConnectedOutputsTransporters();
		this.currentInputDirectionIndex = (this.currentInputDirectionIndex + 1) % connectedOutputsTransporters.size();
		super.inputItem(item);
	}

	public override getInputsTransporters(): TransporterComponent[] {
		for (let i = 0; i < 3; i++) {
			const mergerInputDirection =
				mergerInputDirections[(this.currentInputDirectionIndex + i) % mergerInputDirections.size()];
			const connectedOutputTransporter = this.getConnectedOutputTransporterInInputDirection(mergerInputDirection);
			if (connectedOutputTransporter !== undefined && connectedOutputTransporter.canOutputItem()) {
				return [connectedOutputTransporter];
			}
		}
		return [];
	}

	protected override getConnectedOutputsTransporters(): TransporterComponent[] {
		const connectedOutputsTransporters: TransporterComponent[] = [];
		for (const mergerInputDirection of mergerInputDirections) {
			const inputTransporter = this.getConnectedOutputTransporterInInputDirection(mergerInputDirection);
			if (inputTransporter !== undefined) {
				connectedOutputsTransporters.push(inputTransporter);
			}
		}
		return connectedOutputsTransporters;
	}

	private getConnectedOutputTransporterInInputDirection(inputDirection: MergerInputDirection) {
		let direction: Vector3;
		switch (inputDirection) {
			case MergerInputDirection.Left:
				direction = this.instance.PrimaryPart!.CFrame.RightVector.mul(-1);
				break;
			case MergerInputDirection.Backward:
				direction = this.instance.PrimaryPart!.CFrame.LookVector.mul(-1);
				break;
			case MergerInputDirection.Right:
				direction = this.instance.PrimaryPart!.CFrame.RightVector;
				break;
		}
		return this.getConnectedOutputTransporterInDirection(this.instance.PrimaryPart!.CFrame.Position, direction);
	}
}
