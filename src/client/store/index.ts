import { combineProducers, InferState } from "@rbxts/reflex";
import { contextSlice } from "./context";
import { buildMenuSlice } from "./context/build";
import { itemMenuSlice } from "./context/item";

export type RootStore = typeof store;
export type RootState = InferState<RootStore>;

export function createStore() {
	const store = combineProducers({
		context: contextSlice,
		buildMenu: buildMenuSlice,
		itemMenu: itemMenuSlice,
	});
	return store;
}
export const store = createStore();
