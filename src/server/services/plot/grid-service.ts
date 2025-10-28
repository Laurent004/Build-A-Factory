import { GridCell, GridData } from "shared/grid";
import { STRUCTURES, StructuresPlacementData } from "shared/constants/structures";
import { snapVectorToCardinal } from "shared/utils/math";
import { Service } from "@flamework/core";
import { Object } from "@rbxts/luau-polyfill";

@Service({})
export default class GridService {
	private readonly grids = new Map<Player, GridCell[][]>();
	private readonly gridsData = new Map<Player, GridData>();
	private readonly structuresCells = new Map<Model, GridCell[]>();

	private readonly width: number = 50;
	private readonly height: number = 50;
	private readonly cellSize: number = 4;

	public initGrid(player: Player, plotPosition: Vector3): void {
		const grid: GridCell[][] = [];
		for (let x = 0; x < this.width; x++) {
			grid[x] = [];
			for (let z = 0; z < this.height; z++) {
				grid[x][z] = {
					position: new Vector3int16(x, 0, z),
					structureModel: undefined,
				};
			}
		}

		const gridData: GridData = {
			width: this.width,
			height: this.height,
			cellSize: this.cellSize,
			startX: plotPosition.X - (this.width / 2) * this.cellSize + this.cellSize,
			startZ: plotPosition.Z - (this.height / 2) * this.cellSize + this.cellSize,
		};

		this.grids.set(player, grid);
		this.gridsData.set(player, gridData);
	}

	public initStructuresCells(player: Player, structuresModels: Model[]): void {
		for (const structureModel of structuresModels) {
			const cells: GridCell[] = this.getStructureCells(player, structureModel);
			for (const cell of cells) {
				cell.structureModel = structureModel;
			}
			this.structuresCells.set(structureModel, cells);
		}
	}

	public clearStructuresCells(structuresModels: Model[]): void {
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
		return STRUCTURES[structureModel.Name].nodes.cells.mapFiltered((cellNodeLocalPosition) => {
			return this.getCellAtWorldPosition(
				player,
				structureModel.GetPivot().PointToWorldSpace(cellNodeLocalPosition),
			);
		});
	}

	public canPlace(player: Player, structuresPlacementData: StructuresPlacementData[]): boolean {
		return structuresPlacementData.every((structurePlacementData) => {
			return Object.entries(structurePlacementData.targetCFs).every(([structureName, targetCF]) => {
				return STRUCTURES[structureName].nodes.cells.every((cellNodeLocalPosition) => {
					const cell = this.getCellAtWorldPosition(player, targetCF.PointToWorldSpace(cellNodeLocalPosition));
					return cell !== undefined && cell.structureModel === undefined;
				});
			});
		});
	}

	//#region Helpers
	public getGridData(player: Player) {
		return this.gridsData.get(player);
	}

	public getCellAtWorldPosition(player: Player, position: Vector3): GridCell | undefined {
		const grid = this.grids.get(player)!;
		const gridData = this.gridsData.get(player)!;
		const x = math.round((position.X + gridData.cellSize / 2 - gridData.startX) / gridData.cellSize);
		const z = math.round((position.Z + gridData.cellSize / 2 - gridData.startZ) / gridData.cellSize);
		if (x >= 0 && x < grid.size() && z >= 0 && z < grid[0].size()) {
			return grid[x][z];
		}
		return undefined;
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
	public getCellInDirection(player: Player, origin: Vector3 | GridCell, direction: Vector3, steps: number = 1) {
		const originPosition = typeIs(origin, "Vector3") ? origin : this.getCellWorldPosition(player, origin);
		return this.getCellAtWorldPosition(
			player,
			originPosition.add(snapVectorToCardinal(direction).mul(this.gridsData.get(player)!.cellSize * steps)),
		);
	}
	//#endregion
}
