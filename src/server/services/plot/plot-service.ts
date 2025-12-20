import { MarketplaceService, Players, Workspace } from "@rbxts/services";
import { getStructureData, StructureData, STRUCTURES } from "shared/constants/structures";
import { OnInit, Service } from "@flamework/core";
import DataService from "../data/data-service";
import { Events } from "server/network";
import GridService from "./grid-service";
import { EventBus } from "server/event-bus";
import { Array } from "@rbxts/luau-polyfill";
import PowerService from "./power-service";
import CashService from "../progression/cash-service";
import TutorialService from "../progression/tutorial-service";
import FactoryService from "./factory-service";

@Service()
export default class PlotService implements OnInit {
	constructor(
		private readonly dataService: DataService,
		private readonly gridService: GridService,
		private readonly powerService: PowerService,
		private readonly tutorialService: TutorialService,
		private readonly cashService: CashService,
		private readonly factoryService: FactoryService,
	) {}

	onInit(): void | Promise<void> {
		this.initEvents();
	}

	private initEvents(): void {
		EventBus.GameEvents.OnGameLoad.Connect((player) => {
			this.initPlot(player);
			this.startAutoSaving(player);
		});

		EventBus.GameEvents.OnGameUnload.Connect((player) => {
			this.resetPlot(player);
		});

		Events.PlaceStructures.connect((player, structures, powerLines) => {
			if (!this.gridService.canPlace(player, structures) || !this.tutorialService.canPlace(player, structures))
				return;
			const overlapParams = new OverlapParams();
			overlapParams.FilterType = Enum.RaycastFilterType.Include;
			overlapParams.AddToFilter(player.Character!);
			let value: number = 0;
			for (const structure of structures) {
				const queue: StructureData[] = [structure];
				while (queue.size() > 0) {
					const structureData = queue.shift()!;
					if (
						(STRUCTURES[structureData.name].nodes.cells.size() > 0 &&
							Workspace.GetPartBoundsInBox(
								new CFrame(...structureData.cf).mul(
									STRUCTURES[structureData.name].model.PrimaryPart!.PivotOffset.Inverse(),
								),
								STRUCTURES[structureData.name].model.PrimaryPart!.Size,
								overlapParams,
							).size() > 0) ||
						(STRUCTURES[structureData.name].gamepass !== undefined &&
							!MarketplaceService.UserOwnsGamePassAsync(
								player.UserId,
								STRUCTURES[structureData.name].gamepass!,
							))
					)
						return;
					value += STRUCTURES[structureData.name].cost;
					if (value > this.cashService.getCash(player)) return;
					for (const childStructureData of structureData.children as StructureData[]) {
						queue.push(childStructureData);
					}
				}
			}
			this.cashService.addCash(player, -value);

			const structuresModels: Model[] = [];
			for (const structure of structures) {
				const newStructureModel = this.factoryService.createStructure(
					structure,
					undefined,
					Workspace.WaitForChild("Plots")
						.GetChildren()
						.find((plot): plot is Model => plot.GetAttribute("UserId") === player.UserId)!
						.WaitForChild("Structures"),
				);
				for (const structureModel of [newStructureModel, ...newStructureModel.GetDescendants()].filter(
					(instance): instance is Model => instance.IsA("Model") && instance.Name in STRUCTURES,
				)) {
					structuresModels.push(structureModel);
				}
			}
			this.gridService.initStructuresCells(player, structuresModels);

			const attachments = Array.flatMap(structuresModels, (structureModel) =>
				structureModel
					.GetDescendants()
					.filter(
						(instance): instance is Attachment =>
							instance.IsA("Attachment") && instance.Name === "PowerAttachment",
					),
			);
			for (const powerLine of powerLines) {
				this.powerService.attemptConnect(
					player,
					attachments.find((attachment) =>
						new CFrame(...powerLine.startAttachmentCF).FuzzyEq(attachment.WorldCFrame),
					)!,
					attachments.find((attachment) =>
						new CFrame(...powerLine.endAttachmentCF).FuzzyEq(attachment.WorldCFrame),
					)!,
				);
			}
			Events.OnStructuresPlacement.broadcast(player, structuresModels);
			EventBus.PlotEvents.OnStructuresPlacement.Fire(player, structuresModels);
		});

		Events.StartStructuresMovement.connect((player, structuresModels) => {
			this.gridService.clearStructuresCells(structuresModels);
			Events.OnStructuresMovementStart.broadcast(player, structuresModels);
		});

		Events.MoveStructures.connect((player, structuresMovementData) => {
			if (
				!this.gridService.canPlace(
					player,
					structuresMovementData.map((structureMovementData) => {
						return {
							...getStructureData(structureMovementData.model),
							cf: structureMovementData.cf.GetComponents(),
						};
					}),
				) ||
				!this.tutorialService.canMove(player)
			)
				return;
			const overlapParams = new OverlapParams();
			overlapParams.FilterType = Enum.RaycastFilterType.Include;
			overlapParams.AddToFilter(player.Character!);
			if (
				structuresMovementData.some(
					(structureMovementData) =>
						Workspace.GetPartBoundsInBox(
							structureMovementData.cf.mul(
								structureMovementData.model.PrimaryPart!.PivotOffset.Inverse(),
							),
							structureMovementData.model.PrimaryPart!.Size,
							overlapParams,
						).size() > 0,
				)
			)
				return;

			const structuresModels: Model[] = [];
			for (const structureMovementData of structuresMovementData) {
				structureMovementData.model.PivotTo(structureMovementData.cf);
				structuresModels.push(structureMovementData.model);
			}
			this.gridService.initStructuresCells(player, structuresModels);
			Events.OnStructuresMovement.broadcast(player, structuresModels);
			EventBus.PlotEvents.OnStructuresMovement.Fire(player, structuresModels);
		});

		Events.CancelStructuresMovement.connect((player, structuresModels) => {
			this.gridService.initStructuresCells(player, structuresModels);
			Events.OnStructuresMovement.broadcast(player, structuresModels);
			EventBus.PlotEvents.OnStructuresMovement.Fire(player, structuresModels);
		});

		Events.DestroyStructures.connect((player, structuresModels) => {
			if (!this.tutorialService.canDelete(player, structuresModels)) return;
			this.gridService.clearStructuresCells(structuresModels);
			for (const powerLine of Workspace.WaitForChild("Plots")
				.GetChildren()
				.find((plot): plot is Model => plot.GetAttribute("UserId") === player.UserId)!
				.WaitForChild("Power Lines")
				.GetChildren() as RopeConstraint[]) {
				if (
					structuresModels.includes(powerLine.Attachment0!.FindFirstAncestorOfClass("Model")!) ||
					structuresModels.includes(powerLine.Attachment1!.FindFirstAncestorOfClass("Model")!)
				) {
					this.powerService.attemptDisconnect(player, powerLine.Attachment0!, powerLine.Attachment1!);
				}
			}
			Events.OnStructuresDestroying.broadcast(player, structuresModels);
			for (const structureModel of structuresModels) {
				this.cashService.addCash(player, STRUCTURES[structureModel.Name].cost);
				structureModel.Destroy();
			}
		});

		Events.ClearStructuresItems.connect((player, structuresModels) => {
			Events.OnStructuresItemsClear.broadcast(player, structuresModels);
		});

		Events.SetStructuresAttribute.connect((player, structuresModels, attributeName, attributeValue) => {
			if (!this.tutorialService.canSetAttribute(player, structuresModels, attributeName)) return;
			for (const structureModel of structuresModels) {
				structureModel.SetAttribute(attributeName, attributeValue);
			}
		});

		Events.CreatePowerLine.connect((player, startAttachment, endAttachment) => {
			if (!this.tutorialService.canConnect(player, startAttachment, endAttachment)) return;
			this.powerService.attemptConnect(player, startAttachment, endAttachment);
		});

		Events.DestroyPowerLine.connect((player, startAttachment, endAttachment) => {
			if (!this.tutorialService.canDisconnect(player, startAttachment, endAttachment)) return;
			this.powerService.attemptDisconnect(player, startAttachment, endAttachment);
		});
	}

	private initPlot(player: Player): void {
		const plot = Workspace.WaitForChild("Plots")
			.GetChildren()
			.find((plot): plot is Model => plot.GetAttribute("UserId") === undefined)!;
		this.dataService.get(player, "name").then((name) => {
			plot.Name = name;
		});
		plot.SetAttribute("UserId", player.UserId);
		player.RespawnLocation = plot.FindFirstChildOfClass("SpawnLocation");
		this.gridService.initGrid(player, plot);
		Promise.all([
			this.dataService.get(player, "structures").then((structures) => {
				for (const structure of structures!) {
					this.factoryService.createStructure(structure, plot.GetPivot(), plot.WaitForChild("Structures"));
				}
				this.gridService.initStructuresCells(
					player,
					plot
						.WaitForChild("Structures")
						.GetDescendants()
						.filter((instance): instance is Model => instance.IsA("Model") && instance.Name in STRUCTURES),
				);
			}),
			this.dataService.get(player, "powerLines").then((powerLinse) => {
				const attachments: Attachment[] = plot
					.WaitForChild("Structures")
					.GetDescendants()
					.filter(
						(instance): instance is Attachment =>
							instance.IsA("Attachment") && instance.Name === "PowerAttachment",
					);
				for (const powerLine of powerLinse) {
					this.powerService.attemptConnect(
						player,
						attachments.find((attachment) =>
							attachment.WorldCFrame.FuzzyEq(
								plot.PrimaryPart!.CFrame.mul(new CFrame(...powerLine.startAttachmentCF)),
							),
						)!,
						attachments.find((attachment) =>
							attachment.WorldCFrame.FuzzyEq(
								plot.PrimaryPart!.CFrame.mul(new CFrame(...powerLine.endAttachmentCF)),
							),
						)!,
					);
				}
			}),
		]).then(() => {
			Events.OnPlotInitialization.broadcast(player, plot);
			for (const otherPlayer of Players.GetPlayers().filter((player_) => player_ !== player)) {
				Events.OnPlotInitialization.fire(player, otherPlayer, plot);
			}
		});
	}

	private resetPlot(player: Player): void {
		this.save(player);
		const plot = Workspace.WaitForChild("Plots")
			.GetChildren()
			.find((plot): plot is Model => plot.GetAttribute("UserId") === player.UserId)!;
		plot.SetAttribute("UserId", undefined);
		for (const folder of plot.GetChildren().filter((instance): instance is Folder => instance.IsA("Folder"))) {
			for (const instance of folder.GetChildren()) {
				instance.Destroy();
			}
		}
		Events.OnPlotReset.broadcast(player);
		EventBus.PlotEvents.OnPlotReset.Fire(player);
	}

	private startAutoSaving(player: Player): void {
		task.spawn(() => {
			while (task.wait(120)) {
				this.save(player);
			}
		});
	}

	private save(player: Player): void {
		this.dataService.set(
			player,
			"structures",
			(
				Workspace.WaitForChild("Plots")
					.GetChildren()
					.find((plot): plot is Model => plot.GetAttribute("UserId") === player.UserId)!
					.WaitForChild("Structures")
					.GetChildren() as Model[]
			).map((structureModel) =>
				getStructureData(structureModel, structureModel.FindFirstAncestorOfClass("Model")!.GetPivot()),
			),
		);
		this.dataService.set(player, "powerLines", this.powerService.getPowerLinesData(player));
	}
}
