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

	private tutorialStep!: number;
	private readonly structuresModels: Model[] = [];
	private readonly highlights: Highlight[] = [];
	private readonly beams: Beam[] = [];

	private constructor() {
		this.initEvents();
	}

	private initEvents(): void {
		Events.OnTutorialStepUpdate.connect((newTutorialStep) => {
			this.tutorialStep = newTutorialStep;
			this.resetTutorialStepPreview();
			if (newTutorialStep === TUTORIAL.size()) return;
			this.initTutorialStepPreview(TUTORIAL[newTutorialStep]);
		});
	}

	private initTutorialStepPreview(tutorialStep: TutorialStep): void {
		const plot = Workspace.WaitForChild("Plots")
			.GetChildren()
			.find((plot): plot is Model => plot.GetAttribute("UserId") === Players.LocalPlayer.UserId)!;

		if (tutorialStep.type === "Build") {
			for (const structureData of tutorialStep.structuresData) {
				const newStructureModel = STRUCTURES[structureData.name].model.Clone();
				for (const instance of newStructureModel
					.GetDescendants()
					.filter(
						(instance): instance is BasePart =>
							instance.IsA("BasePart") && instance !== newStructureModel.PrimaryPart,
					)) {
					instance.Transparency = 0.6;
					instance.CanCollide = false;
				}
				newStructureModel.PivotTo(plot.GetPivot().mul(structureData.cf));
				newStructureModel.Parent = Workspace;
				this.structuresModels.push(newStructureModel);
			}
		} else if (tutorialStep.type === "Delete") {
			for (const structureData of tutorialStep.structuresData) {
				const newHighlight = new Instance("Highlight");
				newHighlight.FillTransparency = 0.7;
				newHighlight.FillColor = Color3.fromRGB(255, 60, 89);
				newHighlight.OutlineColor = Color3.fromRGB(255, 101, 104);
				newHighlight.Adornee = plot
					.WaitForChild("Structures")
					.GetChildren()
					.find(
						(structureModel) =>
							structureModel.Name === structureData.name &&
							plot
								.GetPivot()
								.ToObjectSpace((structureModel as Model).GetPivot())
								.FuzzyEq(structureData.cf, 0.025),
					);
				newHighlight.Parent = Workspace;
				this.highlights.push(newHighlight);
			}
		} else if (tutorialStep.type === "SetAttribute") {
			const newHighlight = new Instance("Highlight");
			newHighlight.FillTransparency = 0.7;
			newHighlight.FillColor = Color3.fromRGB(35, 126, 212);
			newHighlight.OutlineColor = Color3.fromRGB(70, 141, 255);
			newHighlight.Adornee = plot
				.WaitForChild("Structures")
				.GetChildren()
				.find((structureModel) => structureModel.Name === tutorialStep.structureName);
			newHighlight.Parent = Workspace;
			this.highlights.push(newHighlight);
		} else if (tutorialStep.type === "Connect" || tutorialStep.type === "Disconnect") {
			const startPowerAttachment = plot
				.GetDescendants()
				.find(
					(instance): instance is Attachment =>
						instance.IsA("Attachment") &&
						instance.Name === "PowerAttachment" &&
						instance.FindFirstAncestorOfClass("Model")!.Name === tutorialStep.startStructureName,
				);
			const endPowerAttachment = plot
				.GetDescendants()
				.find(
					(instance): instance is Attachment =>
						instance.IsA("Attachment") &&
						instance.Name === "PowerAttachment" &&
						instance.FindFirstAncestorOfClass("Model")!.Name === tutorialStep.endStructureName,
				);
			const newBeam = ReplicatedStorage.WaitForChild("TutorialBeam").Clone() as Beam;
			newBeam.Attachment0 = startPowerAttachment;
			newBeam.Attachment1 = endPowerAttachment;
			newBeam.TextureLength =
				startPowerAttachment!.WorldPosition.sub(endPowerAttachment!.WorldPosition).Magnitude * 0.65;
			newBeam.Parent = Workspace;
			this.beams.push(newBeam);
		}
	}

	private resetTutorialStepPreview(): void {
		for (const structureModel of this.structuresModels) {
			structureModel.Destroy();
		}
		for (const highlight of this.highlights) {
			highlight.Destroy();
		}
		for (const beam of this.beams) {
			beam.Destroy();
		}
	}

	public canPlace(structureModel: Model): boolean {
		if (this.tutorialStep === TUTORIAL.size()) return true;
		const tutorialStep = TUTORIAL[this.tutorialStep];
		if (tutorialStep.type !== "Build") return false;
		const plot = Workspace.WaitForChild("Plots")
			.GetChildren()
			.find((plot): plot is Model => plot.GetAttribute("UserId") === Players.LocalPlayer.UserId)!;
		return tutorialStep.structuresData.every(
			(structureData) =>
				structureModel
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
