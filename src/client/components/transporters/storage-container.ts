import { Component } from "@flamework/components";
import TransporterComponent from "./transporter";
import { ItemName } from "shared/constants/items";

@Component({ tag: "StorageContainer" })
export default class StorageContainerComponent extends TransporterComponent {
	public override canInputItem(itemName: ItemName): boolean {
		const bufferedItemCount = this.items.filter((item) => item.Name === itemName).size();
		if (bufferedItemCount % this.attributes.itemsPerSlot! !== 0) {
			//Can still input inside some slot
			return true;
		} else {
			const bufferedSlots = math.ceil(this.items.size() / this.attributes.itemsPerSlot!);
			if (bufferedSlots >= this.attributes.itemsSlots!) {
				//No empty slot available
				return false;
			}
		}
		return true;
	}

	public getStoredItems(): Model[] {
		return this.items;
	}
}
