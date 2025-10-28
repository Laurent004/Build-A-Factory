import { RootState } from "../..";

export const selectInfoSelectionStructureModel = (state: RootState) => {
	return state.info.structuresModels.size() > 0 ? state.info.structuresModels[0] : undefined;
};

export const selectInfoStructureAttribute = (attributeName: string) => (state: RootState) => {
	return state.info.structureAttributes[attributeName];
};
