import { Service } from "@flamework/core";
import { Object } from "@rbxts/luau-polyfill";
import { StructureName, STRUCTURES } from "shared/constants/structures";

@Service({})
export default class StructureFactoryService {
	public create(
		plot: Model,
		name: StructureName,
		targetCF: CFrame,
		attributes: Record<string, AttributeValue>,
	): Model {
		const structureDefinition = STRUCTURES[name];
		const structureModel = structureDefinition.model.Clone();
		if (attributes !== undefined && Object.entries(attributes).size() > 0) {
			for (const [attributeName, attribute] of Object.entries(attributes)) {
				structureModel.SetAttribute(attributeName, attribute);
			}
		} else {
			for (const [attributeName, value] of Object.entries(structureDefinition.attributes)) {
				structureModel.SetAttribute(attributeName, value);
			}
		}
		structureModel.AddTag(STRUCTURES[name].tag);
		structureModel.PivotTo(targetCF);
		structureModel.Parent = plot.WaitForChild("Structures");
		return structureModel;
	}
}
