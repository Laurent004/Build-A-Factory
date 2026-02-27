import { RootState } from "client/store";

export const selectSettings = (state: RootState): Record<string, unknown> => {
	return state.settings.settings;
};
