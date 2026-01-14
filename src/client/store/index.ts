import { combineProducers, InferState } from "@rbxts/reflex";
import { tooltipSlice } from "./overlay";
import { buildSlice, contextSlice } from "./context";

export type RootStore = typeof store;
export type RootState = InferState<RootStore>;

export function createStore() {
	const store = combineProducers({
		context: contextSlice,
		build: buildSlice,
		tooltip: tooltipSlice,
	});
	return store;
}
export const store = createStore();
