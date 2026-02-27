import { Players, RunService, Workspace } from "@rbxts/services";
import Signal from "@rbxts/signal";
import { STRUCTURES } from "shared/constants/structures";
import { GridCell, GridService } from "shared/services/plot";

export default class MouseService {
	private readonly player = Players.LocalPlayer;
	private readonly camera = Workspace.CurrentCamera as Camera;
	private readonly mouse = this.player.GetMouse();
	private readonly rayRange: number = 1500;

	public readonly onStructureModelChanged = new Signal<(newStructureModel: Model | undefined) => void>();
	public readonly onCellChanged = new Signal<(newCell: GridCell) => void>();
	public readonly onClampedCellChanged = new Signal<(newClampedCell: GridCell) => void>();
	public readonly onCellVertexPositionChanged = new Signal<(newCellVertexPosition: Vector3) => void>();
	public readonly onClampedCellVertexPositionChanged = new Signal<(newClampedCellVertexPosition: Vector3) => void>();

	private rayParams: RaycastParams | undefined;
	private structureModel: Model | undefined;
	private cell: GridCell | undefined;
	private clampedCell: GridCell | undefined;
	private cellVertexPosition: Vector3 | undefined;
	private clampedCellVertexPosition: Vector3 | undefined;
	private connection: RBXScriptConnection | undefined;

	constructor(private readonly gridService: GridService) {}

	public startUpdating(): void {
		this.connection = RunService.Heartbeat.Connect(() => {
			this.update();
		});
	}

	private update(): void {
		const structureModel = this.getStructureModel();
		if (structureModel === undefined || this.structureModel !== structureModel) {
			this.structureModel = structureModel;
			this.onStructureModelChanged.Fire(structureModel);
		}

		const cell = this.getCell();
		if (cell !== undefined && this.cell !== cell) {
			this.cell = cell;
			this.onCellChanged.Fire(cell);
		}

		const clampedCell = this.getClampedCell();
		if (clampedCell !== undefined && this.clampedCell !== clampedCell) {
			this.clampedCell = cell;
			this.onClampedCellChanged.Fire(clampedCell);
		}

		const cellVertexPosition = this.getCellVertexPosition();
		if (cellVertexPosition !== undefined && this.cellVertexPosition !== cellVertexPosition) {
			this.cellVertexPosition = cellVertexPosition;
			this.onCellVertexPositionChanged.Fire(cellVertexPosition);
		}

		const clampedCellVertexPosition = this.getClampedCellVertexPosition();
		if (clampedCellVertexPosition !== undefined && this.clampedCellVertexPosition !== clampedCellVertexPosition) {
			this.clampedCellVertexPosition = clampedCellVertexPosition;
			this.onClampedCellVertexPositionChanged.Fire(clampedCellVertexPosition);
		}
	}

	public stopUpdating(): void {
		this.connection?.Disconnect();
	}

	public getMouse(): Mouse {
		return this.mouse;
	}

	public getRayResult(): RaycastResult | undefined {
		const cameraRay = this.camera.ScreenPointToRay(this.mouse.X, this.mouse.Y);
		return Workspace.Raycast(cameraRay.Origin, cameraRay.Direction.mul(this.rayRange), this.rayParams);
	}

	public getStructureModel(): Model | undefined {
		const result = this.getRayResult();
		if (result === undefined) return undefined;
		for (const filterDescendantInstance of this.rayParams!.FilterDescendantsInstances) {
			if (filterDescendantInstance.IsA("Folder") && filterDescendantInstance.Name === "Structures") {
				const structureModel = filterDescendantInstance
					.GetChildren()
					.find(
						(instance): instance is Model =>
							instance.IsA("Model") &&
							instance.Name in STRUCTURES &&
							instance.IsAncestorOf(result.Instance),
					);
				if (structureModel !== undefined) return structureModel;
			} else if (filterDescendantInstance.IsA("Model") && filterDescendantInstance.Name in STRUCTURES) {
				if (filterDescendantInstance.IsAncestorOf(result.Instance)) return filterDescendantInstance;
			}
		}
		return undefined;
	}

	public getCell(): GridCell | undefined {
		const result = this.getRayResult();
		return result !== undefined
			? this.gridService.getCellAtWorldPosition(this.player, result.Position.add(result.Normal))
			: undefined;
	}

	public getClampedCell(): GridCell | undefined {
		const result = this.getRayResult();
		return result !== undefined
			? this.gridService.getClampedCellAtWorldPosition(this.player, result.Position.add(result.Normal))
			: undefined;
	}

	public getCellVertexPosition(): Vector3 | undefined {
		const result = this.getRayResult();
		return result !== undefined
			? this.gridService.getCellVertexPositionAtWorldPosition(this.player, result.Position)
			: undefined;
	}

	public getClampedCellVertexPosition(): Vector3 | undefined {
		const result = this.getRayResult();
		return result !== undefined
			? this.gridService.getClampedCellVertexPositionAtWorldPosition(this.player, result.Position)
			: undefined;
	}

	public setRaycastParams(rayParams: RaycastParams): void {
		this.rayParams = rayParams;
	}
}
