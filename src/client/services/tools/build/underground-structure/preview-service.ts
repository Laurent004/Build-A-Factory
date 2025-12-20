import { Workspace } from "@rbxts/services";
import BaseStructureHighlightService from "../../base/visuals/highlight-service";
import BaseStructureArrowService from "../../base/visuals/arrow-service";
import BaseStructureBeamService from "../../base/visuals/beam-service";
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
			let z = startPosition.Z;
			const stepZ =
				startPosition.Z < endPosition.Z
					? undergroundStructureModel.PrimaryPart!.Size.Z
					: -undergroundStructureModel.PrimaryPart!.Size.Z;
			while (z !== endPosition.Z - stepZ) {
				z += stepZ;
				const newTransporter = (
					STRUCTURES[undergroundStructureModel.Name].subCategory === "Conveyor Belts"
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
			let x = startPosition.X;
			const stepX =
				startPosition.X < endPosition.X
					? undergroundStructureModel.PrimaryPart!.Size.Z
					: -undergroundStructureModel.PrimaryPart!.Size.Z;
			while (x !== endPosition.X - stepX) {
				x += stepX;
				const newTransporter = (
					STRUCTURES[undergroundStructureModel.Name].subCategory === "Conveyor Belts"
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
		this.baseStructureHighlightService.resetStructureHighlight();
		this.baseStructureArrowService.resetStructureArrows();
		this.baseStructureBeamService.resetStructureBeams();
		this.undergroundStructureModelHolder.FindFirstChildOfClass("Model")?.Destroy();

		for (const undergroundStructureModel of this.undergroundStructureModelHolder.GetChildren()) {
			undergroundStructureModel.Destroy();
		}
	}

	public getUndergroundStructureModelHolder(): Model {
		return this.undergroundStructureModelHolder;
	}
}
