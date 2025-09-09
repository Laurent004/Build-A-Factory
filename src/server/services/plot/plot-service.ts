import { Players, Workspace } from "@rbxts/services";
import { StructureName, STRUCTURES, StructureSaveData } from "shared/constants/structures";
import { OnInit, Service } from "@flamework/core";
import DataService from "../data/data-service";
import { Events } from "server/network";
import GridService from "./grid-service";
import StructureFactoryService from "./structure-factory-service";
import { EventBus } from "server/event-bus";

@Service()
export default class PlotService implements OnInit {
	private readonly saveInterval: number = 12;
	constructor(
		private readonly dataService: DataService,
		private readonly gridService: GridService,
		private readonly structureFactoryService: StructureFactoryService,
	) {}

	onInit(): void | Promise<void> {
		this.initEvents();
		this.startSavingStructures();
	}

	private initEvents() {
		Players.PlayerAdded.Connect((player) => {
			player.CharacterAdded.Connect(() => {
				this.onPlayerAdded(player);
			});
		});
		Players.PlayerRemoving.Connect((player) => {
			this.onPlayerRemoving(player);
		});

		Events.PlaceStructures.connect((player, structuresPlacementData) => {
			if (!this.gridService.canPlace(player, structuresPlacementData)) return;
			const structuresModels: Model[] = [];
			for (const structurePlacementData of structuresPlacementData) {
				const structureModel = this.structureFactoryService.create(
					this.getPlot(player)!,
					structurePlacementData.structureName,
					structurePlacementData.targetCF.mul(
						STRUCTURES[structurePlacementData.structureName as StructureName].model.PrimaryPart!
							.PivotOffset,
					),
					structurePlacementData.structureAttributes,
				);
				structuresModels.push(structureModel);
			}
			this.gridService.initStructuresCells(player, structuresModels);
			Events.OnStructuresPlacement.broadcast(player, structuresModels);
		});

		Events.StartStructuresMovement.connect((_, structuresModels) => {
			Events.OnStructuresMovementStart.broadcast(structuresModels);
		});

		Events.CancelStructuresMovement.connect((player, structuresModels) => {
			Events.OnStructuresMovement.broadcast(player, structuresModels);
			EventBus.OnStructureMovement.Fire(player, structuresModels);
		});

		Events.MoveStructures.connect((player, structuresMovementData) => {
			if (!this.gridService.canMoveTo(player, structuresMovementData)) return;
			const structuresModels: Model[] = [];
			for (const structureMovementData of structuresMovementData) {
				structuresModels.push(structureMovementData.structureModel);
				structureMovementData.structureModel.PivotTo(
					structureMovementData.targetCF.mul(structureMovementData.structureModel.PrimaryPart!.PivotOffset),
				);
			}
			Events.OnStructuresMovement.broadcast(player, structuresModels);
			EventBus.OnStructureMovement.Fire(player, structuresModels);
		});

		Events.ClearStructuresItems.connect((_, structuresModels) => {
			Events.OnStructuresItemsClear.broadcast(structuresModels);
		});

		Events.DestroyStructures.connect((_, structuresModels) => {
			Events.OnStructuresDestroying.broadcast(structuresModels);
			for (const structureModel of structuresModels) {
				structureModel.Destroy();
			}
		});

		Events.SetStructureAttribute.connect((_, structureModel, structureAttributeName, structureAttributeValue) => {
			structureModel.SetAttribute(structureAttributeName, structureAttributeValue);
		});
	}

	public onPlayerAdded(player: Player) {
		const availablePlot = this.getAvailablePlot();
		if (availablePlot !== undefined) {
			availablePlot.SetAttribute("UserId", player.UserId);

			this.dataService.get(player, "structuresSaveData").then((structuresSaveData) => {
				const gridData = this.gridService.initGrid(player, availablePlot);
				const structuresModels: Model[] = [];
				if (structuresSaveData !== undefined) {
					for (const structureSaveData of structuresSaveData) {
						const structuresAttributes: Record<string, AttributeValue> = {};
						for (const [structureAttributeName, structureAttributeValue] of structureSaveData.attributes) {
							structuresAttributes[structureAttributeName] = structureAttributeValue;
						}
						const structureModel = this.structureFactoryService.create(
							availablePlot,
							structureSaveData.name,
							availablePlot.PrimaryPart!.CFrame.mul(new CFrame(...structureSaveData.cfComponents)),
							structuresAttributes,
						);
						structuresModels.push(structureModel);
					}
					this.gridService.initStructuresCells(player, structuresModels);
				}
				Events.OnPlotInitialization.broadcast(player, availablePlot, gridData);
			});
		}
	}

	public onPlayerRemoving(player: Player) {
		this.saveStructures(player);
		for (const folder of this.getPlot(player)!
			.GetChildren()
			.filter((instance) => instance.IsA("Folder"))) {
			folder.Destroy();
		}
		this.getPlot(player)?.SetAttribute("UserId", undefined);
	}

	private getAvailablePlot(): Model | undefined {
		const plots = Workspace.WaitForChild("Plots").GetChildren();
		for (const plot of plots) {
			const userId = plot.GetAttribute("UserId");
			if (userId === undefined) {
				return plot as Model;
			}
		}
		return undefined;
	}

	private getPlot(player: Player): Model | undefined {
		const plots = Workspace.WaitForChild("Plots").GetChildren();
		for (const plot of plots) {
			const userId = plot.GetAttribute("UserId");
			if (userId === player.UserId) {
				return plot as Model;
			}
		}
		return undefined;
	}

	private startSavingStructures() {
		task.spawn(() => {
			while (task.wait(this.saveInterval)) {
				for (const player of Players.GetPlayers()) {
					this.saveStructures(player);
				}
			}
		});
	}

	private saveStructures(player: Player) {
		const plot = this.getPlot(player)!;
		const structuresModels = plot.WaitForChild("Structures").GetChildren() as Model[];
		const structuresSaveData: StructureSaveData[] = [];
		for (const structureModel of structuresModels) {
			const structureSaveData: StructureSaveData = {
				name: structureModel.Name as StructureName,
				cfComponents: plot.GetPivot().ToObjectSpace(structureModel.GetPivot()).GetComponents(),
				attributes: structureModel.GetAttributes(),
			};
			structuresSaveData.push(structureSaveData);
		}
		this.dataService.set(player, "structuresSaveData", structuresSaveData);
	}
}
