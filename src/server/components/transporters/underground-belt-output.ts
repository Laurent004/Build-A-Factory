import { Component } from "@flamework/components";
import TransporterComponent from "./transporter";
import { OnStart } from "@flamework/core";
import { GridCell } from "shared/grid";
import UndergroundBeltInputComponent from "./underground-belt-input";
import { Item } from "shared/constants/items";

@Component({ tag: "UndergroundBeltOutput" })
export default class UndergroundBeltOutputComponent extends TransporterComponent implements OnStart {
	private undergroundBeltDistance!: number;

	protected override onStructuresMovement(structuresModels: Model[]): void {
		super.onStructuresMovement(structuresModels);
		if (this.inputTransporters.size() === 0) {
			this.initInputTransporters();
		}
	}

	protected override initInputTransporters(): void {
		const undergroundBeltInput = this.instance.Parent!.WaitForChild("Underground Belt Input") as Model;
		this.components
			.waitForComponent<UndergroundBeltInputComponent>(undergroundBeltInput)
			.then((undergroundBeltInputComponent) => {
				this.inputTransporters.add(undergroundBeltInputComponent);
				const cell: GridCell = this.gridService.getCellAtWorldPosition(
					this.player,
					this.instance.GetPivot().Position,
				)!;
				const undergroundBeltInputCell: GridCell = this.gridService.getCellAtWorldPosition(
					this.player,
					undergroundBeltInput.GetPivot().Position,
				)!;

				this.undergroundBeltDistance =
					cell.position.X === undergroundBeltInputCell.position.X
						? math.abs(undergroundBeltInputCell.position.Z - cell.position.Z)
						: math.abs(undergroundBeltInputCell.position.X - cell.position.X);
			});
	}

	public override canInputItem(item: Item): boolean {
		return this.queuedItems.size() + this.items.size() < this.undergroundBeltDistance;
	}
}
