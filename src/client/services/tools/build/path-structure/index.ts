import { RunService } from "@rbxts/services";
import { BaseStructureCFrameService } from "../../placement/structure-cframe";
import BaseBuildingService from "../base";
import MouseService from "../../mouse";
import { PathStructurePreviewService } from "./preview";
import { BaseStructurePreviewService } from "../../placement/structure-preview";
import BaseStructureHighlightService from "../../placement/structure-highlight";
import BaseStructureArrowService from "../../placement/structure-arrow";
import BaseStructurePlacementService from "../../placement/structure-placement";

export default class PathStructureBuildingService extends BaseBuildingService {
	private readonly pathStructurePreviewService: PathStructurePreviewService;
	private straightStructureModel!: Model;
	private leftTurnStructureModel!: Model;
	private rightTurnStructureModel!: Model;
	private startPosition: Vector3 | undefined;
	private goalPosition: Vector3 | undefined;
	private connection: RBXScriptConnection | undefined;

	constructor(
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

		this.mouseService.onClampedCellChanged.Connect((newClampedCell) => {
			if (
				this.active &&
				(this.straightStructureModel.PrimaryPart!.Size.X % 8 !== 0 ||
					this.straightStructureModel.PrimaryPart!.Size.Z % 8 !== 0)
			) {
				this.baseStructureCFrameService.setTargetPosition(
					new Vector3(
						newClampedCell.worldPosition.X,
						newClampedCell.worldPosition.Y + this.straightStructureModel.PrimaryPart!.Size.Y / 2 + 0.5,
						newClampedCell.worldPosition.Z,
					),
				);

				if (
					this.startPosition === undefined ||
					math.abs(newClampedCell.worldPosition.sub(this.startPosition).X) %
						this.straightStructureModel.PrimaryPart!.Size.Z !==
						0 ||
					math.abs(newClampedCell.worldPosition.sub(this.startPosition).Z) %
						this.straightStructureModel.PrimaryPart!.Size.Z !==
						0 ||
					this.goalPosition?.FuzzyEq(newClampedCell.worldPosition)
				)
					return;
				this.baseStructurePreviewService.resetStructurePlacementPreview();
				this.goalPosition = new Vector3(
					newClampedCell.worldPosition.X,
					this.startPosition.Y,
					newClampedCell.worldPosition.Z,
				);
				this.rebuidStructurePath();
			}
		});

		this.mouseService.onClampedCellVertexPositionChanged.Connect((newClampedCellVertexPosition) => {
			if (
				this.active &&
				this.straightStructureModel.PrimaryPart!.Size.X % 8 === 0 &&
				this.straightStructureModel.PrimaryPart!.Size.Z % 8 === 0
			) {
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
			}
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
		this.mouseService.stopUpdating();
		this.baseStructurePreviewService.resetStructurePlacementPreview();
		this.pathStructurePreviewService.resetPathStructurePreview();
		this.startPosition = undefined;
		this.goalPosition = undefined;
	}

	private startUpdatingStructure(): void {
		this.connection = RunService.Heartbeat.Connect((dt) => {
			if (
				this.baseStructureCFrameService
					.getTargetCF()
					.FuzzyEq(this.baseStructurePreviewService.getStructureModelHolder().GetPivot())
			)
				return;
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

	public onStart(): void {
		const result =
			this.straightStructureModel.PrimaryPart!.Size.X % 8 !== 0 ||
			this.straightStructureModel.PrimaryPart!.Size.Z % 8 !== 0
				? this.mouseService.getClampedCell()
				: this.mouseService.getClampedCellVertexPosition();
		if (result === undefined) return;
		this.startPosition = typeIs(result, "Vector3") ? result : result.worldPosition;
		this.stopUpdating();
		this.startUpdatingPathStructure();
	}

	public onEnd(): void {
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
