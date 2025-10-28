import { Component } from "@flamework/components";
import TransporterComponent from "./transporter";
import { ReplicatedStorage, TweenService, Workspace } from "@rbxts/services";
import { ITEMS } from "shared/constants/items";

@Component({ tag: "DeliveryDock" })
export default class DeliveryDockComponent extends TransporterComponent {
	private readonly cashEffectTI = new TweenInfo(1, Enum.EasingStyle.Linear, Enum.EasingDirection.In);

	public override inputItem(item: Model): void {
		super.inputItem(item);

		const cashEffect = ReplicatedStorage.WaitForChild("CashEffect").Clone() as Part;
		cashEffect.Position = this.instance.PrimaryPart!.Position.add(new Vector3(0, 4, 0));
		const cashText = cashEffect.FindFirstChildOfClass("BillboardGui")!.FindFirstChildOfClass("TextLabel")!;
		cashText.Text = `+ $${ITEMS[item.Name].value}`;
		cashEffect.Parent = Workspace;

		const tween = TweenService.Create(cashEffect, this.cashEffectTI, {
			Position: this.instance.PrimaryPart!.Position.add(new Vector3(0, 12, 0)),
		});
		tween.Play();
		tween.Completed.Once(() => {
			cashEffect.Destroy();
		});
		TweenService.Create(cashText, this.cashEffectTI, { TextTransparency: 1 }).Play();
	}

	public override canInputItem(item: Model): boolean {
		return true;
	}
}
