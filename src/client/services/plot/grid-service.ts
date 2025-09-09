import { Events } from "../../network";
import { snapVectorToCardinal } from "shared/utils/math";
import {
	StructureMovementData,
	StructureName,
	StructuresPlacementData,
	getStructureCellsNodesWorldPositions,
} from "shared/constants/structures";
import { GridCell, GridData } from "shared/grid";
import { Players } from "@rbxts/services";
import { EventBus } from "client/event-bus";

export default class GridService {
	//#region Singleton
	private static _inst: GridService;
	public static getInst(): GridService {
		this._inst = this._inst ?? new GridService();
		return this._inst;
	}
	//#endregion
	private readonly gridsData = new Map<Player, GridData>();

	constructor() {
		this.initEvents();
	}

	private initEvents() {
		Events.OnPlotInitialization.connect((player, plot, gridData) => {
			this.initGrid(player, plot, gridData);
		});
		Events.OnStructuresPlacement.connect((player, structuresModels) => {
			for (const structureModel of structuresModels) {
				this.initStructuresCells(player, structureModel);
			}
			EventBus.PlotEvents.OnStructuresPlacement.Fire(player, structuresModels);
		});
	}

	private initGrid(player: Player, plot: Model, gridData: GridData) {
		this.gridsData.set(player, gridData);
		const structuresModels = plot.WaitForChild("Structures").GetChildren() as Model[];
		for (const structureModel of structuresModels) {
			this.initStructuresCells(player, structureModel);
		}
		EventBus.PlotEvents.OnPlotInitialization.Fire(player);
	}

	private initStructuresCells(player: Player, structureModel: Model) {
		const structureCells: GridCell[] = [];
		for (const structureCellNodeWorldPosition of getStructureCellsNodesWorldPositions(structureModel)) {
			const cell = this.getCellAtWorldPosition(player, structureCellNodeWorldPosition)!;
			cell.structureModel = structureModel;
			structureCells.push(cell);
		}

		const movementConnection = Events.OnStructuresMovement.connect((_, structuresModels) => {
			if (structuresModels.includes(structureModel)) {
				const ownedStructureCells = structureCells.filter(
					(structureCell) => structureCell.structureModel === structureModel,
				);
				for (const ownedStructureCell of ownedStructureCells) {
					ownedStructureCell.structureModel = undefined;
				}

				structureCells.clear();
				for (const structureCellNodeWorldPosition of getStructureCellsNodesWorldPositions(structureModel)) {
					const cell = this.getCellAtWorldPosition(player, structureCellNodeWorldPosition)!;
					cell.structureModel = structureModel;
					structureCells.push(cell);
				}
			}
		});

		structureModel.Destroying.Connect(() => {
			const ownedStructureCells = structureCells.filter(
				(structureCell) => structureCell.structureModel === structureModel,
			);
			for (const ownedStructureCell of ownedStructureCells) {
				ownedStructureCell.structureModel = undefined;
			}
			movementConnection.Disconnect();
		});

		structureModel.AttributeChanged.Connect((attributeName) => {
			Events.SetStructureAttribute(structureModel, attributeName, structureModel.GetAttribute(attributeName)!);
		});
	}

	public canPlace(player: Player, structuresModels: Model[]): boolean {
		for (const structureModel of structuresModels) {
			for (const structureCellNodeWorldPosition of getStructureCellsNodesWorldPositions(structureModel)) {
				const cell = this.getCellAtWorldPosition(player, structureCellNodeWorldPosition);
				if (cell === undefined || cell.structureModel !== undefined) return false;
			}
		}
		return true;
	}

	public place(player: Player, structuresModels: Model[]): void {
		if (!this.canPlace(player, structuresModels)) return;
		const structuresPlacementData: StructuresPlacementData[] = [];
		for (const structureModel of structuresModels) {
			const structuresAttributes: Record<string, AttributeValue> = {};
			for (const [structureAttributeName, structureAttributeValue] of structureModel.GetAttributes()) {
				structuresAttributes[structureAttributeName] = structureAttributeValue;
			}
			const structurePlacementData: StructuresPlacementData = {
				structureName: structureModel.Name as StructureName,
				targetCF: structureModel.PrimaryPart!.CFrame,
				structureAttributes: structuresAttributes,
			};
			structuresPlacementData.push(structurePlacementData);
		}
		Events.PlaceStructures.fire(structuresPlacementData);
	}

	public canMoveTo(player: Player, structuresModels: Model[]): boolean {
		for (const structureModel of structuresModels) {
			for (const structureCellNodeWorldPosition of getStructureCellsNodesWorldPositions(structureModel)) {
				const cell = this.getCellAtWorldPosition(player, structureCellNodeWorldPosition);
				if (cell === undefined || (cell.structureModel && !structuresModels.includes(cell.structureModel)))
					return false;
			}
		}
		return true;
	}

	public moveTo(player: Player, structuresModels: Model[]): void {
		if (!this.canMoveTo(player, structuresModels)) return;
		const structuresMovementData: StructureMovementData[] = [];
		for (const structureModel of structuresModels) {
			const structureMovementData: StructureMovementData = {
				structureModel: structureModel,
				targetCF: structureModel.PrimaryPart!.CFrame,
			};
			structuresMovementData.push(structureMovementData);
		}
		Events.MoveStructures.fire(structuresMovementData);
	}

	public delete(structuresModels: Model[]) {
		Events.DestroyStructures.fire(structuresModels);
	}

	public getCellAtWorldPosition(player: Player = Players.LocalPlayer, position: Vector3): GridCell | undefined {
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

	public getClampedCellAtWorldPosition(
		player: Player = Players.LocalPlayer,
		position: Vector3,
	): GridCell | undefined {
		const gridData = this.gridsData.get(player)!;
		const x = math.clamp(
			math.round((position.X + gridData.cellSize / 2 - gridData.startX) / gridData.cellSize),
			0,
			gridData.grid.size() - 1,
		);
		const y = math.clamp(math.floor(position.Y / gridData.layerHeight), 0, gridData.grid[0][0].size());
		const z = math.clamp(
			math.round((position.Z + gridData.cellSize / 2 - gridData.startZ) / gridData.cellSize),
			0,
			gridData.grid[0].size(),
		);
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

	public getCellWorldPosition(player: Player, cell: GridCell): Vector3 {
		const gridData = this.gridsData.get(player)!;
		const position = new Vector3(
			gridData.startX + cell.x * gridData.cellSize - gridData.cellSize / 2,
			cell.y * gridData.layerHeight,
			gridData.startZ + cell.z * gridData.cellSize - gridData.cellSize / 2,
		);
		return position;
	}

	public getCellInDirection(
		player: Player,
		originPosition: Vector3,
		direction: Vector3,
		steps?: number,
	): GridCell | undefined;
	public getCellInDirection(
		player: Player,
		originCell: GridCell,
		direction: Vector3,
		steps?: number,
	): GridCell | undefined;
	public getCellInDirection(player: Player, origin: Vector3 | GridCell, direction: Vector3, steps: number = 1) {
		const cardinalVector = snapVectorToCardinal(direction);
		const originPosition = typeIs(origin, "Vector3") ? origin : this.getCellWorldPosition(player, origin);
		const positionInDirection = originPosition.add(
			cardinalVector.mul(this.gridsData.get(player)!.cellSize * steps),
		);
		const cellInDirection = this.getCellAtWorldPosition(player, positionInDirection);
		return cellInDirection;
	}

	public getNeighborsCells(player: Player, origin: Vector3): GridCell[];
	public getNeighborsCells(player: Player, origin: GridCell): GridCell[];
	public getNeighborsCells(player: Player, origin: Vector3 | GridCell): GridCell[] {
		const originPosition = typeIs(origin, "Vector3") ? origin : this.getCellWorldPosition(player, origin);
		const directions: Vector3[] = [Vector3.xAxis, Vector3.xAxis.mul(-1), Vector3.zAxis, Vector3.zAxis.mul(-1)];
		const neighborsCells: GridCell[] = [];
		for (const direction of directions) {
			const cell = this.getCellInDirection(player, originPosition, direction);
			if (cell === undefined) continue;
			neighborsCells.push(cell);
		}
		return neighborsCells;
	}

	public getPathToCell(player: Player, startCell: GridCell, goalCell: GridCell, rotation: number): GridCell[] {
		const grid = this.gridsData.get(player)!.grid;
		const cellsPath: GridCell[] = [];
		cellsPath.push(startCell);

		const stepX = startCell.x < goalCell.x ? 1 : -1;
		const stepZ = startCell.z < goalCell.z ? 1 : -1;
		let x = startCell.x;
		let z = startCell.z;

		if (rotation % 180 === 0) {
			while (z !== goalCell.z) {
				z += stepZ;
				cellsPath.push(grid[x][z][0]);
			}

			while (x !== goalCell.x) {
				x += stepX;
				cellsPath.push(grid[x][z][0]);
			}
		} else {
			while (x !== goalCell.x) {
				x += stepX;
				cellsPath.push(grid[x][z][0]);
			}
			while (z !== goalCell.z) {
				z += stepZ;
				cellsPath.push(grid[x][z][0]);
			}
		}
		return cellsPath;
	}
}
