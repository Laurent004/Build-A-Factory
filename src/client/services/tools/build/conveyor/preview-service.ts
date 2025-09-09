import GridService from "client/services/plot/grid-service";
import { GridCell } from "shared/grid";
import { StructureDefinition, STRUCTURES } from "shared/constants/structures";
import { Players, Workspace } from "@rbxts/services";
import { MODELS } from "shared/assets/models";
import { snapVectorToCardinal } from "shared/utils/math";
import StructureHighlightService from "../../visuals/highlight-service";
import StructureArrowService from "../../visuals/arrow-service";

export default class ConveyorPreviewService {
	private readonly structureHighlightService: StructureHighlightService;
	private readonly structureArrowService: StructureArrowService = StructureArrowService.getInst();

	private readonly conveyorsModelsHolder: Model = new Instance("Model", Workspace);
	private snappedConveyorModel: Model | undefined;
	private readonly conveyorModelsPath = new Map<GridCell, Model>();

	constructor(private readonly gridService: GridService) {
		this.structureHighlightService = new StructureHighlightService(gridService);
		this.structureHighlightService.initHighlight(this.conveyorsModelsHolder);
	}

	public initBuildingPreview(structureDefinition: StructureDefinition) {
		const newConveyorModel = structureDefinition.model.Clone();
		newConveyorModel.Parent = this.conveyorsModelsHolder;
		this.conveyorsModelsHolder.PrimaryPart = newConveyorModel.PrimaryPart;
		this.snappedConveyorModel = structureDefinition.model.Clone();
		this.structureArrowService.initArrows(this.conveyorsModelsHolder);
	}

	public updateBuildingPreview(currentCF: CFrame, targetCF: CFrame) {
		this.conveyorsModelsHolder.PivotTo(currentCF);
		this.snappedConveyorModel!.PivotTo(targetCF);
		this.structureHighlightService.updateBuildingHighlight([this.snappedConveyorModel!]);
		this.structureArrowService.updateAllStructuresArrows();
	}

	public resetBuildingPreview() {
		this.structureArrowService.resetAllArrows();
		this.snappedConveyorModel?.Destroy();
		this.snappedConveyorModel = undefined;
	}

	public initPathPreview(startCell: GridCell, goalCell: GridCell, rotation: number) {
		const manhattanCellsPath = this.gridService.getPathToCell(Players.LocalPlayer, startCell, goalCell, rotation);
		if (manhattanCellsPath.size() === 1) {
			const goalCellPosition = this.gridService.getCellWorldPosition(Players.LocalPlayer, goalCell);
			const newConveyorModel = STRUCTURES["Straight Conveyor"].model.Clone();
			const targetPosition = new Vector3(goalCellPosition.X, 2.25, goalCellPosition.Z);
			const targetCF = new CFrame(targetPosition).mul(CFrame.Angles(0, math.rad(rotation), 0));
			newConveyorModel.PivotTo(targetCF);
			newConveyorModel.Parent = this.conveyorsModelsHolder;
			this.structureArrowService.initArrows(newConveyorModel);
		} else {
			for (let i = 0; i < manhattanCellsPath.size(); i++) {
				const cell = manhattanCellsPath[i];
				const cellPosition = this.gridService.getCellWorldPosition(Players.LocalPlayer, cell);
				const newConveyorModel = MODELS.structures.StraightConveyor.Clone();
				this.conveyorModelsPath.set(cell, newConveyorModel);

				let direction: Vector3;
				if (i === manhattanCellsPath.size() - 1) {
					this.structureArrowService.initOutputArrows(newConveyorModel);
					const previousCellPosition = this.gridService.getCellWorldPosition(
						Players.LocalPlayer,
						manhattanCellsPath[i - 1],
					);
					direction = snapVectorToCardinal(cellPosition.sub(previousCellPosition));
				} else {
					if (i === 0) {
						this.structureArrowService.initInputArrows(newConveyorModel);
					}
					const nextCellPosition = this.gridService.getCellWorldPosition(
						Players.LocalPlayer,
						manhattanCellsPath[i + 1],
					);
					direction = snapVectorToCardinal(nextCellPosition.sub(cellPosition));
				}

				const targetPosition = new Vector3(cellPosition.X, 2.25, cellPosition.Z);
				const targetCF = CFrame.lookAt(targetPosition, targetPosition.add(direction));
				newConveyorModel.PivotTo(targetCF);
				newConveyorModel.Parent = this.conveyorsModelsHolder;
			}
			this.fixPathModels();
		}
	}

	private fixPathModels() {
		const outputNodeLocalCF = STRUCTURES["Straight Conveyor"].nodes.outputs[0];
		for (const [_, conveyorModel] of this.conveyorModelsPath) {
			const forward = snapVectorToCardinal(conveyorModel.PrimaryPart!.CFrame.mul(outputNodeLocalCF).RightVector);
			const right = snapVectorToCardinal(conveyorModel.PrimaryPart!.CFrame.mul(outputNodeLocalCF).UpVector);

			const neighbors = {
				forward: this.gridService.getCellInDirection(
					Players.LocalPlayer,
					conveyorModel.PrimaryPart!.CFrame.Position,
					forward,
				),
				left: this.gridService.getCellInDirection(
					Players.LocalPlayer,
					conveyorModel.PrimaryPart!.CFrame.Position,
					right.mul(-1),
				),
				right: this.gridService.getCellInDirection(
					Players.LocalPlayer,
					conveyorModel.PrimaryPart!.CFrame.Position,
					right,
				),
			};
			const has = {
				forward: neighbors.forward && this.conveyorModelsPath.has(neighbors.forward),
				left: neighbors.left && this.conveyorModelsPath.has(neighbors.left),
				right: neighbors.right && this.conveyorModelsPath.has(neighbors.right),
			};

			let newConveyorModel: Model | undefined;
			if (has.forward) {
				if (has.left) {
					const leftConveyorModel = this.conveyorModelsPath.get(neighbors.left!)!;
					const leftConveyorModelForward = snapVectorToCardinal(
						leftConveyorModel.PrimaryPart!.CFrame.mul(outputNodeLocalCF).RightVector,
					);
					if (leftConveyorModelForward === right) {
						newConveyorModel = MODELS.structures.LeftTurnConveyor;
					}
				}
				if (has.right) {
					const rightConveyorModel = this.conveyorModelsPath.get(neighbors.right!)!;
					const rightConveyorModelForward = snapVectorToCardinal(
						rightConveyorModel.PrimaryPart!.CFrame.mul(outputNodeLocalCF).RightVector,
					);
					if (rightConveyorModelForward === right.mul(-1)) {
						newConveyorModel = MODELS.structures.RightTurnConveyor;
					}
				}
			}

			if (newConveyorModel !== undefined) {
				newConveyorModel = newConveyorModel.Clone();
				newConveyorModel.PivotTo(conveyorModel.GetPivot());
				newConveyorModel.Parent = this.conveyorsModelsHolder;
				conveyorModel.Destroy();
			}
		}
	}

	public updatePathPreview(targetCF: CFrame) {
		//Here we have a targetCF beacuse we still want to be able to update the snapped conveyor model rotation.
		this.snappedConveyorModel!.PivotTo(targetCF);
		this.structureHighlightService.updateBuildingHighlight(this.getConveyorsModels());
		this.structureArrowService.updateAllStructuresArrows();
	}

	public resetPathPreview() {
		this.structureArrowService.resetAllArrows();
		for (const conveyorModel of this.getConveyorsModels()) {
			conveyorModel.Destroy();
		}
		this.conveyorModelsPath.clear();
	}

	public getConveyorsModelsHolder() {
		return this.conveyorsModelsHolder;
	}

	public getConveyorsModels(): Model[] {
		return this.conveyorsModelsHolder.GetChildren().filter((instance): instance is Model => instance.IsA("Model"));
	}

	public getSnappedConveyorModel(): Model | undefined {
		return this.snappedConveyorModel;
	}
}
