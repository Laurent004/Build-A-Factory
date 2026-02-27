import { Players, Workspace } from "@rbxts/services";
import { Events } from "client/network";
import { STRUCTURES } from "shared/constants/structures";
import { EventBus } from "shared/event-bus";
import { GridService, PowerService } from "shared/services/plot";

export default class PlotService {
	//#region Singleton
	private static _inst: PlotService;
	public static getInst(): PlotService {
		this._inst = this._inst ?? new PlotService();
		return this._inst;
	}
	//#endregion

	private readonly gridService = GridService.getInst();
	private readonly powerService = PowerService.getInst();
	private readonly plots = new Map<Model, Player>();

	private constructor() {
		this.initEvents();
	}

	private initEvents(): void {
		for (const plot of Workspace.WaitForChild("Plots").GetChildren() as Model[]) {
			const expansionsFolder = plot.WaitForChild("Expansions");
			const structuresFolder = plot.WaitForChild("Structures");
			const powerLinesFolder = plot.WaitForChild("PowerLines");

			if (plot.GetAttribute("UserId") !== undefined) {
				const player = Players.GetPlayerByUserId(plot.GetAttribute("UserId") as number)!;
				this.plots.set(plot, player);
				this.gridService.initGrid(player, plot);
				for (const expansion of (expansionsFolder.GetChildren() as Part[]).filter(
					(expansion) => expansion.GetAttribute("IsOwned") === true,
				)) {
					this.gridService.updateGrid(player, expansion);
				}

				for (const structureModel of structuresFolder
					.GetDescendants()
					.filter((instance): instance is Model => instance.IsA("Model") && instance.Name in STRUCTURES)) {
					this.gridService.initStructuresCells(player, [structureModel]);
					structureModel.Destroying.Once(() => {
						this.gridService.clearStructuresCells([structureModel]);
					});
				}

				for (const powerLine of powerLinesFolder.GetChildren() as RopeConstraint[]) {
					if (powerLine.Attachment0 === undefined || powerLine.Attachment1 === undefined) {
						const connections = [
							powerLine.GetPropertyChangedSignal("Attachment0").Connect(() => {
								if (powerLine.Attachment0 !== undefined && powerLine.Attachment1 !== undefined) {
									this.powerService.connect(
										this.plots.get(plot)!,
										powerLine.Attachment0,
										powerLine.Attachment1,
									);
									for (const connection of connections) {
										connection.Disconnect();
									}
								}
							}),
							powerLine.GetPropertyChangedSignal("Attachment1").Connect(() => {
								if (powerLine.Attachment0 !== undefined && powerLine.Attachment1 !== undefined) {
									this.powerService.connect(
										this.plots.get(plot)!,
										powerLine.Attachment0,
										powerLine.Attachment1,
									);
									for (const connection of connections) {
										connection.Disconnect();
									}
								}
							}),
						];
					} else {
						this.powerService.connect(this.plots.get(plot)!, powerLine.Attachment0, powerLine.Attachment1);
					}
					powerLine.Destroying.Once(() => {
						this.powerService.disconnect(
							this.plots.get(plot)!,
							powerLine.Attachment0!,
							powerLine.Attachment1!,
						);
					});
				}
			}

			plot.GetAttributeChangedSignal("UserId").Connect(() => {
				if (plot.GetAttribute("UserId") === undefined) {
					const player = this.plots.get(plot);
					if (player !== undefined) {
						this.plots.delete(plot);
						this.gridService.resetGrid(player);
						return;
					}
				}
				const player = Players.GetPlayerByUserId(plot.GetAttribute("UserId") as number)!;
				this.plots.set(plot, player);
				this.gridService.initGrid(player, plot);
			});

			expansionsFolder.ChildAdded.Connect((expansion) => {
				if (expansion.GetAttribute("IsOwned") === true) {
					this.gridService.updateGrid(this.plots.get(plot)!, expansion as Part);
				}
				expansion.GetAttributeChangedSignal("IsOwned").Connect(() => {
					if (expansion.GetAttribute("IsOwned") === true) {
						this.gridService.updateGrid(this.plots.get(plot)!, expansion as Part);
					}
				});
			});

			structuresFolder.ChildAdded.Connect((child) => {
				if (!child.IsA("Model") || !(child.Name in STRUCTURES)) return;
				const structuresModels = [
					child,
					...child
						.GetDescendants()
						.filter((instance): instance is Model => instance.IsA("Model") && instance.Name in STRUCTURES),
				];
				this.gridService.initStructuresCells(this.plots.get(plot)!, structuresModels);
				for (const structureModel of structuresModels) {
					structureModel.Destroying.Once(() => {
						this.gridService.clearStructuresCells([structureModel]);
					});
				}
			});

			powerLinesFolder.ChildAdded.Connect((child) => {
				if (!child.IsA("RopeConstraint")) return;
				if (child.Attachment0 === undefined || child.Attachment1 === undefined) {
					const connections = [
						child.GetPropertyChangedSignal("Attachment0").Connect(() => {
							if (child.Attachment0 !== undefined && child.Attachment1 !== undefined) {
								this.powerService.connect(this.plots.get(plot)!, child.Attachment0, child.Attachment1);
								for (const connection of connections) {
									connection.Disconnect();
								}
							}
						}),
						child.GetPropertyChangedSignal("Attachment1").Connect(() => {
							if (child.Attachment0 !== undefined && child.Attachment1 !== undefined) {
								this.powerService.connect(this.plots.get(plot)!, child.Attachment0, child.Attachment1);
								for (const connection of connections) {
									connection.Disconnect();
								}
							}
						}),
					];
				} else {
					this.powerService.connect(this.plots.get(plot)!, child.Attachment0, child.Attachment1);
				}
				child.Destroying.Once(() => {
					this.powerService.disconnect(this.plots.get(plot)!, child.Attachment0!, child.Attachment1!);
				});
			});
		}

		Events.OnStructuresEditStart.connect((player, structuresModels) => {
			this.gridService.clearStructuresCells(structuresModels);
			EventBus.OnStructuresEditStart.Fire(player, structuresModels);
		});

		Events.OnStructuresEdit.connect((player, structuresModels) => {
			this.gridService.initStructuresCells(player, structuresModels);
			EventBus.OnStructuresEdit.Fire(player, structuresModels);
		});

		Events.OnStructuresItemsClear.connect((player, structuresModels) => {
			EventBus.OnStructuresItemsClear.Fire(player, structuresModels);
		});
	}
}
