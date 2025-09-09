import { Controller, OnInit } from "@flamework/core";
import { Context } from "client/constants/navigation";
import { EventBus } from "client/event-bus";
import { ToolController } from "./tool-controller";
import GridService from "client/services/plot/grid-service";
import { StructurePreviewService } from "client/services/tools/build/structure/preview-service";
import { StructureCFrameService } from "client/services/tools/build/structure/cframe-service";
import { Players, RunService, Workspace } from "@rbxts/services";
import MouseService from "client/services/tools/mouse-service";
import StructureSelectionService from "client/services/tools/selection-service";
import { Events } from "client/network";

@Controller({})
export default class EditController extends ToolController implements OnInit {
	protected readonly context: Context = "Edit";
	private readonly gridService: GridService = GridService.getInst();
	private readonly mouseService: MouseService = MouseService.getInst();

	private readonly structurePreviewService: StructurePreviewService = new StructurePreviewService(this.gridService);
	private readonly structureCFrameService: StructureCFrameService = new StructureCFrameService(this.mouseService);
	private readonly structureSelectionService: StructureSelectionService = new StructureSelectionService(
		this.mouseService,
		Color3.fromRGB(27, 137, 206),
	);

	private readonly rayParams = new RaycastParams();

	private isMoving: boolean = false;
	private hasRecentlyMoved: boolean = false;
	private connection: RBXScriptConnection | undefined;

	constructor() {
		super();
		this.rayParams.FilterType = Enum.RaycastFilterType.Exclude;
	}

	onInit(): void {
		super.onInit();
		EventBus.InputEvents.Tools.Edit.StartSelection.Connect(() => {
			if (this.isMoving) return;
			this.structureSelectionService.startSelection();
		});
		EventBus.InputEvents.Tools.Edit.Select.Connect(() => {
			if (this.isMoving || this.hasRecentlyMoved) return;
			this.structureSelectionService.select();
		});

		this.structureSelectionService.onSelection.Connect((selectedStructuresModels) => {
			this.move(selectedStructuresModels);
		});
		EventBus.InputEvents.Tools.Edit.Rotate.Connect(() => {
			this.structureCFrameService.updateTargetRotation();
		});
		EventBus.InputEvents.Tools.Edit.Place.Connect(() => {
			if (!this.isMoving) return;
			this.gridService.moveTo(Players.LocalPlayer, this.structurePreviewService.getStructuresModels()!);
		});

		Events.OnStructuresMovement.connect((player) => {
			if (player === Players.LocalPlayer) {
				this.isMoving = false;
				this.hasRecentlyMoved = true;
				task.delay(0.3, () => {
					this.hasRecentlyMoved = false;
				});
				this.exit();
			}
		});
	}

	private move(selectedStructuresModels: Model[]) {
		this.isMoving = true;
		this.structurePreviewService.initEditingPreview(selectedStructuresModels);
		this.structureCFrameService.saveCFrame(
			(this.structurePreviewService.getStructuresModels()[0].Parent as Model).GetPivot(),
		);
		this.rayParams.FilterDescendantsInstances = selectedStructuresModels;
		this.mouseService.setRaycastParams(this.rayParams);
		this.startUpdating();
		Events.StartStructuresMovement.fire(selectedStructuresModels);
	}

	protected override exit(): void {
		this.stopUpdating();
		if (this.isMoving) {
			this.isMoving = false;
			this.structurePreviewService.updateEditingPreview(
				this.structureCFrameService.getSavedCFrame()!,
				this.structureCFrameService.getSavedCFrame()!,
			);
			Events.CancelStructuresMovement.fire(this.structurePreviewService.getStructuresModels());
		}
		this.structurePreviewService.resetEditingPreview();
		this.structureSelectionService.stopSelection();
	}

	private startUpdating() {
		this.connection = RunService.Heartbeat.Connect((dt: number) => {
			this.update(dt);
		});
	}

	private update(dt: number) {
		this.structureCFrameService.updateCurrentCFrame(dt);
		this.structurePreviewService.updateEditingPreview(
			this.structureCFrameService.getCurrentCFrame(),
			this.structureCFrameService.getTargetCFrame(),
		);
	}

	private stopUpdating() {
		this.connection?.Disconnect();
		this.connection = undefined;
	}
}
