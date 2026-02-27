import React from "@rbxts/react";
import { useSelector } from "@rbxts/react-reflex";
import { ToolInputPanel } from "../input-panel";
import { selectBuildingStructureModel } from "client/hooks/store/context/tools";
import { selectContext } from "client/hooks/store/context";

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
