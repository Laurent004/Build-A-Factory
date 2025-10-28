import { Component } from "@flamework/components";
import TransporterComponent from "./transporter";
import { STRUCTURES } from "shared/constants/structures";
import { Item } from "shared/constants/items";

@Component({ tag: "StorageContainer" })
export default class StorageContainerComponent extends TransporterComponent {
	public override canInputItem(item: Item): boolean {
		return this.items.filter((bufferedItem) => bufferedItem.name === item.name).size() %
			(STRUCTURES[this.instance.Name].constants["SlotStackSize"] as number) ===
			0
			? math.ceil(this.items.size() / (STRUCTURES[this.instance.Name].constants["SlotStackSize"] as number)) <
					(STRUCTURES[this.instance.Name].constants["Slots"] as number)
			: true;
	}
}
