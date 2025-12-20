import { BaseComponent, Component, Components } from "@flamework/components";
import { OnStart } from "@flamework/core";
import { TweenService } from "@rbxts/services";
import { StructureState } from "shared/constants/structures";
import StructureComponent from "./structure";
import TransporterComponent from "./logistics/transporter";

@Component({ tag: "IndicatorLight" })
export default class IndicatorLightComponent extends BaseComponent<{}, Model> implements OnStart {
	private readonly colors: Record<StructureState, Color3> = {
		"No Connection": Color3.fromRGB(59, 59, 59),
		"No Power": Color3.fromRGB(176, 64, 64),
		Standby: Color3.fromRGB(190, 190, 6),
		Working: Color3.fromRGB(20, 182, 74),
	};
	private indicatorLight!: Part;
	private structureComponent!: StructureComponent;
	private blinkThread: thread | undefined;
	private blinkTween: Tween | undefined;

	constructor(private readonly components: Components) {
		super();
	}

	onStart(): void {
		this.initIndicatorLight();
	}

	private initIndicatorLight(): void {
		this.indicatorLight = this.instance.WaitForChild("IndicatorLight") as Part;
		this.structureComponent = this.components.getComponents<TransporterComponent>(this.instance)[0];
		if (this.structureComponent === undefined) return;
		this.updateIndicatorLightState(this.structureComponent.getState());
		this.structureComponent.onStateChanged.Connect((newStructureState) => {
			this.updateIndicatorLightState(newStructureState);
		});
	}

	private updateIndicatorLightState(structureState: StructureState): void {
		TweenService.Create(this.indicatorLight, new TweenInfo(0.2, Enum.EasingStyle.Linear, Enum.EasingDirection.In), {
			Color: this.colors[structureState],
		}).Play();
		if (structureState === "Standby" && this.blinkThread === undefined) {
			this.startBlinking();
		} else {
			this.stopBlinking();
		}
	}

	private startBlinking(): void {
		this.blinkThread = task.delay(1.5, () => {
			if (this.structureComponent.getState() !== "Standby") return;
			this.blinkTween = TweenService.Create(
				this.indicatorLight,
				new TweenInfo(0.2, Enum.EasingStyle.Linear, Enum.EasingDirection.In, -1, true, 0.5),
				{
					Color: this.colors["No Connection"],
				},
			);
			this.blinkTween.Play();
		});
	}

	private stopBlinking(): void {
		if (this.blinkThread !== undefined) {
			task.cancel(this.blinkThread);
		}
		this.blinkThread = undefined;
		this.blinkTween?.Cancel();
		this.blinkTween = undefined;
	}
}
