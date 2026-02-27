import { BaseComponent, Component, Components } from "@flamework/components";
import { ReplicatedStorage, TweenService, Workspace } from "@rbxts/services";
import { ITEMS, Solid } from "shared/constants/items";
import SoundService from "client/services/sound";
import TransporterComponent from "../transporter";
import { OnStart } from "@flamework/core";

@Component({ tag: "DeliveryDock" })
export default class DeliveryDockEffectsComponent extends BaseComponent<{}, Model> implements OnStart {
	protected readonly soundService = SoundService.getInst();
	private transporterComponent!: TransporterComponent;
	private readonly connections: RBXScriptConnection[] = [];

	constructor(private readonly components: Components) {
		super();
	}

	onStart(): void {
		this.transporterComponent = this.components.getComponents<TransporterComponent>(this.instance)[0];
		this.initEvents();
	}

	private initEvents(): void {
		this.connections.push(
			this.transporterComponent.OnInput.Connect((item) => {
				const cashEffect = ReplicatedStorage.WaitForChild("CashEffect").Clone() as Part;
				cashEffect.PivotTo(new CFrame(this.instance.PrimaryPart!.Position.add(new Vector3(0, 4, 0))));
				cashEffect.FindFirstChildOfClass("BillboardGui")!.FindFirstChildOfClass("TextLabel")!.Text = `+$${
					ITEMS[(item as Solid).name].value
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
			this.instance.Destroying.Once(() => {
				for (const connection of this.connections) {
					connection.Disconnect();
				}
				this.connections.clear();
			}),
		);
	}
}
