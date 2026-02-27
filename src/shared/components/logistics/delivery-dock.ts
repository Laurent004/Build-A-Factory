import { Component } from "@flamework/components";
import { ITEMS, Solid } from "shared/constants/items";
import TransporterComponent from "./transporter";
import CurrencyService from "shared/services/progression/currency";
import { RunService } from "@rbxts/services";

@Component({ tag: "DeliveryDock" })
export default class DeliveryDockComponent extends TransporterComponent {
	private readonly currencyService = CurrencyService.getInst();

	public override inputItem(solid: Solid): void;
	public override inputItem(fluid: string, volume: number): void;
	public override inputItem(item: Solid | string, volume?: number): void {
		if (!typeIs(item, "table")) return;
		this.queuedSolids.remove(this.queuedSolids.indexOf(item));
		if (item.m?.Parent !== undefined) {
			this.poolService.add(item.m);
		}
		item.p = -1;
		this.OnInput.Fire(item);
		if (RunService.IsServer()) {
			this.currencyService.addCurrency(this.player, "Cash", ITEMS[item.name].value!.cash);
		}
	}

	public override canInputItem(solid: Solid): boolean;
	public override canInputItem(fluid: string): boolean;
	public override canInputItem(item: Solid | string): boolean {
		return typeIs(item, "table");
	}
}
