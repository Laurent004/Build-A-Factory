import { Players, Workspace } from "@rbxts/services";
import BaseStructureArrowService from "./structure-arrow";
import BaseStructureHighlightService from "./structure-highlight";
import { STRUCTURES } from "shared/constants/structures";
import BaseStructureBeamService from "./structure-beam";
import GridService from "client/services/plot/grid";

export class BaseStructurePreviewService {
	//#region Singleton
	private static _inst: BaseStructurePreviewService;
	public static getInst(): BaseStructurePreviewService {
		return this._inst;
	}
	//#endregion

	private readonly structureModelHolder: Model = new Instance("Model", Workspace);

	private constructor(
		private readonly gridService: GridService,
		private readonly baseStructureHighlightService: BaseStructureHighlightService,
		private readonly baseStructureArrowService: BaseStructureArrowService,
		private readonly baseStructureBeamService: BaseStructureBeamService,
	) {}

	public static init(
		gridService: GridService,
		baseStructureHighlightService: BaseStructureHighlightService,
		baseStructureArrowService: BaseStructureArrowService,
		baseStructureBeamService: BaseStructureBeamService,
	): void {
		if (this._inst !== undefined) return;
		this._inst = new BaseStructurePreviewService(
			gridService,
			baseStructureHighlightService,
			baseStructureArrowService,
			baseStructureBeamService,
		);
	}

	public initStructurePlacementPreview(model: Model): void {
		if (
			[model, ...model.GetChildren()]
				.filter(
					(instance): instance is Model =>
						instance.IsA("Model") &&
						instance.Name in STRUCTURES &&
						instance.GetAttribute("Id") === undefined,
				)
				.size() === 1
		) {
			const newStructureModel = [model, ...model.GetChildren()]
				.filter(
					(instance): instance is Model =>
						instance.IsA("Model") &&
						instance.Name in STRUCTURES &&
						instance.GetAttribute("Id") === undefined,
				)[0]
				.Clone();
			for (const tag of newStructureModel.GetTags()) {
				newStructureModel.RemoveTag(tag);
			}
			newStructureModel.Parent = this.structureModelHolder;
			this.structureModelHolder.PrimaryPart = newStructureModel.PrimaryPart;
		} else {
			for (const newPrimaryPart of model
				.GetDescendants()
				.filter((instance): instance is Model => instance.IsA("Model") && instance.Name in STRUCTURES)
				.map((structureModel) => structureModel.PrimaryPart!.Clone())) {
				newPrimaryPart.Parent = this.structureModelHolder;
			}

			const newPrimaryPart = new Instance("Part");
			[newPrimaryPart.CFrame, newPrimaryPart.Size] = this.structureModelHolder.GetBoundingBox();
			newPrimaryPart.Transparency = 1;
			newPrimaryPart.Anchored = true;
			if (newPrimaryPart.Size.X % 8 !== 0 || newPrimaryPart.Size.Z % 8 !== 0) {
				const cellLocalPosition = newPrimaryPart.CFrame.PointToObjectSpace(
					this.gridService.getClampedCellAtWorldPosition(
						Players.LocalPlayer,
						new Vector3(newPrimaryPart.Position.X, 0, newPrimaryPart.Position.Z),
					)!.worldPosition,
				);
				newPrimaryPart.PivotOffset = new CFrame(cellLocalPosition.X, 0, cellLocalPosition.Z);
			}
			newPrimaryPart.Parent = this.structureModelHolder;
			this.structureModelHolder.PrimaryPart = newPrimaryPart;
			for (const instance of this.structureModelHolder
				.GetChildren()
				.filter((instance) => instance !== newPrimaryPart)) {
				instance.Destroy();
			}

			for (const newStructureModel of model
				.GetChildren()
				.filter((instance): instance is Model => instance.IsA("Model") && instance.Name in STRUCTURES)
				.map((structureModel) => structureModel.Clone())) {
				for (const structureModel of [newStructureModel, ...newStructureModel.GetDescendants()].filter(
					(instance): instance is Model => instance.IsA("Model") && instance.Name in STRUCTURES,
				)) {
					for (const tag of structureModel.GetTags()) {
						structureModel.RemoveTag(tag);
					}
				}
				newStructureModel.Parent = this.structureModelHolder;
			}

			const attachments = this.structureModelHolder
				.GetDescendants()
				.filter(
					(instance): instance is Attachment =>
						instance.IsA("Attachment") && instance.Name === "PowerAttachment",
				);
			for (const powerLine of [
				model.GetChildren().filter((instance): instance is RopeConstraint => instance.IsA("RopeConstraint")),
				Workspace.WaitForChild("Plots")
					.GetChildren()
					.find((plot): plot is Model => plot.GetAttribute("UserId") === Players.LocalPlayer.UserId)!
					.WaitForChild("Power Lines")
					.GetChildren() as RopeConstraint[],
			].find((powerLines) => powerLines.size() > 0) ?? []) {
				const startAttachment = attachments.find((attachment) =>
					powerLine.Attachment0!.WorldCFrame.FuzzyEq(attachment.WorldCFrame),
				);
				const endAttachment = attachments.find((attachment) =>
					powerLine.Attachment1!.WorldCFrame.FuzzyEq(attachment.WorldCFrame),
				);
				if (startAttachment === undefined || endAttachment === undefined) continue;
				const newPowerLine = powerLine.Clone();
				newPowerLine.Attachment0 = startAttachment;
				newPowerLine.Attachment1 = endAttachment;
				newPowerLine.Parent = this.structureModelHolder;
			}
		}

		for (const basePart of this.structureModelHolder
			.GetDescendants()
			.filter((instance): instance is BasePart => instance.IsA("BasePart"))) {
			basePart.CanCollide = false;
		}

		this.baseStructureHighlightService.initStructureHighlight(this.structureModelHolder);
		this.baseStructureArrowService.initStructureArrows(this.structureModelHolder);
		this.baseStructureBeamService.initStructureBeams(this.structureModelHolder);
	}

	public initStructureEditPreview(model: Model): void {
		if (
			model
				.GetChildren()
				.filter((instance): instance is Model => instance.IsA("Model") && instance.Name in STRUCTURES)
				.size() === 1
		) {
			for (const structureModel of model
				.GetChildren()
				.filter((instance): instance is Model => instance.IsA("Model") && instance.Name in STRUCTURES)) {
				structureModel.Parent = this.structureModelHolder;
				this.structureModelHolder.PrimaryPart = structureModel.PrimaryPart;
			}
		} else {
			for (const newPrimaryPart of model
				.GetDescendants()
				.filter((instance): instance is Model => instance.IsA("Model") && instance.Name in STRUCTURES)
				.map((structureModel) => structureModel.PrimaryPart!.Clone())) {
				newPrimaryPart.Parent = this.structureModelHolder;
			}

			const newPrimaryPart = new Instance("Part");
			[newPrimaryPart.CFrame, newPrimaryPart.Size] = this.structureModelHolder.GetBoundingBox();
			newPrimaryPart.Transparency = 1;
			newPrimaryPart.Anchored = true;
			if (newPrimaryPart.Size.X % 8 !== 0 || newPrimaryPart.Size.Z % 8 !== 0) {
				const cellLocalPosition = newPrimaryPart.CFrame.PointToObjectSpace(
					this.gridService.getClampedCellAtWorldPosition(
						Players.LocalPlayer,
						new Vector3(newPrimaryPart.Position.X, 0, newPrimaryPart.Position.Z),
					)!.worldPosition,
				);
				newPrimaryPart.PivotOffset = new CFrame(cellLocalPosition.X, 0, cellLocalPosition.Z);
			}
			newPrimaryPart.Parent = this.structureModelHolder;
			this.structureModelHolder.PrimaryPart = newPrimaryPart;
			for (const instance of this.structureModelHolder
				.GetChildren()
				.filter((instance) => instance !== newPrimaryPart)) {
				instance.Destroy();
			}

			for (const structureModel of model
				.GetChildren()
				.filter((instance): instance is Model => instance.IsA("Model") && instance.Name in STRUCTURES)) {
				structureModel.Parent = this.structureModelHolder;
			}
		}

		for (const basePart of this.structureModelHolder
			.GetDescendants()
			.filter((instance): instance is BasePart => instance.IsA("BasePart"))) {
			basePart.CanCollide = false;
		}

		this.baseStructureHighlightService.initStructureHighlight(this.structureModelHolder);
		this.baseStructureArrowService.initStructureArrows(this.structureModelHolder);
		this.baseStructureBeamService.initStructureBeams(this.structureModelHolder);
	}

	public updateStructurePreview(currentCF: CFrame, canPlace: boolean): void {
		this.structureModelHolder.PivotTo(currentCF);
		this.baseStructureHighlightService.updateStructureHighlight(canPlace);
		this.baseStructureArrowService.updateStructureArrows();
		this.baseStructureBeamService.updateStructureBeams();
	}

	public resetStructurePlacementPreview(): void {
		for (const instance of this.structureModelHolder.GetChildren()) {
			instance.Destroy();
		}
		this.baseStructureHighlightService.resetStructureHighlight();
		this.baseStructureArrowService.resetStructureArrows();
		this.baseStructureBeamService.resetStructureBeams();
	}

	public resetStructureEditPreview(): void {
		const structures = Workspace.WaitForChild("Plots")
			.GetChildren()
			.find((plot) => plot.GetAttribute("UserId") === Players.LocalPlayer.UserId)!
			.WaitForChild("Structures");
		for (const structureModel of this.structureModelHolder
			.GetChildren()
			.filter((instance): instance is Model => instance.IsA("Model") && instance.Name in STRUCTURES)) {
			structureModel.Parent = structures;
			for (const basePart of structureModel
				.GetDescendants()
				.filter(
					(instance): instance is BasePart =>
						instance.IsA("BasePart") &&
						instance.FindFirstAncestorOfClass("Model") === structureModel &&
						instance !== structureModel.PrimaryPart,
				)) {
				basePart.CanCollide = true;
			}
		}
		this.structureModelHolder.PrimaryPart?.Destroy();
		this.baseStructureHighlightService.resetStructureHighlight();
		this.baseStructureArrowService.resetStructureArrows();
		this.baseStructureBeamService.resetStructureBeams();
	}

	public getStructureModelHolder(): Model {
		return this.structureModelHolder;
	}
}
