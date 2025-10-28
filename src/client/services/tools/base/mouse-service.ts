import { GridCell } from "shared/grid";
import GridService from "../../plot/grid-service";
import { Players, RunService, Workspace } from "@rbxts/services";
import Signal from "@rbxts/signal";
import { STRUCTURES } from "shared/constants/structures";

export default class MouseService {
	private readonly player = Players.LocalPlayer;
	private readonly camera = Workspace.CurrentCamera as Camera;
	private readonly mouse = this.player.GetMouse();

	private readonly rayRange: number = 1500;
	private rayParams: RaycastParams | undefined;

	public readonly onMouseStructureModelChanged = new Signal<(newMouseStructureModel: Model | undefined) => void>();
	public readonly onMouseCellChanged = new Signal<(newMouseCell: GridCell, newMouseCellPosition: Vector3) => void>();
	public readonly onMouseClampedCellChanged = new Signal<
		(newMouseClampedCell: GridCell, newMouseClampedCellPosition: Vector3) => void
	>();
	public readonly onMouseCellVertexPositionChanged = new Signal<(newMouseCellVertexPosition: Vector3) => void>();
	public readonly onMouseClampedCellVertexPositionChanged = new Signal<
		(newMouseClampedCellVertexPosition: Vector3) => void
	>();

	private currentStructureModel: Model | undefined;
	private currentCell: GridCell | undefined;
	private currentClampedCell: GridCell | undefined;
	private currentCellVertexPosition: Vector3 | undefined;
	private currentClampedCellVertexPosition: Vector3 | undefined;

	private connection: RBXScriptConnection | undefined;

	constructor(private readonly gridService: GridService) {}

	public startUpdating() {
		this.connection = RunService.Heartbeat.Connect(() => {
			this.update();
		});
	}

	private update() {
		const structureModel = this.getMouseStructureModel();
		if (structureModel === undefined || this.currentStructureModel !== structureModel) {
			this.currentStructureModel = structureModel;
			this.onMouseStructureModelChanged.Fire(structureModel);
		}

		const cell = this.getMouseCell();
		if (cell !== undefined && this.currentCell !== cell) {
			this.currentCell = cell;
			this.onMouseCellChanged.Fire(cell, this.gridService.getCellWorldPosition(this.player, cell));
		}

		const clampedCell = this.getMouseClampedCell();
		if (clampedCell !== undefined && this.currentClampedCell !== clampedCell) {
			this.currentClampedCell = cell;
			this.onMouseClampedCellChanged.Fire(
				clampedCell,
				this.gridService.getCellWorldPosition(this.player, clampedCell),
			);
		}

		const cellVertexPosition = this.getMouseCellVertexPosition();
		if (cellVertexPosition !== undefined && this.currentCellVertexPosition !== cellVertexPosition) {
			this.currentCellVertexPosition = cellVertexPosition;
			this.onMouseCellVertexPositionChanged.Fire(cellVertexPosition);
		}

		const clampedCellVertexPosition = this.getMouseClampedCellVertexPosition();
		if (
			clampedCellVertexPosition !== undefined &&
			this.currentClampedCellVertexPosition !== clampedCellVertexPosition
		) {
			this.currentClampedCellVertexPosition = clampedCellVertexPosition;
			this.onMouseClampedCellVertexPositionChanged.Fire(clampedCellVertexPosition);
		}
	}

	public stopUpdating() {
		this.connection?.Disconnect();
	}

	public getMouseRayResult() {
		const cameraRay = this.camera.ScreenPointToRay(this.mouse.X, this.mouse.Y);
		return Workspace.Raycast(cameraRay.Origin, cameraRay.Direction.mul(this.rayRange), this.rayParams);
	}

	public getMouseStructureModel() {
		const result = this.getMouseRayResult();
		if (result === undefined) return undefined;
		return this.rayParams!.FilterDescendantsInstances.find(
			(filterDescendantInstance) =>
				filterDescendantInstance
					.GetChildren()
					.find(
						(instance): instance is Model =>
							instance.IsA("Model") &&
							instance.Name in STRUCTURES &&
							instance.IsAncestorOf(result.Instance),
					) !== undefined,
		)
			?.GetChildren()
			.find(
				(instance): instance is Model =>
					instance.IsA("Model") && instance.Name in STRUCTURES && instance.IsAncestorOf(result.Instance),
			);
	}

	public getMouseCell() {
		const result = this.getMouseRayResult();
		return result !== undefined ? this.gridService.getCellAtWorldPosition(this.player, result.Position) : undefined;
	}

	public getMouseClampedCell() {
		const result = this.getMouseRayResult();
		return result !== undefined
			? this.gridService.getClampedCellAtWorldPosition(this.player, result.Position)
			: undefined;
	}

	public getMouseCellVertexPosition() {
		const result = this.getMouseRayResult();
		return result !== undefined
			? this.gridService.getCellVertexPositionAtWorldPosition(this.player, result.Position)
			: undefined;
	}

	public getMouseClampedCellVertexPosition() {
		const result = this.getMouseRayResult();
		return result !== undefined
			? this.gridService.getClampedCellVertexPositionAtWorldPosition(this.player, result.Position)
			: undefined;
	}

	public setRaycastParams(rayParams: RaycastParams) {
		this.rayParams = rayParams;
	}
}
