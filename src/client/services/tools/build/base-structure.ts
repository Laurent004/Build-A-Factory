import { Players, RunService, Workspace } from "@rbxts/services";
import { BaseStructurePreviewService } from "../placement/structure-preview";
import { BaseStructureCFrameService } from "../placement/structure-cframe";
import BaseBuildingService from "./base";
import MouseService from "../mouse";
import BaseStructurePlacementService from "../placement/structure-placement";

export class BaseStructureBuildingService extends BaseBuildingService {
	private connection: RBXScriptConnection | undefined;

	constructor(
		private readonly mouseService: MouseService,
		private readonly baseStructurePreviewService: BaseStructurePreviewService,
		private readonly baseStructureCFrameService: BaseStructureCFrameService,
		private readonly baseStructurePlacementService: BaseStructurePlacementService,
	) {
		super();
		this.mouseService.onClampedCellChanged.Connect((newClampedCell) => {
			if (
				this.active &&
				this.baseStructurePreviewService.getStructureModelHolder().PrimaryPart !== undefined &&
				(this.baseStructurePreviewService.getStructureModelHolder().PrimaryPart!.Size.X % 8 !== 0 ||
					this.baseStructurePreviewService.getStructureModelHolder().PrimaryPart!.Size.Z % 8 !== 0)
			) {
				this.baseStructureCFrameService.setTargetPosition(
					new Vector3(
						newClampedCell.worldPosition.X,
						math.max(
							this.baseStructurePreviewService.getStructureModelHolder().PrimaryPart!.Size.Y / 2 + 0.5,
							this.baseStructurePreviewService.getStructureModelHolder().GetPivot().Position.Y,
						),
						newClampedCell.worldPosition.Z,
					),
				);
			}
		});

		this.mouseService.onClampedCellVertexPositionChanged.Connect((newClampedCellVertexPosition) => {
			if (
				this.active &&
				this.baseStructurePreviewService.getStructureModelHolder().PrimaryPart !== undefined &&
				this.baseStructurePreviewService.getStructureModelHolder().PrimaryPart!.Size.X % 8 === 0 &&
				this.baseStructurePreviewService.getStructureModelHolder().PrimaryPart!.Size.Z % 8 === 0
			) {
				this.baseStructureCFrameService.setTargetPosition(
					new Vector3(
						newClampedCellVertexPosition.X,
						math.max(
							this.baseStructurePreviewService.getStructureModelHolder().PrimaryPart!.Size.Y / 2 + 0.5,
							this.baseStructurePreviewService.getStructureModelHolder().GetPivot().Position.Y,
						),
						newClampedCellVertexPosition.Z,
					),
				);
			}
		});
	}

	public enter(structureModel: Model): void {
		super.enter();
		const rayParams = new RaycastParams();
		rayParams.FilterType = Enum.RaycastFilterType.Exclude;
		rayParams.AddToFilter([
			Workspace.WaitForChild("Plots")
				.GetChildren()
				.find((plot) => plot.GetAttribute("UserId") === Players.LocalPlayer.UserId)!
				.WaitForChild("Structures"),
			this.baseStructurePreviewService.getStructureModelHolder(),
		]);
		this.mouseService.setRaycastParams(rayParams);
		this.mouseService.startUpdating();
		this.baseStructurePreviewService.initStructurePlacementPreview(structureModel);
		this.baseStructureCFrameService.setPosition(
			this.baseStructurePreviewService.getStructureModelHolder().GetPivot().Position,
		);
		this.baseStructureCFrameService.setRotation(
			this.baseStructurePreviewService.getStructureModelHolder().GetPivot().Rotation,
		);
		this.startUpdatingStructure();
	}

	public exit(): void {
		this.stopUpdatingStructure();
		this.mouseService.stopUpdating();
		this.baseStructurePreviewService.resetStructurePlacementPreview();
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

	private stopUpdatingStructure(): void {
		this.connection?.Disconnect();
		this.connection = undefined;
	}

	public onStart(): void {
		this.baseStructurePlacementService.place(
			this.baseStructurePreviewService.getStructureModelHolder(),
			this.baseStructureCFrameService.getTargetCF(),
		);
	}

	public onRotate(): void {
		this.baseStructureCFrameService.setTargetRotation(
			this.baseStructureCFrameService.getTargetCF().Rotation.mul(CFrame.Angles(0, math.rad(90), 0)),
		);
	}
}
