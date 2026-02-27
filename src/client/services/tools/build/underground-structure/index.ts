import GridService from "client/services/plot/grid";
import { Players, RunService, Workspace } from "@rbxts/services";
import { BaseStructurePreviewService } from "../../placement/structure-preview";
import { BaseStructureCFrameService } from "../../placement/structure-cframe";
import BaseBuildingService from "../base";
import MouseService from "../../mouse";
import { UndergroundStructurePreviewService } from "./preview";
import BaseStructureHighlightService from "../../placement/structure-highlight";
import BaseStructureArrowService from "../../placement/structure-arrow";
import BaseStructureBeamService from "../../placement/structure-beam";
import BaseStructurePlacementService from "../../placement/structure-placement";

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

		this.mouseService.onClampedCellChanged.Connect((newClampedCell) => {
			if (!this.active) return;
			this.baseStructureCFrameService.setTargetPosition(
				new Vector3(
					newClampedCell.worldPosition.X,
					this.undergroundStructureModel.PrimaryPart!.Size.Y / 2 + 0.5,
					newClampedCell.worldPosition.Z,
				),
			);
			if (this.startPosition === undefined || newClampedCell.worldPosition.FuzzyEq(this.startPosition)) return;
			const newEndPositon =
				math.abs(newClampedCell.worldPosition.X - this.startPosition.X) >
				math.abs(newClampedCell.worldPosition.Z - this.startPosition.Z)
					? new Vector3(newClampedCell.worldPosition.X, 0, this.startPosition.Z)
					: new Vector3(this.startPosition.X, 0, newClampedCell.worldPosition.Z);
			if (this.endPosition!.FuzzyEq(newEndPositon)) return;
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
		this.mouseService.stopUpdating();
		this.baseStructurePreviewService.resetStructurePlacementPreview();
		this.undergroundStructurePreviewService.resetUndergroundStructurePreview();
		this.startPosition = undefined;
		this.endPosition = undefined;
	}

	private startUpdatingUndergroundStructureInput(): void {
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

	public onStart(): void {
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
			this.startPosition = cell.worldPosition;
			this.endPosition = (
				this.gridService.getNeighborsCells(Players.LocalPlayer, cell).find((cell) => cell.isUnlocked) ??
				this.gridService.getNeighborsCells(Players.LocalPlayer, cell)[0]
			).worldPosition;
			this.rebuildUndergroundStructure();
			this.startUpdatingUndergroundStructure();
		}
	}

	public onRotate(): void {
		this.baseStructureCFrameService.setTargetRotation(
			this.baseStructureCFrameService.getTargetCF().Rotation.mul(CFrame.Angles(0, math.rad(90), 0)),
		);
		if (this.startPosition !== undefined) {
			[this.startPosition, this.endPosition] = [this.endPosition, this.startPosition];
			this.rebuildUndergroundStructure();
		}
	}
}
