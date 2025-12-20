import { Players, RunService } from "@rbxts/services";
import GridService from "client/services/plot/grid-service";
import { BaseStructureCFrameService } from "../../base/visuals/cframe-service";
import BaseBuildingService from "../base";
import MouseService from "../../base/mouse-service";
import { PathStructurePreviewService } from "./preview-service";
import { BaseStructurePreviewService } from "../../base/visuals/preview-service";
import BaseStructureHighlightService from "../../base/visuals/highlight-service";
import BaseStructureArrowService from "../../base/visuals/arrow-service";
import BaseStructurePlacementService from "../../base/placement-service";

export default class PathStructureBuildingService extends BaseBuildingService {
	private readonly pathStructurePreviewService: PathStructurePreviewService;
	private straightStructureModel!: Model;
	private leftTurnStructureModel!: Model;
	private rightTurnStructureModel!: Model;
	private startPosition: Vector3 | undefined;
	private goalPosition: Vector3 | undefined;
	private connection: RBXScriptConnection | undefined;

	constructor(
		private readonly gridService: GridService,
		private readonly mouseService: MouseService,
		private readonly baseStructurePreviewService: BaseStructurePreviewService,
		baseStructureHighlightService: BaseStructureHighlightService,
		baseStructureArrowService: BaseStructureArrowService,
		private readonly baseStructureCFrameService: BaseStructureCFrameService,
		private readonly baseStructurePlacementService: BaseStructurePlacementService,
	) {
		super();
		this.pathStructurePreviewService = new PathStructurePreviewService(
			baseStructureHighlightService,
			baseStructureArrowService,
		);

		this.mouseService.onClampedCellVertexPositionChanged.Connect((newClampedCellVertexPosition) => {
			if (
				!this.active ||
				this.straightStructureModel.PrimaryPart!.Size.X % 8 !== 0 ||
				this.straightStructureModel.PrimaryPart!.Size.Z % 8 !== 0
			)
				return;

			this.baseStructureCFrameService.setTargetPosition(
				new Vector3(
					newClampedCellVertexPosition.X,
					this.straightStructureModel.PrimaryPart!.Size.Y / 2 + 0.5,
					newClampedCellVertexPosition.Z,
				),
			);

			if (
				this.startPosition === undefined ||
				math.abs(newClampedCellVertexPosition.sub(this.startPosition).X) %
					this.straightStructureModel.PrimaryPart!.Size.Z !==
					0 ||
				math.abs(newClampedCellVertexPosition.sub(this.startPosition).Z) %
					this.straightStructureModel.PrimaryPart!.Size.Z !==
					0 ||
				this.goalPosition?.FuzzyEq(newClampedCellVertexPosition)
			)
				return;
			this.baseStructurePreviewService.resetStructurePlacementPreview();
			this.goalPosition = new Vector3(newClampedCellVertexPosition.X, 0, newClampedCellVertexPosition.Z);
			this.rebuidStructurePath();
		});

		this.mouseService.onClampedCellChanged.Connect((_, newClampedCellPosition) => {
			if (
				!this.active ||
				(this.straightStructureModel.PrimaryPart!.Size.X % 8 === 0 &&
					this.straightStructureModel.PrimaryPart!.Size.Z % 8 === 0)
			)
				return;

			this.baseStructureCFrameService.setTargetPosition(
				new Vector3(
					newClampedCellPosition.X,
					newClampedCellPosition.Y + this.straightStructureModel.PrimaryPart!.Size.Y / 2 + 0.5,
					newClampedCellPosition.Z,
				),
			);

			if (
				this.startPosition === undefined ||
				math.abs(newClampedCellPosition.sub(this.startPosition).X) %
					this.straightStructureModel.PrimaryPart!.Size.Z !==
					0 ||
				math.abs(newClampedCellPosition.sub(this.startPosition).Z) %
					this.straightStructureModel.PrimaryPart!.Size.Z !==
					0 ||
				this.goalPosition?.FuzzyEq(newClampedCellPosition)
			)
				return;
			this.baseStructurePreviewService.resetStructurePlacementPreview();
			this.goalPosition = new Vector3(newClampedCellPosition.X, this.startPosition.Y, newClampedCellPosition.Z);
			this.rebuidStructurePath();
		});
	}

	public enter(straightStructureModel: Model, leftTurnStructureModel: Model, rightTurnStructureModel: Model): void {
		super.enter();
		this.straightStructureModel = straightStructureModel;
		this.leftTurnStructureModel = leftTurnStructureModel;
		this.rightTurnStructureModel = rightTurnStructureModel;

		const rayParams = new RaycastParams();
		rayParams.FilterType = Enum.RaycastFilterType.Exclude;
		rayParams.AddToFilter([
			this.baseStructurePreviewService.getStructureModelHolder(),
			this.pathStructurePreviewService.getPathStructureModelHolder(),
		]);
		this.mouseService.setRaycastParams(rayParams);
		this.mouseService.startUpdating();
		this.baseStructurePreviewService.initStructurePlacementPreview(this.straightStructureModel);
		this.startUpdatingStructure();
	}

	public exit(): void {
		super.exit();
		this.stopUpdating();
		this.baseStructurePreviewService.resetStructurePlacementPreview();
		this.pathStructurePreviewService.resetPathStructurePreview();
		this.mouseService.stopUpdating();

		this.startPosition = undefined;
		this.goalPosition = undefined;
	}

	private startUpdatingStructure(): void {
		this.connection = RunService.Heartbeat.Connect((dt: number) => {
			this.baseStructureCFrameService.updateCurrentCF(dt);
			this.baseStructurePreviewService.updateStructurePreview(
				this.baseStructureCFrameService.getCurrentCF(),
				this.baseStructurePlacementService.canPlace(this.baseStructurePreviewService.getStructureModelHolder()),
			);
		});
	}

	private startUpdatingPathStructure(): void {
		this.connection = RunService.Heartbeat.Connect(() => {
			this.pathStructurePreviewService.updatePathStructurePreview(
				this.baseStructurePlacementService.canPlace(
					this.pathStructurePreviewService.getPathStructureModelHolder(),
				),
			);
		});
	}

	private stopUpdating(): void {
		this.connection?.Disconnect();
		this.connection = undefined;
	}

	private rebuidStructurePath(): void {
		this.pathStructurePreviewService.resetPathStructurePreview();
		this.pathStructurePreviewService.initPathStructurePreview(
			this.straightStructureModel,
			this.leftTurnStructureModel,
			this.rightTurnStructureModel,
			this.startPosition!,
			this.goalPosition!,
			math.round(math.deg(this.baseStructureCFrameService.getTargetCF().Rotation.ToOrientation()[1])),
		);
	}

	public onPlacementStart(): void {
		const result =
			this.straightStructureModel.PrimaryPart!.Size.X % 8 === 0 &&
			this.straightStructureModel.PrimaryPart!.Size.Z % 8 === 0
				? this.mouseService.getClampedCellVertexPosition()
				: this.mouseService.getClampedCell();
		if (result === undefined) return;
		this.startPosition = typeIs(result, "Vector3")
			? result
			: this.gridService.getCellWorldPosition(Players.LocalPlayer, result);
		this.stopUpdating();
		this.startUpdatingPathStructure();
	}

	public onPlacementEnd(): void {
		this.baseStructurePlacementService.place(
			this.goalPosition === undefined
				? this.baseStructurePreviewService.getStructureModelHolder()
				: this.pathStructurePreviewService.getPathStructureModelHolder(),
			this.goalPosition === undefined
				? this.baseStructureCFrameService.getTargetCF()
				: this.pathStructurePreviewService.getPathStructureModelHolder().GetPivot(),
		);

		this.exit();
		this.enter(this.straightStructureModel, this.leftTurnStructureModel, this.rightTurnStructureModel);
	}

	public onRotate(): void {
		this.baseStructureCFrameService.setTargetRotation(
			this.baseStructureCFrameService.getTargetCF().Rotation.mul(CFrame.Angles(0, math.rad(90), 0)),
		);
		if (this.startPosition !== undefined) {
			this.rebuidStructurePath();
		}
	}
}
