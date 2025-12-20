import React from "@rbxts/react";
import { ToolInputPanel } from "../../input-panel";
import { useSelector } from "@rbxts/react-reflex";
import { selectContext } from "client/store/context";
import { selectBuildMenuBuildingStructureModel } from "client/store/context/build";
import { useRem } from "client/hooks/use-rem";

export default function LiftStructureBuildInputPanel() {
	const rem = useRem();
	const context = useSelector(selectContext);
	const structureModel = useSelector(selectBuildMenuBuildingStructureModel);

	return (
		<ToolInputPanel
			active={context === "Build" && structureModel?.Name.find("Lift")[0] !== undefined}
			inputs={[
				`<stroke color="rgb(75, 108, 255)" thickness=".3"><font weight="regular" color="rgb(176,208,255)">Left Mouse Button</font></stroke> to place the ${structureModel?.Name.lower()} input.`,
				`<stroke color="rgb(75, 108, 255)" thickness=".3"><font weight="regular" color="rgb(176,208,255)">Left Mouse Button</font></stroke> to place the ${structureModel?.Name.lower()} output.`,
				`<stroke color="rgb(75, 108, 255)" thickness=".3"><font weight="regular" color="rgb(176,208,255)">R</font></stroke> to rotate the ${structureModel?.Name.lower()} input or reverse the direction.`,
				`<stroke color="rgb(75, 108, 255)" thickness=".3"><font weight="regular" color="rgb(176,208,255)">Mouse Wheel</font></stroke> to rotate the ${structureModel?.Name.lower()} output.`,
			]}
			size={new UDim2(0, rem(423), 0, rem(278))}
			inputSize={new UDim2(0.979, 0, 0.19, 0)}
		></ToolInputPanel>
	);
}
