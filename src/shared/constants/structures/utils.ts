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
