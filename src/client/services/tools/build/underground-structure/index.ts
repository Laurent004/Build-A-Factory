import GridService from "client/services/plot/grid-service";
import { Players, RunService, Workspace } from "@rbxts/services";
import { BaseStructurePreviewService } from "../../base/visuals/preview-service";
import { BaseStructureCFrameService } from "../../base/visuals/cframe-service";
import BaseBuildingService from "../base";
import MouseService from "../../base/mouse-service";
import { UndergroundStructurePreviewService } from "./preview-service";
import BaseStructureHighlightService from "../../base/visuals/highlight-service";
import BaseStructureArrowService from "../../base/visuals/arrow-service";
import BaseStructureBeamService from "../../base/visuals/beam-service";
import BaseStructurePlacementService from "../../base/placement-service";

export class UndergroundStructureBuildingService extends BaseBuildingService {
	private readonly undergroundStructurePreviewService: UndergroundStructurePreviewService;
	private undergroundStructureModel!: Model;
	private startPosition: Vector3 | undefined;
	private endPosition: Vector3 | undefined;
	private connection: RBXScriptConnection | undefined;

	constructor(
		private readonly gridService: GridService,
		private readonly mouseService: MouseService,
		private readonly baseStructurePreviewService: BaseStructurePreviewService,
		baseStructureHighlightService: BaseStructureHighlightService,
		baseStructureArrowService: BaseStructureArrowService,
		baseStructureBeamService: BaseStructureBeamService,
		private readonly baseStructureCFrameService: BaseStructureCFrameService,
		private readonly baseStructurePlacementService: BaseStructurePlacementService,
	) {
		super();
		this.undergroundStructurePreviewService = new UndergroundStructurePreviewService(
			baseStructureHighlightService,
			baseStructureArrowService,
			baseStructureBeamService,
		);

		this.mouseService.onClampedCellChanged.Connect((_, newClampedCellPosition) => {
			if (!this.active) return;
			this.baseStructureCFrameService.setTargetPosition(
				new Vector3(
					newClampedCellPosition.X,
					this.undergroundStructureModel.PrimaryPart!.Size.Y / 2 + 0.5,
					newClampedCellPosition.Z,
				),
			);
			if (this.startPosition === undefined || newClampedCellPosition.FuzzyEq(this.startPosition)) return;
			const newEndPositon =
				math.abs(newClampedCellPosition.X - this.startPosition.X) >
				math.abs(newClampedCellPosition.Z - this.startPosition.Z)
					? new Vector3(newClampedCellPosition.X, 0, this.startPosition.Z)
					: new Vector3(this.startPosition.X, 0, newClampedCellPosition.Z);
			if (newEndPositon.FuzzyEq(this.endPosition!)) return;
			this.endPosition = newEndPositon;
			this.rebuildUndergroundStructure();
		});
	}

	public enter(undergroundStructureModel: Model): void {
		super.enter();
		this.undergroundStructureModel = undergroundStructureModel;

		const rayParams = new RaycastParams();
		rayParams.FilterType = Enum.RaycastFilterType.Exclude;
		rayParams.AddToFilter([
			Workspace.WaitForChild("Plots")
				.GetChildren()
				.find((plot) => plot.GetAttribute("UserId") === Players.LocalPlayer.UserId)!
				.WaitForChild("Structures"),
			this.baseStructurePreviewService.getStructureModelHolder(),
			this.undergroundStructurePreviewService.getUndergroundStructureModelHolder(),
		]);
		this.mouseService.setRaycastParams(rayParams);
		this.mouseService.startUpdating();

		this.baseStructurePreviewService.initStructurePlacementPreview(
			this.undergroundStructureModel
				.GetChildren()
				.find(
					(instance): instance is Model =>
						instance.IsA("Model") && instance.Name.find("Input")[0] !== undefined,
				)!,
		);
		this.startUpdatingUndergroundStructureInput();
	}

	public exit(): void {
		super.exit();
		this.stopUpdating();
		this.baseStructurePreviewService.resetStructurePlacementPreview();
		this.undergroundStructurePreviewService.resetUndergroundStructurePreview();
		this.mouseService.stopUpdating();

		this.startPosition = undefined;
		this.endPosition = undefined;
	}

	private startUpdatingUndergroundStructureInput(): void {
		this.connection = RunService.Heartbeat.Connect((dt: number) => {
			this.baseStructureCFrameService.updateCurrentCF(dt);
			this.baseStructurePreviewService.updateStructurePreview(
				this.baseStructureCFrameService.getCurrentCF(),
				this.baseStructurePlacementService.canPlace(this.baseStructurePreviewService.getStructureModelHolder()),
			);
		});
	}

	private startUpdatingUndergroundStructure(): void {
		this.connection = RunService.Heartbeat.Connect(() => {
			this.undergroundStructurePreviewService.updateUndergroundStructurePreview(
				this.baseStructurePlacementService.canPlace(
					this.undergroundStructurePreviewService.getUndergroundStructureModelHolder(),
				),
			);
		});
	}

	private stopUpdating(): void {
		this.connection?.Disconnect();
		this.connection = undefined;
	}

	private rebuildUndergroundStructure(): void {
		this.undergroundStructurePreviewService.resetUndergroundStructurePreview();
		this.undergroundStructurePreviewService.initUndergroundStructurePreview(
			this.undergroundStructureModel,
			this.startPosition!,
			this.endPosition!,
		);
	}

	public onPlacementStart(): void {
		if (this.startPosition !== undefined) {
			this.baseStructurePlacementService.place(
				this.undergroundStructurePreviewService.getUndergroundStructureModelHolder(),
				this.undergroundStructurePreviewService.getUndergroundStructureModelHolder().GetPivot(),
			);
			this.exit();
			this.enter(this.undergroundStructureModel);
		} else {
			const cell = this.mouseService.getCell();
			if (cell === undefined) return;
			this.stopUpdating();
			this.baseStructurePreviewService.resetStructurePlacementPreview();

			this.startPosition = this.gridService.getCellWorldPosition(Players.LocalPlayer, cell);
			this.endPosition = this.gridService.getCellWorldPosition(
				Players.LocalPlayer,
				this.gridService.getNeighborsCells(Players.LocalPlayer, cell)[0],
			);
			this.rebuildUndergroundStructure();
			this.startUpdatingUndergroundStructure();
		}
	}

	public onRotate(): void {
		this.baseStructureCFrameService.setTargetRotation(
			this.baseStructureCFrameService.getTargetCF().Rotation.mul(CFrame.Angles(0, math.rad(90), 0)),
		);
		if (this.startPosition === undefined) return;
		[this.startPosition, this.endPosition] = [this.endPosition, this.startPosition];
		this.rebuildUndergroundStructure();
	}
}
