import GridService from "client/services/plot/grid-service";
import { Players, RunService, Workspace } from "@rbxts/services";
import { BaseStructurePreviewService } from "../../base/visuals/preview-service";
import { BaseStructureCFrameService } from "../../base/visuals/cframe-service";
import BaseStructureBuildingService from "../building-service";
import MouseService from "../../base/mouse-service";
import { UndergroundBeltPreviewService } from "./preview-service";
import { STRUCTURES } from "shared/constants/structures";
import BaseStructureHighlightService from "../../base/visuals/highlight-service";
import BaseStructureArrowService from "../../base/visuals/arrow-service";
import BaseStructureBeamService from "../../base/visuals/beam-service";
import BaseStructurePlacementService from "../../base/placement-service";

export class UndergroundBeltBuildingService extends BaseStructureBuildingService {
	private readonly baseStructurePreviewService: BaseStructurePreviewService;
	private readonly baseStructureCFrameService = BaseStructureCFrameService.getInst();
	private readonly undergroundBeltPreviewService: UndergroundBeltPreviewService;

	private startCellPosition: Vector3 | undefined;
	private endCellPosition: Vector3 | undefined;

	private connection: RBXScriptConnection | undefined;

	constructor(
		private readonly gridService: GridService,
		private readonly mouseService: MouseService,
		private readonly baseStructurePlacementService: BaseStructurePlacementService,
		baseStructureHighlightService: BaseStructureHighlightService,
		baseStructureArrowService: BaseStructureArrowService,
		baseStructureBeamService: BaseStructureBeamService,
	) {
		super();
		BaseStructurePreviewService.init(
			baseStructureHighlightService,
			baseStructureArrowService,
			baseStructureBeamService,
		);
		this.baseStructurePreviewService = BaseStructurePreviewService.getInst();
		this.undergroundBeltPreviewService = new UndergroundBeltPreviewService(
			baseStructureHighlightService,
			baseStructureArrowService,
			baseStructureBeamService,
		);

		this.mouseService.onMouseClampedCellChanged.Connect((newMouseClampedCell, newMouseClampedCellPosition) => {
			this.mouseService.onMouseClampedCellChanged.Connect((_, newMouseClampedCellPosition) => {
				this.baseStructureCFrameService.updateTargetPosition(
					new Vector3(newMouseClampedCellPosition.X, 2.25, newMouseClampedCellPosition.Z),
				);
			});

			if (this.startCellPosition === undefined) return;
			const startCell = gridService.getCellAtWorldPosition(Players.LocalPlayer, this.startCellPosition)!;
			const endCell = gridService.getCellAtWorldPosition(Players.LocalPlayer, this.endCellPosition!)!;
			if (
				startCell === newMouseClampedCell ||
				(startCell.position.X !== newMouseClampedCell.position.X &&
					startCell.position.Z !== newMouseClampedCell.position.Z) ||
				endCell === newMouseClampedCell
			)
				return;
			this.endCellPosition = newMouseClampedCellPosition;
			this.rebuildUndergroundBelt();
		});
	}

	public enter() {
		const rayParams = new RaycastParams();
		rayParams.FilterType = Enum.RaycastFilterType.Exclude;
		rayParams.AddToFilter([
			Workspace.WaitForChild("Plots")
				.GetChildren()
				.find((plot) => plot.GetAttribute("UserId") === Players.LocalPlayer.UserId)!,
			this.baseStructurePreviewService.getStructureModelHolder(),
			this.undergroundBeltPreviewService.getUndergroundBeltModelHolder(),
		]);
		this.mouseService.setRaycastParams(rayParams);
		this.mouseService.startUpdating();

		this.baseStructurePreviewService.initStructurePlacementPreview(STRUCTURES["Underground Belt Input"].model);
		this.startUpdatingUndergroundBeltInput();
	}

	public exit() {
		this.stopUpdating();
		this.baseStructurePreviewService.resetStructurePlacementPreview();
		this.undergroundBeltPreviewService.resetUndergroundBeltPreview();
		this.mouseService.stopUpdating();

		this.startCellPosition = undefined;
		this.endCellPosition = undefined;
	}

	private startUpdatingUndergroundBeltInput() {
		this.connection = RunService.Heartbeat.Connect((dt: number) => {
			this.baseStructureCFrameService.updateCurrentCFrame(dt);
			this.baseStructurePreviewService.updateStructurePreview(
				this.baseStructureCFrameService.getCurrentCFrame(),
				this.baseStructurePlacementService.canPlace(this.baseStructurePreviewService.getStructureModelHolder()),
			);
		});
	}

	private startUpdatingUndergroundBelt() {
		this.connection = RunService.Heartbeat.Connect(() => {
			this.undergroundBeltPreviewService.updateUndergroundBeltPreview(
				this.baseStructurePlacementService.canPlace(
					this.undergroundBeltPreviewService.getUndergroundBeltModelHolder(),
				),
			);
		});
	}

	private stopUpdating() {
		this.connection?.Disconnect();
		this.connection = undefined;
	}

	private rebuildUndergroundBelt() {
		const undergroundBeltInputTargetPosition = new Vector3(
			this.startCellPosition!.X,
			2.25,
			this.startCellPosition!.Z,
		);
		const undergroundBeltOutputTargetPosition = new Vector3(this.endCellPosition!.X, 2.25, this.endCellPosition!.Z);
		this.undergroundBeltPreviewService.resetUndergroundBeltPreview();
		this.undergroundBeltPreviewService.initUndergroundBeltPreview(
			CFrame.lookAt(
				undergroundBeltInputTargetPosition,
				undergroundBeltInputTargetPosition.add(
					undergroundBeltOutputTargetPosition.sub(undergroundBeltInputTargetPosition),
				),
			),
			CFrame.lookAt(
				undergroundBeltOutputTargetPosition,
				undergroundBeltOutputTargetPosition.add(
					undergroundBeltOutputTargetPosition.sub(undergroundBeltInputTargetPosition),
				),
			),
		);
	}

	public onPlacementStart(): void {
		if (this.startCellPosition !== undefined) {
			this.baseStructurePlacementService.place(
				this.undergroundBeltPreviewService.getUndergroundBeltModelHolder(),
			);
			this.exit();
			this.enter();
		} else {
			const cell = this.mouseService.getMouseCell();
			if (cell === undefined) return;
			this.stopUpdating();
			this.baseStructurePreviewService.resetStructurePlacementPreview();

			this.startCellPosition = this.gridService.getCellWorldPosition(Players.LocalPlayer, cell);
			this.endCellPosition = this.gridService.getCellWorldPosition(
				Players.LocalPlayer,
				this.gridService.getNeighborsCells(Players.LocalPlayer, cell)[0],
			);
			this.rebuildUndergroundBelt();
			this.startUpdatingUndergroundBelt();
		}
	}

	public onRotate(): void {
		this.baseStructureCFrameService.updateTargetRotation();
		if (this.startCellPosition !== undefined) {
			[this.startCellPosition, this.endCellPosition] = [this.endCellPosition, this.startCellPosition];
			this.rebuildUndergroundBelt();
		}
	}
}
