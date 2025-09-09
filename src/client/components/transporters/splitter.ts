import { Component } from "@flamework/components";
import TransporterComponent from "./transporter";
import { SplitterOutputDirection, splitterOutputDirections, SplitterOutputFilter } from "shared/constants/structures";
import { OnStart } from "@flamework/core";
import { ItemName } from "shared/constants/items";

@Component({ tag: "Splitter" })
export default class SplitterComponent extends TransporterComponent implements OnStart {
	private currentOutputDirectionIndex: number = 0;

	onStart(): void {
		super.onStart();
	}

	public override getOutputTransporter(): TransporterComponent | undefined {
		const outputsTransporters = this.getOutputsTransporters();
		if (outputsTransporters === undefined) return undefined;
		const outputTransporter = outputsTransporters[this.currentOutputDirectionIndex % outputsTransporters.size()];
		this.currentOutputDirectionIndex = (this.currentOutputDirectionIndex + 1) % outputsTransporters.size();
		return outputTransporter;
	}

	private getOutputsTransporters() {
		const overflowOutputsTransporters = this.getConnectedInputsTransportersOfFilterType("Overflow", true, false);
		const nonOverflowOutputsTransporters = this.getConnectedInputsTransportersOfFilterType("Overflow", false, true);
		const anyUndefinedOutputsTransporters = this.getConnectedInputsTransportersOfFilterType(
			"Any (undefined)",
			true,
			false,
		);
		const anyOutputsTransporters = this.getConnectedInputsTransportersOfFilterType("Any", false, false);
		const availableAnyOutputsTransporters = this.getConnectedInputsTransportersOfFilterType("Any", true, false);
		const itemOutputsTransporters = this.getConnectedInputsTransportersOfFilterType(
			this.items[0].Name as ItemName,
			true,
			false,
		);
		const canFilterItem = splitterOutputDirections.every(
			(splitterOutputDirection) => this.attributes[splitterOutputDirection] === this.items[0].Name,
		);

		const transporters: [boolean, TransporterComponent[]][] = [
			[
				nonOverflowOutputsTransporters.size() > 0 &&
					overflowOutputsTransporters.size() > 0 &&
					nonOverflowOutputsTransporters.every(
						(nonOverflowTransporter) =>
							!nonOverflowTransporter.getInputsTransporters().includes(this) ||
							!nonOverflowTransporter.canInputItem(this.items[0].Name as ItemName),
					),

				overflowOutputsTransporters,
			],
			[
				anyUndefinedOutputsTransporters.size() > 0 &&
					anyOutputsTransporters.every(
						(anyTransporter) =>
							!anyTransporter.getInputsTransporters().includes(this) ||
							!anyTransporter.canInputItem(this.items[0].Name as ItemName),
					) &&
					!canFilterItem,
				anyUndefinedOutputsTransporters,
			],
			[availableAnyOutputsTransporters.size() > 0, availableAnyOutputsTransporters],
			[itemOutputsTransporters.size() > 0, itemOutputsTransporters],
		];

		const outputsTransporters: TransporterComponent[] | undefined = transporters.find(
			([condition, _]) => condition,
		)?.[1];
		return outputsTransporters;
	}

	private getConnectedInputsTransportersOfFilterType(
		outputFilter: SplitterOutputFilter,
		available: boolean,
		exclude: boolean,
	): TransporterComponent[] {
		const transporters: TransporterComponent[] = [];
		for (const outputDirection of splitterOutputDirections) {
			let direction!: Vector3;
			switch (outputDirection) {
				case SplitterOutputDirection.Left:
					direction = this.instance.PrimaryPart!.CFrame.RightVector.mul(-1);
					break;
				case SplitterOutputDirection.Forward:
					direction = this.instance.PrimaryPart!.CFrame.LookVector;
					break;
				case SplitterOutputDirection.Right:
					direction = this.instance.PrimaryPart!.CFrame.RightVector;
					break;
			}
			const transporter = this.getConnectedInputTransporterInDirection(
				this.instance.PrimaryPart!.CFrame.Position,
				direction,
			);
			if (
				transporter !== undefined &&
				(available
					? transporter.getInputsTransporters().includes(this) &&
					  transporter.canInputItem(this.items[0].Name as ItemName)
					: true)
			) {
				const filter = this.attributes[outputDirection]!;
				if (exclude) {
					if (filter !== outputFilter) {
						transporters.push(transporter);
					}
				} else {
					if (filter === outputFilter) {
						transporters.push(transporter);
					}
				}
			}
		}
		return transporters;
	}
}
