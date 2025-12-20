import { Workspace } from "@rbxts/services";
import { snapVectorToCardinal } from "shared/utils/math";
import BaseStructureHighlightService from "../../base/visuals/highlight-service";
import BaseStructureArrowService from "../../base/visuals/arrow-service";

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
			const pathCellsPositions: Vector3[] = [
				new Vector3(
					startPosition.X,
					goalPosition.Y + straightStructureModel.PrimaryPart!.Size.Y / 2 + 0.5,
					startPosition.Z,
				),
			];
			const stepX =
				startPosition.X < goalPosition.X
					? straightStructureModel!.PrimaryPart!.Size.Z
					: -straightStructureModel!.PrimaryPart!.Size.Z;
			const stepZ =
				startPosition.Z < goalPosition.Z
					? straightStructureModel!.PrimaryPart!.Size.Z
					: -straightStructureModel!.PrimaryPart!.Size.Z;

			let x = startPosition.X;
			let z = startPosition.Z;
			if (targetRotation % 180 === 0) {
				while (z !== goalPosition.Z) {
					z += stepZ;
					pathCellsPositions.push(
						new Vector3(x, goalPosition.Y + straightStructureModel.PrimaryPart!.Size.Y / 2 + 0.5, z),
					);
				}

				while (x !== goalPosition.X) {
					x += stepX;
					pathCellsPositions.push(
						new Vector3(x, goalPosition.Y + straightStructureModel.PrimaryPart!.Size.Y / 2 + 0.5, z),
					);
				}
			} else {
				while (x !== goalPosition.X) {
					x += stepX;
					pathCellsPositions.push(
						new Vector3(x, goalPosition.Y + straightStructureModel.PrimaryPart!.Size.Y / 2 + 0.5, z),
					);
				}
				while (z !== goalPosition.Z) {
					z += stepZ;
					pathCellsPositions.push(
						new Vector3(x, goalPosition.Y + straightStructureModel.PrimaryPart!.Size.Y / 2 + 0.5, z),
					);
				}
			}

			for (let i = 0; i < pathCellsPositions.size(); i++) {
				const previousDirection =
					i !== 0 ? snapVectorToCardinal(pathCellsPositions[i].sub(pathCellsPositions[i - 1])) : undefined;
				const direction =
					i === pathCellsPositions.size() - 1
						? snapVectorToCardinal(pathCellsPositions[i].sub(pathCellsPositions[i - 1]))
						: snapVectorToCardinal(pathCellsPositions[i + 1].sub(pathCellsPositions[i]));
				const cross = previousDirection?.Cross(direction);

				const newStructureModel =
					cross !== undefined
						? cross.Y > 0
							? leftTurnStructureModel.Clone()
							: cross.Y < 0
							? rightTurnStructureModel.Clone()
							: straightStructureModel.Clone()
						: straightStructureModel.Clone();

				newStructureModel.PivotTo(
					newStructureModel.Name !== straightStructureModel.Name &&
						leftTurnStructureModel === rightTurnStructureModel &&
						cross !== undefined &&
						cross.Y > 0
						? CFrame.lookAlong(pathCellsPositions[i], direction).mul(CFrame.Angles(0, math.rad(90), 0))
						: CFrame.lookAlong(pathCellsPositions[i], direction),
				);
				newStructureModel.Parent = this.pathStructureModelHolder;

				if (i === 0) {
					this.baseStructureArrowService.initStructureInputArrows(newStructureModel);
				} else if (i === pathCellsPositions.size() - 1) {
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
		this.baseStructureHighlightService.resetStructureHighlight();
		this.baseStructureArrowService.resetStructureArrows();
		for (const structureModel of this.pathStructureModelHolder.GetChildren()) {
			structureModel.Destroy();
		}
	}

	public getPathStructureModelHolder(): Model {
		return this.pathStructureModelHolder;
	}
}
