import { RootState } from "..";

export const selectActiveNotifications = (state: RootState) => {
	return state.notifications.activeNotifications;
};
