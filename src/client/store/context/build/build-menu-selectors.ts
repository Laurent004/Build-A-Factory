import { RootState } from "client/store";
import { StructureCategory } from "shared/constants/structures";

export const selectBuildMenuStructureCategory = (state: RootState): StructureCategory | undefined => {
	return state.buildMenu.structureCategory;
};

export const selectBuildMenuStructureInformation = (
	state: RootState,
): { structureModel: Model; structureImage: string; structureDescription: string } => {
	return state.buildMenu.structureInformation;
};

export const selectBuildMenuBlueprintEditorOpen = (state: RootState): boolean => {
	return state.buildMenu.blueprintEditorOpen;
};

export const selectBuildMenuBuildingStructureModel = (state: RootState): Model | undefined => {
	return state.buildMenu.buildingStructureModel;
};
