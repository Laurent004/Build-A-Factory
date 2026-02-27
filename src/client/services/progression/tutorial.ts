import { Players, ReplicatedStorage, TweenService, Workspace } from "@rbxts/services";
import { Events } from "client/network";
import { createStructure, STRUCTURES } from "shared/constants/structures";
import { TUTORIAL, TutorialStepDefinition } from "shared/constants/tutorial";

export default class TutorialService {
	//#region Singleton
	private static _inst: TutorialService;
	public static getInst(): TutorialService {
		this._inst = this._inst ?? new TutorialService();
		return this._inst;
	}
	//#endregion

	private tutorialStep: number = 0;
	private readonly structuresModels: Model[] = [];
	private readonly highlights: Highlight[] = [];
	private readonly beams: Beam[] = [];

	private constructor() {
		this.initEvents();
	}

	private initEvents(): void {
		Events.OnPlotReset.connect((player) => {
			if (player !== Players.LocalPlayer) return;
			this.resetTutorialStep();
			this.tutorialStep = 0;
		});
		Events.OnTutorialStepUpdate.connect((newTutorialStep) => {
			this.resetTutorialStep();
			this.tutorialStep = newTutorialStep;
			if (newTutorialStep < TUTORIAL.size()) {
				this.initTutorialStep(TUTORIAL[newTutorialStep]);
			}
		});
	}

	private initTutorialStep(tutorialStep: TutorialStepDefinition): void {
		const plot = Workspace.WaitForChild("Plots")
			.GetChildren()
			.find((plot): plot is Model => plot.GetAttribute("UserId") === Players.LocalPlayer.UserId)!;
		if (tutorialStep.type === "Build") {
			for (const structureData of tutorialStep.structuresData) {
				const newStructureModel = createStructure(
					{
						name: structureData.name,
						cf: structureData.cf.GetComponents(),
						attributes: new Map<string, AttributeValue>(),
						children: [],
					},
					plot.GetPivot(),
					false,
					Workspace,
				);
				for (const instance of newStructureModel
					.GetDescendants()
					.filter((instance): instance is BasePart => instance.IsA("BasePart"))) {
					instance.Transparency = instance !== newStructureModel.PrimaryPart ? 0.7 : instance.Transparency;
					instance.CanCollide = false;
					instance.CanQuery = false;
				}
				this.structuresModels.push(newStructureModel);
			}
		} else if (tutorialStep.type === "Delete") {
			for (const structureModel of tutorialStep.structuresData.map((structureData) =>
				plot
					.WaitForChild("Structures")
					.GetChildren()
					.find(
						(instance): instance is Model =>
							instance.IsA("Model") &&
							instance.Name === structureData.name &&
							plot.GetPivot().ToObjectSpace(instance.GetPivot()).FuzzyEq(structureData.cf, 0.01),
					),
			)) {
				const highlight = new Instance("Highlight");
				highlight.FillColor = Color3.fromRGB(255, 60, 89);
				highlight.FillTransparency = 0.5;
				highlight.OutlineColor = Color3.fromRGB(255, 101, 104);
				highlight.Adornee = structureModel;
				highlight.Parent = Workspace;
				TweenService.Create(
					highlight,
					new TweenInfo(1.5, Enum.EasingStyle.Linear, Enum.EasingDirection.In, -1, true, 0.4),
					{ FillTransparency: 1 },
				).Play();
				this.highlights.push(highlight);
			}
		} else if (tutorialStep.type === "SetAttribute") {
			const highlight = new Instance("Highlight");
			highlight.FillColor = Color3.fromRGB(35, 126, 212);
			highlight.FillTransparency = 0.5;
			highlight.OutlineColor = Color3.fromRGB(70, 141, 255);
			highlight.Adornee = plot.WaitForChild("Structures").WaitForChild(tutorialStep.structureName);
			highlight.Parent = Workspace;
			TweenService.Create(
				highlight,
				new TweenInfo(1.5, Enum.EasingStyle.Linear, Enum.EasingDirection.In, -1, true, 0.4),
				{ FillTransparency: 1 },
			).Play();
			this.highlights.push(highlight);
		} else if (tutorialStep.type === "Connect" || tutorialStep.type === "Disconnect") {
			const startStructureModel = plot.WaitForChild("Structures").WaitForChild(tutorialStep.startStructureName);
			const endStructureModel = plot.WaitForChild("Structures").WaitForChild(tutorialStep.endStructureName);
			for (const structureModel of [startStructureModel, endStructureModel]) {
				const highlight = new Instance("Highlight");
				highlight.FillColor = Color3.fromRGB(170, 170, 170);
				highlight.FillTransparency = 0.4;
				highlight.OutlineColor =
					tutorialStep.type === "Connect" ? Color3.fromRGB(255, 255, 255) : Color3.fromRGB(255, 69, 72);
				highlight.Adornee = structureModel;
				highlight.Parent = Workspace;
				TweenService.Create(
					highlight,
					new TweenInfo(1.5, Enum.EasingStyle.Linear, Enum.EasingDirection.In, -1, true, 0.4),
					{ FillTransparency: 1 },
				).Play();
				this.highlights.push(highlight);
			}

			if (tutorialStep.type === "Connect") {
				let startAttachment: Attachment | undefined;
				let endAttachement: Attachment | undefined;
				while (startAttachment === undefined || endAttachement === undefined) {
					startAttachment = startStructureModel
						.GetDescendants()
						.find(
							(instance): instance is Attachment =>
								instance.IsA("Attachment") && instance.Name === "PowerAttachment",
						);
					endAttachement = endStructureModel
						.GetDescendants()
						.find(
							(instance): instance is Attachment =>
								instance.IsA("Attachment") && instance.Name === "PowerAttachment",
						);
					task.wait();
				}

				const beam = ReplicatedStorage.WaitForChild("Beam").Clone() as Beam;
				beam.Color = new ColorSequence([
					new ColorSequenceKeypoint(0, Color3.fromRGB(255, 255, 255)),
					new ColorSequenceKeypoint(1, Color3.fromRGB(255, 255, 255)),
				]);
				beam.Attachment0 = startAttachment;
				beam.Attachment1 = endAttachement;
				beam.Parent = Workspace;
				this.beams.push(beam);
			}
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
		return tutorialStep.structuresData.every((structureData) =>
			model
				.GetChildren()
				.filter((instance): instance is Model => instance.IsA("Model") && instance.Name in STRUCTURES)
				.some(
					(structureModel) =>
						structureModel.Name === structureData.name &&
						plot.GetPivot().ToObjectSpace(structureModel.GetPivot()).FuzzyEq(structureData.cf, 0.01),
				),
		);
	}
}
