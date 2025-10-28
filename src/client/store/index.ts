import { combineProducers, InferState } from "@rbxts/reflex";
import { contextSlice } from "./context";
import { buildMenuSlice } from "./context/build";
import { itemMenuSlice } from "./context/item";
import { infoSlice } from "./context/info";

export type RootStore = typeof store;
export type RootState = InferState<RootStore>;

export function createStore() {
	const store = combineProducers({
		context: contextSlice,
		buildMenu: buildMenuSlice,
		itemMenu: itemMenuSlice,
		info: infoSlice,
	});
	return store;
}
export const store = createStore();
