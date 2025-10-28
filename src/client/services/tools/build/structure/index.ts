import { Players, RunService, Workspace } from "@rbxts/services";
import { BaseStructurePreviewService } from "../../base/visuals/preview-service";
import { BaseStructureCFrameService } from "../../base/visuals/cframe-service";
import BaseStructureBuildingService from "../building-service";
import MouseService from "../../base/mouse-service";
import BaseStructureArrowService from "../../base/visuals/arrow-service";
import BaseStructureHighlightService from "../../base/visuals/highlight-service";
import BaseStructureBeamService from "../../base/visuals/beam-service";
import BaseStructurePlacementService from "../../base/placement-service";

export class StructureBuildingService extends BaseStructureBuildingService {
	private readonly baseStructurePreviewService: BaseStructurePreviewService;
	private readonly baseStructureCFrameService = BaseStructureCFrameService.getInst();

	private connection: RBXScriptConnection | undefined;

	constructor(
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
		this.mouseService.onMouseClampedCellChanged.Connect((_, newMouseClampedCellPosition) => {
			this.baseStructureCFrameService.updateTargetPosition(
				new Vector3(newMouseClampedCellPosition.X, 2.25, newMouseClampedCellPosition.Z),
			);
		});
	}

	public enter(structureModel: Model) {
		const rayParams = new RaycastParams();
		rayParams.FilterType = Enum.RaycastFilterType.Exclude;
		rayParams.AddToFilter([
			Workspace.WaitForChild("Plots")
				.GetChildren()
				.find((plot) => plot.GetAttribute("UserId") === Players.LocalPlayer.UserId)!
				.WaitForChild("Structures"),
			this.baseStructurePreviewService.getStructureModelHolder(),
		]);
		this.mouseService.setRaycastParams(rayParams);
		this.mouseService.startUpdating();
		this.baseStructurePreviewService.initStructurePlacementPreview(structureModel);
		this.startUpdatingStructure();
	}

	public exit() {
		this.stopUpdatingStructure();
		this.baseStructurePreviewService.resetStructurePlacementPreview();
		this.mouseService.stopUpdating();
	}

	private startUpdatingStructure() {
		this.connection = RunService.Heartbeat.Connect((dt: number) => {
			this.baseStructureCFrameService.updateCurrentCFrame(dt);
			this.baseStructurePreviewService.updateStructurePreview(
				this.baseStructureCFrameService.getCurrentCFrame(),
				this.baseStructurePlacementService.canPlace(this.baseStructurePreviewService.getStructureModelHolder()),
			);
		});
	}

	private stopUpdatingStructure() {
		this.connection?.Disconnect();
		this.connection = undefined;
	}

	public onPlacementStart(): void {
		this.baseStructurePlacementService.place(this.baseStructurePreviewService.getStructureModelHolder());
	}

	public onRotate() {
		this.baseStructureCFrameService.updateTargetRotation();
	}
}
