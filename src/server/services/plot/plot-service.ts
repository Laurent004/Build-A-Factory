import { MarketplaceService, Players, Workspace } from "@rbxts/services";
import { STRUCTURES } from "shared/constants/structures";
import { OnInit, Service } from "@flamework/core";
import DataService from "../data/data-service";
import { Events } from "server/network";
import GridService from "./grid-service";
import { EventBus } from "server/event-bus";
import { Object } from "@rbxts/luau-polyfill";
import PowerService from "./power-service";
import MilestoneService from "../progression/milestone-service";
import { MILESTONES } from "shared/constants/milestones";
import CashService from "../progression/cash-service";
import TutorialService from "../progression/tutorial-service";

@Service()
export default class PlotService implements OnInit {
	constructor(
		private readonly dataService: DataService,
		private readonly gridService: GridService,
		private readonly powerService: PowerService,

		private readonly tutorialService: TutorialService,
		private readonly milestoneService: MilestoneService,
		private readonly cashService: CashService,
	) {}

	onInit(): void | Promise<void> {
		this.initEvents();
		this.startAutoSave();
	}

	private initEvents(): void {
		Players.PlayerAdded.Connect((player) => {
			this.initPlot(player);
			for (const player_ of Players.GetPlayers()) {
				if (player_ === player) continue;
				Events.OnPlotInitialization.fire(
					player,
					player_,
					this.getPlot(player_)!,
					this.gridService.getGridData(player_)!,
				);
			}
		});

		Players.PlayerRemoving.Connect((player) => {
			this.resetPlot(player);
		});

		Events.PlaceStructures.connect((player, structuresPlacementData, powerLinesData) => {
			if (
				!this.tutorialService.canPlace(player, structuresPlacementData) ||
				!this.gridService.canPlace(player, structuresPlacementData)
			)
				return;

			const milestone = this.milestoneService.getMilestone(player)!;
			let totalValue: number = 0;
			for (const structurePlacementData of structuresPlacementData) {
				if (STRUCTURES[structurePlacementData.structureName] === undefined) return;
				totalValue += STRUCTURES[structurePlacementData.structureName].price;
				const isUnlocked =
					Object.entries(MILESTONES).find(([, milestoneDefinition]) =>
						milestoneDefinition.rewards.includes(structurePlacementData.structureName),
					) === undefined ||
					milestone >=
						Object.entries(MILESTONES).find(([, milestoneDefinition]) =>
							milestoneDefinition.rewards.includes(structurePlacementData.structureName),
						)![1].index;
				const isPurchased =
					STRUCTURES[structurePlacementData.structureName].gamepass === undefined ||
					MarketplaceService.UserOwnsGamePassAsync(
						player.UserId,
						STRUCTURES[structurePlacementData.structureName].gamepass!,
					) ||
					player.UserId === -1;
				if (!isUnlocked || !isPurchased) return;
			}
			if (!this.cashService.canAfford(player, totalValue)) return;

			const structuresModels: Model[] = [];
			const powerAttachments: Attachment[] = [];
			for (const structurePlacementData of structuresPlacementData) {
				const newStructureModel = this.createStructure(
					player,
					structurePlacementData.structureName,
					structurePlacementData.targetCFs,
					structurePlacementData.structureAttributes,
				);
				structuresModels.push(newStructureModel);
				for (const childStructureModel of newStructureModel
					.GetChildren()
					.filter((instance): instance is Model => instance.IsA("Model") && instance.Name in STRUCTURES)) {
					structuresModels.push(childStructureModel);
				}

				for (const powerAttachment of newStructureModel
					.GetDescendants()
					.filter(
						(instance): instance is Attachment =>
							instance.IsA("Attachment") && instance.Name === "PowerAttachment",
					)) {
					powerAttachments.push(powerAttachment);
				}
			}
			this.gridService.initStructuresCells(player, structuresModels);

			for (const powerLineData of powerLinesData) {
				const startPowerAttachment = powerAttachments.find((powerAttachment) =>
					new CFrame(...powerLineData.startPowerAttachmentCfComponents).FuzzyEq(powerAttachment.WorldCFrame),
				)!;
				const endPowerAttachment = powerAttachments.find((powerAttachment) =>
					new CFrame(...powerLineData.endPowerAttachmentCfComponents).FuzzyEq(powerAttachment.WorldCFrame),
				)!;

				this.createPowerLine(player, startPowerAttachment, endPowerAttachment);
				this.powerService.connect(startPowerAttachment, endPowerAttachment);
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
				!this.tutorialService.canMove(player) ||
				!this.gridService.canPlace(
					player,
					structuresMovementData.map((structureMovementData) => {
						return {
							structureName: structureMovementData.structureModel.Name,
							targetCFs: new Map<string, CFrame>([
								[structureMovementData.structureModel.Name, structureMovementData.targetCF],
							]),
							structureAttributes: structureMovementData.structureModel.GetAttributes(),
						};
					}),
				)
			)
				return;

			const structuresModels: Model[] = [];
			for (const structureMovementData of structuresMovementData) {
				structureMovementData.structureModel.PivotTo(structureMovementData.targetCF);
				structuresModels.push(structureMovementData.structureModel);
			}
			this.gridService.initStructuresCells(player, structuresModels);
			Events.OnStructuresMovement.broadcast(player, structuresModels);
			EventBus.PlotEvents.OnStructuresMovement.Fire(structuresModels);
		});

		Events.CancelStructuresMovement.connect((player, structuresModels) => {
			this.gridService.initStructuresCells(player, structuresModels);
			Events.OnStructuresMovement.broadcast(player, structuresModels);
			EventBus.PlotEvents.OnStructuresMovement.Fire(structuresModels);
		});

		Events.DestroyStructures.connect((player, structuresModels) => {
			if (!this.tutorialService.canDelete(player, structuresModels)) return;
			this.gridService.clearStructuresCells(structuresModels);

			for (const powerLine of this.getPlot(player)!
				.WaitForChild("PowerLines")
				.GetChildren() as RopeConstraint[]) {
				if (
					structuresModels.includes(powerLine.Attachment0!.FindFirstAncestorOfClass("Model")!) ||
					structuresModels.includes(powerLine.Attachment1!.FindFirstAncestorOfClass("Model")!)
				) {
					this.powerService.disconnect(powerLine.Attachment0!, powerLine.Attachment1!);
					Events.OnPowerLineDestroying.broadcast(powerLine.Attachment0!, powerLine.Attachment1!);
					powerLine.Destroy();
				}
			}

			Events.OnStructuresDestroying.broadcast(player, structuresModels);
			for (const structureModel of structuresModels) {
				structureModel.Destroy();
			}
		});

		Events.ClearStructuresItems.connect((_, structuresModels) => {
			Events.OnStructuresItemsClear.broadcast(structuresModels);
		});

		Events.SetStructuresAttribute.connect((player, structuresModels, attributeName, attributeValue) => {
			if (!this.tutorialService.canSetAttribute(player, structuresModels, attributeName)) return;
			for (const structureModel of structuresModels) {
				structureModel.SetAttribute(attributeName, attributeValue);
			}
		});

		Events.CreatePowerLine.connect((player, startPowerAttachment, endPowerAttachment) => {
			if (
				!this.tutorialService.canConnect(player, startPowerAttachment, endPowerAttachment) ||
				!this.powerService.canConnect(startPowerAttachment, endPowerAttachment)
			)
				return;
			this.createPowerLine(player, startPowerAttachment, endPowerAttachment);
			this.powerService.connect(startPowerAttachment, endPowerAttachment);
			Events.OnPowerLineCreation.broadcast(startPowerAttachment, endPowerAttachment);
		});

		Events.DestroyPowerLine.connect((player, startPowerAttachment, endPowerAttachment) => {
			if (!this.tutorialService.canDisconnect(player, startPowerAttachment, endPowerAttachment)) return;
			const powerLine = (this.getPlot(player)!.WaitForChild("PowerLines").GetChildren() as RopeConstraint[]).find(
				(powerLine) =>
					(powerLine.Attachment0 === startPowerAttachment && powerLine.Attachment1 === endPowerAttachment) ||
					(powerLine.Attachment1 === startPowerAttachment && powerLine.Attachment0 === endPowerAttachment),
			)!;
			this.powerService.disconnect(startPowerAttachment, endPowerAttachment);
			Events.OnPowerLineDestroying.broadcast(startPowerAttachment, endPowerAttachment);
			powerLine.Destroy();
		});
	}

	private initPlot(player: Player): void {
		const availablePlot = Workspace.WaitForChild("Plots")
			.GetChildren()
			.find((plot): plot is Model => plot.GetAttribute("UserId") === undefined);
		if (availablePlot === undefined) return;
		player.RespawnLocation = availablePlot.FindFirstChildOfClass("SpawnLocation");
		availablePlot.SetAttribute("UserId", player.UserId);

		this.gridService.initGrid(player, availablePlot.PrimaryPart!.Position);

		const powerAttachments: Attachment[] = [];
		const structuresPromise = this.dataService.get(player, "structuresData").then((structuresSaveData) => {
			for (const structureSaveData of structuresSaveData!) {
				const newStructureModel = this.createStructure(
					player,
					structureSaveData.name,
					new Map<string, CFrame>(
						Object.entries(structureSaveData.cfsComponents).map(([structureName, targetCF]) => {
							return [structureName, availablePlot.PrimaryPart!.CFrame.mul(new CFrame(...targetCF))];
						}),
					),
					structureSaveData.attributes,
				);
				this.gridService.initStructuresCells(player, [
					newStructureModel,
					...newStructureModel
						.GetChildren()
						.filter((instance): instance is Model => instance.IsA("Model") && instance.Name in STRUCTURES),
				]);

				for (const powerAttachment of newStructureModel
					.GetDescendants()
					.filter(
						(instance): instance is Attachment =>
							instance.IsA("Attachment") && instance.Name === "PowerAttachment",
					)) {
					powerAttachments.push(powerAttachment);
				}
			}
		});

		const powerLinesPromise = this.dataService.get(player, "powerLinesData").then((powerLinesSaveData) => {
			if (powerLinesSaveData === undefined) return;

			for (const powerLineSaveData of powerLinesSaveData) {
				const startPowerAttachment = powerAttachments.find((powerAttachment) =>
					powerAttachment.WorldCFrame.FuzzyEq(
						availablePlot.PrimaryPart!.CFrame.mul(
							new CFrame(...powerLineSaveData.startPowerAttachmentCfComponents),
						),
					),
				)!;
				const endPowerAttachment = powerAttachments.find((powerAttachment) =>
					powerAttachment.WorldCFrame.FuzzyEq(
						availablePlot.PrimaryPart!.CFrame.mul(
							new CFrame(...powerLineSaveData.endPowerAttachmentCfComponents),
						),
					),
				)!;

				this.createPowerLine(player, startPowerAttachment, endPowerAttachment);
				this.powerService.connect(startPowerAttachment, endPowerAttachment);
			}
		});

		Promise.all([structuresPromise, powerLinesPromise]).then(() => {
			Events.OnPlotInitialization.broadcast(player, availablePlot, this.gridService.getGridData(player)!);
		});
	}

	private resetPlot(player: Player): void {
		this.save(player);

		const plot = this.getPlot(player)!;
		for (const powerLine of plot.WaitForChild("PowerLines").GetChildren() as RopeConstraint[]) {
			Events.OnPowerLineDestroying.broadcast(powerLine.Attachment0!, powerLine.Attachment1!);
		}
		Events.OnStructuresDestroying.broadcast(player, plot.WaitForChild("Structures").GetChildren() as Model[]);

		for (const folder of plot.GetChildren().filter((instance): instance is Folder => instance.IsA("Folder"))) {
			for (const instance of folder.GetChildren()) {
				instance.Destroy();
			}
		}
		plot.SetAttribute("UserId", undefined);
	}

	private getPlot(player: Player): Model | undefined {
		return Workspace.WaitForChild("Plots")
			.GetChildren()
			.find((plot): plot is Model => plot.GetAttribute("UserId") === player.UserId);
	}

	private startAutoSave(): void {
		task.spawn(() => {
			while (task.wait(120)) {
				for (const player of Players.GetPlayers()) {
					this.save(player);
				}
			}
		});
	}

	private save(player: Player): void {
		const plot = this.getPlot(player);
		if (plot === undefined) return;

		this.dataService.set(
			player,
			"structuresData",
			(plot.WaitForChild("Structures").GetChildren() as Model[]).map((structureModel) => {
				return {
					name: structureModel.Name,
					cfsComponents: new Map<
						string,
						[number, number, number, number, number, number, number, number, number, number, number, number]
					>(
						[
							structureModel,
							...structureModel
								.GetChildren()
								.filter(
									(instance): instance is Model =>
										instance.IsA("Model") && instance.Name in STRUCTURES,
								),
						].map((structureModel) => [
							structureModel.Name,
							plot.GetPivot().ToObjectSpace(structureModel.GetPivot()).GetComponents(),
						]),
					),
					attributes: structureModel.GetAttributes(),
				};
			}),
		);

		this.dataService.set(
			player,
			"powerLinesData",
			(plot.WaitForChild("PowerLines").GetChildren() as RopeConstraint[]).map((powerLine) => {
				return {
					startPowerAttachmentCfComponents: plot
						.GetPivot()
						.ToObjectSpace(powerLine.Attachment0!.WorldCFrame)
						.GetComponents(),
					endPowerAttachmentCfComponents: plot
						.GetPivot()
						.ToObjectSpace(powerLine.Attachment1!.WorldCFrame)
						.GetComponents(),
				};
			}),
		);
	}

	private createStructure(
		player: Player,
		name: string,
		targetCFs: Map<string, CFrame>,
		attributes: Map<string, AttributeValue>,
	): Model {
		const structureDefinition = STRUCTURES[name];
		const newStructureModel = structureDefinition.model.Clone();
		for (const structureModel of [
			newStructureModel,
			...newStructureModel
				.GetChildren()
				.filter((instance): instance is Model => instance.IsA("Model") && instance.Name in STRUCTURES),
		]) {
			structureModel.PivotTo(targetCFs.get(structureModel.Name)!);
		}

		if (attributes.size() > 0) {
			for (const [attributeName, attributeValue] of attributes) {
				newStructureModel.SetAttribute(attributeName, attributeValue);
			}
		} else {
			for (const [attributeName, attributeValue] of Object.entries(structureDefinition.attributes)) {
				newStructureModel.SetAttribute(attributeName, attributeValue);
			}
		}

		for (const structureModel of [
			newStructureModel,
			...newStructureModel
				.GetChildren()
				.filter((instance): instance is Model => instance.IsA("Model") && instance.Name in STRUCTURES),
		]) {
			for (const tag of STRUCTURES[structureModel.Name].tags) {
				structureModel.AddTag(tag);
			}
		}

		newStructureModel.Parent = this.getPlot(player)!.WaitForChild("Structures");
		return newStructureModel;
	}

	private createPowerLine(
		player: Player,
		startPowerAttachment: Attachment,
		endPowerAttachment: Attachment,
	): RopeConstraint {
		const newPowerLine = STRUCTURES["Power Line"].model.FindFirstChildOfClass("RopeConstraint")!.Clone();
		newPowerLine.Attachment0 = startPowerAttachment;
		newPowerLine.Attachment1 = endPowerAttachment;
		newPowerLine.Parent = this.getPlot(player)!.WaitForChild("PowerLines");
		return newPowerLine;
	}
}
