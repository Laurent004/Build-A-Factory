import { createProducer } from "@rbxts/reflex";

export interface ItemMenuState {
	readonly itemName: string;
}

const initialState: ItemMenuState = {
	itemName: "Iron Ore",
};

export const itemMenuSlice = createProducer(initialState, {
	setItemMenuItemName: (s, itemName: string) => ({
		...s,
		itemName: itemName,
	}),
});
