import { BaseComponent, Component, Components } from "@flamework/components";
import { OnStart } from "@flamework/core";
import { Janitor } from "@rbxts/janitor";
import { Players, Workspace } from "@rbxts/services";
import Signal from "@rbxts/signal";
import { EventBus } from "client/event-bus";
import { Events } from "client/network";
import GridService from "client/services/plot/grid";
import { store } from "client/store";
import { selectSettings } from "client/store/context/sections";

@Component({})
export default class StructureComponent extends BaseComponent<{}, Model> implements OnStart {
	protected readonly gridService = GridService.getInst();
	public player!: Player;
	public active: boolean = false;
	public state: string = "No Connection";
	public readonly OnActiveChanged = new Signal<() => void>();
	public readonly OnStateChanged = new Signal<() => void>();
	protected readonly janitor = new Janitor();

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
		this.janitor.LinkToInstance(this.instance, false);
		this.initEvents();
	}

	protected initEvents(): void {
		this.setActive(store.getState().settings.settings["simulateFactories"].includes(this.player.UserId));
		for (const connection of [
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
			this.instance.Destroying.Once(() => {
				this.onDestroying();
			}),
		]) {
			this.janitor.Add(connection);
		}
		store.subscribe(selectSettings, (settings) => {
			this.setActive((settings["simulateFactories"] as number[]).includes(this.player.UserId));
		});
	}

	protected onStructuresPlacement(structuresModels: Model[]): void {}

	protected onStructuresMovementStart(structuresModels: Model[]): void {
		if (!structuresModels.includes(this.instance)) return;
		this.setActive(false);
	}

	protected onStructuresMovement(structuresModels: Model[]): void {
		if (!structuresModels.includes(this.instance)) return;
		this.setActive(store.getState().settings.settings["simulateFactories"].includes(this.player.UserId));
	}

	protected onDestroying(): void {
		this.setActive(false);
	}

	public updateState(): void {}

	private setActive(active: boolean): void {
		if (this.active !== active) {
			this.active = active;
			this.OnActiveChanged.Fire();
		}
	}

	public setState(state: string): void {
		if (this.state !== state) {
			this.state = state;
			this.OnStateChanged.Fire();
		}
	}
}
