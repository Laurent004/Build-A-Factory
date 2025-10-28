import { createProducer } from "@rbxts/reflex";
import { StructureCategory, STRUCTURES } from "shared/constants/structures";

export interface BuildMenuState {
	structureCategory: StructureCategory;
	structureInformation: {
		structureModel: Model;
		structureDescription: string;
	};
	blueprintEditorOpen: boolean;
	buildingStructureModel: Model | undefined;
}

const intialState: BuildMenuState = {
	structureCategory: "Transportation",
	structureInformation: {
		structureModel: STRUCTURES["Straight Conveyor"].model,
		structureDescription: STRUCTURES["Straight Conveyor"].description,
	},
	blueprintEditorOpen: false,
	buildingStructureModel: undefined,
};

export const buildMenuSlice = createProducer(intialState, {
	setBuildMenuStructureCategory: (s, structureCategory: StructureCategory) => ({
		...s,
		structureCategory: structureCategory,
	}),

	setBuildMenuStructureInformation: (
		s,
		structureInformation: {
			structureModel: Model;
			structureDescription: string;
		},
	) => ({
		...s,
		structureInformation: structureInformation,
	}),

	setBuildMenuBlueprintEditorOpen: (s, blueprintEditorOpen: boolean) => ({
		...s,
		blueprintEditorOpen: blueprintEditorOpen,
	}),

	setBuildMenuBuildingStructureModel: (s, structureModel: Model | undefined) => ({
		...s,
		buildingStructureModel: structureModel,
	}),
});
