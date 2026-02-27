import { ContextActionService, Players, RunService, Workspace } from "@rbxts/services";
import { BaseStructurePreviewService } from "../../placement/structure-preview";
import { BaseStructureCFrameService } from "../../placement/structure-cframe";
import BaseBuildingService from "../base";
import MouseService from "../../mouse";
import { LiftStructurePreviewService } from "./preview";
import BaseStructureHighlightService from "../../placement/structure-highlight";
import BaseStructureArrowService from "../../placement/structure-arrow";
import BaseStructureBeamService from "../../placement/structure-beam";
import BaseStructurePlacementService from "../../placement/structure-placement";
import { GridService } from "shared/services/plot";

export class LiftStructureBuildingService extends BaseBuildingService {
	private readonly liftStructurePreviewService: LiftStructurePreviewService;
	private liftStructureModel!: Model;
	private startCf: CFrame | undefined;
	private endCf: CFrame | undefined;
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
		this.liftStructurePreviewService = new LiftStructurePreviewService(
			baseStructureHighlightService,
			baseStructureArrowService,
			baseStructureBeamService,
		);

		this.mouseService.getMouse().Move.Connect(() => {
			if (this.active && this.startCf !== undefined) {
				const camera = Workspace.CurrentCamera!;
				const rayOrigin = camera.CFrame.Position;
				const rayDirection = this.mouseService.getMouse().UnitRay.Direction;
				const horizontalLook = new Vector3(camera.CFrame.LookVector.X, 0, camera.CFrame.LookVector.Z).Unit;
				const dot = rayDirection.Dot(horizontalLook);
				if (math.abs(dot) > 1e-6) {
					const t = this.startCf.Position.sub(rayOrigin).Dot(horizontalLook) / dot;
					if (t > 0) {
						const cell = gridService.getCellAtWorldPosition(
							Players.LocalPlayer,
							new Vector3(
								this.startCf.Position.X,
								math.clamp(
									rayOrigin.add(rayDirection.mul(t)).Y,
									this.startCf.Position.Y - 100,
									this.startCf.Position.Y + 100,
								),
								this.startCf.Position.Z,
							),
						);
						if (
							cell === undefined ||
							cell.worldPosition.FuzzyEq(this.startCf.Position) ||
							cell.worldPosition.FuzzyEq(this.endCf!.Position) ||
							this.startCf.Position.sub(cell.worldPosition).Magnitude /
								this.liftStructureModel.PrimaryPart!.Size.Y -
								1 >
								(Players.LocalPlayer.GetAttribute("LiftHeight") as number)
						)
							return;
						this.endCf = new CFrame(
							this.startCf.Position.X,
							cell.worldPosition.Y,
							this.startCf.Position.Z,
						).mul(CFrame.Angles(0, this.endCf!.ToOrientation()[1], 0));
						this.rebuildLiftStructure();
					}
				}
			}
		});

		this.mouseService.onClampedCellChanged.Connect((newClampedCell) => {
			if (!this.active) return;
			this.baseStructureCFrameService.setTargetPosition(
				new Vector3(
					newClampedCell.worldPosition.X,
					newClampedCell.worldPosition.Y + this.liftStructureModel.PrimaryPart!.Size.Y / 2 + 0.5,
					newClampedCell.worldPosition.Z,
				),
			);
		});
	}

	public enter(liftStructureModel: Model): void {
		super.enter();
		this.liftStructureModel = liftStructureModel;
		const rayParams = new RaycastParams();
		rayParams.FilterType = Enum.RaycastFilterType.Exclude;
		rayParams.AddToFilter([
			this.baseStructurePreviewService.getStructureModelHolder(),
			this.liftStructurePreviewService.getLiftStructureModelHolder(),
		]);
		this.mouseService.setRaycastParams(rayParams);
		this.mouseService.startUpdating();
		this.baseStructurePreviewService.initStructurePlacementPreview(
			this.liftStructureModel
				.GetChildren()
				.find(
					(instance): instance is Model =>
						instance.IsA("Model") && instance.Name.find("Input")[0] !== undefined,
				)!,
		);
		this.startUpdatingLiftStructureInput();
	}

	public exit(): void {
		super.exit();
		this.stopUpdating();
		this.baseStructurePreviewService.resetStructurePlacementPreview();
		this.liftStructurePreviewService.resetLiftStructurePreview();
		this.mouseService.stopUpdating();
		this.startCf = undefined;
		this.endCf = undefined;
	}

	private startUpdatingLiftStructureInput(): void {
		this.connection = RunService.Heartbeat.Connect((dt) => {
			this.baseStructureCFrameService.updateCurrentCF(dt);
			this.baseStructurePreviewService.updateStructurePreview(
				this.baseStructureCFrameService.getCurrentCF(),
				this.baseStructurePlacementService.canPlace(this.baseStructurePreviewService.getStructureModelHolder()).success,
			);
		});
	}

	private startUpdatingLiftStructure(): void {
		this.connection = RunService.Heartbeat.Connect(() => {
			this.liftStructurePreviewService.updateLiftStructurePreview(
				this.baseStructurePlacementService.canPlace(
					this.liftStructurePreviewService.getLiftStructureModelHolder(),
				).success,
			);
		});
	}

	private stopUpdating(): void {
		this.connection?.Disconnect();
		this.connection = undefined;
	}

	private rebuildLiftStructure(): void {
		this.liftStructurePreviewService.resetLiftStructurePreview();
		this.liftStructurePreviewService.initLiftStructurePreview(this.liftStructureModel, this.startCf!, this.endCf!);
	}

	public onStart(): void {
		if (this.startCf !== undefined) {
			this.baseStructurePlacementService.place(
				this.liftStructurePreviewService.getLiftStructureModelHolder(),
				this.liftStructurePreviewService.getLiftStructureModelHolder().GetPivot(),
			);
			this.exit();
			this.enter(this.liftStructureModel);
			ContextActionService.UnbindAction("DisableScroll");
		} else {
			const cell = this.mouseService.getCell();
			if (cell === undefined) return;
			const cells = [
				this.gridService.getCellInDirection(Players.LocalPlayer, cell, Vector3.yAxis),
				this.gridService.getCellInDirection(Players.LocalPlayer, cell, Vector3.yAxis.mul(-1)),
			].filterUndefined();
			if (cells.size() === 0) return;
			this.stopUpdating();
			this.baseStructurePreviewService.resetStructurePlacementPreview();

			ContextActionService.BindAction(
				"DisableScroll",
				() => {
					return Enum.ContextActionResult.Sink;
				},
				false,
				Enum.UserInputType.MouseWheel,
			);
			this.startCf = new CFrame(cell.worldPosition).mul(this.baseStructureCFrameService.getTargetCF().Rotation);
			this.endCf = new CFrame(cells[0].worldPosition).mul(this.baseStructureCFrameService.getTargetCF().Rotation);
			this.rebuildLiftStructure();
			this.startUpdatingLiftStructure();
		}
	}

	public onRotate(): void {
		this.baseStructureCFrameService.setTargetRotation(
			this.baseStructureCFrameService.getTargetCF().Rotation.mul(CFrame.Angles(0, math.rad(90), 0)),
		);
		if (this.startCf === undefined) return;
		[this.startCf, this.endCf] = [this.endCf!, this.startCf];
		this.rebuildLiftStructure();
	}

	public onScroll(position: Vector3): void {
		if (this.startCf === undefined) return;
		this.endCf = this.endCf!.mul(CFrame.Angles(0, math.rad(90 * position.Z), 0));
		this.rebuildLiftStructure();
	}
}
