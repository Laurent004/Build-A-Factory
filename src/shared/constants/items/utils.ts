import { Workspace } from "@rbxts/services";
import { ITEMS } from "./items";
import { ItemName } from "./types";

export function createItem(itemName: ItemName, targetCF: CFrame) {
	const itemModel = ITEMS[itemName].model.Clone();
	itemModel.PivotTo(targetCF);
	itemModel.Parent = Workspace;
	return itemModel;
}
