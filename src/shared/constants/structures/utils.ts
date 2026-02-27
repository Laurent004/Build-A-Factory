import { Object } from "@rbxts/luau-polyfill";
import { STRUCTURES } from "./definitions";
import { BlueprintData, StructureData } from "./dto";
import { ReplicatedStorage } from "@rbxts/services";

const structuresModels: Record<string, Model[]> = ReplicatedStorage.WaitForChild("Structures")
	.GetDescendants()
	.filter((instance): instance is Model => instance.IsA("Model") && instance.Name in STRUCTURES)
	.reduce<Record<string, Model[]>>((structuresModels, structureModel) => {
		if (structuresModels[structureModel.Name] !== undefined) {
			structuresModels[structureModel.Name].push(structureModel);
		} else {
			structuresModels[structureModel.Name] = [structureModel];
		}
		return structuresModels;
	}, {});

export function createStructure(structure: StructureData, cf?: CFrame, tags?: boolean, parent?: Instance): Model {
	const newStructureModel = getStructureModel(
		structure.name,
		structure.attributes.get("IsMirrored") as boolean | undefined,
	)!.Clone();
	newStructureModel.PivotTo((cf ?? CFrame.identity).mul(new CFrame(...structure.cf)));
	for (const [attributeName, attributeValue] of Object.entries(
		structure.attributes.size() > 0 ? structure.attributes : STRUCTURES[structure.name].attributes,
	)) {
		newStructureModel.SetAttribute(attributeName as string, attributeValue as AttributeValue);
	}
	if (tags) {
		for (const tag of STRUCTURES[structure.name].tags) {
			newStructureModel.AddTag(tag);
		}
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
			if (tags) {
				for (const tag of STRUCTURES[childStructure.name].tags) {
					structureModel.AddTag(tag);
				}
			}
			visited.add(structureModel);
		} else {
			visited.add(createStructure(childStructure, cf, tags, newStructureModel));
		}
	}
	return newStructureModel;
}

export function createPowerLine(
	startAttachment: Attachment,
	endAttachment: Attachment,
	parent?: Instance,
): RopeConstraint {
	const newPowerLine = getStructureModel("Power Line")!.FindFirstChildOfClass("RopeConstraint")!.Clone();
	newPowerLine.Attachment0 = startAttachment;
	newPowerLine.Attachment1 = endAttachment;
	newPowerLine.Parent = parent;
	return newPowerLine;
}

export function createBlueprint(blueprintData: BlueprintData, cf?: CFrame): Model {
	const newBlueprintModel = new Instance("Model");
	newBlueprintModel.Name = blueprintData.name;
	newBlueprintModel.SetAttribute("Id", blueprintData.id);

	for (const structure of blueprintData.structures) {
		createStructure(structure, cf, false, newBlueprintModel);
	}

	const attachments = newBlueprintModel
		.GetDescendants()
		.filter(
			(instance): instance is Attachment => instance.IsA("Attachment") && instance.Name === "PowerAttachment",
		);
	for (const powerLine of blueprintData.powerLines) {
		const newPowerLine = getStructureModel("Power Line")!.FindFirstChildOfClass("RopeConstraint")!.Clone();
		newPowerLine.Attachment0 = attachments.find((attachment) =>
			attachment.WorldCFrame.FuzzyEq(
				(cf !== undefined ? cf : CFrame.identity).mul(new CFrame(...powerLine.startAttachmentCF)),
			),
		)!;
		newPowerLine.Attachment1 = attachments.find((attachment) =>
			attachment.WorldCFrame.FuzzyEq(
				(cf !== undefined ? cf : CFrame.identity).mul(new CFrame(...powerLine.endAttachmentCF)),
			),
		)!;
		newPowerLine.Parent = newBlueprintModel;
	}

	return newBlueprintModel;
}

export function getStructureModel(structureName: string, isMirrored?: boolean): Model | undefined {
	return structuresModels[structureName].find(
		(structureModel) =>
			structureModel.GetAttribute("IsMirrored") === (isMirrored === false ? undefined : isMirrored),
	);
}

export function getStructureData(structureModel: Model, cf?: CFrame): StructureData {
	return {
		name: structureModel.Name,
		cf: (cf !== undefined
			? cf.ToObjectSpace(structureModel.GetPivot())
			: structureModel.GetPivot()
		).GetComponents(),
		attributes: structureModel.GetAttributes(),
		children: structureModel
			.GetChildren()
			.filter((instance): instance is Model => instance.IsA("Model") && instance.Name in STRUCTURES)
			.map((childStructureModel) => getStructureData(childStructureModel, cf)),
	};
}

export function getStructuresData(structures: StructureData[]): StructureData[] {
	const structuresData: StructureData[] = [];
	for (const structure of structures) {
		const queue = [structure];
		while (queue.size() > 0) {
			const structure = queue.shift()!;
			structuresData.push(structure);
			for (const childStructure of structure.children as StructureData[]) {
				queue.push(childStructure);
			}
		}
	}
	return structuresData;
}
