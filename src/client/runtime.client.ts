import { Flamework } from "@flamework/core";
import { Object } from "@rbxts/luau-polyfill";
import { STRUCTURES } from "shared/constants/structures";
import WeatherService from "./services/world/weather";

WeatherService.getInst();
Flamework.addPaths("src/client/controllers");
Flamework.addPaths("src/client/components");
Flamework.addPaths("src/shared/components");
Flamework.ignite();

/* for (const [structureName, structureDefinition] of Object.entries(STRUCTURES)) {
	const gridCellAttachments = structureDefinition.model
		.GetDescendants()
		.filter((instance): instance is Attachment => instance.Name === "GridCellAttachment");

	const inputAttachments = structureDefinition.model
		.GetDescendants()
		.filter((instance): instance is Attachment => instance.Name === "InputAttachment");
	const outputAttachments = structureDefinition.model
		.GetDescendants()
		.filter((instance): instance is Attachment => instance.Name === "OutputAttachment");

	print("-------------------");
	print(`Name : ${structureName}`);
	if (gridCellAttachments.size() > 0) {
		print("Grid Cells : ");
		for (const gridCellAttachment of gridCellAttachments) {
			print(
				`new Vector3(${structureDefinition.model
					.GetPivot()
					.PointToObjectSpace(gridCellAttachment.WorldPosition)}),`,
			);
		}
	}
	if (inputAttachments.size() > 0) {
		print("Inputs : ");
		for (const inputAttachment of inputAttachments) {
			print(`new CFrame(${structureDefinition.model.GetPivot().ToObjectSpace(inputAttachment.WorldCFrame)}),`);
		}
	}
	if (outputAttachments.size() > 0) {
		print("Outputs : ");
		for (const outputAttachment of outputAttachments) {
			print(`new CFrame(${structureDefinition.model.GetPivot().ToObjectSpace(outputAttachment.WorldCFrame)}),`);
		}
	}
}
 */