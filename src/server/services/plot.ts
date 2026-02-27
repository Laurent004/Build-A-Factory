import { Players, Workspace } from "@rbxts/services";
import { createStructure, getStructureData, STRUCTURES } from "shared/constants/structures";
import { OnInit, Service } from "@flamework/core";
import { Events } from "server/network";
import { Array } from "@rbxts/luau-polyfill";
import { GridService, PowerService } from "shared/services/plot";
import ValidationService from "shared/services/validation";
import { EventBus } from "shared/event-bus";
import CurrencyService from "./progression/currency";
import { SaveData, SaveService } from "./data/save";

@Service()
export default class PlotService implements OnInit {
	private readonly gridService = GridService.getInst();
	private readonly powerService = PowerService.getInst();
	private readonly validationService = ValidationService.getInst();
	private readonly plots = new Map<Player, Model>();

	constructor(private readonly saveService: SaveService, private readonly currencyService: CurrencyService) {
		this.saveService.register("structures", (player) => {
			const plot = this.plots.get(player)!;
			return (plot.WaitForChild("Structures").GetChildren() as Model[]).map((structureModel) =>
				getStructureData(structureModel, plot.GetPivot()),
			);
		});
		this.saveService.register("powerLines", (player) => {
			const plot = this.plots.get(player)!;
			return (plot.WaitForChild("PowerLines").GetChildren() as RopeConstraint[]).map((powerLine) => {
				return {
					startAttachmentCF: plot
						.GetPivot()
						.ToObjectSpace(powerLine.Attachment0!.WorldCFrame)
						.GetComponents(),
					endAttachmentCF: plot.GetPivot().ToObjectSpace(powerLine.Attachment1!.WorldCFrame).GetComponents(),
				};
			});
		});
	}

	onInit(): void | Promise<void> {
		this.initEvents();
	}

	private initEvents(): void {
		Players.PlayerAdded.Connect((player) => {
			const plot = Workspace.WaitForChild("Plots")
				.GetChildren()
				.find((plot): plot is Model => plot.GetAttribute("UserId") === undefined)!;
			this.gridService.initGrid(player, plot);
			plot.SetAttribute("UserId", player.UserId);
			player.RespawnLocation = plot.FindFirstChildOfClass("SpawnLocation");
			this.plots.set(player, plot);
		});

		this.saveService.OnSaveLoad.Connect((player, saveData) => {
			this.initPlot(player, saveData);
		});

		this.saveService.OnSaveUnload.Connect((player) => {
			this.resetPlot(player);
		});

		Events.PurchaseExpansion.connect((player, expansion) => {
			if (!this.validationService.canExpand(player, expansion)) return;
			this.saveService.get(player, "expansions").then((expansions) => {
				const position = this.plots.get(player)!.GetPivot().PointToObjectSpace(expansion.Position);
				this.saveService.set(player, "expansions", [...expansions, [position.X, 0, position.Z]]);
				this.gridService.updateGrid(player, expansion);
				this.currencyService.addCurrency(player, "Cash", -(expansion.GetAttribute("Cost") as number));
				expansion.SetAttribute("IsOwned", true);
				Events.OnNotification.fire(
					player,
					`<font color="rgb(255, 255, 255)">Successfuly unlocked new expansion!</font>`,
					"sfx/success",
				);
			});
		});

		Events.PlaceStructures.connect((player, structuresData, powerLines) => {
			if (!this.validationService.canBuild(player, structuresData).success) return;
			const structuresFolder = this.plots.get(player)!.WaitForChild("Structures");
			const newStructuresModels: Model[] = [];
			for (const structureData of structuresData) {
				const newStructureModel = createStructure(structureData, undefined, true, structuresFolder);
				for (const structureModel of [newStructureModel, ...newStructureModel.GetDescendants()].filter(
					(instance): instance is Model => instance.IsA("Model") && instance.Name in STRUCTURES,
				)) {
					newStructuresModels.push(structureModel);
				}
			}
			this.gridService.initStructuresCells(player, newStructuresModels);

			const attachments = Array.flatMap(newStructuresModels, (structureModel) =>
				structureModel
					.GetDescendants()
					.filter(
						(instance): instance is Attachment =>
							instance.IsA("Attachment") && instance.Name === "PowerAttachment",
					),
			);
			for (const powerLine of powerLines) {
				this.powerService.connect(
					player,
					attachments.find((attachment) =>
						new CFrame(...powerLine.startAttachmentCF).FuzzyEq(attachment.WorldCFrame),
					)!,
					attachments.find((attachment) =>
						new CFrame(...powerLine.endAttachmentCF).FuzzyEq(attachment.WorldCFrame),
					)!,
				);
			}

			this.currencyService.addCurrency(
				player,
				"Cash",
				-structuresData.reduce((cost, structureData) => (cost += STRUCTURES[structureData.name].cost), 0),
			);
		});

		Events.StartStructuresEdit.connect((player, structuresModels) => {
			this.gridService.clearStructuresCells(structuresModels);
			Events.OnStructuresEditStart.broadcast(player, structuresModels);
			EventBus.OnStructuresEditStart.Fire(player, structuresModels);
		});

		Events.EditStructures.connect((player, structuresEditData) => {
			if (!this.validationService.canEdit(player, structuresEditData).success) return;
			const editedStructuresModels: Model[] = [];
			for (const structureEditData of structuresEditData) {
				structureEditData.model.PivotTo(structureEditData.cf);
				editedStructuresModels.push(structureEditData.model);
			}
			this.gridService.initStructuresCells(player, editedStructuresModels);
			Events.OnStructuresEdit.broadcast(player, editedStructuresModels);
			EventBus.OnStructuresEdit.Fire(player, editedStructuresModels);
		});

		Events.CancelStructuresMovement.connect((player, structuresModels) => {
			this.gridService.initStructuresCells(player, structuresModels);
			Events.OnStructuresEdit.broadcast(player, structuresModels);
			EventBus.OnStructuresEdit.Fire(player, structuresModels);
		});

		Events.ClearStructuresItems.connect((player, structuresModels) => {
			Events.OnStructuresItemsClear.broadcast(player, structuresModels);
			EventBus.OnStructuresItemsClear.Fire(player, structuresModels);
		});

		Events.DestroyStructures.connect((player, structuresModels) => {
			if (!this.validationService.canDelete(player, structuresModels).success) return;
			this.gridService.clearStructuresCells(structuresModels);
			for (const powerLine of (
				this.plots.get(player)!.WaitForChild("PowerLines").GetChildren() as RopeConstraint[]
			).filter(
				(powerLine) =>
					structuresModels.includes(powerLine.Attachment0!.FindFirstAncestorOfClass("Model")!) ||
					structuresModels.includes(powerLine.Attachment1!.FindFirstAncestorOfClass("Model")!),
			)) {
				this.powerService.disconnect(player, powerLine.Attachment0!, powerLine.Attachment1!);
			}
			for (const structureModel of structuresModels) {
				structureModel.Destroy();
			}
			this.currencyService.addCurrency(
				player,
				"Cash",
				-structuresModels.reduce((cost, structureModel) => (cost += STRUCTURES[structureModel.Name].cost), 0),
			);
		});

		Events.SetStructuresAttribute.connect((player, structuresModels, attributeName, attributeValue) => {
			if (
				!this.validationService.canSetAttribute(player, structuresModels, attributeName, attributeValue).success
			)
				return;
			for (const structureModel of structuresModels) {
				structureModel.SetAttribute(attributeName, attributeValue);
			}
		});

		Events.ConnectPowerLine.connect((player, startAttachment, endAttachment) => {
			if (!this.validationService.canConnect(player, startAttachment, endAttachment).success) return;
			this.powerService.connect(player, startAttachment, endAttachment);
		});
	}

	private initPlot(player: Player, saveData: SaveData): void {
		const plot = this.plots.get(player)!;
		const expansionsFolder = plot.WaitForChild("Expansions");
		const structuresFolder = plot.WaitForChild("Structures");

		for (const expansion of saveData.expansions.map(
			(expansionLocalPosition) =>
				(expansionsFolder.GetChildren() as Part[]).find((expansion) =>
					new Vector3(expansion.Position.X, 0, expansion.Position.Z).FuzzyEq(
						new Vector3(
							plot.GetPivot().mul(new Vector3(...expansionLocalPosition)).X,
							0,
							plot.GetPivot().mul(new Vector3(...expansionLocalPosition)).Z,
						),
					),
				)!,
		)) {
			this.gridService.updateGrid(player, expansion);
			expansion.SetAttribute("IsOwned", true);
		}

		for (const structure of saveData.structures) {
			createStructure(structure, plot.GetPivot(), true, structuresFolder);
		}
		this.gridService.initStructuresCells(
			player,
			structuresFolder
				.GetDescendants()
				.filter((instance): instance is Model => instance.IsA("Model") && instance.Name in STRUCTURES),
		);

		const attachments = structuresFolder
			.GetDescendants()
			.filter(
				(instance): instance is Attachment => instance.IsA("Attachment") && instance.Name === "PowerAttachment",
			);
		for (const powerLine of saveData.powerLines) {
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
	}

	private resetPlot(player: Player): void {
		const plot = this.plots.get(player)!;
		this.gridService.resetGrid(player);
		const powerLinesFolder = plot.WaitForChild("PowerLines");
		for (const powerLine of powerLinesFolder.GetChildren() as RopeConstraint[]) {
			this.powerService.disconnect(player, powerLine.Attachment0!, powerLine.Attachment1!);
		}
		powerLinesFolder.ClearAllChildren();
		plot.WaitForChild("Structures").ClearAllChildren();
		for (const expansion of plot.WaitForChild("Expansions").GetChildren()) {
			expansion.SetAttribute("IsOwned", false);
		}
	}
}
