import React from "@rbxts/react";
import { useSelector } from "@rbxts/react-reflex";
import { selectContext } from "client/store/context";
import { selectBuildingStructureModel } from "client/store/context/tools/build";
import { ToolInputPanel } from "../input-panel";

export function BaseStructureBuildInputPanel() {
	const context = useSelector(selectContext);
	const structureModel = useSelector(selectBuildingStructureModel);

	return (
		<ToolInputPanel
			active={
				context === "Build" &&
				structureModel !== undefined &&
				structureModel.Name !== "Conveyor" &&
				structureModel.Name !== "Pipeline" &&
				structureModel.Name.find("Underground")[0] === undefined &&
				structureModel.Name.find("Lift")[0] === undefined &&
				structureModel.Name !== "Power Line"
			}
			inputs={[
				`<font weight="regular" color="rgb(176,208,255)">Left Mouse Button</font> to place.`,
				`<font weight="regular" color="rgb(176,208,255)">R</font> to rotate.`,
			]}
		></ToolInputPanel>
	);
}
