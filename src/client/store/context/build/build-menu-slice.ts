import { createProducer } from "@rbxts/reflex";
import { StructureCategory, STRUCTURES } from "shared/constants/structures";

export interface BuildMenuState {
	structureCategory: StructureCategory;
	structureInformation: {
		structureModel: Model;
		structureImage: string;
		structureDescription: string;
	};
	blueprintEditorOpen: boolean;
	buildingStructureModel: Model | undefined;
}

const intialState: BuildMenuState = {
	structureCategory: "Logistics",
	structureInformation: {
		structureModel: STRUCTURES["Conveyor"].model,
		structureImage: STRUCTURES["Conveyor"].image,
		structureDescription: STRUCTURES["Conveyor"].description,
	},
	blueprintEditorOpen: false,
	buildingStructureModel: undefined,
};

export const buildMenuSlice = createProducer(intialState, {
	setBuildMenuStructureCategory: (s, structureCategory: StructureCategory): BuildMenuState => ({
		...s,
		structureCategory: structureCategory,
	}),

	setBuildMenuStructureInformation: (
		s,
		structureInformation: {
			structureModel: Model;
			structureImage: string;
			structureDescription: string;
		},
	): BuildMenuState => ({
		...s,
		structureInformation: structureInformation,
	}),

	setBuildMenuBlueprintEditorOpen: (s, blueprintEditorOpen: boolean): BuildMenuState => ({
		...s,
		blueprintEditorOpen: blueprintEditorOpen,
	}),

	setBuildMenuBuildingStructureModel: (s, structureModel: Model | undefined): BuildMenuState => ({
		...s,
		buildingStructureModel: structureModel,
	}),
});
