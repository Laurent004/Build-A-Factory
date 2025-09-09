import { ReplicatedStorage } from "@rbxts/services";
import { STRUCTURES } from "shared/constants/structures";
/*
task.delay(3, () => {
	for (const structureModel of ReplicatedStorage.GetChildren().filter(
		(instance): instance is Model => instance.IsA("Model") && instance.Name in STRUCTURES,
	)) {
		const inputAttachments = structureModel
			.GetDescendants()
			.filter((instance): instance is Attachment => instance.Name === "InputAttachment");
		const outputAttachments = structureModel
			.GetDescendants()
			.filter((instance): instance is Attachment => instance.Name === "OutputAttachment");
		const gridCellAttachments = structureModel
			.GetDescendants()
			.filter((instance): instance is Attachment => instance.Name === "GridCellAttachment");
		const itemAttachment = structureModel
			.GetDescendants()
			.find((instance): instance is Attachment => instance.Name === "ItemAttachment")!;

		print("---------------------------");
		print("NAME :", structureModel.Name);
		print("INPUTS");
		for (const InputAttachment of inputAttachments) {
			print(structureModel.PrimaryPart!.CFrame.ToObjectSpace(InputAttachment.WorldCFrame));
		}

		print("OUTPUTS");
		for (const outputAttachment of outputAttachments) {
			print(structureModel.PrimaryPart!.CFrame.ToObjectSpace(outputAttachment.WorldCFrame));
		}

		print("GRID CELLS");
		for (const gridCellAttachment of gridCellAttachments) {
			print(structureModel.PrimaryPart!.CFrame.PointToObjectSpace(gridCellAttachment.WorldCFrame.Position));
		}

		print("ITEM", structureModel.PrimaryPart!.CFrame.ToObjectSpace(itemAttachment.WorldCFrame));
	}
});
*/
