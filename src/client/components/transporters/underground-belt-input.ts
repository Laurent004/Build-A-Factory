import { Component } from "@flamework/components";
import TransporterComponent from "./transporter";
import { OnStart } from "@flamework/core";
import { GridCell } from "shared/grid";
import UndergroundBeltOutputComponent from "./underground-belt-output";

@Component({ tag: "UndergroundBeltInput" })
export default class UndergroundBeltInputComponent extends TransporterComponent implements OnStart {
	private undergroundBeltDistance!: number;

	protected override onStructuresMovement(structuresModels: Model[]): void {
		super.onStructuresMovement(structuresModels);
		if (this.outputTransporters.size() === 0) {
			this.initOutputTransporters();
		}
	}

	protected override initOutputTransporters(): void {
		const undergroundBeltOutput = this.instance.Parent!.WaitForChild("Underground Belt Output") as Model;
		this.components
			.waitForComponent<UndergroundBeltOutputComponent>(undergroundBeltOutput)
			.then((undergroundBeltOutputComponent) => {
				this.outputTransporters.add(undergroundBeltOutputComponent);
				const cell: GridCell = this.gridService.getCellAtWorldPosition(
					this.player,
					this.instance.GetPivot().Position,
				)!;
				const undergroundBeltOutputCell: GridCell = this.gridService.getCellAtWorldPosition(
					this.player,
					undergroundBeltOutput.GetPivot().Position,
				)!;

				this.undergroundBeltDistance =
					cell.position.X === undergroundBeltOutputCell.position.X
						? math.abs(undergroundBeltOutputCell.position.Z - cell.position.Z)
						: math.abs(undergroundBeltOutputCell.position.X - cell.position.X);
			});
	}

	public override outputItem(): Model | undefined {
		const item = super.outputItem();
		if (item !== undefined) {
			for (const basePart of item
				.GetDescendants()
				.filter((instance): instance is BasePart => instance.IsA("BasePart"))) {
				basePart.Transparency = 1;
			}
		}
		return item;
	}

	public override getTransportDuration(): number {
		return super.getTransportDuration() * this.undergroundBeltDistance;
	}
}
