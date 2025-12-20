import { Players, ReplicatedStorage, Workspace } from "@rbxts/services";
import { Events } from "client/network";
import { STRUCTURES } from "shared/constants/structures";
import { TUTORIAL, TutorialStep } from "shared/constants/tutorial";

export default class TutorialService {
	//#region Singleton
	private static _inst: TutorialService;
	public static getInst(): TutorialService {
		this._inst = this._inst ?? new TutorialService();
		return this._inst;
	}
	//#endregion

	private readonly structuresModels: Model[] = [];
	private readonly highlights: Highlight[] = [];
	private readonly beams: Beam[] = [];
	private tutorialStep!: number;

	private constructor() {
		this.initEvents();
	}

	private initEvents(): void {
		Events.OnPlotReset.connect((player) => {
			if (player !== Players.LocalPlayer) return;
			this.tutorialStep = 0;
			this.resetTutorialStep();
		});
		Events.OnTutorialStepUpdate.connect((newTutorialStep) => {
			this.tutorialStep = newTutorialStep;
			this.resetTutorialStep();
			if (newTutorialStep === TUTORIAL.size()) return;
			this.initTutorialStep(TUTORIAL[newTutorialStep]);
		});
	}

	private initTutorialStep(tutorialStep: TutorialStep): void {
		const plot = Workspace.WaitForChild("Plots")
			.GetChildren()
			.find((plot): plot is Model => plot.GetAttribute("UserId") === Players.LocalPlayer.UserId)!;
		if (tutorialStep.type === "Build") {
			for (const structureData of tutorialStep.structuresData) {
				const newStructureModel = STRUCTURES[structureData.name].model.Clone();
				for (const instance of newStructureModel
					.GetDescendants()
					.filter((instance): instance is BasePart => instance.IsA("BasePart"))) {
					instance.Transparency = instance.Transparency !== 1 ? 0.6 : instance.Transparency;
					instance.CanCollide = false;
					instance.CanQuery = false;
				}
				newStructureModel.PivotTo(plot.GetPivot().mul(structureData.cf));
				newStructureModel.Parent = Workspace;
				this.structuresModels.push(newStructureModel);
			}
		} else if (tutorialStep.type === "Delete") {
			for (const structureData of tutorialStep.structuresData) {
				const newHighlight = ReplicatedStorage.WaitForChild("Tutorial")
					.WaitForChild("DeleteHighlight")
					.Clone() as Highlight;
				newHighlight.Parent = plot
					.WaitForChild("Structures")
					.GetDescendants()
					.find(
						(structureModel) =>
							structureModel.IsA("Model") &&
							structureModel.Name === structureData.name &&
							plot.GetPivot().ToObjectSpace(structureModel.GetPivot()).FuzzyEq(structureData.cf, 0.025),
					);
				this.highlights.push(newHighlight);
			}
		} else if (tutorialStep.type === "SetAttribute") {
			const newHighlight = ReplicatedStorage.WaitForChild("Tutorial")
				.WaitForChild("SetAttributeHighlight")
				.Clone() as Highlight;
			newHighlight.Parent = plot
				.WaitForChild("Structures")
				.GetDescendants()
				.find((structureModel) => structureModel.Name === tutorialStep.structureName);
			this.highlights.push(newHighlight);
		} else if (tutorialStep.type === "Connect" || tutorialStep.type === "Disconnect") {
			const startAttachment = plot
				.GetDescendants()
				.find(
					(instance): instance is Attachment =>
						instance.IsA("Attachment") &&
						instance.Name === "PowerAttachment" &&
						instance.FindFirstAncestorOfClass("Model")!.Name === tutorialStep.startStructureName,
				);
			const endAttachment = plot
				.GetDescendants()
				.find(
					(instance): instance is Attachment =>
						instance.IsA("Attachment") &&
						instance.Name === "PowerAttachment" &&
						instance.FindFirstAncestorOfClass("Model")!.Name === tutorialStep.endStructureName,
				);
			const newBeam = ReplicatedStorage.WaitForChild("Tutorial").WaitForChild("ConnectionBeam").Clone() as Beam;
			newBeam.Attachment0 = startAttachment;
			newBeam.Attachment1 = endAttachment;
			newBeam.TextureLength = startAttachment!.WorldPosition.sub(endAttachment!.WorldPosition).Magnitude * 0.7;
			newBeam.Parent = Workspace;
			this.beams.push(newBeam);
		}
	}

	private resetTutorialStep(): void {
		for (const instance of [...this.structuresModels, ...this.highlights, ...this.beams]) {
			instance.Destroy();
		}
	}

	public canPlace(model: Model): boolean {
		if (this.tutorialStep === TUTORIAL.size()) return true;
		const tutorialStep = TUTORIAL[this.tutorialStep];
		if (tutorialStep.type !== "Build") return false;
		const plot = Workspace.WaitForChild("Plots")
			.GetChildren()
			.find((plot): plot is Model => plot.GetAttribute("UserId") === Players.LocalPlayer.UserId)!;
		return tutorialStep.structuresData.every(
			(structureData) =>
				model
					.GetDescendants()
					.filter((instance): instance is Model => instance.IsA("Model") && instance.Name in STRUCTURES)
					.find(
						(structureModel) =>
							structureModel.Name === structureData.name &&
							plot.GetPivot().ToObjectSpace(structureModel.GetPivot()).FuzzyEq(structureData.cf, 0.025),
					) !== undefined,
		);
	}
}
