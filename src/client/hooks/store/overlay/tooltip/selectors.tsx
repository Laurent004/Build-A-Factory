import { RootState } from "client/hooks/store";

export const selectTips = (state: RootState): string[] => {
	return state.tooltip.tips;
};
