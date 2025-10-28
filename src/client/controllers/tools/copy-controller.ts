import { Controller, OnInit } from "@flamework/core";
import { Context } from "client/constants/navigation";
import { EventBus } from "client/event-bus";
import ToolController from "./tool-controller";
import GridService from "client/services/plot/grid-service";
import { BaseStructurePreviewService } from "client/services/tools/base/visuals/preview-service";
import { BaseStructureCFrameService } from "client/services/tools/base/visuals/cframe-service";
import { Players, RunService, Workspace } from "@rbxts/services";
import MouseService from "client/services/tools/base/mouse-service";
import BaseStructureSelectionService from "client/services/tools/base/selection-service";
import { StandardActionBuilder } from "@rbxts/mechanism";
import BaseStructureArrowService from "client/services/tools/base/visuals/arrow-service";
import BaseStructureHighlightService from "client/services/tools/base/visuals/highlight-service";
import BaseStructureBeamService from "client/services/tools/base/visuals/beam-service";
import BaseStructurePlacementService from "client/services/tools/base/placement-service";
import TutorialService from "client/services/progression/tutorial-service";

@Controller({})
export default class CopyController extends ToolController implements OnInit {
	protected readonly context: Context = "Copy";
	protected readonly inputActions = [
		{
			action: new StandardActionBuilder("MouseButton1"),
			activated: () => {
				if (this.hasCopied) {
					this.place();
				} else {
					this.baseStructureSelectionService.startSelection();
				}
			},
			deactivated: () => {
				if (this.hasCopied) return;
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

	private hasCopied: boolean = false;
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
			if (selection !== undefined) {
				this.copy(selection);
			}
			EventBus.ToolEvents.Copy.OnSelection.Fire(selection);
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
		this.baseStructurePreviewService.resetStructurePlacementPreview();
		this.baseStructureSelectionService.stopUpdating();
		this.baseStructureSelectionService.stopSelection();
		this.mouseService.stopUpdating();

		this.hasCopied = false;
	}

	private copy(selection: Model): void {
		this.hasCopied = true;
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
		this.baseStructurePreviewService.initStructurePlacementPreview(selection);
		this.startUpdating();
	}

	private startUpdating(): void {
		this.connection = RunService.Heartbeat.Connect((dt: number) => {
			this.baseStructureCFrameService.updateCurrentCFrame(dt);
			this.baseStructurePreviewService.updateStructurePreview(
				this.baseStructureCFrameService.getCurrentCFrame(),
				this.baseStructurePlacementService.canPlace(this.baseStructurePreviewService.getStructureModelHolder()),
			);
		});
	}

	private place(): void {
		this.baseStructurePlacementService.place(this.baseStructurePreviewService.getStructureModelHolder());
	}

	private stopUpdating(): void {
		this.connection?.Disconnect();
		this.connection = undefined;
	}
}
