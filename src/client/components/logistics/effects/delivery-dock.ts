import { BaseComponent, Component, Components } from "@flamework/components";
import { ReplicatedStorage, TweenService, Workspace } from "@rbxts/services";
import { ITEMS } from "shared/constants/items";
import SoundService from "client/services/sound";
import { OnStart } from "@flamework/core";
import { Janitor } from "@rbxts/janitor";
import TransporterComponent from "shared/components/logistics/transporter";

@Component({ tag: "DeliveryDock" })
export default class DeliveryDockEffectsComponent extends BaseComponent<{}, Model> implements OnStart {
	protected readonly soundService = SoundService.getInst();
	private transporterComponent!: TransporterComponent;
	private readonly janitor = new Janitor();

	constructor(private readonly components: Components) {
		super();
	}

	onStart(): void {
		let transporterComponent: TransporterComponent | undefined;
		while (transporterComponent === undefined) {
			transporterComponent = this.components.getComponents<TransporterComponent>(this.instance)[0];
			task.wait();
		}
		this.transporterComponent = transporterComponent;
		this.janitor.LinkToInstance(this.instance, false);
		this.initEvents();
	}

	private initEvents(): void {
		this.janitor.Add(
			this.transporterComponent.OnInput.Connect((item) => {
				if (!typeIs(item, "table")) return;
				const cashEffect = ReplicatedStorage.WaitForChild("CashEffect").Clone() as Part;
				cashEffect.PivotTo(new CFrame(this.instance.PrimaryPart!.Position.add(new Vector3(0, 4, 0))));
				cashEffect.FindFirstChildOfClass("BillboardGui")!.FindFirstChildOfClass("TextLabel")!.Text = `+$${
					ITEMS[item.name].value!.cash
				}`;
				cashEffect.Parent = Workspace;
				TweenService.Create(cashEffect, new TweenInfo(0.7, Enum.EasingStyle.Linear, Enum.EasingDirection.In), {
					Position: this.instance.PrimaryPart!.Position.add(new Vector3(0, 10, 0)),
				}).Play();
				TweenService.Create(
					cashEffect.FindFirstChildOfClass("BillboardGui")!.FindFirstChildOfClass("TextLabel")!,
					new TweenInfo(0.7, Enum.EasingStyle.Linear, Enum.EasingDirection.In),
					{
						TextTransparency: 1,
					},
				).Play();
				TweenService.Create(
					cashEffect
						.FindFirstChildOfClass("BillboardGui")!
						.FindFirstChildOfClass("TextLabel")!
						.FindFirstChildOfClass("UIStroke")!,
					new TweenInfo(0.7, Enum.EasingStyle.Linear, Enum.EasingDirection.In),
					{
						Transparency: 1,
					},
				).Play();
				task.delay(0.7, () => {
					cashEffect?.Destroy();
				});
				this.soundService.playSound("sfx/cash", this.instance.GetPivot().Position);
			}),
		);
	}
}
