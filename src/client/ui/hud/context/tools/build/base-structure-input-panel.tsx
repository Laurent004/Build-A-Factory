import React from "@rbxts/react";
import { useSelector } from "@rbxts/react-reflex";
import { ToolInputPanel } from "../input-panel";
import { getStructureModel } from "shared/constants/structures";
import { selectContext } from "client/hooks/store/context";
import { selectBuildingStructureModel } from "client/hooks/store/context/tools";

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
				`<font weight="regular" color="rgb(176,208,255)">R</font> to rotate.${
					structureModel !== undefined &&
					structureModel.GetAttribute("Id") === undefined &&
					(structureModel.Name.find("Left")[0] !== undefined ||
						structureModel.Name.find("Right")[0] !== undefined ||
						getStructureModel(
							structureModel.Name,
							!(structureModel.GetAttribute("IsMirrored") === true),
						) !== undefined)
						? `  <font weight="regular" color="rgb(176,208,255)">T</font> to mirror`
						: ""
				}`,
			]}
		></ToolInputPanel>
	);
}
