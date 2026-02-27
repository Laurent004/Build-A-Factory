import React from "@rbxts/react";
import { useSelector } from "@rbxts/react-reflex";
import { selectBuildingStructureModel } from "client/hooks/store/context/tools";
import { selectContext } from "client/hooks/store/context";
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
