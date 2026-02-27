import { Flamework } from "@flamework/core";
import { Object } from "@rbxts/luau-polyfill";
import { getStructureModel, STRUCTURES } from "shared/constants/structures";
import PlotService from "./services/plot";
import WeatherService from "./services/world/weather";

Flamework.addPaths("src/client/controllers");
Flamework.addPaths("src/client/components");
Flamework.addPaths("src/shared/components");
Flamework.addPaths("src/shared/services");
Flamework.ignite();

PlotService.getInst();

/* 
for (const [structureName] of Object.entries(STRUCTURES)) {
	const structureModel = getStructureModel(structureName)!;

	const gridCellAttachments = structureModel
		.GetDescendants()
		.filter((instance): instance is Attachment => instance.Name === "GridCellAttachment");

	const inputAttachments = structureModel
		.GetDescendants()
		.filter((instance): instance is Attachment => instance.Name === "InputAttachment");
	const outputAttachments = structureModel
		.GetDescendants()
		.filter((instance): instance is Attachment => instance.Name === "OutputAttachment");

	print("-------------------");
	print(`Name : ${structureName} default`);
	if (gridCellAttachments.size() > 0) {
		print("Grid Cells : ");
		for (const gridCellAttachment of gridCellAttachments) {
			print(
				`new Vector3(${structureModel.PrimaryPart!.CFrame.PointToObjectSpace(
					gridCellAttachment.WorldPosition,
				)}),`,
			);
		}
	}
	if (inputAttachments.size() > 0) {
		print("Inputs : ");
		for (const inputAttachment of inputAttachments) {
			print(`new CFrame(${structureModel.GetPivot().ToObjectSpace(inputAttachment.WorldCFrame)}),`);
		}
	}
	if (outputAttachments.size() > 0) {
		print("Outputs : ");
		for (const outputAttachment of outputAttachments) {
			print(`new CFrame(${structureModel.GetPivot().ToObjectSpace(outputAttachment.WorldCFrame)}),`);
		}
	}
}
 */
