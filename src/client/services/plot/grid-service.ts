import { Events } from "../../network";
import { snapVectorToCardinal } from "shared/utils/math";
import { STRUCTURES } from "shared/constants/structures";
import { EventBus } from "client/event-bus";
import { GridCell } from "shared/types";

export default class GridService {
	//#region Singleton
	private static _inst: GridService;
	public static getInst(): GridService {
		this._inst = this._inst ?? new GridService();
		return this._inst;
	}
	//#endregion

	private readonly grids = new Map<Player, GridCell[][][]>();
	private readonly gridsData = new Map<Player, { startX: number; startZ: number }>();
	private readonly cells = new Map<Model, GridCell[]>();
	private readonly width: number = 50;
	private readonly height: number = 50;
	private readonly layers: number = 5;
	private readonly cellSize: number = 4;

	private constructor() {
		this.initEvents();
	}

	private initEvents(): void {
		Events.OnPlotInitialization.connect((player, plot) => {
			this.initGrid(player, plot);
			this.initStructuresCells(
				player,
				plot
					.WaitForChild("Structures")
					.GetDescendants()
					.filter((instance): instance is Model => instance.IsA("Model") && instance.Name in STRUCTURES),
			);
			EventBus.PlotEvents.OnPlotInitialization.Fire(player, plot);
		});

		Events.OnStructuresPlacement.connect((player, structuresModels) => {
			this.initStructuresCells(player, structuresModels);
			EventBus.PlotEvents.OnStructuresPlacement.Fire(player, structuresModels);
		});

		Events.OnStructuresMovementStart.connect((_, structuresModels) => {
			this.clearStructuresCells(structuresModels);
		});

		Events.OnStructuresMovement.connect((player, structuresModels) => {
			this.initStructuresCells(player, structuresModels);
			EventBus.PlotEvents.OnStructuresMovement.Fire(player, structuresModels);
		});

		Events.OnStructuresDestroying.connect((_, structuresModels) => {
			this.clearStructuresCells(structuresModels);
		});
	}

	private initGrid(player: Player, plot: Model): void {
		const grid: GridCell[][][] = [];
		for (let x = 0; x < this.width; x++) {
			grid[x] = [];
			for (let z = 0; z < this.height; z++) {
				grid[x][z] = [];
				for (let y = 0; y < this.layers; y++) {
					grid[x][z][y] = {
						position: new Vector3int16(x, y, z),
						structureModel: undefined,
					};
				}
			}
		}
		this.grids.set(player, grid);
		this.gridsData.set(player, {
			startX: plot.GetPivot().Position.X - (this.width / 2) * this.cellSize + this.cellSize,
			startZ: plot.GetPivot().Position.Z - (this.height / 2) * this.cellSize + this.cellSize,
		});
	}

	private initStructuresCells(player: Player, structuresModels: Model[]): void {
		for (const structureModel of structuresModels) {
			const cells = STRUCTURES[structureModel.Name].nodes.cells.mapFiltered((cellNodeLocalPosition) =>
				this.getCellAtWorldPosition(player, structureModel.GetPivot().PointToWorldSpace(cellNodeLocalPosition)),
			);
			for (const cell of cells) {
				cell.structureModel = structureModel;
			}
			this.cells.set(structureModel, cells);
		}
	}

	private clearStructuresCells(structuresModels: Model[]): void {
		for (const structureModel of structuresModels) {
			const cells = this.cells.get(structureModel);
			if (cells === undefined) continue;
			for (const cell of cells.filter((cell) => cell.structureModel === structureModel)) {
				cell.structureModel = undefined;
			}
			this.cells.delete(structureModel);
		}
	}

	public getCellAtWorldPosition(player: Player, position: Vector3): GridCell | undefined {
		const grid = this.grids.get(player)!;
		const gridData = this.gridsData.get(player)!;
		const x = math.round((position.X + this.cellSize / 2 - gridData.startX) / this.cellSize);
		const z = math.round((position.Z + this.cellSize / 2 - gridData.startZ) / this.cellSize);
		const y = math.floor(position.Y / this.cellSize);
		return x >= 0 && x < grid.size() && z >= 0 && z < grid[0].size() && y >= 0 && y < grid[0][0].size()
			? grid[x][z][y]
			: undefined;
	}

	public getClampedCellAtWorldPosition(player: Player, position: Vector3): GridCell {
		const gridData = this.gridsData.get(player)!;
		return this.grids.get(player)![
			math.clamp(
				math.round((position.X + this.cellSize / 2 - gridData.startX) / this.cellSize),
				0,
				this.width - 1,
			)
		][
			math.clamp(
				math.round((position.Z + this.cellSize / 2 - gridData.startZ) / this.cellSize),
				0,
				this.height - 1,
			)
		][math.clamp(math.floor(position.Y / this.cellSize), 0, this.layers - 1)];
	}

	public getCellVertexPositionAtWorldPosition(player: Player, position: Vector3): Vector3 | undefined {
		const cell = this.getCellAtWorldPosition(player, position);
		if (cell === undefined) return undefined;
		const cellPosition = this.getCellWorldPosition(player, cell);
		return [
			new Vector3(this.cellSize / 2, 0, this.cellSize / 2),
			new Vector3(-this.cellSize / 2, 0, this.cellSize / 2),
			new Vector3(this.cellSize / 2, 0, -this.cellSize / 2),
			new Vector3(-this.cellSize / 2, 0, -this.cellSize / 2),
		]
			.map((cellVertexOffset) => cellPosition.add(cellVertexOffset))
			.sort(
				(cellVertexPositionA, cellVertexPositionB) =>
					position.sub(cellVertexPositionA).Magnitude < position.sub(cellVertexPositionB).Magnitude,
			)[0];
	}

	public getClampedCellVertexPositionAtWorldPosition(player: Player, position: Vector3): Vector3 {
		const cellPosition = this.getCellWorldPosition(player, this.getClampedCellAtWorldPosition(player, position));
		return [
			new Vector3(this.cellSize / 2, 0, this.cellSize / 2),
			new Vector3(-this.cellSize / 2, 0, this.cellSize / 2),
			new Vector3(this.cellSize / 2, 0, -this.cellSize / 2),
			new Vector3(-this.cellSize / 2, 0, -this.cellSize / 2),
		]
			.map((cellVertexOffset) => cellPosition.add(cellVertexOffset))
			.sort(
				(cellVertexPositionA, cellVertexPositionB) =>
					position.sub(cellVertexPositionA).Magnitude < position.sub(cellVertexPositionB).Magnitude,
			)[0];
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
			originPosition.add(snapVectorToCardinal(direction).mul(this.cellSize * steps)),
		);
	}

	public getNeighborsCells(player: Player, origin: Vector3): GridCell[];
	public getNeighborsCells(player: Player, origin: GridCell): GridCell[];
	public getNeighborsCells(player: Player, origin: Vector3 | GridCell): GridCell[] {
		const originPosition = typeIs(origin, "Vector3") ? origin : this.getCellWorldPosition(player, origin);
		return [Vector3.xAxis, Vector3.xAxis.mul(-1), Vector3.zAxis, Vector3.zAxis.mul(-1)].mapFiltered(
			(neighborDirection) => this.getCellInDirection(player, originPosition, neighborDirection),
		);
	}

	public getCellWorldPosition(player: Player, cell: GridCell): Vector3 {
		const gridData = this.gridsData.get(player)!;
		return new Vector3(
			gridData.startX + cell.position.X * this.cellSize - this.cellSize / 2,
			cell.position.Y * this.cellSize,
			gridData.startZ + cell.position.Z * this.cellSize - this.cellSize / 2,
		);
	}
}
