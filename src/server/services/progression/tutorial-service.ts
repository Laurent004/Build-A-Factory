import { OnInit, Service } from "@flamework/core";
import { Workspace } from "@rbxts/services";
import DataService from "../data/data-service";
import { TUTORIAL } from "shared/constants/tutorial/definitions";
import { Events } from "server/network";
import { TutorialStep } from "shared/constants/tutorial";
import { StructureData } from "shared/constants/structures";
import { EventBus } from "server/event-bus";

@Service({})
export default class TutorialService implements OnInit {
	private readonly tutorialSteps = new Map<Player, number>();
	private readonly connections = new Map<Player, RBXScriptConnection[]>();

	constructor(private readonly dataService: DataService) {}

	onInit(): void | Promise<void> {
		this.initEvents();
	}

	private initEvents(): void {
		EventBus.GameEvents.OnGameLoad.Connect((player) => {
			this.initTutorial(player);
		});
		EventBus.GameEvents.OnGameUnload.Connect((player) => {
			this.resetTutorial(player);
		});
	}

	private initTutorial(player: Player): void {
		this.dataService.get(player, "tutorialStep").then((tutorialStep) => {
			this.tutorialSteps.set(player, tutorialStep!);
			if (tutorialStep! < TUTORIAL.size()) {
				this.initTutorialStep(player, TUTORIAL[tutorialStep!]);
			}
			Events.OnTutorialStepUpdate.fire(player, tutorialStep);
		});
	}

	private resetTutorial(player: Player): void {
		this.tutorialSteps.delete(player);
		for (const connection of this.connections.get(player) ?? []) connection.Disconnect();
	}

	private initTutorialStep(player: Player, tutorialStep: TutorialStep): void {
		const plot = Workspace.WaitForChild("Plots")
			.GetChildren()
			.find((plot): plot is Model => plot.GetAttribute("UserId") === player.UserId)!;
		if (tutorialStep.type === "Build") {
			this.connections.set(player, [
				...(this.connections.get(player) ?? []),
				plot.WaitForChild("Structures").ChildAdded.Once(() => {
					this.updateTutorialStep(player);
				}),
			]);
		} else if (tutorialStep.type === "Delete") {
			this.connections.set(player, [
				...(this.connections.get(player) ?? []),
				plot.WaitForChild("Structures").ChildRemoved.Connect(() => {
					if (
						plot
							.WaitForChild("Structures")
							.GetChildren()
							.find(
								(structureModel) =>
									tutorialStep.structuresData.find(
										(structureData) =>
											structureData.name === structureModel.Name &&
											structureData.cf.FuzzyEq(
												plot.GetPivot().ToObjectSpace((structureModel as Model).GetPivot()),
												0.025,
											),
									) !== undefined,
							) !== undefined
					)
						return;
					this.updateTutorialStep(player);
				}),
			]);
		} else if (tutorialStep.type === "SetAttribute") {
			this.connections.set(player, [
				...(this.connections.get(player) ?? []),
				...(plot.WaitForChild("Structures").GetChildren() as Model[]).map((structureModel) =>
					structureModel.AttributeChanged.Once(() => {
						this.updateTutorialStep(player);
					}),
				),
			]);
		} else if (tutorialStep.type === "Connect") {
			this.connections.set(player, [
				...(this.connections.get(player) ?? []),
				plot.WaitForChild("Power Lines").ChildAdded.Once(() => {
					this.updateTutorialStep(player);
				}),
			]);
		} else if (tutorialStep.type === "Disconnect") {
			this.connections.set(player, [
				...(this.connections.get(player) ?? []),
				plot.WaitForChild("Power Lines").ChildRemoved.Once(() => {
					this.updateTutorialStep(player);
				}),
			]);
		}
	}

	private updateTutorialStep(player: Player): void {
		const newTutorialStep = this.tutorialSteps.get(player)! + 1;
		this.tutorialSteps.set(player, newTutorialStep);
		for (const connection of this.connections.get(player) ?? []) connection.Disconnect();
		this.dataService.set(player, "tutorialStep", newTutorialStep);
		if (newTutorialStep < TUTORIAL.size()) {
			this.initTutorialStep(player, TUTORIAL[newTutorialStep]);
		} else {
			Events.OnNotification.fire(
				player,
				`<font color="rgb(255, 255, 255)">Congrats for completing the tutorial!</font>`,
			);
		}
		Events.OnTutorialStepUpdate.fire(player, newTutorialStep);
	}

	public canPlace(player: Player, structuresData: StructureData[]): boolean {
		if (this.tutorialSteps.get(player) === TUTORIAL.size()) return true;
		const tutorialStep = TUTORIAL[this.tutorialSteps.get(player)!];
		if (tutorialStep.type !== "Build") return false;
		const plot = Workspace.WaitForChild("Plots")
			.GetChildren()
			.find((plot): plot is Model => plot.GetAttribute("UserId") === player.UserId)!;
		return tutorialStep.structuresData.every(
			(structureData) =>
				structuresData.find(
					(structureData_) =>
						structureData_.name === structureData.name &&
						plot
							.GetPivot()
							.ToObjectSpace(new CFrame(...structureData_.cf))
							.FuzzyEq(structureData.cf, 0.025),
				) !== undefined,
		);
	}

	public canMove(player: Player): boolean {
		return this.tutorialSteps.get(player) === TUTORIAL.size();
	}

	public canDelete(player: Player, structuresModels: Model[]): boolean {
		if (this.tutorialSteps.get(player) === TUTORIAL.size()) return true;
		const tutorialStep = TUTORIAL[this.tutorialSteps.get(player)!];
		if (tutorialStep.type !== "Delete") return false;
		const plot = Workspace.WaitForChild("Plots")
			.GetChildren()
			.find((plot): plot is Model => plot.GetAttribute("UserId") === player.UserId)!;
		return structuresModels.every(
			(structureModel) =>
				tutorialStep.structuresData.find(
					(structureData) =>
						structureData.name === structureModel.Name &&
						structureData.cf.FuzzyEq(plot.GetPivot().ToObjectSpace(structureModel.GetPivot()), 0.025),
				) !== undefined,
		);
	}

	public canSetAttribute(player: Player, structureModels: Model[], attributeName: string): boolean {
		if (this.tutorialSteps.get(player) === TUTORIAL.size()) return true;
		const tutorialStep = TUTORIAL[this.tutorialSteps.get(player)!];
		return (
			tutorialStep.type === "SetAttribute" &&
			structureModels[0].Name === tutorialStep.structureName &&
			attributeName === tutorialStep.attributeName
		);
	}

	public canConnect(player: Player, startAttachment: Attachment, endAttachment: Attachment): boolean {
		if (this.tutorialSteps.get(player) === TUTORIAL.size()) return true;
		const tutorialStep = TUTORIAL[this.tutorialSteps.get(player)!];
		const startStructureModel = startAttachment.FindFirstAncestorOfClass("Model")!;
		const endStructureModel = endAttachment.FindFirstAncestorOfClass("Model")!;
		return (
			tutorialStep.type === "Connect" &&
			((startStructureModel.Name === tutorialStep.startStructureName &&
				endStructureModel.Name === tutorialStep.endStructureName) ||
				(startStructureModel.Name === tutorialStep.endStructureName &&
					endStructureModel.Name === tutorialStep.startStructureName))
		);
	}

	public canDisconnect(player: Player, startAttachment: Attachment, endAttachment: Attachment): boolean {
		if (this.tutorialSteps.get(player) === TUTORIAL.size()) return true;
		const tutorialStep = TUTORIAL[this.tutorialSteps.get(player)!];
		const startStructureModel = startAttachment.FindFirstAncestorOfClass("Model")!;
		const endStructureModel = endAttachment.FindFirstAncestorOfClass("Model")!;
		return (
			tutorialStep.type === "Disconnect" &&
			((startStructureModel.Name === tutorialStep.startStructureName &&
				endStructureModel.Name === tutorialStep.endStructureName) ||
				(startStructureModel.Name === tutorialStep.endStructureName &&
					endStructureModel.Name === tutorialStep.startStructureName))
		);
	}
}
