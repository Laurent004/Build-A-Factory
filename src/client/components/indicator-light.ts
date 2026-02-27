import { BaseComponent, Component, Components } from "@flamework/components";
import { OnStart } from "@flamework/core";
import { TweenService } from "@rbxts/services";
import StructureComponent from "../../shared/components/structure";
import { Janitor } from "@rbxts/janitor";
import { isPowerConsumer, isPowerProducer, PowerConsumer, PowerProducer } from "shared/services/plot";

@Component({ tag: "IndicatorLight" })
export default class IndicatorLightComponent extends BaseComponent<{}, Model> implements OnStart {
	private readonly colors: Record<string, Color3> = {
		"No Connection": Color3.fromRGB(59, 59, 59),
		"No Power": Color3.fromRGB(176, 64, 64),
		Standby: Color3.fromRGB(190, 190, 6),
		Working: Color3.fromRGB(20, 182, 74),
	};
	private indicatorLight!: Part;
	private structureComponent!: StructureComponent & (PowerConsumer | PowerProducer);
	private blinkThread: thread | undefined;
	private blinkTween: Tween | undefined;
	private readonly janitor = new Janitor();

	constructor(private readonly components: Components) {
		super();
	}

	onStart(): void {
		this.indicatorLight = this.instance.WaitForChild("IndicatorLight") as Part;
		let structureComponent: StructureComponent | undefined;
		while (
			structureComponent === undefined ||
			(!isPowerConsumer(structureComponent) && !isPowerProducer(structureComponent))
		) {
			structureComponent = this.components.getComponents<StructureComponent>(this.instance)[0];
			task.wait();
		}
		this.structureComponent = structureComponent;
		this.janitor.LinkToInstance(this.instance, false);
		this.initEvents();
	}

	private initEvents(): void {
		if (isPowerConsumer(this.structureComponent)) {
			this.updateIndicatorLight(this.structureComponent.state);
			this.janitor.Add(
				this.structureComponent.OnStateChanged.Connect((state) => {
					this.updateIndicatorLight(state);
				}),
			);
		} else if (
			isPowerProducer(this.structureComponent) &&
			this.structureComponent.state !== undefined &&
			this.structureComponent.OnStateChanged !== undefined
		) {
			this.updateIndicatorLight(this.structureComponent.state);
			this.janitor.Add(
				this.structureComponent.OnStateChanged.Connect((state) => {
					this.updateIndicatorLight(state);
				}),
			);
		}
	}

	private updateIndicatorLight(state: string): void {
		if (state === "No Power" || state === "Standby") {
			this.blinkThread = task.delay(2, () => {
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
			if (this.blinkThread !== undefined) {
				task.cancel(this.blinkThread);
				this.blinkThread = undefined;
			}
			this.blinkTween?.Cancel();
			this.blinkTween = undefined;
		}
		TweenService.Create(this.indicatorLight, new TweenInfo(0.2, Enum.EasingStyle.Linear, Enum.EasingDirection.In), {
			Color: this.colors[state],
		}).Play();
	}
}
