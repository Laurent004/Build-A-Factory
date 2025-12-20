import { Service } from "@flamework/core";
import { Object } from "@rbxts/luau-polyfill";
import { StructureData, STRUCTURES } from "shared/constants/structures";

@Service({})
export default class FactoryService {
	public createStructure(structureData: StructureData, cf?: CFrame, parent?: Instance): Model {
		const newStructureModel = STRUCTURES[structureData.name].model.Clone();
		newStructureModel.PivotTo((cf ?? CFrame.identity).mul(new CFrame(...structureData.cf)));
		for (const [attributeName, attributeValue] of Object.entries(
			structureData.attributes.size() > 0 ? structureData.attributes : STRUCTURES[structureData.name].attributes,
		)) {
			newStructureModel.SetAttribute(attributeName as string, attributeValue as AttributeValue);
		}
		for (const tag of STRUCTURES[structureData.name].tags) {
			newStructureModel.AddTag(tag);
		}
		newStructureModel.Parent = parent;
		const visited = new Set<Model>();
		for (const childStructureData of structureData.children as StructureData[]) {
			const structureModel = newStructureModel
				.GetChildren()
				.find(
					(instance): instance is Model =>
						instance.IsA("Model") && instance.Name === childStructureData.name && !visited.has(instance),
				);
			if (structureModel !== undefined) {
				visited.add(structureModel);
				structureModel.PivotTo((cf ?? CFrame.identity).mul(new CFrame(...childStructureData.cf)));
				for (const [attributeName, attributeValue] of Object.entries(
					childStructureData.attributes.size() > 0
						? childStructureData.attributes
						: STRUCTURES[childStructureData.name].attributes,
				)) {
					structureModel.SetAttribute(attributeName as string, attributeValue as AttributeValue);
				}
				for (const tag of STRUCTURES[childStructureData.name].tags) {
					structureModel.AddTag(tag);
				}
			} else {
				visited.add(this.createStructure(childStructureData, cf, newStructureModel));
			}
		}
		return newStructureModel;
	}

	public createPowerLine(startAttachment: Attachment, endAttachment: Attachment, parent?: Instance): RopeConstraint {
		const newPowerLine = STRUCTURES["Power Line"].model.FindFirstChildOfClass("RopeConstraint")!.Clone();
		newPowerLine.Attachment0 = startAttachment;
		newPowerLine.Attachment1 = endAttachment;
		newPowerLine.Parent = parent;
		return newPowerLine;
	}
}
