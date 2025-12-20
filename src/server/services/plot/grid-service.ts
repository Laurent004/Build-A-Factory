import { STRUCTURES, StructureData } from "shared/constants/structures";
import { snapVectorToCardinal } from "shared/utils/math";
import { Service } from "@flamework/core";
import { GridCell } from "shared/types";

@Service({})
export default class GridService {
	private readonly grids = new Map<Player, GridCell[][][]>();
	private readonly gridsData = new Map<Player, { startX: number; startZ: number }>();
	private readonly cells = new Map<Model, GridCell[]>();
	private readonly width: number = 50;
	private readonly height: number = 50;
	private readonly layers: number = 5;
	private readonly cellSize: number = 4;

	public initGrid(player: Player, plot: Model): void {
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

	public initStructuresCells(player: Player, structuresModels: Model[]): void {
		for (const structureModel of structuresModels) {
			const cells = STRUCTURES[structureModel.Name].nodes.cells.mapFiltered((cellNodeLocalPosition) => {
				return this.getCellAtWorldPosition(
					player,
					structureModel.GetPivot().PointToWorldSpace(cellNodeLocalPosition),
				);
			});
			for (const cell of cells) {
				cell.structureModel = structureModel;
			}
			this.cells.set(structureModel, cells);
		}
	}

	public clearStructuresCells(structuresModels: Model[]): void {
		for (const structureModel of structuresModels) {
			const cells = this.cells.get(structureModel)!;
			for (const cell of cells.filter((cell) => cell.structureModel === structureModel)) {
				cell.structureModel = undefined;
			}
			this.cells.delete(structureModel);
		}
	}

	public canPlace(player: Player, structuresData: StructureData[]): boolean {
		return structuresData.every((structureData) => {
			const queue: StructureData[] = [structureData];
			while (queue.size() > 0) {
				const structureData = queue.shift()!;
				if (
					STRUCTURES[structureData.name].nodes.cells.some((cellNodeLocalPosition) => {
						const cell = this.getCellAtWorldPosition(
							player,
							new CFrame(...structureData.cf).PointToWorldSpace(cellNodeLocalPosition),
						);
						return cell === undefined || cell.structureModel !== undefined;
					})
				)
					return false;
				for (const childStructureData of structureData.children as StructureData[]) {
					queue.push(childStructureData);
				}
			}
			return true;
		});
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
		const originPosition = typeIs(origin, "Vector3") ? origin : this.getCellWorldPosition(player, origin);
		return this.getCellAtWorldPosition(
			player,
			originPosition.add(snapVectorToCardinal(direction).mul(this.cellSize * steps)),
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
