import { GridCell } from "shared/grid";
import GridService from "../plot/grid-service";
import { Players, Workspace } from "@rbxts/services";
import Signal from "@rbxts/signal";
import { Events } from "client/network";

export default class MouseService {
	//#region Singleton
	private static _inst: MouseService;
	public static getInst(): MouseService {
		this._inst = this._inst ?? new MouseService();
		return this._inst;
	}
	//#endregion
	private readonly gridService: GridService = GridService.getInst();
	private readonly player = Players.LocalPlayer;
	private readonly camera: Camera = Workspace.CurrentCamera as Camera;
	private readonly mouse: Mouse = this.player.GetMouse();

	public readonly onMouseCellChanged = new Signal<(newCell: GridCell, newCellPosition: Vector3) => void>();
	public readonly onMouseClampedCellChanged = new Signal<
		(newClampedCell: GridCell, newClampedCellPosition: Vector3) => void
	>();

	private readonly cameraRayRange: number = 200;
	private cameraRayParams: RaycastParams = new RaycastParams();

	private currentCell: GridCell | undefined;
	private currentClampedCell: GridCell | undefined;

	constructor() {
		Events.OnPlotInitialization.connect((_, plot) => {
			this.startUpdating();
		});
	}

	public startUpdating() {
		while (task.wait()) {
			this.update();
		}
	}

	private update() {
		const cell = this.getMouseCell();
		if (cell && this.currentCell !== cell) {
			this.currentCell = cell;
			this.onMouseCellChanged.Fire(cell, this.gridService.getCellWorldPosition(this.player, cell));
		}

		const clampedCell = this.getMouseClampedCell();
		if (clampedCell && this.currentClampedCell !== clampedCell) {
			this.currentClampedCell = cell;
			this.onMouseClampedCellChanged.Fire(
				clampedCell,
				this.gridService.getCellWorldPosition(this.player, clampedCell),
			);
		}
	}

	public getMouseCell(): GridCell | undefined {
		const cameraRay = this.camera.ScreenPointToRay(this.mouse.X, this.mouse.Y);
		const result = Workspace.Raycast(
			cameraRay.Origin,
			cameraRay.Direction.mul(this.cameraRayRange),
			this.cameraRayParams,
		);
		if (!result) return undefined;
		const cell = this.gridService.getCellAtWorldPosition(this.player, result.Position);
		return cell;
	}

	public getMouseCellPosition(): Vector3 | undefined {
		const cell = this.getMouseCell();
		return cell ? this.gridService.getCellWorldPosition(this.player, cell) : undefined;
	}

	public getMouseClampedCell(): GridCell | undefined {
		const cameraRay = this.camera.ScreenPointToRay(this.mouse.X, this.mouse.Y);
		const result = Workspace.Raycast(
			cameraRay.Origin,
			cameraRay.Direction.mul(this.cameraRayRange),
			this.cameraRayParams,
		);
		if (!result) return undefined;
		const clampedCell = this.gridService.getClampedCellAtWorldPosition(this.player, result.Position);
		return clampedCell;
	}

	public getMouseClampedCellPosition(): Vector3 | undefined {
		const clampedCell = this.getMouseClampedCell();
		return clampedCell ? this.gridService.getCellWorldPosition(this.player, clampedCell) : undefined;
	}

	public setRaycastParams(rayParams: RaycastParams) {
		this.cameraRayParams = rayParams;
	}
}
