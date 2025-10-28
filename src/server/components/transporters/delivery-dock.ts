import { Component } from "@flamework/components";
import TransporterComponent from "./transporter";
import { Item } from "shared/constants/items";
import { OnStart } from "@flamework/core";

@Component({ tag: "DeliveryDock" })
export default class DeliveryDockComponent extends TransporterComponent implements OnStart {
	public override canInputItem(item: Item): boolean {
		return true;
	}
}
