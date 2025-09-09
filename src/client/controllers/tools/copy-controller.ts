import { Controller, OnInit } from "@flamework/core";
import { Context } from "client/constants/navigation";
import { EventBus } from "client/event-bus";
import { ToolController } from "./tool-controller";
import GridService from "client/services/plot/grid-service";
import { StructurePreviewService } from "client/services/tools/build/structure/preview-service";
import { StructureCFrameService } from "client/services/tools/build/structure/cframe-service";
import { Players, RunService } from "@rbxts/services";
import MouseService from "client/services/tools/mouse-service";
import StructureSelectionService from "client/services/tools/selection-service";

@Controller({})
export default class CopyController extends ToolController implements OnInit {
	protected readonly context: Context = "Copy";
	private readonly gridService: GridService = GridService.getInst();
	private readonly mouseService: MouseService = MouseService.getInst();

	private readonly structurePreviewService: StructurePreviewService = new StructurePreviewService(this.gridService);
	private readonly structureCFrameService: StructureCFrameService = new StructureCFrameService(this.mouseService);
	private readonly structureSelectionService: StructureSelectionService = new StructureSelectionService(
		this.mouseService,
		Color3.fromRGB(27, 137, 206),
	);

	private hasCopied: boolean = false;
	private isPlacing: boolean = false;
	private connection: RBXScriptConnection | undefined;

	onInit(): void {
		super.onInit();
		EventBus.InputEvents.Tools.Copy.StartSelection.Connect(() => {
			if (this.hasCopied) return;
			this.structureSelectionService.startSelection();
		});
		EventBus.InputEvents.Tools.Copy.Select.Connect(() => {
			if (this.hasCopied) return;
			this.structureSelectionService.select();
		});

		this.structureSelectionService.onSelection.Connect((selectedStructuresModels) => {
			this.copy(selectedStructuresModels);
		});
		EventBus.InputEvents.Tools.Copy.Rotate.Connect(() => {
			this.structureCFrameService.updateTargetRotation();
		});
		EventBus.InputEvents.Tools.Copy.StartPlacement.Connect(() => {
			this.isPlacing = true;
		});
		EventBus.InputEvents.Tools.Copy.EndPlacement.Connect(() => {
			this.isPlacing = false;
		});
	}

	protected override exit() {
		this.stopUpdating();
		this.hasCopied = false;
		this.isPlacing = false;
		this.structurePreviewService.resetBuildingPreview();
		this.structureSelectionService.stopSelection();
	}

	private copy(selectedStructuresModels: Model[]) {
		this.hasCopied = true;
		this.structurePreviewService.initBuildingPreview(selectedStructuresModels);
		this.startUpdating();
	}

	private startUpdating() {
		this.connection = RunService.Heartbeat.Connect((dt: number) => {
			this.update(dt);
		});
	}

	private update(dt: number) {
		this.structureCFrameService.updateCurrentCFrame(dt);
		this.structurePreviewService.updateBuildingPreview(
			this.structureCFrameService.getCurrentCFrame(),
			this.structureCFrameService.getTargetCFrame(),
		);
		if (this.isPlacing) {
			this.gridService.place(Players.LocalPlayer, this.structurePreviewService.getStructuresModels()!);
		}
	}

	private stopUpdating() {
		this.connection?.Disconnect();
		this.connection = undefined;
	}
}
