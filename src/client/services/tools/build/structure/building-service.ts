import GridService from "client/services/plot/grid-service";
import { StructureDefinition } from "shared/constants/structures";
import { Players, RunService } from "@rbxts/services";
import { StructurePreviewService } from "./preview-service";
import { StructureCFrameService } from "./cframe-service";

import BuildingService from "../building-service";
import MouseService from "../../mouse-service";

export class StructureBuildingService implements BuildingService {
	private readonly structurePreviewService: StructurePreviewService;
	private readonly structureCFrameService: StructureCFrameService;

	private isPlacing: boolean = false;
	private connection: RBXScriptConnection | undefined;

	constructor(private readonly gridService: GridService, mouseService: MouseService) {
		this.structurePreviewService = new StructurePreviewService(gridService);
		this.structureCFrameService = new StructureCFrameService(mouseService);
	}

	public enter(structureDefinition: StructureDefinition) {
		this.structurePreviewService.initBuildingPreview([structureDefinition.model]);
		this.startUpdating();
	}

	public exit() {
		this.stopUpdating();
		this.stopPlacement();
		this.structurePreviewService.resetBuildingPreview();
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
			this.gridService.place(Players.LocalPlayer, this.structurePreviewService.getStructuresModels());
		}
	}

	private stopUpdating() {
		this.connection?.Disconnect();
		this.connection = undefined;
	}

	public startPlacement(): void {
		this.isPlacing = true;
	}

	public stopPlacement(): void {
		this.isPlacing = false;
	}

	public rotate() {
		this.structureCFrameService.updateTargetRotation();
	}
}
