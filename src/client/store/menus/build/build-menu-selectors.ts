import { RootState } from "client/store";
import { StructureCategory } from "shared/constants/structures";

export const selectBuildMenuStructureCategory = (state: RootState) => {
	return state.buildMenu.structureCategory;
};

export const selectBuildMenuStructureName = (state: RootState) => {
	return state.buildMenu.structureName;
};

export const selectBuildMenuStructureCategorySearchText =
	(structureCategory: StructureCategory) => (state: RootState) => {
		return state.buildMenu.structuresCategoriesSearchText[structureCategory];
	};

export const selectBuildMenuBuildingStructureName = (state: RootState) => {
	return state.buildMenu.buildingStructureName;
};

export const selectBuildMenuPreviousBuildingStructureName = (state: RootState) => {
	return state.buildMenu.previousBuildingStructureName;
};
