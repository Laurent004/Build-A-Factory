import React from "@rbxts/react";
import { ToolInputPanel } from "../../input-panel";
import { useSelector } from "@rbxts/react-reflex";
import { selectContext } from "client/store/context";
import { selectBuildMenuBuildingStructureModel } from "client/store/context/build";
import { useRem } from "client/hooks/use-rem";

export default function PowerLineBuildInputPanel() {
	const rem = useRem();
	const context = useSelector(selectContext);
	const structureModel = useSelector(selectBuildMenuBuildingStructureModel);

	return (
		<ToolInputPanel
			active={context === "Build" && structureModel?.Name === "Power Line"}
			inputs={[
				`<stroke color="rgb(75, 108, 255)" thickness=".3"><font weight="regular" color="rgb(176,208,255)">Left Mouse Button</font></stroke> on a connection point to start the power line.`,
				`<stroke color="rgb(75, 108, 255)" thickness=".3"><font weight="regular" color="rgb(176,208,255)">Left Mouse Button</font></stroke> on a connection point to connect the power line.`,
			]}
			size={new UDim2(0, rem(423), 0, rem(149))}
			inputSize={new UDim2(0.979, 0, 0.393, 0)}
		></ToolInputPanel>
	);
}
