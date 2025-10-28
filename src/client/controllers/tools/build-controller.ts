import { Controller, OnInit } from "@flamework/core";
import ToolController from "./tool-controller";
import { Context } from "client/constants/navigation";
import GridService from "client/services/plot/grid-service";
import { store } from "client/store";
import { StructureBuildingService } from "client/services/tools/build/structure";
import ConveyorBuildingService from "client/services/tools/build/conveyor";
import BaseStructureBuildingService from "client/services/tools/build/building-service";
import { selectBuildMenuBuildingStructureModel } from "client/store/context/build";
import { PowerLineBuildingService } from "client/services/tools/build/power-line";
import { StandardActionBuilder } from "@rbxts/mechanism";
import MouseService from "client/services/tools/base/mouse-service";
import { PowerService } from "client/services/plot/power-service";
import { UndergroundBeltBuildingService } from "client/services/tools/build/underground-belt";
import BaseStructureHighlightService from "client/services/tools/base/visuals/highlight-service";
import BaseStructureArrowService from "client/services/tools/base/visuals/arrow-service";
import BaseStructureBeamService from "client/services/tools/base/visuals/beam-service";
import BaseStructurePlacementService from "client/services/tools/base/placement-service";
import TutorialService from "client/services/progression/tutorial-service";

@Controller({})
export default class BuildController extends ToolController implements OnInit {
	protected readonly context: Context = "Build";
	protected readonly inputActions = [
		{
			action: new StandardActionBuilder("R"),
			activated: () => {
				this.currentBuildingService?.onRotate();
			},
		},
		{
			action: new StandardActionBuilder("MouseButton1"),
			activated: () => {
				this.currentBuildingService?.onPlacementStart();
			},
			deactivated: () => {
				this.currentBuildingService?.onPlacementEnd();
			},
		},
	];

	private readonly gridService = GridService.getInst();
	private readonly powerService = PowerService.getInst();
	private readonly mouseService = new MouseService(this.gridService);
	private readonly tutorialService = TutorialService.getInst();

	private readonly baseStructurePlacementService: BaseStructurePlacementService;
	private readonly baseStructureHighlightService: BaseStructureHighlightService =
		BaseStructureHighlightService.getInst();
	private readonly baseStructureArrowService = BaseStructureArrowService.getInst();
	private readonly baseStructureBeamService = BaseStructureBeamService.getInst();

	private readonly structureBuildingService: StructureBuildingService;
	private readonly conveyorBuildingService: ConveyorBuildingService;
	private readonly undergroundBeltBuildingService: UndergroundBeltBuildingService;
	private readonly powerLineBuildingService: PowerLineBuildingService;

	private currentBuildingService: BaseStructureBuildingService | undefined;

	constructor() {
		super();
		BaseStructurePlacementService.init(this.gridService, this.tutorialService);
		this.baseStructurePlacementService = BaseStructurePlacementService.getInst();

		this.structureBuildingService = new StructureBuildingService(
			this.mouseService,
			this.baseStructurePlacementService,
			this.baseStructureHighlightService,
			this.baseStructureArrowService,
			this.baseStructureBeamService,
		);
		this.conveyorBuildingService = new ConveyorBuildingService(
			this.gridService,
			this.mouseService,
			this.baseStructurePlacementService,

			this.baseStructureHighlightService,
			this.baseStructureArrowService,
			this.baseStructureBeamService,
		);
		this.undergroundBeltBuildingService = new UndergroundBeltBuildingService(
			this.gridService,
			this.mouseService,
			this.baseStructurePlacementService,
			this.baseStructureHighlightService,
			this.baseStructureArrowService,
			this.baseStructureBeamService,
		);
		this.powerLineBuildingService = new PowerLineBuildingService(this.powerService, this.mouseService);
	}

	onInit(): void | Promise<void> {
		super.onInit();
		store.subscribe(selectBuildMenuBuildingStructureModel, (structureModel) => {
			if (structureModel === undefined) return;
			switch (structureModel.Name) {
				case "Straight Conveyor":
					this.currentBuildingService = this.conveyorBuildingService;
					break;
				case "Underground Belt":
					this.currentBuildingService = this.undergroundBeltBuildingService;
					break;
				case "Power Line":
					this.currentBuildingService = this.powerLineBuildingService;
					break;
				default:
					this.currentBuildingService = this.structureBuildingService;
					break;
			}
			this.currentBuildingService.enter(structureModel);
		});
	}

	protected override exit(): void {
		super.exit();
		this.currentBuildingService?.exit();
		this.currentBuildingService = undefined;
	}
}
