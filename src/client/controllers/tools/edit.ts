import { Controller } from "@flamework/core";
import ToolController from "./tool";
import { BaseStructurePreviewService } from "client/services/tools/placement/structure-preview";
import { BaseStructureCFrameService } from "client/services/tools/placement/structure-cframe";
import { Players, RunService, Workspace } from "@rbxts/services";
import MouseService from "client/services/tools/mouse";
import BaseStructureSelectionService from "client/services/tools/selection/structure-selection";
import { Events } from "client/network";
import { StandardActionBuilder } from "@rbxts/mechanism";
import { STRUCTURES } from "shared/constants/structures";
import BaseStructureArrowService from "client/services/tools/placement/structure-arrow";
import BaseStructureHighlightService from "client/services/tools/placement/structure-highlight";
import BaseStructureBeamService from "client/services/tools/placement/structure-beam";
import BaseStructurePlacementService from "client/services/tools/placement/structure-placement";
import { Array } from "@rbxts/luau-polyfill";
import SoundService from "client/services/sound";
import ValidationService from "shared/services/validation";
import { GridService } from "shared/services/plot";

@Controller()
export default class EditController extends ToolController {
	protected readonly context = "Edit";
	protected readonly inputActions = [
		{
			action: new StandardActionBuilder("MouseButton1"),
			activated: () => {
				if (
					this.baseStructurePreviewService
						.getStructureModelHolder()
						.GetChildren()
						.filter((instance): instance is Model => instance.IsA("Model") && instance.Name in STRUCTURES)
						.size() > 0
				) {
					this.move();
				} else {
					this.baseStructureSelectionService.startSelection();
				}
			},
			deactivated: () => {
				if (
					this.baseStructurePreviewService
						.getStructureModelHolder()
						.GetChildren()
						.filter((instance): instance is Model => instance.IsA("Model") && instance.Name in STRUCTURES)
						.size() > 0 ||
					this.debounce
				)
					return;
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

	private readonly gridService = GridService.getInst();
	private readonly mouseService = new MouseService(this.gridService);
	private readonly validationService = ValidationService.getInst();
	private readonly soundService = SoundService.getInst();

	private readonly baseStructureHighlightService = BaseStructureHighlightService.getInst();
	private readonly baseStructureArrowService = BaseStructureArrowService.getInst();
	private readonly baseStructureBeamService = BaseStructureBeamService.getInst();
	private readonly baseStructureSelectionService = new BaseStructureSelectionService(
		this.mouseService,
		this.baseStructureArrowService,
		this.baseStructureBeamService,
		this.soundService,
		{ FillColor: Color3.fromRGB(35, 126, 212), FillTransparency: 0.7, OutlineColor: Color3.fromRGB(70, 141, 255) },
	);
	private readonly baseStructureCFrameService = new BaseStructureCFrameService();
	private readonly baseStructurePreviewService: BaseStructurePreviewService;
	private readonly baseStructurePlacementService: BaseStructurePlacementService;

	private debounce: boolean = false;
	private connection: RBXScriptConnection | undefined;

	constructor() {
		super();
		BaseStructurePreviewService.init(
			this.gridService,
			this.baseStructureHighlightService,
			this.baseStructureArrowService,
			this.baseStructureBeamService,
		);
		this.baseStructurePreviewService = BaseStructurePreviewService.getInst();

		BaseStructurePlacementService.init(this.validationService, this.soundService);
		this.baseStructurePlacementService = BaseStructurePlacementService.getInst();
	}

	protected override initEvents(): void {
		super.initEvents();
		this.mouseService.onClampedCellChanged.Connect((newClampedCell) => {
			if (
				this.baseStructurePreviewService.getStructureModelHolder().PrimaryPart !== undefined &&
				(this.baseStructurePreviewService.getStructureModelHolder().PrimaryPart!.Size.X % 8 !== 0 ||
					this.baseStructurePreviewService.getStructureModelHolder().PrimaryPart!.Size.Z % 8 !== 0)
			) {
				this.baseStructureCFrameService.setTargetPosition(
					new Vector3(
						newClampedCell.worldPosition.X,
						this.baseStructurePreviewService.getStructureModelHolder().GetPivot().Position.Y,
						newClampedCell.worldPosition.Z,
					),
				);
			}
		});

		this.mouseService.onClampedCellVertexPositionChanged.Connect((newClampedCellVertexPosition) => {
			if (
				this.baseStructurePreviewService.getStructureModelHolder().PrimaryPart !== undefined &&
				this.baseStructurePreviewService.getStructureModelHolder().PrimaryPart!.Size.X % 8 === 0 &&
				this.baseStructurePreviewService.getStructureModelHolder().PrimaryPart!.Size.Z % 8 === 0
			) {
				this.baseStructureCFrameService.setTargetPosition(
					new Vector3(
						newClampedCellVertexPosition.X,
						this.baseStructurePreviewService.getStructureModelHolder().GetPivot().Position.Y,
						newClampedCellVertexPosition.Z,
					),
				);
			}
		});

		this.baseStructureSelectionService.OnSelection.Connect((selectedStructuresModels) => {
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
			if (selectedStructuresModels.size() > 0) {
				Events.StartStructuresEdit.fire(
					Array.flatMap(selectedStructuresModels, (structureModel) =>
						[structureModel, ...structureModel.GetDescendants()].filter(
							(instance): instance is Model => instance.IsA("Model") && instance.Name in STRUCTURES,
						),
					),
				);
				this.startMoving(selectedStructuresModels);
			}
		});

		Events.OnStructuresEdit.connect((player) => {
			if (player !== Players.LocalPlayer) return;
			this.debounce = true;
			task.delay(0.1, () => {
				this.debounce = false;
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
		this.mouseService.stopUpdating();
		this.baseStructureSelectionService.stopUpdating();
		this.baseStructureSelectionService.stopSelection();
		if (
			this.baseStructurePreviewService
				.getStructureModelHolder()
				.GetChildren()
				.filter((instance): instance is Model => instance.IsA("Model") && instance.Name in STRUCTURES)
				.size() > 0
		) {
			this.baseStructurePreviewService.updateStructurePreview(
				this.baseStructureCFrameService.getSavedCF()!,
				this.baseStructurePlacementService.canEdit(this.baseStructurePreviewService.getStructureModelHolder())
					.success,
			);
			Events.CancelStructuresMovement.fire(
				this.baseStructurePreviewService
					.getStructureModelHolder()
					.GetDescendants()
					.filter((instance): instance is Model => instance.IsA("Model") && instance.Name in STRUCTURES),
			);
		}
		this.baseStructurePreviewService.resetStructureEditPreview();
	}

	private startMoving(selectedStructuresModels: Model[]): void {
		this.baseStructureSelectionService.stopUpdating();
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
		this.baseStructurePreviewService.initStructureEditPreview(selectedStructuresModels[0].Parent as Model);
		this.baseStructureCFrameService.setPosition(
			this.baseStructurePreviewService.getStructureModelHolder().GetPivot().Position,
		);
		this.baseStructureCFrameService.setRotation(
			this.baseStructurePreviewService.getStructureModelHolder().GetPivot().Rotation,
		);
		this.baseStructureCFrameService.saveCF();
		this.startUpdating();
	}

	private startUpdating(): void {
		this.connection = RunService.Heartbeat.Connect((dt) => {
			this.baseStructureCFrameService.updateCurrentCF(dt);
			this.baseStructurePreviewService.updateStructurePreview(
				this.baseStructureCFrameService.getCurrentCF(),
				this.baseStructurePlacementService.canEdit(this.baseStructurePreviewService.getStructureModelHolder())
					.success,
			);
		});
	}

	private move(): void {
		this.baseStructurePlacementService.edit(
			this.baseStructurePreviewService.getStructureModelHolder(),
			this.baseStructureCFrameService.getTargetCF(),
		);
	}

	private stopUpdating(): void {
		this.connection?.Disconnect();
		this.connection = undefined;
	}
}
