import { RootState } from "..";

export const selectContext = (state: RootState) => {
	return state.context.context;
};

export const selectContextOpen = (state: RootState) => {
	return state.context.contextOpen;
};
