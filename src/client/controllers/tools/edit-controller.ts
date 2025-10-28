import { Controller, OnInit } from "@flamework/core";
import { Context } from "client/constants/navigation";
import ToolController from "./tool-controller";
import GridService from "client/services/plot/grid-service";
import { BaseStructurePreviewService } from "client/services/tools/base/visuals/preview-service";
import { BaseStructureCFrameService } from "client/services/tools/base/visuals/cframe-service";
import { Players, RunService, Workspace } from "@rbxts/services";
import MouseService from "client/services/tools/base/mouse-service";
import BaseStructureSelectionService from "client/services/tools/base/selection-service";
import { Events } from "client/network";
import { StandardActionBuilder } from "@rbxts/mechanism";
import { STRUCTURES } from "shared/constants/structures";
import BaseStructureArrowService from "client/services/tools/base/visuals/arrow-service";
import BaseStructureHighlightService from "client/services/tools/base/visuals/highlight-service";
import BaseStructureBeamService from "client/services/tools/base/visuals/beam-service";
import BaseStructurePlacementService from "client/services/tools/base/placement-service";
import TutorialService from "client/services/progression/tutorial-service";

@Controller({})
export default class EditController extends ToolController implements OnInit {
	protected readonly context: Context = "Edit";
	protected readonly inputActions = [
		{
			action: new StandardActionBuilder("MouseButton1"),
			activated: () => {
				if (this.isMoving) {
					this.moveTo();
				} else {
					this.baseStructureSelectionService.startSelection();
				}
			},
			deactivated: () => {
				if (this.isMoving || this.hasRecentlyMoved) return;
				this.baseStructureSelectionService.select();
			},
		},

		{
			action: new StandardActionBuilder("R"),
			activated: () => {
				this.baseStructureCFrameService.updateTargetRotation();
			},
		},
	];

	private readonly gridService: GridService = GridService.getInst();
	private readonly mouseService: MouseService = new MouseService(this.gridService);
	private readonly tutorialService = TutorialService.getInst();

	private readonly baseStructureSelectionService: BaseStructureSelectionService;
	private readonly baseStructurePreviewService: BaseStructurePreviewService;
	private readonly baseStructurePlacementService: BaseStructurePlacementService;
	private readonly baseStructureHighlightService: BaseStructureHighlightService =
		BaseStructureHighlightService.getInst();
	private readonly baseStructureArrowService = BaseStructureArrowService.getInst();
	private readonly baseStructureBeamService = BaseStructureBeamService.getInst();
	private readonly baseStructureCFrameService = BaseStructureCFrameService.getInst();

	private isMoving: boolean = false;
	private hasRecentlyMoved: boolean = false;
	private connection: RBXScriptConnection | undefined;

	constructor() {
		super();
		BaseStructurePlacementService.init(this.gridService, this.tutorialService);
		this.baseStructurePlacementService = BaseStructurePlacementService.getInst();

		this.baseStructureSelectionService = new BaseStructureSelectionService(
			this.mouseService,
			this.baseStructureArrowService,
			this.baseStructureBeamService,
			Color3.fromRGB(35, 126, 212),
			Color3.fromRGB(70, 141, 255),
		);

		BaseStructurePreviewService.init(
			this.baseStructureHighlightService,
			this.baseStructureArrowService,
			this.baseStructureBeamService,
		);
		this.baseStructurePreviewService = BaseStructurePreviewService.getInst();
	}

	public override onInit(): void | Promise<void> {
		super.onInit();
		this.baseStructureSelectionService.onSelection.Connect((selection) => {
			if (selection === undefined) return;
			Events.StartStructuresMovement.fire(
				selection
					.GetDescendants()
					.filter((instance): instance is Model => instance.IsA("Model") && instance.Name in STRUCTURES),
			);
			this.move(selection);
		});

		this.mouseService.onMouseClampedCellChanged.Connect((_, newMouseClampedCellPosition) => {
			this.baseStructureCFrameService.updateTargetPosition(
				new Vector3(newMouseClampedCellPosition.X, 2.25, newMouseClampedCellPosition.Z),
			);
		});
	}

	protected override enter(): void {
		super.enter();
		const rayParams = new RaycastParams();
		rayParams.FilterType = Enum.RaycastFilterType.Include;
		rayParams.AddToFilter(
			Workspace.WaitForChild("Plots")
				.GetChildren()
				.find((plot) => plot.GetAttribute("UserId") === Players.LocalPlayer.UserId)!
				.WaitForChild("Structures"),
		);
		this.mouseService.setRaycastParams(rayParams);
		this.mouseService.startUpdating();
		this.baseStructureSelectionService.startUpdating();
	}

	protected override exit(): void {
		super.exit();
		this.stopUpdating();

		if (this.isMoving) {
			this.isMoving = false;
			this.baseStructurePreviewService.updateStructurePreview(
				this.baseStructureCFrameService.getSavedCFrame()!,
				this.baseStructurePlacementService.canMove(this.baseStructurePreviewService.getStructureModelHolder()),
			);
			Events.CancelStructuresMovement.fire(
				this.baseStructurePreviewService
					.getStructureModelHolder()
					.GetDescendants()
					.filter((instance): instance is Model => instance.IsA("Model") && instance.Name in STRUCTURES),
			);
		}

		this.baseStructurePreviewService.resetStructureEditPreview();
		this.baseStructureSelectionService.stopUpdating();
		this.baseStructureSelectionService.stopSelection();
		this.mouseService.stopUpdating();
	}

	private move(selection: Model): void {
		this.isMoving = true;
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

		this.baseStructureSelectionService.stopUpdating();
		this.baseStructurePreviewService.initStructureEditPreview(selection);
		this.baseStructureCFrameService.saveCFrame(
			this.baseStructurePreviewService.getStructureModelHolder().GetPivot(),
		);
		this.startUpdating();
	}

	private moveTo(): void {
		if (!this.baseStructurePlacementService.canMove(this.baseStructurePreviewService.getStructureModelHolder()))
			return;
		this.baseStructurePlacementService.move(this.baseStructurePreviewService.getStructureModelHolder());

		this.isMoving = false;
		this.hasRecentlyMoved = true;
		task.delay(0.125, () => {
			this.hasRecentlyMoved = false;
		});

		this.stopUpdating();
		this.baseStructurePreviewService.resetStructureEditPreview();
		const rayParams = new RaycastParams();
		rayParams.FilterType = Enum.RaycastFilterType.Include;
		rayParams.AddToFilter(
			Workspace.WaitForChild("Plots")
				.GetChildren()
				.find((plot) => plot.GetAttribute("UserId") === Players.LocalPlayer.UserId)!
				.WaitForChild("Structures"),
		);
		this.mouseService.setRaycastParams(rayParams);
		this.baseStructureSelectionService.startUpdating();
	}

	private startUpdating(): void {
		this.connection = RunService.Heartbeat.Connect((dt: number) => {
			this.baseStructureCFrameService.updateCurrentCFrame(dt);
			this.baseStructurePreviewService.updateStructurePreview(
				this.baseStructureCFrameService.getCurrentCFrame(),
				this.baseStructurePlacementService.canMove(this.baseStructurePreviewService.getStructureModelHolder()),
			);
		});
	}

	private stopUpdating(): void {
		this.connection?.Disconnect();
		this.connection = undefined;
	}
}
