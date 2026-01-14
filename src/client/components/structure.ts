import { BaseComponent, Component, Components } from "@flamework/components";
import { OnStart } from "@flamework/core";
import { Players, Workspace } from "@rbxts/services";
import Signal from "@rbxts/signal";
import { EventBus } from "client/event-bus";
import { Events } from "client/network";
import GridService from "client/services/plot/grid";

let simulateFactories: number[];
Events.OnDataInitialization.connect((data) => {
	simulateFactories = data.settings.simulateFactories;
});
EventBus.OnSettingChange.Connect((settingName, settingValue) => {
	simulateFactories = settingName === "simulateFactories" ? (settingValue as number[]) : simulateFactories;
});

const initializedPlayers = new Set<Player>();
EventBus.OnPlotInitialization.Connect((player) => {
	initializedPlayers.add(player);
});
Events.OnPlotReset.connect((player) => {
	initializedPlayers.delete(player);
});

@Component({})
export default class StructureComponent extends BaseComponent<{}, Model> implements OnStart {
	protected readonly gridService = GridService.getInst();
	protected player!: Player;
	public active: boolean = false;
	public state: string = "No Connection";
	public readonly OnActiveChanged = new Signal<() => void>();
	public readonly OnStateChanged = new Signal<() => void>();
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
			this.OnActiveChanged.Fire();
		} else {
			this.connections.push(
				EventBus.OnPlotInitialization.Connect((player) => {
					if (player !== this.player) return;
					this.active = simulateFactories.includes(this.player.UserId);
					this.OnActiveChanged.Fire();
				}),
			);
		}
		this.connections.push(
			Events.OnPlotReset.connect((player) => {
				if (player !== this.player) return;
				this.onStructuresDestroying([this.instance]);
			}),
			EventBus.OnStructuresPlacement.Connect((player, structuresModels) => {
				if (player !== this.player) return;
				this.onStructuresPlacement(structuresModels);
			}),
			Events.OnStructuresMovementStart.connect((player, structuresModels) => {
				if (player !== this.player) return;
				this.onStructuresMovementStart(structuresModels);
			}),
			EventBus.OnStructuresMovement.Connect((player, structuresModels) => {
				if (player !== this.player) return;
				this.onStructuresMovement(structuresModels);
			}),
			Events.OnStructuresDestroying.connect((player, structuresModels) => {
				if (player !== this.player) return;
				this.onStructuresDestroying(structuresModels);
			}),
			EventBus.OnSettingChange.Connect((settingName, settingValue) => {
				if (settingName === "simulateFactories") {
					this.active = (settingValue as number[]).includes(this.player.UserId);
					this.OnActiveChanged.Fire();
				}
			}),
		);
	}

	protected onStructuresPlacement(structuresModels: Model[]): void {}

	protected onStructuresMovementStart(structuresModels: Model[]): void {
		if (structuresModels.includes(this.instance)) {
			this.active = false;
			this.OnActiveChanged.Fire();
		}
	}

	protected onStructuresMovement(structuresModels: Model[]): void {
		if (structuresModels.includes(this.instance)) {
			this.active = simulateFactories.includes(this.player.UserId);
			this.OnActiveChanged.Fire();
		}
	}

	protected onStructuresDestroying(structuresModels: Model[]): void {
		if (structuresModels.includes(this.instance)) {
			this.active = false;
			this.OnActiveChanged.Fire();
			for (const connection of this.connections) {
				connection.Disconnect();
			}
		}
	}

	public updateState(): void {}

	public setState(state: string): void {
		if (this.state !== state) {
			this.state = state;
			this.OnStateChanged.Fire();
		}
	}
}
