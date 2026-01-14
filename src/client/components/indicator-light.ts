import { BaseComponent, Component, Components } from "@flamework/components";
import { OnStart } from "@flamework/core";
import { Players, TweenService, Workspace } from "@rbxts/services";
import StructureComponent from "./structure";
import { Events } from "client/network";
import { EventBus } from "client/event-bus";

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

@Component({ tag: "IndicatorLight" })
export default class IndicatorLightComponent extends BaseComponent<{}, Model> implements OnStart {
	private readonly colors: Record<string, Color3> = {
		"No Connection": Color3.fromRGB(59, 59, 59),
		"No Power": Color3.fromRGB(176, 64, 64),
		Standby: Color3.fromRGB(190, 190, 6),
		Working: Color3.fromRGB(20, 182, 74),
	};
	private player!: Player;
	private indicatorLight!: Part;
	private structureComponent!: StructureComponent;
	private readonly connections: RBXScriptConnection[] = [];
	private blinkTween: Tween | undefined;

	constructor(private readonly components: Components) {
		super();
	}

	onStart(): void {
		this.player = Players.GetPlayerByUserId(
			Workspace.WaitForChild("Plots")
				.GetChildren()
				.find((plot) => plot.IsAncestorOf(this.instance))!
				.GetAttribute("UserId") as number,
		)!;
		this.indicatorLight = this.instance.WaitForChild("IndicatorLight") as Part;
		if (initializedPlayers.has(this.player)) {
			this.structureComponent = this.components.getComponents<StructureComponent>(this.instance)[0];
			this.initEvents();
		} else {
			this.connections.push(
				EventBus.OnPlotInitialization.Connect((player) => {
					if (player === this.player && simulateFactories.includes(this.player.UserId)) {
						this.structureComponent = this.components.getComponents<StructureComponent>(this.instance)[0];
						this.updateIndicatorLight();
						this.initEvents();
					}
				}),
			);
		}
	}

	private initEvents(): void {
		this.connections.push(
			this.structureComponent.OnStateChanged.Connect(() => {
				this.updateIndicatorLight();
			}),
			Events.OnStructuresDestroying.connect((player, structuresModels) => {
				if (player !== this.player) return;
				if (structuresModels.includes(this.instance)) {
					for (const connection of this.connections) {
						connection.Disconnect();
					}
				}
			}),
		);
	}

	private updateIndicatorLight(): void {
		if (this.structureComponent.state === "Standby" && this.blinkTween === undefined) {
			task.delay(1.5, () => {
				if (this.structureComponent.state !== "Standby" || this.blinkTween !== undefined) return;
				this.blinkTween = TweenService.Create(
					this.indicatorLight,
					new TweenInfo(0.2, Enum.EasingStyle.Linear, Enum.EasingDirection.In, -1, true, 0.5),
					{
						Color: this.colors["No Connection"],
					},
				);
				this.blinkTween.Play();
			});
		} else {
			this.blinkTween?.Cancel();
			this.blinkTween = undefined;
		}
		TweenService.Create(this.indicatorLight, new TweenInfo(0.2, Enum.EasingStyle.Linear, Enum.EasingDirection.In), {
			Color: this.colors[this.structureComponent.state],
		}).Play();
	}
}
