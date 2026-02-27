import { Component } from "@flamework/components";
import { Solid } from "shared/constants/items";
import TransporterComponent from "./transporter";

@Component({ tag: "DeliveryDock" })
export default class DeliveryDockComponent extends TransporterComponent {
	public override inputItem(solid: Solid): void;
	public override inputItem(fluid: string, volume: number): void;
	public override inputItem(item: Solid | string, volume?: number): void {
		if (!(item instanceof Solid)) return;
		this.queuedSolids.remove(this.queuedSolids.indexOf(item));
		item.model?.Destroy();
		item.destroyed = true;
		this.OnInput.Fire(item);
	}
}
