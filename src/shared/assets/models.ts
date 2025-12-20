import { ReplicatedStorage } from "@rbxts/services";

export const MODELS: Record<string, Model> = {
	...ReplicatedStorage.WaitForChild("Structures")
		.GetDescendants()
		.filter((instance): instance is Model => instance.IsA("Model"))
		.reduce<Record<string, Model>>((structureModels, structureModel) => {
			structureModels[structureModel.Name] = structureModel;
			return structureModels;
		}, {}),

	...ReplicatedStorage.WaitForChild("Items")
		.GetDescendants()
		.filter((instance): instance is Model => instance.IsA("Model"))
		.reduce<Record<string, Model>>((itemModels, itemModel) => {
			itemModels[itemModel.Name] = itemModel;
			return itemModels;
		}, {}),
};
