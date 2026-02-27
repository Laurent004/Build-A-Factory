import { RootState } from "client/hooks/store";

export const selectSettings = (state: RootState): Record<string, unknown> => {
	return state.settings.settings;
};
