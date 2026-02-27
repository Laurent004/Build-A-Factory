import { OnInit, Service } from "@flamework/core";
import { Players, Workspace } from "@rbxts/services";
import { TUTORIAL } from "shared/constants/tutorial/definitions";
import { Events } from "server/network";
import { Janitor } from "@rbxts/janitor";
import { TutorialStepDefinition } from "shared/constants/tutorial";
import { SaveService, SaveData } from "../data/save";

@Service()
export default class TutorialService implements OnInit {
	private readonly janitors = new Map<Player, Janitor>();
	private readonly tutorialSteps: {
		[K in TutorialStepDefinition["type"]]: (
			player: Player,
			plot: Model,
			tutorialStepDefinition: Extract<TutorialStepDefinition, { type: K }>,
		) => RBXScriptConnection;
	} = {
		Build: (player, plot, tutorialStepDefinition) =>
			plot.WaitForChild("Structures").ChildAdded.Connect(() => {
				if (
					tutorialStepDefinition.structuresData.some(
						(structureData) =>
							!(plot.WaitForChild("Structures").GetChildren() as Model[]).some(
								(structureModel) =>
									structureModel.Name === structureData.name &&
									(structureData.rotation !== undefined
										? plot
												.GetPivot()
												.ToObjectSpace(structureModel.GetPivot())
												.FuzzyEq(
													new CFrame(structureData.position).mul(structureData.rotation),
													0.01,
												)
										: plot
												.GetPivot()
												.ToObjectSpace(structureModel.GetPivot())
												.Position.FuzzyEq(structureData.position, 0.01)),
							),
					)
				)
					return;
				this.updateTutorialStep(player);
			}),
		Edit: (player, plot, tutorialStepDefinition) =>
			plot
				.WaitForChild("Structures")
				.GetChildren()
				.find(
					(structureModel): structureModel is Model =>
						structureModel.Name === tutorialStepDefinition.structureData.name,
				)!
				.PrimaryPart!.GetPropertyChangedSignal("CFrame")
				.Once(() => {
					this.updateTutorialStep(player);
				}),
		Delete: (player, plot, tutorialStepDefinition) =>
			plot.WaitForChild("Structures").ChildRemoved.Connect(() => {
				if (
					tutorialStepDefinition.structuresData.some((structureData) =>
						(plot.WaitForChild("Structures").GetChildren() as Model[]).some(
							(structureModel) =>
								structureModel.Name === structureData.name &&
								plot
									.GetPivot()
									.ToObjectSpace(structureModel.GetPivot())
									.Position.FuzzyEq(structureData.position, 0.01),
						),
					)
				)
					return;
				this.updateTutorialStep(player);
			}),
		SetAttribute: (player, plot, tutorialStepDefinition) =>
			plot
				.WaitForChild("Structures")
				.GetChildren()
				.find(
					(instance): instance is Model =>
						instance.IsA("Model") && instance.Name === tutorialStepDefinition.structureName,
				)!
				.AttributeChanged.Once(() => {
					this.updateTutorialStep(player);
				}),
		Connect: (player, plot) =>
			plot.WaitForChild("PowerLines").ChildAdded.Once(() => {
				this.updateTutorialStep(player);
			}),
		Delivery: (player) =>
			(player.WaitForChild("leaderstats").WaitForChild("Cash") as NumberValue).Changed.Once(() => {
				this.updateTutorialStep(player);
			}),
	};

	constructor(private readonly saveService: SaveService) {}

	onInit(): void | Promise<void> {
		this.initEvents();
	}

	private initEvents(): void {
		Players.PlayerAdded.Connect((player) => {
			this.janitors.set(player, new Janitor());
		});
		Players.PlayerRemoving.Connect((player) => {
			this.janitors.get(player)!.Destroy();
			this.janitors.delete(player);
		});
		this.saveService.OnSaveLoad.Connect((player, saveData) => {
			this.initTutorial(player, saveData);
		});
		this.saveService.OnSaveUnload.Connect((player) => {
			this.resetTutorial(player);
		});
	}

	private initTutorial(player: Player, saveData: SaveData): void {
		if (saveData.tutorialStep < TUTORIAL.size()) {
			this.initTutorialStep(player);
		}
		player.SetAttribute("TutorialStep", saveData.tutorialStep);
	}

	private resetTutorial(player: Player): void {
		this.janitors.get(player)?.Cleanup();
		player.SetAttribute("TutorialStep", TUTORIAL.size());
	}

	private initTutorialStep(player: Player): void {
		const tutorialStepDefinition = TUTORIAL[player.GetAttribute("TutorialStep") as number];
		this.janitors.get(player)!.Add(
			(
				this.tutorialSteps[tutorialStepDefinition.type] as (
					player: Player,
					plot: Model,
					tutorialStepDefinition: TutorialStepDefinition,
				) => RBXScriptConnection
			)(
				player,
				Workspace.WaitForChild("Plots")
					.GetChildren()
					.find((plot): plot is Model => plot.GetAttribute("UserId") === player.UserId)!,
				tutorialStepDefinition,
			),
		);
	}

	private updateTutorialStep(player: Player): void {
		this.janitors.get(player)!.Cleanup();
		const newTutorialStep = (player.GetAttribute("TutorialStep") as number)! + 1;
		this.saveService.set(player, "tutorialStep", newTutorialStep);
		if (newTutorialStep < TUTORIAL.size()) {
			this.initTutorialStep(player);
		} else {
			Events.OnNotification.fire(
				player,
				`<font color="rgb(255, 255, 255)">Congrats for completing the tutorial!</font>`,
				"sfx/success",
			);
		}
		player.SetAttribute("TutorialStep", newTutorialStep);
	}
}
