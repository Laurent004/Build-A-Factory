import { RootState } from "client/store";

export const selectStructureCategory = (state: RootState): string | undefined => {
	return state.build.structureCategory;
};

export const selectStructureInfo = (
	state: RootState,
): { structureImage: string; structureDescription: string; structureModel: Model } => {
	return state.build.structureInfo;
};

export const selectIsBlueprintEditorOpen = (state: RootState): boolean => {
	return state.build.isBlueprintEditorOpen;
};

export const selectBuildingStructureModel = (state: RootState): Model | undefined => {
	return state.build.buildingStructureModel;
};
