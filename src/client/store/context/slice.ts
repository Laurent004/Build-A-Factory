import { Object } from "@rbxts/luau-polyfill";
import { createProducer } from "@rbxts/reflex";
import { Events } from "client/network";
import { STRUCTURES } from "shared/constants/structures";

interface ContextState {
	readonly context: string | undefined;
	readonly isContextOpen: boolean | undefined;
	readonly structuresModels: Model[];
	readonly structureAttributes: Record<string, AttributeValue | undefined>;
}

const initialState: ContextState = {
	context: undefined,
	isContextOpen: undefined,
	structuresModels: [],
	structureAttributes: {},
};

export const contextSlice = createProducer(initialState, {
	setContext: (s, context: string | undefined): ContextState => {
		return context === s.context
			? { ...s, context: undefined, isContextOpen: undefined, structuresModels: [], structureAttributes: {} }
			: { ...s, context: context, isContextOpen: true, structuresModels: [], structureAttributes: {} };
	},

	setContextOpen: (s, open: boolean): ContextState => {
		return { ...s, isContextOpen: open };
	},

	setContextStructuresModels: (s, selectedStructuresModels: Model[]): ContextState => {
		if (selectedStructuresModels.size() === 0)
			return {
				...s,
				structuresModels: [],
				structureAttributes: {},
			};

		let structuresModels: Model[] = [];
		for (const [structureName, structureDefinition] of Object.entries(STRUCTURES)) {
			const models = selectedStructuresModels.filter((structureModel) => structureModel.Name === structureName);
			if (models.size() === 0) continue;
			if (structuresModels.size() === 0) {
				structuresModels = models;
			} else if (structureDefinition.priority > STRUCTURES[structuresModels[0].Name].priority) {
				structuresModels = models;
			}
		}

		const newStructuresModels = [...selectedStructuresModels];
		const index = newStructuresModels.indexOf(structuresModels[0]);
		[newStructuresModels[0], newStructuresModels[index]] = [newStructuresModels[index], newStructuresModels[0]];

		return {
			...s,
			structuresModels: newStructuresModels,
			structureAttributes: Object.entries(newStructuresModels[0].GetAttributes()).reduce<
				Record<string, AttributeValue | undefined>
			>((structureAttributes, [attributeName, attributeValue]) => {
				structureAttributes[attributeName] = attributeValue;
				return structureAttributes;
			}, {}),
		};
	},

	setContextStructuresModelsAttribute: (
		s,
		attributeName: string,
		attributeValue: AttributeValue | undefined,
	): ContextState => {
		if (s.structuresModels.size() > 0 && s.structuresModels[0].GetAttribute(attributeName) !== attributeValue) {
			Events.SetStructuresAttribute(
				s.structuresModels.filter((structureModel) => structureModel.Name === s.structuresModels[0].Name),
				attributeName,
				attributeValue,
			);
			return {
				...s,
				structureAttributes: {
					...s.structureAttributes,
					[attributeName]: attributeValue,
				},
			};
		}
		return s;
	},
});
