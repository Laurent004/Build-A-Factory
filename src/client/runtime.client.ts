import { Flamework } from "@flamework/core";
import { Players, ReplicatedStorage } from "@rbxts/services";
import { STRUCTURES } from "shared/constants/structures";
import { Events } from "./network";
import { Object } from "@rbxts/luau-polyfill";
import { EventBus } from "./event-bus";
import TutorialService from "./services/progression/tutorial-service";

Flamework.addPaths("src/client/controllers");
Flamework.addPaths("src/client/components");
Flamework.addPaths("src/shared/components");
Flamework.ignite();

/* task.delay(3, () => {
	for (const structureModel of ReplicatedStorage.GetDescendants().filter(
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

		print("---------------------------");
		print("NAME :", structureModel.Name);
		print("INPUTS");
		for (const InputAttachment of inputAttachments) {
			print(`new CFrame(${structureModel.GetPivot().ToObjectSpace(InputAttachment.WorldCFrame)}),`);
		}

		print("OUTPUTS");
		for (const outputAttachment of outputAttachments) {
			print(`new CFrame(${structureModel.GetPivot().ToObjectSpace(outputAttachment.WorldCFrame)}),`);
		}

		print("GRID CELLS");
		for (const gridCellAttachment of gridCellAttachments) {
			print(
				`new Vector3(${structureModel
					.GetPivot()
					.PointToObjectSpace(gridCellAttachment.WorldCFrame.Position)}),`,
			);
		}
	}
});
 
 */
