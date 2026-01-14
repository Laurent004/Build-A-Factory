import { RootState } from "client/store";

export const selectTips = (state: RootState): string[] => {
	return state.tooltip.tips;
};
