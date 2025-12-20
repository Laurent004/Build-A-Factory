import { Controller, OnInit } from "@flamework/core";
import { Context } from "client/constants/navigation";
import ToolController from "./tool";
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
import { EventBus } from "client/event-bus";
import { Array } from "@rbxts/luau-polyfill";

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
				this.baseStructureCFrameService.setTargetRotation(
					this.baseStructureCFrameService.getTargetCF().Rotation.mul(CFrame.Angles(0, math.rad(90), 0)),
				);
			},
		},
	];

	private readonly gridService: GridService = GridService.getInst();
	private readonly mouseService: MouseService = new MouseService(this.gridService);
	private readonly tutorialService = TutorialService.getInst();

	private readonly baseStructureSelectionService: BaseStructureSelectionService;
	private readonly baseStructurePreviewService: BaseStructurePreviewService;
	private readonly baseStructureHighlightService: BaseStructureHighlightService =
		BaseStructureHighlightService.getInst();
	private readonly baseStructureArrowService = BaseStructureArrowService.getInst();
	private readonly baseStructureBeamService = BaseStructureBeamService.getInst();
	private readonly baseStructureCFrameService = new BaseStructureCFrameService();
	private readonly baseStructurePlacementService: BaseStructurePlacementService;

	private isMoving: boolean = false;
	private hasRecentlyMoved: boolean = false;
	private connection: RBXScriptConnection | undefined;

	constructor() {
		super();
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

		BaseStructurePlacementService.init(this.gridService, this.tutorialService);
		this.baseStructurePlacementService = BaseStructurePlacementService.getInst();
	}

	public override onInit(): void | Promise<void> {
		super.onInit();
		EventBus.ToolEvents.OnSelection.Connect((selectedStructuresModels) => {
			if (!this.active) return;
			const rayParams = new RaycastParams();
			rayParams.FilterType = Enum.RaycastFilterType.Include;
			rayParams.AddToFilter(
				[
					Workspace.WaitForChild("Plots")
						.GetChildren()
						.find((plot) => plot.GetAttribute("UserId") === Players.LocalPlayer.UserId)!
						.WaitForChild("Structures"),
				].filterUndefined(),
			);
			this.mouseService.setRaycastParams(rayParams);
			if (selectedStructuresModels.size() === 0) return;
			Events.StartStructuresMovement.fire([
				...selectedStructuresModels,
				...Array.flatMap(selectedStructuresModels, (structureModel) =>
					structureModel
						.GetDescendants()
						.filter((instance): instance is Model => instance.IsA("Model") && instance.Name in STRUCTURES),
				),
			]);
			this.move(selectedStructuresModels);
		});

		this.mouseService.onClampedCellVertexPositionChanged.Connect((newClampedCellVertexPosition) => {
			if (
				this.baseStructurePreviewService.getStructureModelHolder().PrimaryPart === undefined ||
				this.baseStructurePreviewService.getStructureModelHolder().PrimaryPart!.Size.X % 8 !== 0 ||
				this.baseStructurePreviewService.getStructureModelHolder().PrimaryPart!.Size.Z % 8 !== 0
			)
				return;
			this.baseStructureCFrameService.setTargetPosition(
				new Vector3(
					newClampedCellVertexPosition.X,
					this.baseStructurePreviewService.getStructureModelHolder().GetPivot().Position.Y,
					newClampedCellVertexPosition.Z,
				),
			);
		});

		this.mouseService.onClampedCellChanged.Connect((_, newClampedCellPosition) => {
			if (
				this.baseStructurePreviewService.getStructureModelHolder().PrimaryPart === undefined ||
				(this.baseStructurePreviewService.getStructureModelHolder().PrimaryPart!.Size.X % 8 === 0 &&
					this.baseStructurePreviewService.getStructureModelHolder().PrimaryPart!.Size.Z % 8 === 0)
			)
				return;
			this.baseStructureCFrameService.setTargetPosition(
				new Vector3(
					newClampedCellPosition.X,
					this.baseStructurePreviewService.getStructureModelHolder().GetPivot().Position.Y,
					newClampedCellPosition.Z,
				),
			);
		});

		Events.OnStructuresMovement.connect((player) => {
			if (player !== Players.LocalPlayer) return;
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
				this.baseStructureCFrameService.getSavedCF()!,
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

	private move(selectedStructuresModels: Model[]): void {
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
		this.baseStructurePreviewService.initStructureEditPreview(selectedStructuresModels[0].Parent as Model);
		this.baseStructureCFrameService.setPosition(
			this.baseStructurePreviewService.getStructureModelHolder().GetPivot().Position,
		);
		this.baseStructureCFrameService.setRotation(
			this.baseStructurePreviewService.getStructureModelHolder().GetPivot().Rotation,
		);
		this.baseStructureCFrameService.saveCF(this.baseStructurePreviewService.getStructureModelHolder().GetPivot());
		this.startUpdating();
	}

	private moveTo(): void {
		this.baseStructurePlacementService.move(
			this.baseStructurePreviewService.getStructureModelHolder(),
			this.baseStructureCFrameService.getTargetCF(),
		);
	}

	private startUpdating(): void {
		this.connection = RunService.Heartbeat.Connect((dt: number) => {
			this.baseStructureCFrameService.updateCurrentCF(dt);
			this.baseStructurePreviewService.updateStructurePreview(
				this.baseStructureCFrameService.getCurrentCF(),
				this.baseStructurePlacementService.canMove(this.baseStructurePreviewService.getStructureModelHolder()),
			);
		});
	}

	private stopUpdating(): void {
		this.connection?.Disconnect();
		this.connection = undefined;
	}
}
