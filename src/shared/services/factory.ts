import { Object } from "@rbxts/luau-polyfill";
import { StructureData, STRUCTURES } from "shared/constants/structures";

export default class FactoryService {
	//#region Singleton
	private static _inst: FactoryService;
	public static getInst(): FactoryService {
		this._inst = this._inst ?? new FactoryService();
		return this._inst;
	}
	//#endregion

	public createStructure(structure: StructureData, cf?: CFrame, tags?: boolean, parent?: Instance): Model {
		const newStructureModel = STRUCTURES[structure.name].model.Clone();
		newStructureModel.PivotTo((cf ?? CFrame.identity).mul(new CFrame(...structure.cf)));
		for (const [attributeName, attributeValue] of Object.entries(
			structure.attributes.size() > 0 ? structure.attributes : STRUCTURES[structure.name].attributes,
		)) {
			newStructureModel.SetAttribute(attributeName as string, attributeValue as AttributeValue);
		}
		for (const tag of tags ? STRUCTURES[structure.name].tags : []) {
			newStructureModel.AddTag(tag);
		}
		newStructureModel.Parent = parent;

		const visited = new Set<Model>();
		for (const childStructure of structure.children as StructureData[]) {
			const structureModel = newStructureModel
				.GetChildren()
				.find(
					(instance): instance is Model =>
						instance.IsA("Model") && instance.Name === childStructure.name && !visited.has(instance),
				);
			if (structureModel !== undefined) {
				structureModel.PivotTo((cf ?? CFrame.identity).mul(new CFrame(...childStructure.cf)));
				for (const [attributeName, attributeValue] of Object.entries(
					childStructure.attributes.size() > 0
						? childStructure.attributes
						: STRUCTURES[childStructure.name].attributes,
				)) {
					structureModel.SetAttribute(attributeName as string, attributeValue as AttributeValue);
				}
				for (const tag of tags ? STRUCTURES[childStructure.name].tags : []) {
					structureModel.AddTag(tag);
				}
				visited.add(structureModel);
			} else {
				visited.add(this.createStructure(childStructure, cf, tags, newStructureModel));
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
