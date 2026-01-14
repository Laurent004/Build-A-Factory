import { Workspace } from "@rbxts/services";
import BaseStructureHighlightService from "../../placement/structure-highlight";
import BaseStructureArrowService from "../../placement/structure-arrow";
import { STRUCTURES } from "shared/constants/structures";

export class PathStructurePreviewService {
	private readonly pathStructureModelHolder = new Instance("Model", Workspace);

	constructor(
		private readonly baseStructureHighlightService: BaseStructureHighlightService,
		private readonly baseStructureArrowService: BaseStructureArrowService,
	) {}

	public initPathStructurePreview(
		straightStructureModel: Model,
		leftTurnStructureModel: Model,
		rightTurnStructureModel: Model,
		startPosition: Vector3,
		goalPosition: Vector3,
		targetRotation: number,
	): void {
		if (startPosition.FuzzyEq(goalPosition)) {
			const newStraightStructureModel = straightStructureModel.Clone();
			newStraightStructureModel.PivotTo(
				new CFrame(
					new Vector3(
						goalPosition.X,
						goalPosition.Y + straightStructureModel.PrimaryPart!.Size.Y / 2 + 0.5,
						goalPosition.Z,
					),
				).mul(CFrame.Angles(0, math.rad(targetRotation), 0)),
			);
			newStraightStructureModel.Parent = this.pathStructureModelHolder;
			this.baseStructureArrowService.initStructureArrows(newStraightStructureModel);
		} else {
			const path: Vector3[] = [];
			if (targetRotation % 180 === 0) {
				for (
					let z = startPosition.Z;
					startPosition.Z < goalPosition.Z ? z <= goalPosition.Z : z >= goalPosition.Z;
					z +=
						startPosition.Z < goalPosition.Z
							? straightStructureModel!.PrimaryPart!.Size.Z
							: -straightStructureModel!.PrimaryPart!.Size.Z
				) {
					path.push(
						new Vector3(
							startPosition.X,
							goalPosition.Y + straightStructureModel.PrimaryPart!.Size.Y / 2 + 0.5,
							z,
						),
					);
				}
				for (
					let x =
						startPosition.X +
						(startPosition.X < goalPosition.X
							? straightStructureModel!.PrimaryPart!.Size.Z
							: -straightStructureModel!.PrimaryPart!.Size.Z);
					startPosition.X < goalPosition.X ? x <= goalPosition.X : x >= goalPosition.X;
					x +=
						startPosition.X < goalPosition.X
							? straightStructureModel!.PrimaryPart!.Size.Z
							: -straightStructureModel!.PrimaryPart!.Size.Z
				) {
					path.push(
						new Vector3(
							x,
							goalPosition.Y + straightStructureModel.PrimaryPart!.Size.Y / 2 + 0.5,
							goalPosition.Z,
						),
					);
				}
			} else {
				for (
					let x = startPosition.X;
					startPosition.X < goalPosition.X ? x <= goalPosition.X : x >= goalPosition.X;
					x +=
						startPosition.X < goalPosition.X
							? straightStructureModel!.PrimaryPart!.Size.Z
							: -straightStructureModel!.PrimaryPart!.Size.Z
				) {
					path.push(
						new Vector3(
							x,
							goalPosition.Y + straightStructureModel.PrimaryPart!.Size.Y / 2 + 0.5,
							startPosition.Z,
						),
					);
				}
				for (
					let z =
						startPosition.Z +
						(startPosition.Z < goalPosition.Z
							? straightStructureModel!.PrimaryPart!.Size.Z
							: -straightStructureModel!.PrimaryPart!.Size.Z);
					startPosition.Z < goalPosition.Z ? z <= goalPosition.Z : z >= goalPosition.Z;
					z +=
						startPosition.Z < goalPosition.Z
							? straightStructureModel!.PrimaryPart!.Size.Z
							: -straightStructureModel!.PrimaryPart!.Size.Z
				) {
					path.push(
						new Vector3(
							goalPosition.X,
							goalPosition.Y + straightStructureModel.PrimaryPart!.Size.Y / 2 + 0.5,
							z,
						),
					);
				}
			}

			for (let i = 0; i < path.size(); i++) {
				const direction = i === path.size() - 1 ? path[i].sub(path[i - 1]).Unit : path[i + 1].sub(path[i]).Unit;
				const cross = (i !== 0 ? path[i].sub(path[i - 1]).Unit : undefined)?.Cross(direction);
				const newStructureModel =
					cross !== undefined
						? cross.Y > 0
							? leftTurnStructureModel.Clone()
							: cross.Y < 0
							? rightTurnStructureModel.Clone()
							: straightStructureModel.Clone()
						: straightStructureModel.Clone();
				newStructureModel.PivotTo(
					newStructureModel.Name === leftTurnStructureModel.Name &&
						leftTurnStructureModel === rightTurnStructureModel &&
						cross !== undefined &&
						cross.Y > 0
						? CFrame.lookAlong(path[i], direction).mul(CFrame.Angles(0, math.rad(90), 0))
						: CFrame.lookAlong(path[i], direction),
				);
				newStructureModel.Parent = this.pathStructureModelHolder;

				if (i === 0) {
					this.baseStructureArrowService.initStructureInputArrows(newStructureModel);
				} else if (i === path.size() - 1) {
					this.pathStructureModelHolder.PrimaryPart = newStructureModel.PrimaryPart;
					this.baseStructureArrowService.initStructureOutputArrows(newStructureModel);
				}
			}
		}
		for (const basePart of this.pathStructureModelHolder
			.GetDescendants()
			.filter((instance): instance is BasePart => instance.IsA("BasePart"))) {
			basePart.CanCollide = false;
		}
		this.baseStructureHighlightService.initStructureHighlight(this.pathStructureModelHolder);
	}

	public updatePathStructurePreview(canPlace: boolean): void {
		this.baseStructureHighlightService.updateStructureHighlight(canPlace);
		this.baseStructureArrowService.updateStructureArrows();
	}

	public resetPathStructurePreview(): void {
		for (const structureModel of this.pathStructureModelHolder
			.GetChildren()
			.filter((instance): instance is Model => instance.IsA("Model") && instance.Name in STRUCTURES)) {
			structureModel.Destroy();
		}
		this.baseStructureHighlightService.resetStructureHighlight();
		this.baseStructureArrowService.resetStructureArrows();
	}

	public getPathStructureModelHolder(): Model {
		return this.pathStructureModelHolder;
	}
}
