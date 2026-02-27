import { createProducer } from "@rbxts/reflex";
import { STRUCTURES } from "shared/constants/structures";

interface BuildState {
	structureCategory: string;
	structureInfo: {
		structureImage: string;
		structureDescription: string;
		structureModel: Model;
	};
	isBlueprintEditorOpen: boolean;
	buildingStructureModel: Model | undefined;
}

const intialState: BuildState = {
	structureCategory: "Logistics",
	structureInfo: {
		structureImage: STRUCTURES["Conveyor"].image,
		structureDescription: STRUCTURES["Conveyor"].description,
		structureModel: STRUCTURES["Conveyor"].model,
	},
	isBlueprintEditorOpen: false,
	buildingStructureModel: undefined,
};

export const buildSlice = createProducer(intialState, {
	seStructureCategory: (s, structureCategory: string): BuildState => ({
		...s,
		structureCategory: structureCategory,
	}),

	setStructureInfo: (
		s,
		structureInfo: {
			structureImage: string;
			structureDescription: string;
			structureModel: Model;
		},
	): BuildState => ({
		...s,
		structureInfo: structureInfo,
	}),

	setBlueprintEditorOpen: (s, blueprintEditorOpen: boolean): BuildState => ({
		...s,
		isBlueprintEditorOpen: blueprintEditorOpen,
	}),

	setBuildingStructureModel: (s, structureModel: Model | undefined): BuildState => ({
		...s,
		buildingStructureModel: structureModel,
	}),
});
