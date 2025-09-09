import { GridCell, GridData } from "shared/grid";
import {
	STRUCTURES,
	StructureMovementData,
	StructureName,
	StructuresPlacementData,
	getStructureCellsNodesWorldPositions,
} from "shared/constants/structures";
import { snapVectorToCardinal } from "shared/utils/math";
import { Service } from "@flamework/core";
import Signal from "@rbxts/signal";

@Service({})
export default class GridService {
	private readonly gridsData = new Map<Player, GridData>();
	private readonly width: number = 50;
	private readonly height: number = 50;
	private readonly layers: number = 4;
	private readonly cellSize: number = 4;
	private readonly layerHeight: number = 4;

	public readonly OnStructuresPlacement = new Signal<(structuresModels: Model[]) => void>();
	public readonly OnStructuresMovement = new Signal<(structuresModels: Model[]) => void>();

	public initGrid(player: Player, plot: Model): GridData {
		const startX = plot.PrimaryPart!.CFrame.Position.X - (this.width / 2) * this.cellSize + this.cellSize;
		const startZ = plot.PrimaryPart!.CFrame.Position.Z - (this.height / 2) * this.cellSize + this.cellSize;

		const grid: GridCell[][][] = [];
		for (let x = 0; x < this.width; x++) {
			grid[x] = [];
			for (let z = 0; z < this.height; z++) {
				grid[x][z] = [];
				for (let y = 0; y <= this.layers; y++) {
					grid[x][z][y] = {
						x: x,
						y: y,
						z: z,
						structureModel: undefined,
					};
				}
			}
		}
		const gridData: GridData = {
			grid: grid,
			cellSize: this.cellSize,
			layerHeight: this.layerHeight,
			startX: startX,
			startZ: startZ,
		};

		this.gridsData.set(player, gridData);
		return gridData;
	}

	public initStructuresCells(player: Player, structuresModels: Model[]) {
		for (const structureModel of structuresModels) {
			const structuresCells: GridCell[] = [];
			for (const structureCellNodeWorldPosition of getStructureCellsNodesWorldPositions(structureModel)) {
				const cell = this.getCellAtWorldPosition(player, structureCellNodeWorldPosition)!;
				cell.structureModel = structureModel;
				structuresCells.push(cell);
			}

			structureModel.PrimaryPart!.GetPropertyChangedSignal("CFrame").Connect(() => {
				const ownedStructureCells = structuresCells.filter(
					(structureCell) => structureCell.structureModel === structureModel,
				);
				for (const ownedStructureCell of ownedStructureCells) {
					ownedStructureCell.structureModel = undefined;
				}

				structuresCells.clear();
				for (const structureCellNodeWorldPosition of getStructureCellsNodesWorldPositions(structureModel)) {
					const cell = this.getCellAtWorldPosition(player, structureCellNodeWorldPosition)!;
					cell.structureModel = structureModel;
					structuresCells.push(cell);
				}
			});

			structureModel.Destroying.Connect(() => {
				const ownedStructureCells = structuresCells.filter(
					(structureCell) => structureCell.structureModel === structureModel,
				);
				for (const ownedStructureCell of ownedStructureCells) {
					ownedStructureCell.structureModel = undefined;
				}
				for (const ownedStructureCell of ownedStructureCells) {
					ownedStructureCell.structureModel = undefined;
				}
			});
		}
	}

	public canPlace(player: Player, structuresPlacementData: StructuresPlacementData[]): boolean {
		{
			for (const structurePlacementData of structuresPlacementData) {
				const structureDefinition = STRUCTURES[structurePlacementData.structureName];
				const cellsNodesLocalPositions = structureDefinition.nodes.cells;
				for (const cellNodeLocalPosition of cellsNodesLocalPositions) {
					const cell = this.getCellAtWorldPosition(
						player,
						structurePlacementData.targetCF.PointToWorldSpace(cellNodeLocalPosition),
					)!;
					if (!cell || cell.structureModel !== undefined) return false;
				}
			}
		}

		return true;
	}

	public canMoveTo(player: Player, structuresMovementData: StructureMovementData[]) {
		const structuresModels = structuresMovementData.map(
			(structureMovementData) => structureMovementData.structureModel,
		);
		for (const structureMovementData of structuresMovementData) {
			const structureDefinition = STRUCTURES[structureMovementData.structureModel.Name as StructureName];
			const cellsNodesLocalPositions = structureDefinition.nodes.cells;
			for (const cellNodeLocalPosition of cellsNodesLocalPositions) {
				const cell = this.getCellAtWorldPosition(
					player,
					structureMovementData.targetCF.PointToWorldSpace(cellNodeLocalPosition),
				);
				if (
					cell === undefined ||
					(cell.structureModel !== undefined && !structuresModels.includes(cell.structureModel))
				)
					return false;
			}
		}
		return true;
	}

	public getCellAtWorldPosition(player: Player, position: Vector3): GridCell | undefined {
		const gridData = this.gridsData.get(player)!;
		const x = math.round((position.X + gridData.cellSize / 2 - gridData.startX) / gridData.cellSize);
		const y = math.floor(position.Y / gridData.layerHeight);
		const z = math.round((position.Z + gridData.cellSize / 2 - gridData.startZ) / gridData.cellSize);
		if (
			x >= 0 &&
			x < gridData.grid.size() &&
			y >= 0 &&
			y <= gridData.grid[0][0].size() &&
			z >= 0 &&
			z < gridData.grid[0].size()
		) {
			return this.gridsData.get(player)!.grid[x][z][y];
		}
		return undefined;
	}

	public getCellInDirection(
		player: Player,
		originPosition: Vector3,
		direction: Vector3,
		steps: number = 1,
	): GridCell | undefined {
		const cardinalVector = snapVectorToCardinal(direction.Unit);
		const positionInDirection = originPosition.add(cardinalVector.mul(this.cellSize * steps));
		const cellInDirection = this.getCellAtWorldPosition(player, positionInDirection);
		return cellInDirection;
	}

	public getNeighborsCells(player: Player, originPosition: Vector3): GridCell[] {
		const neighborsCells: GridCell[] = [];
		const directions: Vector3[] = [
			new Vector3(1, 0, 0),
			new Vector3(-1, 0, 0),
			new Vector3(0, 0, 1),
			new Vector3(0, 0, -1),
		];
		for (const direction of directions) {
			const cell = this.getCellInDirection(player, originPosition, direction);
			if (!cell) continue;
			neighborsCells.push(cell);
		}
		return neighborsCells;
	}
}
