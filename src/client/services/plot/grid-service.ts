import { Events } from "../../network";
import { snapVectorToCardinal } from "shared/utils/math";
import { PowerLineData, StructureMovementData, STRUCTURES, StructuresPlacementData } from "shared/constants/structures";
import { GridCell, GridData } from "shared/grid";
import { EventBus } from "client/event-bus";

export default class GridService {
	//#region Singleton
	private static _inst: GridService;
	public static getInst(): GridService {
		this._inst = this._inst ?? new GridService();
		return this._inst;
	}
	//#endregion

	private readonly grids = new Map<Player, GridCell[][]>();
	private readonly gridsData = new Map<Player, GridData>();
	private readonly structuresCells = new Map<Model, GridCell[]>();

	private constructor() {
		this.initEvents();
	}

	private initEvents(): void {
		Events.OnPlotInitialization.connect((player, plot, gridData) => {
			this.initGrid(player, gridData);
			this.initStructuresCells(
				player,
				plot
					.WaitForChild("Structures")
					.GetDescendants()
					.filter((instance): instance is Model => instance.IsA("Model") && instance.Name in STRUCTURES),
			);

			Events.OnPlotInitialization.fire();
			EventBus.PlotEvents.OnPlotInitialization.Fire(player, plot);
		});

		Events.OnStructuresPlacement.connect((player, structuresModels) => {
			this.initStructuresCells(player, structuresModels);
			EventBus.PlotEvents.OnStructuresPlacement.Fire(player);
		});

		Events.OnStructuresMovementStart.connect((_, structuresModels) => {
			this.clearStructuresCells(structuresModels);
		});

		Events.OnStructuresMovement.connect((player, structuresModels) => {
			this.initStructuresCells(player, structuresModels);
			EventBus.PlotEvents.OnStructuresMovement.Fire(structuresModels);
		});

		Events.OnStructuresDestroying.connect((_, structuresModels) => {
			this.clearStructuresCells(structuresModels);
		});
	}

	private initGrid(player: Player, gridData: GridData): void {
		const grid: GridCell[][] = [];
		for (let x = 0; x < gridData.width; x++) {
			grid[x] = [];
			for (let z = 0; z < gridData.height; z++) {
				grid[x][z] = {
					position: new Vector3int16(x, 0, z),
					structureModel: undefined,
				};
			}
		}

		this.grids.set(player, grid);
		this.gridsData.set(player, gridData);
	}

	private initStructuresCells(player: Player, structuresModels: Model[]): void {
		for (const structureModel of structuresModels) {
			const cells: GridCell[] = this.getStructureCells(player, structureModel);
			for (const cell of cells) {
				cell.structureModel = structureModel;
			}
			this.structuresCells.set(structureModel, cells);
		}
	}

	private clearStructuresCells(structuresModels: Model[]): void {
		for (const structureModel of structuresModels) {
			const cells = this.structuresCells.get(structureModel);
			if (cells === undefined) continue;
			for (const cell of cells.filter((cell) => cell.structureModel === structureModel)) {
				cell.structureModel = undefined;
			}
			this.structuresCells.delete(structureModel);
		}
	}

	private getStructureCells(player: Player, structureModel: Model): GridCell[] {
		return STRUCTURES[structureModel.Name].nodes.cells.mapFiltered((cellNodeLocalPosition) =>
			this.getCellAtWorldPosition(player, structureModel.GetPivot().PointToWorldSpace(cellNodeLocalPosition)),
		);
	}

	public place(player: Player, structureModel: Model): void {
		if (!this.canPlace(player, structureModel)) return;
		const structuresPlacementData: StructuresPlacementData[] = structureModel
			.GetChildren()
			.filter((instance): instance is Model => instance.IsA("Model") && instance.Name in STRUCTURES)
			.map((model) => {
				return {
					structureName: model.Name,
					targetCFs: new Map<string, CFrame>(
						[
							model,
							...model
								.GetChildren()
								.filter(
									(instance): instance is Model =>
										instance.IsA("Model") && instance.Name in STRUCTURES,
								),
						].map((structureModel) => [structureModel.Name, structureModel.GetPivot()]),
					),
					structureAttributes: model.GetAttributes(),
				};
			});

		const powerLinesData: PowerLineData[] = structureModel
			.GetChildren()
			.filter((instance): instance is RopeConstraint => instance.IsA("RopeConstraint"))
			.map((powerLine) => {
				return {
					startPowerAttachmentCfComponents: powerLine.Attachment0!.WorldCFrame.GetComponents(),
					endPowerAttachmentCfComponents: powerLine.Attachment1!.WorldCFrame.GetComponents(),
				};
			});

		Events.PlaceStructures.fire(structuresPlacementData, powerLinesData);
	}

	public canPlace(player: Player, structureModel: Model): boolean {
		return structureModel
			.GetDescendants()
			.filter((instance): instance is Model => instance.IsA("Model") && instance.Name in STRUCTURES)
			.every((model) => {
				const cells = this.getStructureCells(player, model);
				return (
					cells.size() === STRUCTURES[model.Name].nodes.cells.size() &&
					cells.every((cell) => cell.structureModel === undefined)
				);
			});
	}

	public move(player: Player, structureModel: Model): void {
		if (!this.canPlace(player, structureModel)) return;
		const structuresMovementData: StructureMovementData[] = structureModel
			.GetDescendants()
			.filter((instance): instance is Model => instance.IsA("Model") && instance.Name in STRUCTURES)
			.map((model) => {
				return {
					structureModel: model,
					targetCF: model.GetPivot(),
				};
			});
		Events.MoveStructures.fire(structuresMovementData);
	}

	//#region Helpers

	public getCellAtWorldPosition(player: Player, position: Vector3): GridCell | undefined {
		const grid = this.grids.get(player)!;
		const gridData = this.gridsData.get(player)!;
		const x = math.round((position.X + gridData.cellSize / 2 - gridData.startX) / gridData.cellSize);
		const z = math.round((position.Z + gridData.cellSize / 2 - gridData.startZ) / gridData.cellSize);
		if (x >= 0 && x < gridData.width && z >= 0 && z < gridData.height) {
			return grid[x][z];
		}
		return undefined;
	}

	public getClampedCellAtWorldPosition(player: Player, position: Vector3): GridCell | undefined {
		const gridData = this.gridsData.get(player)!;
		const x = math.clamp(
			math.round((position.X + gridData.cellSize / 2 - gridData.startX) / gridData.cellSize),
			0,
			gridData.width - 1,
		);
		const z = math.clamp(
			math.round((position.Z + gridData.cellSize / 2 - gridData.startZ) / gridData.cellSize),
			0,
			gridData.height - 1,
		);
		if (x >= 0 && x < gridData.width && z >= 0 && z < gridData.height) {
			return this.grids.get(player)![x][z];
		}
		return undefined;
	}

	public getCellVertexPositionAtWorldPosition(player: Player, position: Vector3): Vector3 | undefined {
		const cell = this.getCellAtWorldPosition(player, position);
		if (cell === undefined) return undefined;

		const gridData = this.gridsData.get(player)!;
		const cellPosition = this.getCellWorldPosition(player, cell);
		const cellVerticesOffsets = [
			new Vector3(gridData.cellSize / 2, 0, gridData.cellSize / 2),
			new Vector3(-gridData.cellSize / 2, 0, gridData.cellSize / 2),
			new Vector3(gridData.cellSize / 2, 0, -gridData.cellSize / 2),
			new Vector3(-gridData.cellSize / 2, 0, -gridData.cellSize / 2),
		];

		let closestVertexPosition!: Vector3;
		let closestDistance: number = math.huge;
		for (const cellVertexOffset of cellVerticesOffsets) {
			const cellVertexPosition = cellPosition.add(cellVertexOffset);
			const distance = cellVertexPosition.sub(position).Magnitude;
			if (distance < closestDistance) {
				closestVertexPosition = cellVertexPosition;
				closestDistance = distance;
			}
		}

		return closestVertexPosition;
	}

	public getClampedCellVertexPositionAtWorldPosition(player: Player, position: Vector3): Vector3 | undefined {
		const cell = this.getClampedCellAtWorldPosition(player, position);
		if (cell === undefined) return undefined;

		const gridData = this.gridsData.get(player)!;
		const cellPosition = this.getCellWorldPosition(player, cell);
		const cellVerticesOffsets = [
			new Vector3(gridData.cellSize / 2, 0, gridData.cellSize / 2),
			new Vector3(-gridData.cellSize / 2, 0, gridData.cellSize / 2),
			new Vector3(gridData.cellSize / 2, 0, -gridData.cellSize / 2),
			new Vector3(-gridData.cellSize / 2, 0, -gridData.cellSize / 2),
		];

		let closestVertexPosition!: Vector3;
		let closestDistance: number = math.huge;
		for (const cellVertexOffset of cellVerticesOffsets) {
			const cellVertexPosition = cellPosition.add(cellVertexOffset);
			const distance = cellVertexPosition.sub(position).Magnitude;
			if (distance < closestDistance) {
				closestVertexPosition = cellVertexPosition;
				closestDistance = distance;
			}
		}

		return closestVertexPosition;
	}

	public getCellWorldPosition(player: Player, cell: GridCell): Vector3 {
		const gridData = this.gridsData.get(player)!;
		return new Vector3(
			gridData.startX + cell.position.X * gridData.cellSize - gridData.cellSize / 2,
			0,
			gridData.startZ + cell.position.Z * gridData.cellSize - gridData.cellSize / 2,
		);
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
	public getCellInDirection(
		player: Player,
		origin: Vector3 | GridCell,
		direction: Vector3,
		steps: number = 1,
	): GridCell | undefined {
		const originPosition = typeIs(origin, "Vector3") ? origin : this.getCellWorldPosition(player, origin);
		return this.getCellAtWorldPosition(
			player,
			originPosition.add(snapVectorToCardinal(direction).mul(this.gridsData.get(player)!.cellSize * steps)),
		);
	}

	public getNeighborsCells(player: Player, origin: Vector3): GridCell[];
	public getNeighborsCells(player: Player, origin: GridCell): GridCell[];
	public getNeighborsCells(player: Player, origin: Vector3 | GridCell): GridCell[] {
		const originPosition = typeIs(origin, "Vector3") ? origin : this.getCellWorldPosition(player, origin);
		const neighborsDirections: Vector3[] = [
			Vector3.xAxis,
			Vector3.xAxis.mul(-1),
			Vector3.zAxis,
			Vector3.zAxis.mul(-1),
		];
		return neighborsDirections.mapFiltered((neighborDirection) =>
			this.getCellInDirection(player, originPosition, neighborDirection),
		);
	}

	public getManhattanPath(player: Player, startCell: GridCell, goalCell: GridCell, rotation: number): GridCell[] {
		const grid = this.grids.get(player)!;
		const cellsPath: GridCell[] = [startCell];

		const stepX = startCell.position.X < goalCell.position.X ? 1 : -1;
		const stepZ = startCell.position.Z < goalCell.position.Z ? 1 : -1;

		let x = startCell.position.X;
		let z = startCell.position.Z;
		if (rotation % 180 === 0) {
			while (z !== goalCell.position.Z) {
				z += stepZ;
				cellsPath.push(grid[x][z]);
			}

			while (x !== goalCell.position.X) {
				x += stepX;
				cellsPath.push(grid[x][z]);
			}
		} else {
			while (x !== goalCell.position.X) {
				x += stepX;
				cellsPath.push(grid[x][z]);
			}
			while (z !== goalCell.position.Z) {
				z += stepZ;
				cellsPath.push(grid[x][z]);
			}
		}
		return cellsPath;
	}

	//#endregion
}
