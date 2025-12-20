import { Players, RunService, Workspace } from "@rbxts/services";
import { BaseStructurePreviewService } from "../base/visuals/preview-service";
import { BaseStructureCFrameService } from "../base/visuals/cframe-service";
import BaseBuildingService from "./base";
import MouseService from "../base/mouse-service";
import BaseStructurePlacementService from "../base/placement-service";

export class BaseStructureBuildingService extends BaseBuildingService {
	private connection: RBXScriptConnection | undefined;

	constructor(
		private readonly mouseService: MouseService,
		private readonly baseStructurePreviewService: BaseStructurePreviewService,
		private readonly baseStructureCFrameService: BaseStructureCFrameService,
		private readonly baseStructurePlacementService: BaseStructurePlacementService,
	) {
		super();
		this.mouseService.onClampedCellVertexPositionChanged.Connect((newClampedCellVertexPosition) => {
			if (
				!this.active ||
				this.baseStructurePreviewService.getStructureModelHolder().PrimaryPart === undefined ||
				this.baseStructurePreviewService.getStructureModelHolder().PrimaryPart!.Size.X % 8 !== 0 ||
				this.baseStructurePreviewService.getStructureModelHolder().PrimaryPart!.Size.Z % 8 !== 0
			)
				return;
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
		});
		this.mouseService.onClampedCellChanged.Connect((_, newClampedCellPosition) => {
			if (
				!this.active ||
				this.baseStructurePreviewService.getStructureModelHolder().PrimaryPart === undefined ||
				(this.baseStructurePreviewService.getStructureModelHolder().PrimaryPart!.Size.X % 8 === 0 &&
					this.baseStructurePreviewService.getStructureModelHolder().PrimaryPart!.Size.Z % 8 === 0)
			)
				return;
			this.baseStructureCFrameService.setTargetPosition(
				new Vector3(
					newClampedCellPosition.X,
					math.max(
						this.baseStructurePreviewService.getStructureModelHolder().PrimaryPart!.Size.Y / 2 + 0.5,
						this.baseStructurePreviewService.getStructureModelHolder().GetPivot().Position.Y,
					),
					newClampedCellPosition.Z,
				),
			);
		});
	}

	public enter(structureModel: Model) {
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

	public exit() {
		this.stopUpdatingStructure();
		this.baseStructurePreviewService.resetStructurePlacementPreview();
		this.mouseService.stopUpdating();
	}

	private startUpdatingStructure() {
		this.connection = RunService.Heartbeat.Connect((dt: number) => {
			this.baseStructureCFrameService.updateCurrentCF(dt);
			this.baseStructurePreviewService.updateStructurePreview(
				this.baseStructureCFrameService.getCurrentCF(),
				this.baseStructurePlacementService.canPlace(this.baseStructurePreviewService.getStructureModelHolder()),
			);
		});
	}

	private stopUpdatingStructure() {
		this.connection?.Disconnect();
		this.connection = undefined;
	}

	public onPlacementStart(): void {
		this.baseStructurePlacementService.place(
			this.baseStructurePreviewService.getStructureModelHolder(),
			this.baseStructureCFrameService.getTargetCF(),
		);
	}

	public onRotate() {
		this.baseStructureCFrameService.setTargetRotation(
			this.baseStructureCFrameService.getTargetCF().Rotation.mul(CFrame.Angles(0, math.rad(90), 0)),
		);
	}
}
