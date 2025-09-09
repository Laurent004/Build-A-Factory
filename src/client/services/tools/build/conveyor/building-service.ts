import { Players, RunService } from "@rbxts/services";
import GridService from "client/services/plot/grid-service";
import { StructureDefinition, STRUCTURES } from "shared/constants/structures";
import { StructureCFrameService } from "../structure/cframe-service";
import { GridCell } from "shared/grid";
import BuildingService from "../building-service";
import ConveyorPreviewService from "./preview-service";
import MouseService from "../../mouse-service";

export default class ConveyorBuildingService implements BuildingService {
	private readonly structureCFrameService: StructureCFrameService;
	private readonly conveyorPreviewService: ConveyorPreviewService;

	private startCell: GridCell | undefined;
	private goalCell: GridCell | undefined;
	private isPlacing: boolean = false;
	private connection: RBXScriptConnection | undefined;

	private readonly rayParams = new RaycastParams();

	constructor(private readonly gridService: GridService, private readonly mouseService: MouseService) {
		this.structureCFrameService = new StructureCFrameService(this.mouseService);
		this.conveyorPreviewService = new ConveyorPreviewService(gridService);
		this.mouseService.onMouseClampedCellChanged.Connect((newClampedCell) => {
			if (!this.isPlacing) return;
			this.updatePathGoalCell(newClampedCell);
		});
		this.rayParams.FilterType = Enum.RaycastFilterType.Exclude;
		this.rayParams.FilterDescendantsInstances = [this.conveyorPreviewService.getConveyorsModelsHolder()];
	}

	public enter(structureDefinition: StructureDefinition) {
		this.conveyorPreviewService.initBuildingPreview(structureDefinition);
		this.startUpdatingBuildingPreview();
		this.mouseService.setRaycastParams(this.rayParams);
	}

	public exit() {
		this.connection?.Disconnect();
		this.connection = undefined;
		this.startCell = undefined;
		this.goalCell = undefined;
		this.isPlacing = false;
		this.conveyorPreviewService.resetBuildingPreview();
		this.conveyorPreviewService.resetPathPreview();
	}

	private startUpdatingBuildingPreview() {
		this.connection = RunService.Heartbeat.Connect((dt: number) => {
			this.updateBuildingPreview(dt);
		});
	}

	private updateBuildingPreview(dt: number) {
		this.structureCFrameService.updateCurrentCFrame(dt);
		this.conveyorPreviewService.updateBuildingPreview(
			this.structureCFrameService.getCurrentCFrame(),
			this.structureCFrameService.getTargetCFrame(),
		);
	}

	public startPlacement() {
		const cell = this.mouseService.getMouseClampedCell();
		if (cell === undefined) return;

		this.startCell = cell;
		this.goalCell = cell;
		this.isPlacing = true;

		this.connection?.Disconnect();
		this.connection = RunService.Heartbeat.Connect(() => {
			this.conveyorPreviewService.updatePathPreview(this.structureCFrameService.getTargetCFrame());
		});
	}

	private updatePathGoalCell(newClampedCell: GridCell) {
		this.goalCell = newClampedCell;
		this.conveyorPreviewService.resetPathPreview();
		this.conveyorPreviewService.initPathPreview(
			this.startCell!,
			this.goalCell,
			this.structureCFrameService.getTargetRotation(),
		);
	}

	public place() {
		if (this.startCell === this.goalCell) {
			this.gridService.place(Players.LocalPlayer, [this.conveyorPreviewService.getSnappedConveyorModel()!]);
		} else {
			this.gridService.place(Players.LocalPlayer, this.conveyorPreviewService.getConveyorsModels());
		}
		this.exit();
		this.enter(STRUCTURES["Straight Conveyor"]);
	}

	public rotate() {
		this.structureCFrameService.updateTargetRotation();
		if (this.isPlacing) {
			this.conveyorPreviewService.resetPathPreview();
			this.conveyorPreviewService.initPathPreview(
				this.startCell!,
				this.goalCell!,
				this.structureCFrameService.getTargetRotation(),
			);
		}
	}
}
