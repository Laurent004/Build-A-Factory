import { Object } from "@rbxts/luau-polyfill";
import { createProducer } from "@rbxts/reflex";
import { Context } from "client/constants/navigation";
import { Events } from "client/network";
import { STRUCTURES } from "shared/constants/structures";

export interface ContextState {
	readonly context: Context | undefined;
	readonly contextOpen: boolean | undefined;
	readonly structuresModels: Model[];
	readonly structureAttributes: Record<string, AttributeValue | undefined>;
}

const initialState: ContextState = {
	context: undefined,
	contextOpen: undefined,
	structuresModels: [],
	structureAttributes: {},
};

export const contextSlice = createProducer(initialState, {
	setContext: (s, context: Context | undefined): ContextState => {
		return context === s.context
			? { ...s, context: undefined, contextOpen: undefined, structuresModels: [], structureAttributes: {} }
			: { ...s, context: context, contextOpen: true, structuresModels: [], structureAttributes: {} };
	},

	setContextOpen: (s, open: boolean): ContextState => {
		return { ...s, contextOpen: open };
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
		newStructuresModels.remove(newStructuresModels.indexOf(structuresModels[0]));
		newStructuresModels.unshift(structuresModels[0]);
		const newStructuresAttributes: Record<string, AttributeValue | undefined> = {};
		for (const [attributeName, attributeValue] of newStructuresModels[0].GetAttributes()) {
			newStructuresAttributes[attributeName] = attributeValue;
		}

		return {
			...s,
			structuresModels: newStructuresModels,
			structureAttributes: newStructuresAttributes,
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
