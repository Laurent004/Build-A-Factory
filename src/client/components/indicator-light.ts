import { BaseComponent, Component, Components } from "@flamework/components";
import { OnStart } from "@flamework/core";
import { TweenService } from "@rbxts/services";
import StructureComponent from "./structure";
import { Janitor } from "@rbxts/janitor";

@Component({ tag: "IndicatorLight" })
export default class IndicatorLightComponent extends BaseComponent<{}, Model> implements OnStart {
	private readonly colors: Record<string, Color3> = {
		"No Connection": Color3.fromRGB(59, 59, 59),
		"No Power": Color3.fromRGB(176, 64, 64),
		Standby: Color3.fromRGB(190, 190, 6),
		Working: Color3.fromRGB(20, 182, 74),
	};
	private indicatorLight!: Part;
	private structureComponent!: StructureComponent;
	private blinkTween: Tween | undefined;
	private readonly janitor = new Janitor();

	constructor(private readonly components: Components) {
		super();
	}

	onStart(): void {
		this.indicatorLight = this.instance.WaitForChild("IndicatorLight") as Part;
		this.structureComponent = this.components.getComponents<StructureComponent>(this.instance)[0];
		this.janitor.LinkToInstance(this.instance, false);
		this.updateIndicatorLight();
		this.initEvents();
	}

	private initEvents(): void {
		this.janitor.Add(
			this.structureComponent.OnStateChanged.Connect(() => {
				this.updateIndicatorLight();
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
