import { createProducer } from "@rbxts/reflex";
import { ItemName } from "shared/constants/items";

export interface ItemMenuState {
	readonly itemName: ItemName;
	readonly itemSearchText: string;
}

const initialState: ItemMenuState = {
	itemName: "Iron Ore",
	itemSearchText: "",
};

export const itemMenuSlice = createProducer(initialState, {
	setItemMenuItemDefinition: (s, itemName: ItemName) => ({
		...s,
		itemName: itemName,
	}),
	setItemMenuItemSearchText: (s, itemSearchText: string) => ({
		...s,
		itemSearchText: itemSearchText,
	}),
});
