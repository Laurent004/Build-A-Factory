import { BaseComponent, Component, Components } from "@flamework/components";
import { Dependency, OnStart } from "@flamework/core";
import { TweenService } from "@rbxts/services";
import { StructureState } from "shared/constants/structures";
import StructureComponent from "./structure";

@Component({ tag: "IndicatorLight" })
export default class IndicatorLightComponent extends BaseComponent<{}, Model> implements OnStart {
	private readonly components = Dependency<Components>();
	private readonly colors: Record<StructureState, Color3> = {
		"No Connection": Color3.fromRGB(59, 59, 59),
		"No Power": Color3.fromRGB(176, 64, 64),
		Standby: Color3.fromRGB(190, 190, 6),
		Working: Color3.fromRGB(20, 182, 74),
	};

	private readonly blinkStartDelay: number = 1.5;
	private readonly blinkTI = new TweenInfo(0.2, Enum.EasingStyle.Linear, Enum.EasingDirection.In, -1, true, 0.5);

	private indicatorLight!: Part;
	private structureComponent!: StructureComponent;

	private blinkThread: thread | undefined;
	private blinkTween: Tween | undefined;

	onStart(): void {
		this.initIndicatorLight();
	}

	private initIndicatorLight(): void {
		this.indicatorLight = this.instance.WaitForChild("IndicatorLight") as Part;
		this.structureComponent = this.components.getComponents<StructureComponent>(this.instance)[0];
		this.updateIndicatorLightState(this.structureComponent.getState());

		this.structureComponent.onStateChanged.Connect((newStructureState) => {
			this.updateIndicatorLightState(newStructureState);
		});
	}

	private updateIndicatorLightState(structureState: StructureState): void {
		this.indicatorLight.Color = this.colors[structureState];
		if (structureState === "Standby" && this.blinkThread === undefined) {
			this.startBlinking();
		} else {
			this.stopBlinking();
		}
	}

	private startBlinking(): void {
		this.blinkThread = task.delay(this.blinkStartDelay, () => {
			if (this.structureComponent.getState() !== "Standby") return;
			this.blinkTween = TweenService.Create(this.indicatorLight, this.blinkTI, {
				Color: this.colors["No Connection"],
			});
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
