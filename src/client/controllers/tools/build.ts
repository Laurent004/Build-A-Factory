import { Controller, OnInit } from "@flamework/core";
import ToolController from "./tool";
import { Context } from "client/constants/navigation";
import GridService from "client/services/plot/grid-service";
import { store } from "client/store";
import { BaseStructureBuildingService } from "client/services/tools/build/base-structure";
import PathStructureBuildingService from "client/services/tools/build/path-structure";
import { selectBuildMenuBuildingStructureModel } from "client/store/context/build";
import { StandardActionBuilder } from "@rbxts/mechanism";
import MouseService from "client/services/tools/base/mouse-service";
import { PowerService } from "client/services/plot/power-service";
import { UndergroundStructureBuildingService } from "client/services/tools/build/underground-structure";
import BaseStructureHighlightService from "client/services/tools/base/visuals/highlight-service";
import BaseStructureArrowService from "client/services/tools/base/visuals/arrow-service";
import BaseStructureBeamService from "client/services/tools/base/visuals/beam-service";
import BaseStructurePlacementService from "client/services/tools/base/placement-service";
import TutorialService from "client/services/progression/tutorial-service";
import { STRUCTURES } from "shared/constants/structures";
import BaseBuildingService from "client/services/tools/build/base";
import { BaseStructurePreviewService } from "client/services/tools/base/visuals/preview-service";
import { BaseStructureCFrameService } from "client/services/tools/base/visuals/cframe-service";
import { PowerLineBuildingService } from "client/services/tools/build/power-line";
import { LiftStructureBuildingService } from "client/services/tools/build/lift-structure";
import { UserInputService } from "@rbxts/services";
import { Object } from "@rbxts/luau-polyfill";

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

	private readonly baseStructurePreviewService: BaseStructurePreviewService;
	private readonly baseStructureHighlightService: BaseStructureHighlightService =
		BaseStructureHighlightService.getInst();
	private readonly baseStructureArrowService = BaseStructureArrowService.getInst();
	private readonly baseStructureBeamService = BaseStructureBeamService.getInst();
	private readonly baseStructurePlacementService: BaseStructurePlacementService;

	private readonly baseStructureBuildingService: BaseStructureBuildingService;
	private readonly pathStructureBuildingService: PathStructureBuildingService;
	private readonly undergroundStructureBuildingService: UndergroundStructureBuildingService;
	private readonly liftStructureBuildingService: LiftStructureBuildingService;
	private readonly powerLineBuildingService: PowerLineBuildingService;

	private currentBuildingService: BaseBuildingService | undefined;

	constructor() {
		super();
		BaseStructurePreviewService.init(
			this.baseStructureHighlightService,
			this.baseStructureArrowService,
			this.baseStructureBeamService,
		);
		this.baseStructurePreviewService = BaseStructurePreviewService.getInst();

		BaseStructurePlacementService.init(this.gridService, this.tutorialService);
		this.baseStructurePlacementService = BaseStructurePlacementService.getInst();

		this.baseStructureBuildingService = new BaseStructureBuildingService(
			this.mouseService,
			this.baseStructurePreviewService,
			new BaseStructureCFrameService(),
			this.baseStructurePlacementService,
		);
		this.pathStructureBuildingService = new PathStructureBuildingService(
			this.gridService,
			this.mouseService,
			this.baseStructurePreviewService,
			this.baseStructureHighlightService,
			this.baseStructureArrowService,
			new BaseStructureCFrameService(),
			this.baseStructurePlacementService,
		);
		this.undergroundStructureBuildingService = new UndergroundStructureBuildingService(
			this.gridService,
			this.mouseService,
			this.baseStructurePreviewService,
			this.baseStructureHighlightService,
			this.baseStructureArrowService,
			this.baseStructureBeamService,
			new BaseStructureCFrameService(),
			this.baseStructurePlacementService,
		);
		this.liftStructureBuildingService = new LiftStructureBuildingService(
			this.gridService,
			this.mouseService,
			this.baseStructurePreviewService,
			this.baseStructureHighlightService,
			this.baseStructureArrowService,
			this.baseStructureBeamService,
			new BaseStructureCFrameService(),
			this.baseStructurePlacementService,
		);
		this.powerLineBuildingService = new PowerLineBuildingService(this.powerService, this.mouseService);

		UserInputService.InputChanged.Connect((input) => {
			if (input.UserInputType !== Enum.UserInputType.MouseWheel) return;
			this.currentBuildingService?.onScroll(input.Position);
		});
	}

	public override onInit(): void | Promise<void> {
		super.onInit();
		store.subscribe(selectBuildMenuBuildingStructureModel, (structureModel) => {
			if (structureModel === undefined) return;
			if (structureModel.Name === "Conveyor" || structureModel.Name === "Pipeline") {
				this.currentBuildingService = this.pathStructureBuildingService;
				this.currentBuildingService.enter(
					structureModel,
					Object.entries(STRUCTURES).find(
						([structureName]) =>
							structureName.find(structureModel.Name)[0] !== undefined &&
							structureName.find("Left")[0] !== undefined,
					)?.[1].model ??
						Object.entries(STRUCTURES).find(
							([structureName]) =>
								structureName.find(structureModel.Name)[0] !== undefined &&
								structureName.find("Turn")[0] !== undefined,
						)![1].model,
					Object.entries(STRUCTURES).find(
						([structureName]) =>
							structureName.find(structureModel.Name)[0] !== undefined &&
							structureName.find("Right")[0] !== undefined,
					)?.[1].model ??
						Object.entries(STRUCTURES).find(
							([structureName]) =>
								structureName.find(structureModel.Name)[0] !== undefined &&
								structureName.find("Turn")[0] !== undefined,
						)![1].model,
				);
			} else if (structureModel.Name.find("Underground")[0] !== undefined) {
				this.currentBuildingService = this.undergroundStructureBuildingService;
				this.currentBuildingService.enter(structureModel);
			} else if (structureModel.Name.find("Lift")[0] !== undefined) {
				this.currentBuildingService = this.liftStructureBuildingService;
				this.currentBuildingService.enter(
					structureModel,
					Object.entries(STRUCTURES).find(
						([structureName]) =>
							structureName.find(structureModel.Name)[0] !== undefined &&
							structureName.find("Elevator")[0] !== undefined,
					)![1].model,
				);
			} else if (structureModel.Name === "Power Line") {
				this.currentBuildingService = this.powerLineBuildingService;
				this.currentBuildingService.enter();
			} else {
				this.currentBuildingService = this.baseStructureBuildingService;
				this.currentBuildingService.enter(structureModel);
			}
		});
	}

	protected override exit(): void {
		super.exit();
		this.currentBuildingService?.exit();
		this.currentBuildingService = undefined;
	}
}
