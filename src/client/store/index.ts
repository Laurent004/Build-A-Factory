import { combineProducers, InferState } from "@rbxts/reflex";
import { tooltipSlice } from "./overlay";
import { contextSlice } from "./context";
import { buildSlice } from "./context/tools";
import { settingsSlice } from "./context/sections";

export type RootStore = typeof store;
export type RootState = InferState<RootStore>;

export function createStore() {
	const store = combineProducers({
		context: contextSlice,
		build: buildSlice,
		settings: settingsSlice,
		tooltip: tooltipSlice,
	});
	return store;
}
export const store = createStore();
