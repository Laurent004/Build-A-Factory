import { Controller, OnInit, OnStart } from "@flamework/core";
import { ToolController } from "./tool-controller";
import { Context } from "client/constants/navigation";
import { StructureName, STRUCTURES } from "shared/constants/structures";
import GridService from "client/services/plot/grid-service";
import { store } from "client/store";
import { EventBus } from "client/event-bus";
import { StructureBuildingService } from "client/services/tools/build/structure/building-service";
import { selectBuildMenuBuildingStructureName } from "client/store/menus/build";
import ConveyorBuildingService from "client/services/tools/build/conveyor/building-service";
import BuildingService from "client/services/tools/build/building-service";
import MouseService from "client/services/tools/mouse-service";

@Controller({})
export default class BuildController extends ToolController implements OnInit {
	protected readonly context: Context = "Build";
	private readonly gridService: GridService = GridService.getInst();
	private readonly mouseService: MouseService = MouseService.getInst();

	private readonly structureBuildingService: StructureBuildingService;
	private readonly conveyorBuildingService: ConveyorBuildingService;
	private currentBuildingService: BuildingService | undefined;

	constructor() {
		super();
		this.structureBuildingService = new StructureBuildingService(this.gridService, this.mouseService);
		this.conveyorBuildingService = new ConveyorBuildingService(this.gridService, this.mouseService);
	}

	onInit(): void | Promise<void> {
		super.onInit();

		store.subscribe(selectBuildMenuBuildingStructureName, (structureName) => {
			if (structureName === undefined) return;
			this.currentBuildingService?.exit();
			this.enter(structureName);
		});
		EventBus.InputEvents.Tools.Build.Rotate.Connect(() => {
			if (this.currentBuildingService === undefined) return;
			this.currentBuildingService.rotate();
		});
		EventBus.InputEvents.Tools.Build.StartPlacement.Connect(() => {
			if (this.currentBuildingService === undefined) return;
			this.currentBuildingService.startPlacement();
		});
		EventBus.InputEvents.Tools.Build.EndPlacement.Connect(() => {
			if (this.currentBuildingService instanceof StructureBuildingService) {
				this.currentBuildingService.stopPlacement();
			} else if (this.currentBuildingService instanceof ConveyorBuildingService) {
				this.currentBuildingService.place();
			}
		});
	}

	private enter(structureName: StructureName) {
		if (structureName === "Straight Conveyor") {
			this.currentBuildingService = this.conveyorBuildingService;
		} else {
			this.currentBuildingService = this.structureBuildingService;
		}
		this.currentBuildingService.enter(STRUCTURES[structureName]);
	}

	protected override exit() {
		this.currentBuildingService?.exit();
		this.currentBuildingService = undefined;
	}
}
