import { Component } from "@flamework/components";
import TransporterComponent from "./transporter";
import { ReplicatedStorage, TweenService, Workspace } from "@rbxts/services";
import { ITEMS, Solid } from "shared/constants/items";
import SoundService from "client/services/sound";

@Component({ tag: "DeliveryDock" })
export default class DeliveryDockComponent extends TransporterComponent {
	protected readonly soundService = SoundService.getInst();

	public override inputItem(solid: Solid): void;
	public override inputItem(fluid: string, volume: number): void;
	public override inputItem(item: Solid | string, volume?: number): void {
		if (!(item instanceof Solid)) return;
		this.queuedSolids.remove(this.queuedSolids.indexOf(item));
		item.model?.Destroy();
		item.destroyed = true;
		this.OnInput.Fire(item, 1);

		const cashEffect = ReplicatedStorage.WaitForChild("CashEffect").Clone() as Part;
		cashEffect.PivotTo(new CFrame(this.instance.PrimaryPart!.Position.add(new Vector3(0, 4, 0))));
		cashEffect.FindFirstChildOfClass("BillboardGui")!.FindFirstChildOfClass("TextLabel")!.Text = `+$${
			ITEMS[item.name].value
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
	}

	public override canInputItem(solid: Solid): boolean;
	public override canInputItem(fluid: string): boolean;
	public override canInputItem(item: Solid | string): boolean {
		return item instanceof Solid;
	}
}
