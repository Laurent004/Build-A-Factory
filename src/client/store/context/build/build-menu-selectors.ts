import { RootState } from "client/store";

export const selectBuildMenuStructureCategory = (state: RootState) => {
	return state.buildMenu.structureCategory;
};

export const selectBuildMenuStructureInformation = (state: RootState) => {
	return state.buildMenu.structureInformation;
};

export const selectBuildMenuBlueprintEditorOpen = (state: RootState) => {
	return state.buildMenu.blueprintEditorOpen;
};

export const selectBuildMenuBuildingStructureModel = (state: RootState) => {
	return state.buildMenu.buildingStructureModel;
};
