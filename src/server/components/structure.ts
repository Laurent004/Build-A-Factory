import { BaseComponent, Component, Components } from "@flamework/components";
import { Dependency, OnStart } from "@flamework/core";
import { Players, Workspace } from "@rbxts/services";
import Signal from "@rbxts/signal";
import { EventBus } from "server/event-bus";
import { Events } from "server/network";
import GridService from "server/services/plot/grid-service";
import { StructureState } from "shared/constants/structures";

const initializedPlots = new Set<Player>();
Events.OnPlotInitialization.connect((player) => {
	initializedPlots.add(player);
	const connection = Players.PlayerRemoving.Connect((removedPlayer) => {
		if (player === removedPlayer) {
			initializedPlots.delete(player);
			connection.Disconnect();
		}
	});
});

@Component({})
export default class StructureComponent extends BaseComponent<{}, Model> implements OnStart {
	protected readonly components = Dependency<Components>();

	protected player!: Player;
	protected active: boolean = false;
	protected state: StructureState = "No Connection";
	public readonly onStateChanged = new Signal<(newState: StructureState) => void>();

	private readonly connections: RBXScriptConnection[] = [];

	constructor(protected readonly gridService: GridService) {
		super();
	}

	onStart(): void {
		this.player = Players.GetPlayerByUserId(
			Workspace.WaitForChild("Plots")
				.GetChildren()
				.find((plot) => plot.IsAncestorOf(this.instance))!
				.GetAttribute("UserId") as number,
		)!;
		this.initEvents();
	}

	protected initEvents(): void {
		if (initializedPlots.has(this.player)) {
			this.active = true;
		} else {
			this.connections.push(
				Events.OnPlotInitialization.connect((player) => {
					if (player !== this.player) return;
					this.onPlotInitialization();
				}),
			);
		}

		this.connections.push(
			EventBus.PlotEvents.OnStructuresPlacement.Connect(() => {
				this.onStructuresPlacement();
			}),
		);

		this.connections.push(
			Events.StartStructuresMovement.connect((_, structuresModels) => {
				this.onStructuresMovementStart(structuresModels);
			}),
		);

		this.connections.push(
			EventBus.PlotEvents.OnStructuresMovement.Connect((structuresModels) => {
				this.onStructuresMovement(structuresModels);
			}),
		);

		this.connections.push(
			Events.DestroyStructures.connect((_, structuresModels) => {
				this.onStructuresDestroying(structuresModels);
			}),
		);

		this.instance.Destroying.Once(() => {
			this.onDestroying();
		});
	}

	protected onPlotInitialization(): void {
		this.active = true;
	}

	protected onStructuresPlacement(): void {}

	protected onStructuresMovementStart(structuresModels: Model[]): void {
		if (structuresModels.includes(this.instance)) {
			this.active = false;
		}
	}

	protected onStructuresMovement(structuresModels: Model[]): void {
		if (structuresModels.includes(this.instance)) {
			this.active = true;
		}
	}

	protected onStructuresDestroying(structuresModels: Model[]): void {}

	protected onDestroying(): void {
		for (const connection of this.connections) {
			connection.Disconnect();
		}
	}

	public updateState(): void {}

	public getState(): StructureState {
		return this.state;
	}

	public setState(state: StructureState): void {
		if (this.state !== state) {
			this.state = state;
			this.onStateChanged.Fire(state);
		}
	}
}
