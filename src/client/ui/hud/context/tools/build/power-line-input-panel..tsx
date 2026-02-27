import React from "@rbxts/react";
import { useSelector } from "@rbxts/react-reflex";
import { selectContext } from "client/store/context";
import { selectBuildingStructureModel } from "client/store/context/tools/build";
import { ToolInputPanel } from "../input-panel";

export function PowerLineBuildInputPanel() {
	const context = useSelector(selectContext);
	const structureModel = useSelector(selectBuildingStructureModel);

	return (
		<ToolInputPanel
			active={context === "Build" && structureModel?.Name === "Power Line"}
			inputs={[
				`<font weight="regular" color="rgb(176,208,255)">Left Mouse Button</font> on a connection point to start the power line.`,
				`<font weight="regular" color="rgb(176,208,255)">Left Mouse Button</font> on a connection point to connect the power line.`,
			]}
		></ToolInputPanel>
	);
}
