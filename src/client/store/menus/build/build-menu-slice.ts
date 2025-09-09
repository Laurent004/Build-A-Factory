import { Object } from "@rbxts/luau-polyfill";
import { createProducer } from "@rbxts/reflex";
import { StructureCategory, StructureName } from "shared/constants/structures";

export interface BuildMenuState {
	structureCategory: StructureCategory;
	structureName: StructureName;
	structuresCategoriesSearchText: Record<StructureCategory, string>;
	buildingStructureName: StructureName | undefined;
	previousBuildingStructureName: StructureName;
}

const intialState: BuildMenuState = {
	structureCategory: "Transportation",
	structureName: "Straight Conveyor",
	structuresCategoriesSearchText: {
		Transportation: "",
		Production: "",
	},
	buildingStructureName: undefined,
	previousBuildingStructureName: "Straight Conveyor",
};

export const buildMenuSlice = createProducer(intialState, {
	setBuildMenuStructureCategory: (s, structureCategory: StructureCategory) => ({
		...s,
		structureCategory: structureCategory,
	}),

	setBuildMenuStructureName: (s, structureName: StructureName) => ({
		...s,
		structureName: structureName,
	}),

	setBuildMenuStructureCategorySearchText: (s, structureCategory: StructureCategory, structureSearchText: string) => {
		const newStructuresCategoriesSearchText = { ...s.structuresCategoriesSearchText };
		newStructuresCategoriesSearchText[structureCategory] = structureSearchText;
		return {
			...s,
			structuresCategoriesSearchText: newStructuresCategoriesSearchText,
		};
	},

	setBuildMenuBuildingStructureName: (s, structureName: StructureName | undefined) => ({
		...s,
		buildingStructureName: structureName,
	}),
	setBuildMenuPreviousBuildingStructureName: (s, structureName: StructureName) => ({
		...s,
		previousBuildingStructureName: structureName,
	}),
});
