import { BaseComponent, Component, Components } from "@flamework/components";
import { OnStart } from "@flamework/core";
import { Players, Workspace } from "@rbxts/services";
import Signal from "@rbxts/signal";
import { EventBus } from "client/event-bus";
import { Events } from "client/network";
import GridService from "client/services/plot/grid-service";
import { StructureState } from "shared/constants/structures";

let simulateFactories: number[];
Events.OnDataInitialization.connect((data) => {
	simulateFactories = data.settings.simulateFactories;
});
EventBus.OnSettingChange.Connect((settingName, settingValue) => {
	if (settingName !== "simulateFactories") return;
	simulateFactories = settingValue as number[];
});

const initializedPlayers = new Set<Player>();
EventBus.PlotEvents.OnPlotInitialization.Connect((player) => {
	initializedPlayers.add(player);
	Players.PlayerRemoving.Connect((removedPlayer) => {
		if (player !== removedPlayer) return;
		initializedPlayers.delete(player);
	});
});

Events.OnPlotReset.connect((player) => {
	initializedPlayers.delete(player);
});

@Component({})
export default class StructureComponent extends BaseComponent<{}, Model> implements OnStart {
	protected readonly gridService = GridService.getInst();
	protected player!: Player;
	protected active: boolean = false;
	protected state: StructureState = "No Connection";
	public readonly onActiveChanged = new Signal<(active: boolean) => void>();
	public readonly onStateChanged = new Signal<(newState: StructureState) => void>();
	protected readonly connections: RBXScriptConnection[] = [];

	constructor(protected readonly components: Components) {
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
		if (initializedPlayers.has(this.player)) {
			this.active = simulateFactories.includes(this.player.UserId);
			this.onActiveChanged.Fire(this.active);
		} else {
			EventBus.PlotEvents.OnPlotInitialization.Connect((player) => {
				if (player !== this.player) return;
				this.active = simulateFactories.includes(this.player.UserId);
				this.onActiveChanged.Fire(this.active);
			});
		}
		this.connections.push(
			Events.OnPlotReset.connect((player) => {
				if (player !== this.player) return;
				this.onStructuresDestroying([this.instance]);
			}),
			EventBus.PlotEvents.OnStructuresPlacement.Connect((player, structuresModels) => {
				if (player !== this.player) return;
				this.onStructuresPlacement(structuresModels);
			}),
			Events.OnStructuresMovementStart.connect((player, structuresModels) => {
				if (player !== this.player) return;
				this.onStructuresMovementStart(structuresModels);
			}),
			EventBus.PlotEvents.OnStructuresMovement.Connect((player, structuresModels) => {
				if (player !== this.player) return;
				this.onStructuresMovement(structuresModels);
			}),
			Events.OnStructuresDestroying.connect((player, structuresModels) => {
				if (player !== this.player) return;
				this.onStructuresDestroying(structuresModels);
			}),
			EventBus.OnSettingChange.Connect((settingName, settingValue) => {
				if (settingName !== "simulateFactories") return;
				this.active = (settingValue as number[]).includes(this.player.UserId);
				this.onActiveChanged.Fire(this.active);
			}),
		);
	}

	protected onStructuresPlacement(structuresModels: Model[]): void {}

	protected onStructuresMovementStart(structuresModels: Model[]): void {
		if (structuresModels.includes(this.instance)) {
			this.active = false;
			this.onActiveChanged.Fire(this.active);
		}
	}

	protected onStructuresMovement(structuresModels: Model[]): void {
		if (structuresModels.includes(this.instance)) {
			this.active = simulateFactories.includes(this.player.UserId);
			this.onActiveChanged.Fire(this.active);
		}
	}

	protected onStructuresDestroying(structuresModels: Model[]): void {
		if (structuresModels.includes(this.instance)) {
			this.active = false;
			this.onActiveChanged.Fire(this.active);
			for (const connection of this.connections) {
				connection.Disconnect();
			}
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
