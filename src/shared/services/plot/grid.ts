import { getStructureModel, StructureData, STRUCTURES } from "shared/constants/structures";

export interface GridCell {
	readonly position: Vector3;
	readonly worldPosition: Vector3;
	isUnlocked: boolean;
	structureModel: Model | undefined;
}

export class GridService {
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
	private readonly width: number = 60;
	private readonly height: number = 60;
	private readonly layers: number = 4;
	private readonly cellSize: number = 4;
	private readonly expansionSize: number = 15;

	private constructor(){}

	public initGrid(player: Player, plot: Model): void {
		const grid: GridCell[][][] = [];
		const gridData = {
			startX: plot.GetPivot().Position.X - (this.width / 2) * this.cellSize + this.cellSize,
			startZ: plot.GetPivot().Position.Z - (this.height / 2) * this.cellSize + this.cellSize,
		};
		for (let x = 0; x < this.width; x++) {
			grid[x] = [];
			for (let z = 0; z < this.height; z++) {
				grid[x][z] = [];
				for (let y = 0; y < this.layers; y++) {
					grid[x][z][y] = {
						position: new Vector3(x, y, z),
						worldPosition: new Vector3(
							gridData.startX + x * this.cellSize - this.cellSize / 2,
							y * this.cellSize,
							gridData.startZ + z * this.cellSize - this.cellSize / 2,
						),
						isUnlocked: false,
						structureModel: undefined,
					};
				}
			}
		}
		this.grids.set(player, grid);
		this.gridsData.set(player, gridData);
	}

	public updateGrid(player: Player, expansion: Part): void {
		for (
			let x = expansion.Position.X - (this.expansionSize * this.cellSize) / 2 + this.cellSize / 2;
			x <= expansion.Position.X + (this.expansionSize * this.cellSize) / 2 - this.cellSize / 2;
			x += this.cellSize
		) {
			for (
				let z = expansion.Position.Z - (this.expansionSize * this.cellSize) / 2 + this.cellSize / 2;
				z <= expansion.Position.Z + (this.expansionSize * this.cellSize) / 2 - this.cellSize / 2;
				z += this.cellSize
			) {
				for (let y = 0; y < this.layers; y++) {
					this.getCellAtWorldPosition(player, new Vector3(x, y * this.cellSize, z))!.isUnlocked = true;
				}
			}
		}
	}

	public resetGrid(player:Player):void{
		const grid=this.grids.get(player)!;
		for (let x = 0; x < this.width; x++) {
			for (let z = 0; z < this.height; z++) {
				for (let y = 0; y < this.layers; y++) {
					const cell=grid[x][z][y];
					cell.isUnlocked=false
					cell.structureModel=undefined
				}
			}
		}
	}

	public initStructuresCells(player: Player, structuresModels: Model[]): void {
		for (const structureModel of structuresModels) {
			const cells = STRUCTURES[structureModel.Name].nodes.cells.mapFiltered((cellNodeLocalPosition) =>
				this.getCellAtWorldPosition(
					player,
					structureModel
						.GetPivot()
						.mul(
							getStructureModel(
								structureModel.Name,
								structureModel.GetAttribute("IsMirrored") as boolean | undefined,
							)!.PrimaryPart!.PivotOffset.Inverse(),
						)
						.PointToWorldSpace(cellNodeLocalPosition),
				),
			);
			for (const cell of cells) {
				cell.structureModel = structureModel;
			}
			this.cells.set(structureModel, cells);
		}
	}

	public clearStructuresCells(structuresModels: Model[]): void {
		for (const structureModel of structuresModels) {
			const cells = this.cells.get(structureModel);
			if (cells === undefined) continue;
			for (const cell of cells.filter((cell) => cell.structureModel === structureModel)) {
				cell.structureModel = undefined;
			}
			this.cells.delete(structureModel);
		}
	}

	public canPlace(player: Player, structuresData: StructureData[]): boolean {
		return structuresData.every((structureData) =>
			STRUCTURES[structureData.name].nodes.cells.every((cellNodeLocalPosition) => {
				const cell = this.getCellAtWorldPosition(
					player,
					new CFrame(...structureData.cf)
						.mul(
							getStructureModel(
								structureData.name,
								structureData.attributes.get("IsMirrored") as boolean | undefined,
							)!.PrimaryPart!.PivotOffset.Inverse(),
						)
						.PointToWorldSpace(cellNodeLocalPosition),
				);
				return cell !== undefined && cell.isUnlocked && cell.structureModel === undefined;
			}),
		);
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
		return [
			new Vector3(this.cellSize / 2, 0, this.cellSize / 2),
			new Vector3(-this.cellSize / 2, 0, this.cellSize / 2),
			new Vector3(this.cellSize / 2, 0, -this.cellSize / 2),
			new Vector3(-this.cellSize / 2, 0, -this.cellSize / 2),
		]
			.map((cellVertexOffset) => cell.worldPosition.add(cellVertexOffset))
			.sort(
				(cellVertexPositionA, cellVertexPositionB) =>
					position.sub(cellVertexPositionA).Magnitude < position.sub(cellVertexPositionB).Magnitude,
			)[0];
	}

	public getClampedCellVertexPositionAtWorldPosition(player: Player, position: Vector3): Vector3 {
		const clampedCell = this.getClampedCellAtWorldPosition(player, position);
		return [
			new Vector3(this.cellSize / 2, 0, this.cellSize / 2),
			new Vector3(-this.cellSize / 2, 0, this.cellSize / 2),
			new Vector3(this.cellSize / 2, 0, -this.cellSize / 2),
			new Vector3(-this.cellSize / 2, 0, -this.cellSize / 2),
		]
			.map((cellVertexOffset) => clampedCell.worldPosition.add(cellVertexOffset))
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
		return this.getCellAtWorldPosition(
			player,
			(typeIs(origin, "Vector3") ? origin : origin.worldPosition).add(direction.Unit.mul(steps * this.cellSize)),
		);
	}

	public getNeighborsCells(player: Player, origin: Vector3): GridCell[];
	public getNeighborsCells(player: Player, origin: GridCell): GridCell[];
	public getNeighborsCells(player: Player, origin: Vector3 | GridCell): GridCell[] {
		return [Vector3.xAxis, Vector3.xAxis.mul(-1), Vector3.zAxis, Vector3.zAxis.mul(-1)].mapFiltered(
			(neighborDirection) =>
				this.getCellInDirection(
					player,
					typeIs(origin, "Vector3") ? origin : origin.worldPosition,
					neighborDirection,
				),
		);
	}
}
