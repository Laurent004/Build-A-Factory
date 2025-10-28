import { Players, RunService, Workspace } from "@rbxts/services";
import GridService from "client/services/plot/grid-service";
import { BaseStructureCFrameService } from "../../base/visuals/cframe-service";
import { GridCell } from "shared/grid";
import BaseStructureBuildingService from "../building-service";
import MouseService from "../../base/mouse-service";
import { ConveyorPreviewService } from "./preview-service";
import { BaseStructurePreviewService } from "../../base/visuals/preview-service";
import { STRUCTURES } from "shared/constants/structures";
import BaseStructureHighlightService from "../../base/visuals/highlight-service";
import BaseStructureArrowService from "../../base/visuals/arrow-service";
import BaseStructureBeamService from "../../base/visuals/beam-service";
import BaseStructurePlacementService from "../../base/placement-service";

export default class ConveyorBuildingService extends BaseStructureBuildingService {
	private readonly baseStructureCFrameService = BaseStructureCFrameService.getInst();
	private readonly baseStructurePreviewService: BaseStructurePreviewService;
	private readonly conveyorPreviewService: ConveyorPreviewService;

	private startCell: GridCell | undefined;
	private goalCell: GridCell | undefined;
	private connection: RBXScriptConnection | undefined;

	constructor(
		private readonly gridService: GridService,
		private readonly mouseService: MouseService,
		private readonly baseStructurePlacementService: BaseStructurePlacementService,
		baseStructureHighlightService: BaseStructureHighlightService,
		baseStructureArrowService: BaseStructureArrowService,
		baseStructureBeamService: BaseStructureBeamService,
	) {
		super();
		BaseStructurePreviewService.init(
			baseStructureHighlightService,
			baseStructureArrowService,
			baseStructureBeamService,
		);
		this.baseStructurePreviewService = BaseStructurePreviewService.getInst();
		this.conveyorPreviewService = new ConveyorPreviewService(
			gridService,
			baseStructureHighlightService,
			baseStructureArrowService,
		);

		this.mouseService.onMouseClampedCellChanged.Connect((newMouseClampedCell, newMouseClampedCellPosition) => {
			this.baseStructureCFrameService.updateTargetPosition(
				new Vector3(newMouseClampedCellPosition.X, 2.25, newMouseClampedCellPosition.Z),
			);
			if (this.startCell !== undefined && this.goalCell !== newMouseClampedCell) {
				this.baseStructurePreviewService.resetStructurePlacementPreview();
				this.goalCell = newMouseClampedCell;
				this.rebuildConveyorPath();
			}
		});
	}

	public enter() {
		const rayParams = new RaycastParams();
		rayParams.FilterType = Enum.RaycastFilterType.Exclude;
		rayParams.AddToFilter([
			Workspace.WaitForChild("Plots")
				.GetChildren()
				.find((plot) => plot.GetAttribute("UserId") === Players.LocalPlayer.UserId)!
				.WaitForChild("Structures"),
			this.baseStructurePreviewService.getStructureModelHolder(),
			this.conveyorPreviewService.getConveyorModelHolder(),
		]);
		this.mouseService.setRaycastParams(rayParams);
		this.mouseService.startUpdating();
		this.baseStructurePreviewService.initStructurePlacementPreview(STRUCTURES["Straight Conveyor"].model);
		this.startUpdatingConveyor();
	}

	public exit() {
		this.stopUpdating();
		this.baseStructurePreviewService.resetStructurePlacementPreview();
		this.conveyorPreviewService.resetConveyorPathPreview();
		this.mouseService.stopUpdating();

		this.startCell = undefined;
		this.goalCell = undefined;
	}

	private startUpdatingConveyor() {
		this.connection = RunService.Heartbeat.Connect((dt: number) => {
			this.baseStructureCFrameService.updateCurrentCFrame(dt);
			this.baseStructurePreviewService.updateStructurePreview(
				this.baseStructureCFrameService.getCurrentCFrame(),
				this.baseStructurePlacementService.canPlace(this.baseStructurePreviewService.getStructureModelHolder()),
			);
		});
	}

	private startUpdatingConveyorPath() {
		this.connection = RunService.Heartbeat.Connect(() => {
			this.conveyorPreviewService.updateConveyorPathPreview(
				this.baseStructurePlacementService.canPlace(this.conveyorPreviewService.getConveyorModelHolder()),
			);
		});
	}

	private stopUpdating() {
		this.connection?.Disconnect();
		this.connection = undefined;
	}

	private rebuildConveyorPath() {
		this.conveyorPreviewService.resetConveyorPathPreview();

		const targetRotation = math.round(
			math.deg(this.baseStructureCFrameService.getTargetCFrame().ToOrientation()[1]),
		);
		this.conveyorPreviewService.initConveyorPathPreview(
			this.gridService.getManhattanPath(Players.LocalPlayer, this.startCell!, this.goalCell!, targetRotation),
			targetRotation,
		);
	}

	public onPlacementStart() {
		const mouseClampedCell = this.mouseService.getMouseClampedCell();
		if (mouseClampedCell === undefined) return;
		this.startCell = mouseClampedCell;
		this.stopUpdating();
		this.startUpdatingConveyorPath();
	}

	public onPlacementEnd() {
		this.baseStructurePlacementService.place(
			this.goalCell === undefined
				? this.baseStructurePreviewService.getStructureModelHolder()
				: this.conveyorPreviewService.getConveyorModelHolder(),
		);

		this.exit();
		this.enter();
	}

	public onRotate() {
		this.baseStructureCFrameService.updateTargetRotation();
		if (this.startCell !== undefined) {
			this.rebuildConveyorPath();
		}
	}
}
