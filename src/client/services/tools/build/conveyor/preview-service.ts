import GridService from "client/services/plot/grid-service";
import { GridCell } from "shared/grid";
import { Players, Workspace } from "@rbxts/services";
import { snapVectorToCardinal } from "shared/utils/math";
import BaseStructureHighlightService from "../../base/visuals/highlight-service";
import BaseStructureArrowService from "../../base/visuals/arrow-service";
import { STRUCTURES } from "shared/constants/structures";

export class ConveyorPreviewService {
	private readonly conveyorModelHolder = new Instance("Model", Workspace);
	private readonly conveyorPathCellsModels = new Map<GridCell, Model>();

	constructor(
		private readonly gridService: GridService,
		private readonly baseStructureHighlightService: BaseStructureHighlightService,
		private readonly baseStructureArrowService: BaseStructureArrowService,
	) {}

	public initConveyorPathPreview(cellsPath: GridCell[], targetRotation: number) {
		if (cellsPath.size() === 1) {
			const newConveyorModel = STRUCTURES["Straight Conveyor"].model.Clone();
			const goalCellPosition = this.gridService.getCellWorldPosition(Players.LocalPlayer, cellsPath[0]);
			newConveyorModel.PivotTo(
				new CFrame(new Vector3(goalCellPosition.X, 2.25, goalCellPosition.Z)).mul(
					CFrame.Angles(0, math.rad(targetRotation), 0),
				),
			);
			newConveyorModel.Parent = this.conveyorModelHolder;
			this.baseStructureArrowService.initStructureArrows(newConveyorModel);
		} else {
			for (let i = 0; i < cellsPath.size(); i++) {
				const cell = cellsPath[i];
				const cellPosition = this.gridService.getCellWorldPosition(Players.LocalPlayer, cell);

				const newConveyorModel = STRUCTURES["Straight Conveyor"].model.Clone();
				this.conveyorPathCellsModels.set(cell, newConveyorModel);

				let direction: Vector3;
				if (i === cellsPath.size() - 1) {
					this.baseStructureArrowService.initStructureOutputArrows(newConveyorModel);
					direction = snapVectorToCardinal(
						cellPosition.sub(this.gridService.getCellWorldPosition(Players.LocalPlayer, cellsPath[i - 1])),
					);
				} else {
					if (i === 0) {
						this.baseStructureArrowService.initStructureInputArrows(newConveyorModel);
					}
					direction = snapVectorToCardinal(
						this.gridService.getCellWorldPosition(Players.LocalPlayer, cellsPath[i + 1]).sub(cellPosition),
					);
				}

				const targetPosition = new Vector3(cellPosition.X, 2.25, cellPosition.Z);
				newConveyorModel.PivotTo(CFrame.lookAt(targetPosition, targetPosition.add(direction)));
				newConveyorModel.Parent = this.conveyorModelHolder;
			}
			this.fixConveyorPathModels();
		}

		this.baseStructureHighlightService.initStructureHighlight(this.conveyorModelHolder);
	}

	public updateConveyorPathPreview(canPlace: boolean) {
		this.baseStructureHighlightService.updateStructureHighlight(canPlace);
		this.baseStructureArrowService.updateStructureArrows();
	}

	public resetConveyorPathPreview() {
		this.baseStructureHighlightService.resetStructureHighlight();
		this.baseStructureArrowService.resetStructureArrows();
		for (const conveyorModel of this.conveyorModelHolder.GetChildren()) {
			conveyorModel.Destroy();
		}
		this.conveyorPathCellsModels.clear();
	}

	private fixConveyorPathModels() {
		for (const [cell, conveyorModel] of this.conveyorPathCellsModels) {
			const forward = conveyorModel.PrimaryPart!.CFrame.LookVector;
			const right = conveyorModel.PrimaryPart!.CFrame.RightVector;

			const neighbors = {
				forward: this.gridService.getCellInDirection(Players.LocalPlayer, cell, forward),
				left: this.gridService.getCellInDirection(Players.LocalPlayer, cell, right.mul(-1)),
				right: this.gridService.getCellInDirection(Players.LocalPlayer, cell, right),
			};
			const has = {
				forward: neighbors.forward && this.conveyorPathCellsModels.has(neighbors.forward),
				left: neighbors.left && this.conveyorPathCellsModels.has(neighbors.left),
				right: neighbors.right && this.conveyorPathCellsModels.has(neighbors.right),
			};

			let newConveyorModel: Model | undefined;
			if (has.forward) {
				if (has.left) {
					const leftConveyorModel = this.conveyorPathCellsModels.get(neighbors.left!)!;
					if (leftConveyorModel.PrimaryPart!.CFrame.LookVector.FuzzyEq(right, 0.2)) {
						newConveyorModel = STRUCTURES["Left Turn Conveyor"].model.Clone();
					}
				} else if (has.right) {
					const rightConveyorModel = this.conveyorPathCellsModels.get(neighbors.right!)!;
					if (rightConveyorModel.PrimaryPart!.CFrame.LookVector.FuzzyEq(right.mul(-1), 0.2)) {
						newConveyorModel = STRUCTURES["Right Turn Conveyor"].model.Clone();
					}
				}
			}

			if (newConveyorModel !== undefined) {
				newConveyorModel.PivotTo(conveyorModel.GetPivot());
				newConveyorModel.Parent = this.conveyorModelHolder;
				conveyorModel.Destroy();
			}
		}
	}

	public getConveyorModelHolder() {
		return this.conveyorModelHolder;
	}
}
