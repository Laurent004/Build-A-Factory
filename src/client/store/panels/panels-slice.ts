import { createProducer } from "@rbxts/reflex";
import { StructureAttributes } from "shared/constants/structures";

export interface PanelsState {
	structureModel: Model | undefined;
	structureAttributes: Partial<Record<keyof StructureAttributes, AttributeValue>> | undefined;
}

const initialState: PanelsState = {
	structureModel: undefined,
	structureAttributes: undefined,
};

export const panelsSlice = createProducer(initialState, {
	setPanelsStructureModel: (s, structureModel: Model | undefined) => ({
		...s,
		structureModel: structureModel,
	}),
	setPanelsStructureAttributes: (
		s,
		structureAttributes: Partial<Record<keyof StructureAttributes, AttributeValue>> | undefined,
	) => ({
		...s,
		structureAttributes: structureAttributes,
	}),
	setPanelsStructureAttribute: <K extends keyof StructureAttributes>(
		s: PanelsState,
		structureAttributeName: K,
		structureAttributeValue: StructureAttributes[K],
	) => {
		const newStructureAttributes = { ...(s.structureAttributes ?? {}) };
		if (structureAttributeValue === undefined) {
			newStructureAttributes[structureAttributeName] = "";
		} else {
			newStructureAttributes[structureAttributeName] = structureAttributeValue;
		}
		return {
			...s,
			structureAttributes: newStructureAttributes,
		};
	},
});
