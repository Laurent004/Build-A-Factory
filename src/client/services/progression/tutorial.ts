import { Janitor } from "@rbxts/janitor";
import { Players, ReplicatedStorage, TweenService, Workspace } from "@rbxts/services";
import { createStructure } from "shared/constants/structures";
import { TUTORIAL, TutorialStepDefinition } from "shared/constants/tutorial";

export default class TutorialService {
	//#region Singleton
	private static _inst: TutorialService;
	public static getInst(): TutorialService {
		this._inst = this._inst ?? new TutorialService();
		return this._inst;
	}
	//#endregion

	private readonly tutorialSteps: Partial<{
		[K in TutorialStepDefinition["type"]]: (
			plot: Model,
			tutorialStepDefinition: Extract<TutorialStepDefinition, { type: K }>,
		) => Instance[];
	}> = {
		Build: (plot, tutorialStepDefinition) => {
			return tutorialStepDefinition.structuresData.map((structureData) => {
				const newStructureModel = createStructure(
					{
						name: structureData.name,
						cf: new CFrame(structureData.position)
							.mul(structureData.rotation ?? CFrame.identity)
							.GetComponents(),
						attributes: new Map<string, AttributeValue>(),
						children: [],
					},
					plot.GetPivot(),
					false,
					Workspace,
				);
				for (const basePart of newStructureModel
					.GetDescendants()
					.filter((instance): instance is BasePart => instance.IsA("BasePart"))) {
					basePart.Transparency = basePart === newStructureModel.PrimaryPart ? basePart.Transparency : 0.7;
					basePart.CanCollide = false;
					basePart.CanQuery = false;
				}
				return newStructureModel;
			});
		},
		Edit: (plot, tutorialStepDefinition) => {
			const newStructureModel = createStructure(
				{
					name: tutorialStepDefinition.structureData.name,
					cf: new CFrame(tutorialStepDefinition.structureData.position)
						.mul(tutorialStepDefinition.structureData.rotation ?? CFrame.identity)
						.GetComponents(),
					attributes: new Map<string, AttributeValue>(),
					children: [],
				},
				plot.GetPivot(),
				false,
				Workspace,
			);
			for (const basePart of newStructureModel
				.GetDescendants()
				.filter((instance): instance is BasePart => instance.IsA("BasePart"))) {
				basePart.Transparency = basePart === newStructureModel.PrimaryPart ? basePart.Transparency : 0.7;
				basePart.CanCollide = false;
				basePart.CanQuery = false;
			}
			return [newStructureModel];
		},
		Delete: (plot, tutorialStepDefinition) => {
			return tutorialStepDefinition.structuresData.map((structureData) => {
				const structureModel = plot
					.WaitForChild("Structures")
					.GetChildren()
					.find(
						(instance): instance is Model =>
							instance.IsA("Model") &&
							instance.Name === structureData.name &&
							plot
								.GetPivot()
								.ToObjectSpace(instance.GetPivot())
								.Position.FuzzyEq(structureData.position, 0.01),
					);
				const highlight = new Instance("Highlight");
				highlight.FillColor = Color3.fromRGB(255, 60, 89);
				highlight.OutlineColor = Color3.fromRGB(255, 101, 104);
				highlight.Adornee = structureModel;
				highlight.Parent = Workspace;
				TweenService.Create(
					highlight,
					new TweenInfo(1.5, Enum.EasingStyle.Linear, Enum.EasingDirection.In, -1, true, 0.4),
					{ FillTransparency: 1 },
				).Play();
				return highlight;
			});
		},
		SetAttribute: (plot, tutorialStepDefinition) => {
			const highlight = new Instance("Highlight");
			highlight.FillColor = Color3.fromRGB(35, 126, 212);
			highlight.FillTransparency = 0.5;
			highlight.OutlineColor = Color3.fromRGB(70, 141, 255);
			highlight.Adornee = plot.WaitForChild("Structures").WaitForChild(tutorialStepDefinition.structureName);
			highlight.Parent = Workspace;
			TweenService.Create(
				highlight,
				new TweenInfo(1.5, Enum.EasingStyle.Linear, Enum.EasingDirection.In, -1, true, 0.4),
				{ FillTransparency: 1 },
			).Play();
			return [highlight];
		},
		Connect: (plot, tutorialStepDefinition) => {
			const instances: Instance[] = [];
			const startStructureModel = plot
				.WaitForChild("Structures")
				.WaitForChild(tutorialStepDefinition.structuresNames[0]);
			const endStructureModel = plot
				.WaitForChild("Structures")
				.WaitForChild(tutorialStepDefinition.structuresNames[1]);
			for (const structureModel of [startStructureModel, endStructureModel]) {
				const highlight = new Instance("Highlight");
				highlight.FillColor = Color3.fromRGB(170, 170, 170);
				highlight.Adornee = structureModel;
				highlight.Parent = Workspace;
				TweenService.Create(
					highlight,
					new TweenInfo(1.5, Enum.EasingStyle.Linear, Enum.EasingDirection.In, -1, true, 0.4),
					{ FillTransparency: 1 },
				).Play();
				instances.push(highlight);
			}

			const beam = ReplicatedStorage.WaitForChild("Beam").Clone() as Beam;
			beam.Color = new ColorSequence([
				new ColorSequenceKeypoint(0, Color3.fromRGB(255, 255, 255)),
				new ColorSequenceKeypoint(1, Color3.fromRGB(255, 255, 255)),
			]);
			beam.Parent = Workspace;
			instances.push(beam);
			beam.Attachment0 = startStructureModel
				.GetDescendants()
				.find(
					(instance): instance is Attachment =>
						instance.IsA("Attachment") && instance.Name === "PowerAttachment",
				);
			if (beam.Attachment0 === undefined) {
				const connection = startStructureModel.DescendantAdded.Connect((descendant) => {
					if (!descendant.IsA("Attachment") || descendant.Name !== "PowerAttachment") return;
					beam.Attachment0 = descendant;

					connection.Disconnect();
				});
			}
			beam.Attachment1 = endStructureModel
				.GetDescendants()
				.find(
					(instance): instance is Attachment =>
						instance.IsA("Attachment") && instance.Name === "PowerAttachment",
				);
			if (beam.Attachment1 === undefined) {
				const connection = endStructureModel.DescendantAdded.Connect((descendant) => {
					if (!descendant.IsA("Attachment") || descendant.Name !== "PowerAttachment") return;
					beam.Attachment1 = descendant;
					connection.Disconnect();
				});
			}

			return instances;
		},
	};
	private readonly janitor = new Janitor();

	private constructor() {
		this.initEvents();
	}

	private initEvents(): void {
		Players.LocalPlayer.GetAttributeChangedSignal("TutorialStep").Connect(() => {
			this.resetTutorialStep();
			if ((Players.LocalPlayer.GetAttribute("TutorialStep") as number) < TUTORIAL.size()) {
				this.initTutorialStep();
			}
		});
	}

	private initTutorialStep(): void {
		const tutorialStepDefinition = TUTORIAL[Players.LocalPlayer.GetAttribute("TutorialStep") as number];
		for (const instance of (
			this.tutorialSteps[tutorialStepDefinition.type] as (
				plot: Model,
				tutorialStepDefinition: TutorialStepDefinition,
			) => Instance[]
		)(
			Workspace.WaitForChild("Plots")
				.GetChildren()
				.find((plot): plot is Model => plot.GetAttribute("UserId") === Players.LocalPlayer.UserId)!,
			tutorialStepDefinition,
		)) {
			this.janitor.Add(() => {
				instance.Destroy();
			});
		}
	}

	private resetTutorialStep(): void {
		this.janitor.Cleanup();
	}
}
