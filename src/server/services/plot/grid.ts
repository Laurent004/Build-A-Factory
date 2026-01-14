import { STRUCTURES, StructureData } from "shared/constants/structures";
import { Service } from "@flamework/core";
import { GridCell } from "shared/types";

@Service({})
export default class GridService {
	private readonly grids = new Map<Player, GridCell[][][]>();
	private readonly gridsData = new Map<Player, { startX: number; startZ: number }>();
	private readonly structuresCells = new Map<Model, GridCell[]>();
	private readonly width: number = 60;
	private readonly height: number = 60;
	private readonly layers: number = 4;
	private readonly cellSize: number = 4;
	private readonly expansionSize: number = 15;

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
						unlocked: false,
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
					this.getCellAtWorldPosition(player, new Vector3(x, y * this.cellSize, z))!.unlocked = true;
				}
			}
		}
	}

	public initStructuresCells(player: Player, structuresModels: Model[]): void {
		for (const structureModel of structuresModels) {
			const cells = STRUCTURES[structureModel.Name].nodes.cells.mapFiltered((cellNodeLocalPosition) =>
				this.getCellAtWorldPosition(player, structureModel.GetPivot().PointToWorldSpace(cellNodeLocalPosition)),
			);
			for (const cell of cells) {
				cell.structureModel = structureModel;
			}
			this.structuresCells.set(structureModel, cells);
		}
	}

	public clearStructuresCells(structuresModels: Model[]): void {
		for (const structureModel of structuresModels) {
			const cells = this.structuresCells.get(structureModel)!;
			for (const cell of cells.filter((cell) => cell.structureModel === structureModel)) {
				cell.structureModel = undefined;
			}
			this.structuresCells.delete(structureModel);
		}
	}

	public canPlace(player: Player, structuresData: StructureData[]): boolean {
		return structuresData.every((structureData) =>
			STRUCTURES[structureData.name].nodes.cells.every((cellNodeLocalPosition) => {
				const cell = this.getCellAtWorldPosition(
					player,
					new CFrame(...structureData.cf).PointToWorldSpace(cellNodeLocalPosition),
				);
				return cell !== undefined && cell.unlocked && cell.structureModel === undefined;
			}),
		);
	}

	public getCellAtWorldPosition(player: Player, position: Vector3): GridCell | undefined {
		const gridData = this.gridsData.get(player)!;
		const x = math.round((position.X + this.cellSize / 2 - gridData.startX) / this.cellSize);
		const z = math.round((position.Z + this.cellSize / 2 - gridData.startZ) / this.cellSize);
		const y = math.floor(position.Y / this.cellSize);
		return x >= 0 && x < this.width && z >= 0 && z < this.height && y >= 0 && y < this.layers
			? this.grids.get(player)![x][z][y]
			: undefined;
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
	public getCellInDirection(player: Player, position: Vector3 | GridCell, direction: Vector3, steps: number = 1) {
		return this.getCellAtWorldPosition(
			player,
			(typeIs(position, "Vector3") ? position : position.worldPosition).add(
				direction.Unit.mul(steps * this.cellSize),
			),
		);
	}
}
