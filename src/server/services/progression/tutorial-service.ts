import { OnInit, OnStart, Service } from "@flamework/core";
import { Players, Workspace } from "@rbxts/services";
import DataService from "../data/data-service";
import { TUTORIAL } from "shared/constants/tutorial/definitions";
import { StructuresPlacementData } from "shared/constants/structures";
import { Events } from "server/network";
import { TutorialStep } from "shared/constants/tutorial";
import { EventBus } from "server/event-bus";

@Service({})
export default class TutorialService implements OnInit, OnStart {
	private readonly tutorialSteps = new Map<Player, number>();

	constructor(private readonly dataService: DataService) {}

	onInit(): void | Promise<void> {
		this.initEvents();
	}

	onStart(): void {
		this.startAutoSave();
	}

	private initEvents(): void {
		Players.PlayerAdded.Connect((player) => {
			this.initPlayerTutorialProgress(player);
		});

		Players.PlayerRemoving.Connect((player) => {
			this.onPlayerRemoving(player);
		});
	}

	private initPlayerTutorialProgress(player: Player): void {
		this.dataService.get(player, "tutorialStep").then((tutorialStep) => {
			this.tutorialSteps.set(player, tutorialStep!);
			if (tutorialStep! < TUTORIAL.size()) {
				this.initTutorialStep(player, TUTORIAL[tutorialStep!]);
			}
			Events.OnTutorialStepUpdate.fire(player, tutorialStep!);
		});
	}

	private onPlayerRemoving(player: Player): void {
		this.save(player);
		this.tutorialSteps.delete(player);
	}

	private initTutorialStep(player: Player, tutorialStep: TutorialStep): void {
		const plot = Workspace.WaitForChild("Plots")
			.GetChildren()
			.find((plot): plot is Model => plot.GetAttribute("UserId") === player.UserId)!;
		if (tutorialStep.type === "Build") {
			plot.WaitForChild("Structures").ChildAdded.Once(() => {
				this.updateTutorialProgress(player);
			});
		} else if (tutorialStep.type === "Delete") {
			const connection = plot.WaitForChild("Structures").ChildRemoved.Connect(() => {
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
				this.updateTutorialProgress(player);
				connection.Disconnect();
			});
		} else if (tutorialStep.type === "SetAttribute") {
			for (const structureModel of plot.WaitForChild("Structures").GetChildren() as Model[]) {
				structureModel.AttributeChanged.Once(() => {
					this.updateTutorialProgress(player);
				});
			}
		} else if (tutorialStep.type === "Connect") {
			plot.WaitForChild("PowerLines").ChildAdded.Once(() => {
				this.updateTutorialProgress(player);
			});
		} else if (tutorialStep.type === "Disconnect") {
			plot.WaitForChild("PowerLines").ChildRemoved.Once(() => {
				this.updateTutorialProgress(player);
			});
		} else if (tutorialStep.type === "Milestone") {
			const connection = EventBus.ProgressionEvents.OnMilestoneUnlock.Connect((player_, milestone) => {
				if (player_ !== player || milestone !== tutorialStep.milestone) return;
				this.updateTutorialProgress(player);
				connection?.Disconnect();
			});
		}
	}

	private updateTutorialProgress(player: Player): void {
		const newTutorialStep = this.tutorialSteps.get(player)! + 1;
		this.tutorialSteps.set(player, newTutorialStep);
		if (newTutorialStep < TUTORIAL.size()) {
			this.initTutorialStep(player, TUTORIAL[newTutorialStep]);
		}
		Events.OnTutorialStepUpdate.fire(player, newTutorialStep);
	}

	private startAutoSave(): void {
		task.spawn(() => {
			while (task.wait(60)) {
				for (const player of Players.GetPlayers()) {
					this.save(player);
				}
			}
		});
	}

	private save(player: Player): void {
		this.dataService.set(player, "tutorialStep", this.tutorialSteps.get(player)!);
	}

	public canPlace(player: Player, structuresPlacementData: StructuresPlacementData[]): boolean {
		if (this.tutorialSteps.get(player) === TUTORIAL.size()) return true;
		const tutorialStep = TUTORIAL[this.tutorialSteps.get(player)!];
		if (tutorialStep.type !== "Build") return false;
		const plot = Workspace.WaitForChild("Plots")
			.GetChildren()
			.find((plot): plot is Model => plot.GetAttribute("UserId") === player.UserId)!;
		return tutorialStep.structuresData.every(
			(structureData) =>
				structuresPlacementData.find(
					(structurePlacementData) =>
						structurePlacementData.structureName === structureData.name &&
						plot
							.GetPivot()
							.ToObjectSpace(structurePlacementData.targetCFs.get(structurePlacementData.structureName)!)
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
		if (tutorialStep === undefined) return true;
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
		if (tutorialStep === undefined || tutorialStep.type === "Milestone") return true;
		return (
			tutorialStep.type === "SetAttribute" &&
			structureModels.size() === 1 &&
			structureModels[0].Name === tutorialStep.structureName &&
			attributeName === tutorialStep.attributeName
		);
	}

	public canConnect(player: Player, startPowerAttachment: Attachment, endPowerAttachment: Attachment): boolean {
		if (this.tutorialSteps.get(player) === TUTORIAL.size()) return true;
		const tutorialStep = TUTORIAL[this.tutorialSteps.get(player)!];
		const startStructureModel = startPowerAttachment.FindFirstAncestorOfClass("Model")!;
		const endStructureModel = endPowerAttachment.FindFirstAncestorOfClass("Model")!;
		return (
			tutorialStep.type === "Connect" &&
			((startStructureModel.Name === tutorialStep.startStructureName &&
				endStructureModel.Name === tutorialStep.endStructureName) ||
				(startStructureModel.Name === tutorialStep.endStructureName &&
					endStructureModel.Name === tutorialStep.startStructureName))
		);
	}

	public canDisconnect(player: Player, startPowerAttachment: Attachment, endPowerAttachment: Attachment): boolean {
		if (this.tutorialSteps.get(player) === TUTORIAL.size()) return true;
		const tutorialStep = TUTORIAL[this.tutorialSteps.get(player)!];
		const startStructureModel = startPowerAttachment.FindFirstAncestorOfClass("Model")!;
		const endStructureModel = endPowerAttachment.FindFirstAncestorOfClass("Model")!;
		return (
			tutorialStep.type === "Disconnect" &&
			((startStructureModel.Name === tutorialStep.startStructureName &&
				endStructureModel.Name === tutorialStep.endStructureName) ||
				(startStructureModel.Name === tutorialStep.endStructureName &&
					endStructureModel.Name === tutorialStep.startStructureName))
		);
	}
}
