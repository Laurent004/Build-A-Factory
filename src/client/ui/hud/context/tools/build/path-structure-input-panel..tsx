import React from "@rbxts/react";
import { useSelector } from "@rbxts/react-reflex";
import { selectContext } from "client/store/context";
import { selectBuildingStructureModel } from "client/store/context/tools/build";
import { ToolInputPanel } from "../input-panel";

export function PathStructureBuildInputPanel() {
	const context = useSelector(selectContext);
	const structureModel = useSelector(selectBuildingStructureModel);

	return (
		<ToolInputPanel
			active={context === "Build" && (structureModel?.Name === "Conveyor" || structureModel?.Name === "Pipeline")}
			inputs={[
				`<font weight="regular" color="rgb(176,208,255)">Left Mouse Button</font> to place a single ${structureModel?.Name.lower()}.`,
				`Drag <font weight="regular" color="rgb(176,208,255)">Left Mouse Button</font> to draw multiple ${structureModel?.Name.lower()}s.`,
				`<font weight="regular" color="rgb(176,208,255)">R</font> to rotate a single ${structureModel?.Name.lower()} or change the path direction.`,
			]}
		></ToolInputPanel>
	);
}
