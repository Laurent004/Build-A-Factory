import { Workspace } from "@rbxts/services";
import BaseStructureHighlightService from "../../placement/structure-highlight";
import BaseStructureArrowService from "../../placement/structure-arrow";
import BaseStructureBeamService from "../../placement/structure-beam";
import { STRUCTURES } from "shared/constants/structures";

export class UndergroundStructurePreviewService {
	private readonly undergroundStructureModelHolder = new Instance("Model", Workspace);

	constructor(
		private readonly baseStructureHighlightService: BaseStructureHighlightService,
		private readonly baseStructureArrowService: BaseStructureArrowService,
		private readonly baseStructureBeamService: BaseStructureBeamService,
	) {}

	public initUndergroundStructurePreview(
		undergroundStructureModel: Model,
		startPosition: Vector3,
		endPosition: Vector3,
	): void {
		const newUndergroundStructureModel = undergroundStructureModel.Clone();
		newUndergroundStructureModel.PivotTo(
			CFrame.lookAlong(startPosition, endPosition.sub(startPosition)).add(
				new Vector3(0, undergroundStructureModel.PrimaryPart!.Size.Y / 2 + 0.5, 0),
			),
		);
		newUndergroundStructureModel
			.GetChildren()
			.find(
				(instance): instance is Model => instance.IsA("Model") && instance.Name.find("Output")[0] !== undefined,
			)!
			.PivotTo(
				CFrame.lookAlong(endPosition, endPosition.sub(startPosition)).add(
					new Vector3(0, undergroundStructureModel.PrimaryPart!.Size.Y / 2 + 0.5, 0),
				),
			);

		if (startPosition.X === endPosition.X) {
			for (
				let z =
					startPosition.Z +
					(startPosition.Z < endPosition.Z
						? undergroundStructureModel.PrimaryPart!.Size.Z
						: -undergroundStructureModel.PrimaryPart!.Size.Z);
				startPosition.Z < endPosition.Z ? z < endPosition.Z : z > endPosition.Z;
				z +=
					startPosition.Z < endPosition.Z
						? undergroundStructureModel.PrimaryPart!.Size.Z
						: -undergroundStructureModel.PrimaryPart!.Size.Z
			) {
				const newTransporter = (
					STRUCTURES[undergroundStructureModel.Name].subcategory === "Conveyor Belts"
						? STRUCTURES["Transporter"].model
						: STRUCTURES["Fluid Transporter"].model
				).Clone();
				newTransporter.PivotTo(
					CFrame.lookAlong(
						new Vector3(
							startPosition.X,
							startPosition.Y + undergroundStructureModel.PrimaryPart!.Size.Y / 2 + 0.5,
							z,
						),
						endPosition.sub(startPosition),
					),
				);
				newTransporter.Parent = newUndergroundStructureModel;
			}
		} else {
			for (
				let x =
					startPosition.X +
					(startPosition.X < endPosition.X
						? undergroundStructureModel.PrimaryPart!.Size.Z
						: -undergroundStructureModel.PrimaryPart!.Size.Z);
				startPosition.X < endPosition.X ? x < endPosition.X : x > endPosition.X;
				x +=
					startPosition.X < endPosition.X
						? undergroundStructureModel.PrimaryPart!.Size.Z
						: -undergroundStructureModel.PrimaryPart!.Size.Z
			) {
				const newTransporter = (
					STRUCTURES[undergroundStructureModel.Name].subcategory === "Conveyor Belts"
						? STRUCTURES["Transporter"].model
						: STRUCTURES["Fluid Transporter"].model
				).Clone();
				newTransporter.PivotTo(
					CFrame.lookAlong(
						new Vector3(
							x,
							startPosition.Y + undergroundStructureModel.PrimaryPart!.Size.Y / 2 + 0.5,
							startPosition.Z,
						),
						endPosition.sub(startPosition),
					),
				);
				newTransporter.Parent = newUndergroundStructureModel;
			}
		}
		newUndergroundStructureModel.Parent = this.undergroundStructureModelHolder;
		this.undergroundStructureModelHolder.PrimaryPart = newUndergroundStructureModel.PrimaryPart;
		for (const basePart of this.undergroundStructureModelHolder
			.GetDescendants()
			.filter((instance): instance is BasePart => instance.IsA("BasePart"))) {
			basePart.CanCollide = false;
		}

		this.baseStructureHighlightService.initStructureHighlight(this.undergroundStructureModelHolder);
		this.baseStructureArrowService.initStructureArrows(this.undergroundStructureModelHolder);
		this.baseStructureBeamService.initStructureBeams(this.undergroundStructureModelHolder);
	}

	public updateUndergroundStructurePreview(canPlace: boolean): void {
		this.baseStructureHighlightService.updateStructureHighlight(canPlace);
		this.baseStructureArrowService.updateStructureArrows();
		this.baseStructureBeamService.updateStructureBeams();
	}

	public resetUndergroundStructurePreview(): void {
		for (const undergroundStructureModel of this.undergroundStructureModelHolder
			.GetChildren()
			.filter((instance): instance is Model => instance.IsA("Model") && instance.Name in STRUCTURES)) {
			undergroundStructureModel.Destroy();
		}
		this.baseStructureHighlightService.resetStructureHighlight();
		this.baseStructureArrowService.resetStructureArrows();
		this.baseStructureBeamService.resetStructureBeams();
	}

	public getUndergroundStructureModelHolder(): Model {
		return this.undergroundStructureModelHolder;
	}
}
