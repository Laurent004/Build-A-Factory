import { combineProducers, InferState } from "@rbxts/reflex";
import { contextSlice } from "./context";
import { buildMenuSlice } from "./menus/build";
import { itemMenuSlice } from "./menus/item";
import { panelsSlice } from "./panels";
import { notificationsSlice } from "./notifications/notifications-slice";

export type RootStore = typeof store;
export type RootState = InferState<RootStore>;

export function createStore() {
	const store = combineProducers({
		context: contextSlice,
		buildMenu: buildMenuSlice,
		itemMenu: itemMenuSlice,
		panels: panelsSlice,

		notifications: notificationsSlice,
	});
	return store;
}
export const store = createStore();
