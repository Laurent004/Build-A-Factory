import { MarketplaceService, Players, Workspace } from "@rbxts/services";
import { getStructureData, getStructuresData, STRUCTURES } from "shared/constants/structures";
import { OnInit, Service } from "@flamework/core";
import DataService from "../data/data";
import { Events } from "server/network";
import GridService from "./grid";
import { EventBus } from "server/event-bus";
import { Array } from "@rbxts/luau-polyfill";
import PowerService from "./power";
import CashService from "../progression/cash";
import TutorialService from "../progression/tutorial";
import CollisionService from "shared/services/collision";
import FactoryService from "shared/services/factory";

@Service()
export default class PlotService implements OnInit {
	private readonly collisionService = CollisionService.getInst();
	private readonly factoryService = FactoryService.getInst();

	constructor(
		private readonly dataService: DataService,
		private readonly gridService: GridService,
		private readonly powerService: PowerService,
		private readonly tutorialService: TutorialService,
		private readonly cashService: CashService,
	) {}

	onInit(): void | Promise<void> {
		this.initEvents();
	}

	private initEvents(): void {
		Players.PlayerAdded.Connect((player) => {
			const plot = Workspace.WaitForChild("Plots")
				.GetChildren()
				.find((plot): plot is Model => plot.GetAttribute("UserId") === undefined)!;
			plot.SetAttribute("UserId", player.UserId);
			player.RespawnLocation = plot.FindFirstChildOfClass("SpawnLocation");
		});
		EventBus.OnGameLoad.Connect((player) => {
			this.initPlot(player);
			this.startAutoSaving(player);
		});
		EventBus.OnGameUnload.Connect((player) => {
			this.resetPlot(player);
		});
		Events.PurchaseExpansion.connect((player, expansion) => {
			if (
				this.cashService.getCash(player) <
				tonumber(
					expansion
						.GetDescendants()
						.find((instance) => instance.IsA("TextLabel"))!
						.Text.gsub("%D", "")[0],
				)!
			)
				return;
			this.cashService.addCash(
				player,
				-tonumber(
					expansion
						.GetDescendants()
						.find((instance) => instance.IsA("TextLabel"))!
						.Text.gsub("%D", "")[0],
				)!,
			);
			expansion.SetAttribute("Owned", true);
			this.gridService.updateGrid(player, expansion);
			this.dataService.get(player, "expansions").then((expansions) => {
				const position = Workspace.WaitForChild("Plots")
					.GetChildren()
					.find((plot): plot is Model => plot.GetAttribute("UserId") === player.UserId)!
					.GetPivot()
					.PointToObjectSpace(expansion.Position);
				this.dataService.set(player, "expansions", [...expansions, [position.X, position.Y, position.Z]]);
			});
			Events.OnExpansionPurchase.broadcast(player, expansion);
			Events.OnNotification.fire(
				player,
				`<font color="rgb(255, 255, 255)">Successfuly unlocked new expansion!</font>`,
				"sfx/success",
			);
		});
		Events.PlaceStructures.connect((player, structures, powerLines) => {
			const structuresData = getStructuresData(structures);
			if (
				!this.collisionService.canPlace(player, structuresData) ||
				!this.gridService.canPlace(player, structuresData) ||
				!this.tutorialService.canPlace(player, structuresData) ||
				this.cashService.getCash(player) <
					structuresData.reduce((value, structure) => (value += STRUCTURES[structure.name].cost), 0) ||
				structuresData.some(
					(structure) =>
						STRUCTURES[structure.name].gamepass !== undefined &&
						!MarketplaceService.UserOwnsGamePassAsync(player.UserId, STRUCTURES[structure.name].gamepass!),
				)
			)
				return;
			this.cashService.addCash(
				player,
				-structuresData.reduce((value, structure) => (value += STRUCTURES[structure.name].cost), 0),
			);

			const structuresModels: Model[] = [];
			for (const structure of structures) {
				const newStructureModel = this.factoryService.createStructure(
					structure,
					undefined,
					true,
					Workspace.WaitForChild("Plots")
						.GetChildren()
						.find((plot) => plot.GetAttribute("UserId") === player.UserId)!
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
			EventBus.OnStructuresPlacement.Fire(player, structuresModels);
		});

		Events.StartStructuresMovement.connect((player, structuresModels) => {
			this.gridService.clearStructuresCells(structuresModels);
			Events.OnStructuresMovementStart.broadcast(player, structuresModels);
		});

		Events.MoveStructures.connect((player, structures) => {
			const structuresData = getStructuresData(
				Array.flatMap(structures, (structure) => getStructureData(structure.model, undefined)),
			);
			if (
				!this.collisionService.canPlace(player, structuresData) ||
				!this.gridService.canPlace(player, structuresData) ||
				!this.tutorialService.canMove(player)
			)
				return;
			const structuresModels: Model[] = [];
			for (const structureMovementData of structures) {
				structureMovementData.model.PivotTo(structureMovementData.cf);
				structuresModels.push(structureMovementData.model);
			}
			this.gridService.initStructuresCells(player, structuresModels);
			Events.OnStructuresMovement.broadcast(player, structuresModels);
			EventBus.OnStructuresMovement.Fire(player, structuresModels);
		});

		Events.CancelStructuresMovement.connect((player, structuresModels) => {
			this.gridService.initStructuresCells(player, structuresModels);
			Events.OnStructuresMovement.broadcast(player, structuresModels);
			EventBus.OnStructuresMovement.Fire(player, structuresModels);
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
			.find((plot): plot is Model => plot.GetAttribute("UserId") === player.UserId)!;
		this.dataService.get(player, "name").then((name) => {
			plot.Name = name;
		});
		Promise.all([
			this.dataService.get(player, "expansions").then((expansions) => {
				this.gridService.initGrid(player, plot);
				for (const expansion of expansions.map(
					(position) =>
						(plot.WaitForChild("Expansions").GetChildren() as Part[]).find((expansion) =>
							new Vector3(expansion.Position.X, 0, expansion.Position.Z).FuzzyEq(
								new Vector3(
									plot.GetPivot().mul(new Vector3(...position)).X,
									0,
									plot.GetPivot().mul(new Vector3(...position)).Z,
								),
							),
						)!,
				)) {
					expansion.SetAttribute("Owned", true);
					this.gridService.updateGrid(player, expansion);
				}
			}),
			this.dataService.get(player, "structures").then((structures) => {
				for (const structure of structures!) {
					this.factoryService.createStructure(
						structure,
						plot.GetPivot(),
						true,
						plot.WaitForChild("Structures"),
					);
				}
				this.gridService.initStructuresCells(
					player,
					plot
						.WaitForChild("Structures")
						.GetDescendants()
						.filter((instance): instance is Model => instance.IsA("Model") && instance.Name in STRUCTURES),
				);
			}),
			this.dataService.get(player, "powerLines").then((powerLines) => {
				const attachments = plot
					.WaitForChild("Structures")
					.GetDescendants()
					.filter(
						(instance): instance is Attachment =>
							instance.IsA("Attachment") && instance.Name === "PowerAttachment",
					);
				for (const powerLine of powerLines) {
					this.powerService.connect(
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
				Events.OnPlotInitialization.fire(
					player,
					otherPlayer,
					Workspace.WaitForChild("Plots")
						.GetChildren()
						.find((plot): plot is Model => plot.GetAttribute("UserId") === otherPlayer.UserId)!,
				);
			}
		});
	}

	private resetPlot(player: Player): void {
		this.save(player);
		const plot = Workspace.WaitForChild("Plots")
			.GetChildren()
			.find((plot): plot is Model => plot.GetAttribute("UserId") === player.UserId)!;
		for (const structureModel of plot.WaitForChild("Structures").GetChildren()) {
			structureModel.Destroy();
		}
		for (const powerLine of plot.WaitForChild("Power Lines").GetChildren()) {
			powerLine.Destroy();
		}
		for (const expansion of plot.WaitForChild("Expansions").GetChildren()) {
			expansion.SetAttribute("Owned", false);
		}
		Events.OnPlotReset.broadcast(player);
		EventBus.OnPlotReset.Fire(player);
	}

	private startAutoSaving(player: Player): void {
		task.spawn(() => {
			while (task.wait(120)) {
				this.save(player);
			}
		});
	}

	private save(player: Player): void {
		const plot = Workspace.WaitForChild("Plots")
			.GetChildren()
			.find((plot): plot is Model => plot.GetAttribute("UserId") === player.UserId)!;
		this.dataService.set(
			player,
			"structures",
			(plot.WaitForChild("Structures").GetChildren() as Model[]).map((structureModel) =>
				getStructureData(structureModel, plot.GetPivot()),
			),
		);
		this.dataService.set(
			player,
			"powerLines",
			(plot.WaitForChild("Power Lines").GetChildren() as RopeConstraint[]).map((powerLine) => {
				return {
					startAttachmentCF: plot
						.GetPivot()
						.ToObjectSpace(powerLine.Attachment0!.WorldCFrame)
						.GetComponents(),
					endAttachmentCF: plot.GetPivot().ToObjectSpace(powerLine.Attachment1!.WorldCFrame).GetComponents(),
				};
			}),
		);
	}
}
