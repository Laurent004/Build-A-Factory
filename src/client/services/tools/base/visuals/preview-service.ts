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

	public initStructurePlacementPreview(structureModel: Model) {
		const powerAttachments: Attachment[] = [];
		for (const model of [structureModel, ...structureModel.GetChildren()].filter(
			(instance): instance is Model => instance.IsA("Model") && instance.Name in STRUCTURES,
		)) {
			const newStructureModel = model.Clone();
			for (const highlight of newStructureModel
				.GetChildren()
				.filter((instance): instance is Highlight => instance.IsA("Highlight"))) {
				highlight.Destroy();
			}

			for (const structureModel of [
				newStructureModel,
				...newStructureModel
					.GetChildren()
					.filter((instance): instance is Model => instance.IsA("Model") && instance.Name in STRUCTURES),
			]) {
				for (const tag of structureModel.GetTags()) {
					structureModel.RemoveTag(tag);
				}
			}

			newStructureModel.Parent = this.structureModelHolder;
			this.structureModelHolder.PrimaryPart = newStructureModel.PrimaryPart;

			for (const powerAttachment of newStructureModel
				.GetDescendants()
				.filter(
					(instance): instance is Attachment =>
						instance.IsA("Attachment") && instance.Name === "PowerAttachment",
				)) {
				powerAttachments.push(powerAttachment);
			}
		}

		const powerLines: RopeConstraint[] = structureModel
			.GetChildren()
			.filter((instance): instance is RopeConstraint => instance.IsA("RopeConstraint"));
		if (powerLines.size() === 0) {
			for (const powerLine of Workspace.WaitForChild("Plots")
				.GetChildren()
				.find((plot): plot is Model => plot.GetAttribute("UserId") === Players.LocalPlayer.UserId)!
				.WaitForChild("PowerLines")
				.GetChildren() as RopeConstraint[]) {
				const startPowerAttachment = powerAttachments.find((powerAttachment) =>
					powerLine.Attachment0!.WorldCFrame.FuzzyEq(powerAttachment.WorldCFrame),
				);
				const endPowerAttachment = powerAttachments.find((powerAttachment) =>
					powerLine.Attachment1!.WorldCFrame.FuzzyEq(powerAttachment.WorldCFrame),
				);
				if (startPowerAttachment === undefined || endPowerAttachment === undefined) continue;

				const newPowerLine = powerLine.Clone();
				newPowerLine.Attachment0 = startPowerAttachment;
				newPowerLine.Attachment1 = endPowerAttachment;
				newPowerLine.Parent = this.structureModelHolder;
			}
		} else {
			for (const powerLine of powerLines) {
				const newPowerLine = powerLine.Clone();
				newPowerLine.Attachment0 = powerAttachments.find((powerAttachment) =>
					powerLine.Attachment0!.WorldCFrame.FuzzyEq(powerAttachment.WorldCFrame),
				);
				newPowerLine.Attachment1 = powerAttachments.find((powerAttachment) =>
					powerLine.Attachment1!.WorldCFrame.FuzzyEq(powerAttachment.WorldCFrame),
				);
				newPowerLine.Parent = this.structureModelHolder;
			}
		}

		this.baseStructureHighlightService.initStructureHighlight(this.structureModelHolder);
		this.baseStructureArrowService.initStructureArrows(this.structureModelHolder);
		this.baseStructureBeamService.initStructureBeams(this.structureModelHolder);
	}

	public initStructureEditPreview(structureModel: Model) {
		for (const model of structureModel
			.GetChildren()
			.filter((instance): instance is Model => instance.IsA("Model") && instance.Name in STRUCTURES)) {
			model.Parent = this.structureModelHolder;
			this.structureModelHolder.PrimaryPart = model.PrimaryPart;
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
