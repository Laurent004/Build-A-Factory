import { BaseComponent, Component, Components } from "@flamework/components";
import { OnStart } from "@flamework/core";
import { Janitor } from "@rbxts/janitor";
import { Players, Workspace } from "@rbxts/services";
import { EventBus } from "shared/event-bus";
import { GridService } from "shared/services/plot";

@Component()
export default class StructureComponent extends BaseComponent<{}, Model> implements OnStart {
	protected readonly gridService = GridService.getInst();
	public player!: Player;
	public active: boolean = true;
	protected readonly janitor = new Janitor();

	constructor(protected readonly components: Components) {
		super();
	}

	onStart(): void {
		this.player = Players.GetPlayerByUserId(
			Workspace.WaitForChild("Plots")
				.GetChildren()
				.find((plot): plot is Model => plot.IsAncestorOf(this.instance))!
				.GetAttribute("UserId") as number,
		)!;
		this.janitor.LinkToInstance(this.instance, false);
		this.initEvents();
	}

	protected initEvents(): void {
		for (const object of [
			EventBus.OnStructuresEditStart.Connect((player, structuresModels) => {
				if (player !== this.player || !structuresModels.includes(this.instance)) return;
				this.onEditStart();
			}),
			EventBus.OnStructuresEdit.Connect((player, structuresModels) => {
				if (player !== this.player || !structuresModels.includes(this.instance)) return;
				this.onEdit();
			}),
			() => {
				this.onDestroying();
			},
		]) {
			this.janitor.Add(object);
		}
	}

	protected onActiveChanged(active: boolean): void {}

	protected onEditStart(): void {
		this.setActive(false);
	}

	protected onEdit(): void {
		this.setActive(true);
	}

	protected onDestroying(): void {
		this.setActive(false);
	}

	private setActive(active: boolean): void {
		if (this.active !== active) {
			this.active = active;
			this.onActiveChanged(active);
		}
	}
}
