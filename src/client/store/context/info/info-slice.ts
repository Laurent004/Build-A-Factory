import { Object } from "@rbxts/luau-polyfill";
import { createProducer } from "@rbxts/reflex";
import { Events } from "client/network";
import { STRUCTURES } from "shared/constants/structures";

export interface InfoState {
	structuresModels: Model[];
	structureAttributes: Record<string, AttributeValue | undefined>;
}

const initialState: InfoState = {
	structuresModels: [],
	structureAttributes: {},
};

export const infoSlice = createProducer(initialState, {
	setInfoSelection: (s, selection: Model | undefined) => {
		if (
			selection !== undefined &&
			selection
				.GetChildren()
				.filter((instance): instance is Model => instance.IsA("Model") && instance.Name in STRUCTURES)
				.size() > 0
		) {
			{
				let structuresModels: Model[] = [];
				for (const [structureName, structureDefinition] of Object.entries(STRUCTURES)) {
					const models = [selection, ...selection.GetChildren()].filter(
						(instance): instance is Model => instance.IsA("Model") && instance.Name === structureName,
					);
					if (models.size() <= 0) continue;

					if (structuresModels.size() <= 0) {
						structuresModels = models;
					} else if (
						structureDefinition.selectionPriority > STRUCTURES[structuresModels[0].Name].selectionPriority
					) {
						structuresModels = models;
					}
				}

				const structureAttributes: Record<string, AttributeValue> = {};
				for (const [attributeName, attributeValue] of structuresModels[0].GetAttributes()) {
					structureAttributes[attributeName] = attributeValue;
				}

				return {
					...s,
					structuresModels: structuresModels,
					structureAttributes: structureAttributes,
				};
			}
		}

		return {
			...s,
			structuresModels: [],
			structureAttributes: {},
		};
	},

	setInfoStructuresAttribute: (s, attributeName: string, attributeValue: AttributeValue | undefined) => {
		if (s.structuresModels.size() > 0 && s.structuresModels[0].GetAttribute(attributeName) !== attributeValue) {
			Events.SetStructuresAttribute(s.structuresModels, attributeName, attributeValue);
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
