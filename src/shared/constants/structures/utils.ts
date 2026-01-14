import { STRUCTURES } from "./definitions";
import { StructureData } from "./dto";

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
