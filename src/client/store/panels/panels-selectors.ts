import { StructureAttributes } from "shared/constants/structures";
import { RootState } from "..";

export const selectPanelsStructureModel = (state: RootState) => {
	return state.panels.structureModel;
};

export const selectPanelsStructureAttributes = (state: RootState) => {
	return state.panels.structureAttributes;
};

export const selectPanelsStructureAttribute =
	<K extends keyof StructureAttributes>(structureAttributeName: K) =>
	(state: RootState) => {
		return state.panels.structureModel?.GetAttribute(structureAttributeName) as StructureAttributes[K] | undefined;
	};
