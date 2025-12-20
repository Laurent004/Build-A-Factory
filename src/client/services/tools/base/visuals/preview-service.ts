import { Players, Workspace } from "@rbxts/services";
import BaseStructureArrowService from "./arrow-service";
import BaseStructureHighlightService from "./highlight-service";
import { STRUCTURES } from "shared/constants/structures";
import BaseStructureBeamService from "./beam-service";

export class BaseStructurePreviewService {
	//#region Singleton
	private static _inst: BaseStructurePreviewService;
	public static getInst(): BaseStructurePreviewService {
		return this._inst;
	}
	//#endregion

	private readonly structureModelHolder: Model = new Instance("Model", Workspace);

	private constructor(
		private readonly baseStructureHighlightService: BaseStructureHighlightService,
		private readonly baseStructureArrowService: BaseStructureArrowService,
		private readonly baseStructureBeamService: BaseStructureBeamService,
	) {}

	public static init(
		baseStructureHighlightService: BaseStructureHighlightService,
		baseStructureArrowService: BaseStructureArrowService,
		baseStructureBeamService: BaseStructureBeamService,
	) {
		if (this._inst !== undefined) return;
		this._inst = new BaseStructurePreviewService(
			baseStructureHighlightService,
			baseStructureArrowService,
			baseStructureBeamService,
		);
	}

	public initStructurePlacementPreview(model: Model) {
		for (const structureModel of [model, ...model.GetChildren()].filter(
			(instance): instance is Model => instance.IsA("Model") && instance.Name in STRUCTURES,
		)) {
			const newStructureModel = structureModel.Clone();
			for (const instance of [newStructureModel, ...newStructureModel.GetDescendants()]) {
				if (instance.IsA("Model") && instance.Name in STRUCTURES) {
					for (const tag of instance.GetTags()) {
						instance.RemoveTag(tag);
					}
				} else if (instance.IsA("BasePart")) {
					instance.CanCollide = false;
				} else if (instance.IsA("Highlight")) {
					instance.Destroy();
				}
			}
			newStructureModel.Parent = this.structureModelHolder;
			this.structureModelHolder.PrimaryPart = newStructureModel.PrimaryPart;
		}

		const attachments = this.structureModelHolder
			.GetDescendants()
			.filter(
				(instance): instance is Attachment => instance.IsA("Attachment") && instance.Name === "PowerAttachment",
			);
		const powerLines: RopeConstraint[] = model
			.GetChildren()
			.filter((instance): instance is RopeConstraint => instance.IsA("RopeConstraint"));
		if (powerLines.size() === 0) {
			for (const powerLine of Workspace.WaitForChild("Plots")
				.GetChildren()
				.find((plot): plot is Model => plot.GetAttribute("UserId") === Players.LocalPlayer.UserId)!
				.WaitForChild("Power Lines")
				.GetChildren() as RopeConstraint[]) {
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
		} else {
			for (const powerLine of powerLines) {
				const newPowerLine = powerLine.Clone();
				newPowerLine.Attachment0 = attachments.find((attachment) =>
					powerLine.Attachment0!.WorldCFrame.FuzzyEq(attachment.WorldCFrame),
				);
				newPowerLine.Attachment1 = attachments.find((attachment) =>
					powerLine.Attachment1!.WorldCFrame.FuzzyEq(attachment.WorldCFrame),
				);
				newPowerLine.Parent = this.structureModelHolder;
			}
		}

		this.baseStructureHighlightService.initStructureHighlight(this.structureModelHolder);
		this.baseStructureArrowService.initStructureArrows(this.structureModelHolder);
		this.baseStructureBeamService.initStructureBeams(this.structureModelHolder);
	}

	public initStructureEditPreview(model: Model) {
		for (const structureModel of model
			.GetChildren()
			.filter((instance): instance is Model => instance.IsA("Model") && instance.Name in STRUCTURES)) {
			structureModel.Parent = this.structureModelHolder;
			this.structureModelHolder.PrimaryPart = structureModel.PrimaryPart;
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

	public updateStructurePreview(currentCF: CFrame, canPlace: boolean) {
		this.structureModelHolder.PivotTo(currentCF);
		this.baseStructureHighlightService.updateStructureHighlight(canPlace);
		this.baseStructureArrowService.updateStructureArrows();
		this.baseStructureBeamService.updateStructureBeams();
	}

	public resetStructurePlacementPreview() {
		this.baseStructureHighlightService.resetStructureHighlight();
		this.baseStructureArrowService.resetStructureArrows();
		this.baseStructureBeamService.resetStructureBeams();

		for (const instance of this.structureModelHolder.GetChildren()) {
			instance.Destroy();
		}
	}

	public resetStructureEditPreview() {
		this.baseStructureHighlightService.resetStructureHighlight();
		this.baseStructureArrowService.resetStructureArrows();
		this.baseStructureBeamService.resetStructureBeams();

		for (const basePart of this.structureModelHolder
			.GetDescendants()
			.filter((instance): instance is BasePart => instance.IsA("BasePart"))) {
			const model = basePart.FindFirstAncestorOfClass("Model");
			if (model === undefined || !(model.Name in STRUCTURES) || basePart === model.PrimaryPart) continue;
			basePart.CanCollide = true;
		}
		const structuresFolder = Workspace.WaitForChild("Plots")
			.GetChildren()
			.find((plot) => plot.GetAttribute("UserId") === Players.LocalPlayer.UserId)
			?.WaitForChild("Structures");
		for (const structureModel of this.structureModelHolder.GetChildren()) {
			structureModel.Parent = structuresFolder;
		}
	}

	public getStructureModelHolder() {
		return this.structureModelHolder;
	}
}
