import React from "@rbxts/react";
import { useSelector } from "@rbxts/react-reflex";
import { selectContext } from "client/store/context";
import { selectBuildingStructureModel } from "client/store/context/tools/build";
import { ToolInputPanel } from "../input-panel";

export function LiftStructureBuildInputPanel() {
	const context = useSelector(selectContext);
	const structureModel = useSelector(selectBuildingStructureModel);

	return (
		<ToolInputPanel
			active={context === "Build" && structureModel?.Name.find("Lift")[0] !== undefined}
			inputs={[
				`<font weight="regular" color="rgb(176,208,255)">Left Mouse Button</font> to place the ${structureModel?.Name.lower()} input.`,
				`<font weight="regular" color="rgb(176,208,255)">Left Mouse Button</font> to place the ${structureModel?.Name.lower()} output.`,
				`<font weight="regular" color="rgb(176,208,255)">R</font> to rotate the ${structureModel?.Name.lower()} input or reverse the direction.`,
				`<font weight="regular" color="rgb(176,208,255)">Mouse Wheel</font> to rotate the ${structureModel?.Name.lower()} output.`,
			]}
		></ToolInputPanel>
	);
}
