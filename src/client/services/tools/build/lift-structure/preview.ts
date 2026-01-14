import { Workspace } from "@rbxts/services";
import BaseStructureHighlightService from "../../placement/structure-highlight";
import BaseStructureArrowService from "../../placement/structure-arrow";
import BaseStructureBeamService from "../../placement/structure-beam";
import { STRUCTURES } from "shared/constants/structures";

export class LiftStructurePreviewService {
	private readonly liftStructureModelHolder = new Instance("Model", Workspace);

	constructor(
		private readonly baseStructureHighlightService: BaseStructureHighlightService,
		private readonly baseStructureArrowService: BaseStructureArrowService,
		private readonly baseStructureBeamService: BaseStructureBeamService,
	) {}

	public initLiftStructurePreview(
		liftStructureModel: Model,
		liftElevatorStructureModel: Model,
		liftStructureInputCF: CFrame,
		liftStructureOutputCF: CFrame,
	): void {
		const newLiftStructureModel = liftStructureModel.Clone();
		newLiftStructureModel.PivotTo(
			liftStructureInputCF
				.add(new Vector3(0, liftStructureModel.PrimaryPart!.Size.Y / 2 + 0.5, 0))
				.mul(
					CFrame.Angles(
						0,
						0,
						liftStructureInputCF.Position.Y > liftStructureOutputCF.Position.Y ? math.rad(180) : 0,
					),
				),
		);
		newLiftStructureModel
			.GetChildren()
			.find(
				(instance): instance is Model => instance.IsA("Model") && instance.Name.find("Output")[0] !== undefined,
			)!
			.PivotTo(
				liftStructureOutputCF
					.add(new Vector3(0, liftStructureModel.PrimaryPart!.Size.Y / 2 + 0.5, 0))
					.mul(
						CFrame.Angles(
							0,
							0,
							liftStructureInputCF.Position.Y > liftStructureOutputCF.Position.Y ? math.rad(180) : 0,
						),
					),
			);

		for (
			let y =
				liftStructureInputCF.Position.Y +
				(liftStructureInputCF.Position.Y < liftStructureOutputCF.Position.Y
					? liftStructureModel.PrimaryPart!.Size.Y
					: -liftStructureModel.PrimaryPart!.Size.Y);
			liftStructureInputCF.Position.Y < liftStructureOutputCF.Position.Y
				? y < liftStructureOutputCF.Position.Y
				: y > liftStructureOutputCF.Position.Y;
			y +=
				liftStructureInputCF.Position.Y < liftStructureOutputCF.Position.Y
					? liftStructureModel.PrimaryPart!.Size.Y
					: -liftStructureModel.PrimaryPart!.Size.Y
		) {
			const newTransporter = STRUCTURES["Transporter"].model.Clone();
			newTransporter.PivotTo(
				CFrame.lookAlong(
					new Vector3(
						liftStructureInputCF.Position.X,
						y + liftStructureModel.PrimaryPart!.Size.Y / 2 + 0.5,
						liftStructureInputCF.Position.Z,
					),
					liftStructureOutputCF.Position.sub(liftStructureInputCF.Position),
				),
			);
			newTransporter.Parent = newLiftStructureModel;
			const newLiftElevator = liftElevatorStructureModel.Clone();
			newLiftElevator.PivotTo(
				CFrame.lookAlong(
					new Vector3(
						liftStructureInputCF.Position.X,
						y + liftStructureModel.PrimaryPart!.Size.Y / 2 + 0.5,
						liftStructureInputCF.Position.Z,
					),
					liftStructureOutputCF.mul(
						CFrame.Angles(
							0,
							0,
							liftStructureInputCF.Position.Y > liftStructureOutputCF.Position.Y ? math.rad(180) : 0,
						),
					).LookVector,
				),
			);
			newLiftElevator.Parent = newLiftStructureModel;
		}

		newLiftStructureModel.Parent = this.liftStructureModelHolder;
		this.liftStructureModelHolder.PrimaryPart = newLiftStructureModel.PrimaryPart;
		for (const basePart of this.liftStructureModelHolder
			.GetDescendants()
			.filter((instance): instance is BasePart => instance.IsA("BasePart"))) {
			basePart.CanCollide = false;
		}

		this.baseStructureHighlightService.initStructureHighlight(this.liftStructureModelHolder);
		this.baseStructureArrowService.initStructureArrows(this.liftStructureModelHolder);
		this.baseStructureBeamService.initStructureBeams(this.liftStructureModelHolder);
	}

	public updateLiftStructurePreview(canPlace: boolean): void {
		this.baseStructureHighlightService.updateStructureHighlight(canPlace);
		this.baseStructureArrowService.updateStructureArrows();
		this.baseStructureBeamService.updateStructureBeams();
	}

	public resetLiftStructurePreview(): void {
		for (const liftStructureModel of this.liftStructureModelHolder
			.GetChildren()
			.filter((instance): instance is Model => instance.IsA("Model") && instance.Name in STRUCTURES)) {
			liftStructureModel.Destroy();
		}
		this.baseStructureHighlightService.resetStructureHighlight();
		this.baseStructureArrowService.resetStructureArrows();
		this.baseStructureBeamService.resetStructureBeams();
	}

	public getLiftStructureModelHolder(): Model {
		return this.liftStructureModelHolder;
	}
}
