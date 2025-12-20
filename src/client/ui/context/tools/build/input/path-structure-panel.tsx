import React from "@rbxts/react";
import { ToolInputPanel } from "../../input-panel";
import { useSelector } from "@rbxts/react-reflex";
import { selectContext } from "client/store/context";
import { selectBuildMenuBuildingStructureModel } from "client/store/context/build";
import { useRem } from "client/hooks/use-rem";

export default function PathStructureBuildInputPanel() {
	const rem = useRem();
	const context = useSelector(selectContext);
	const structureModel = useSelector(selectBuildMenuBuildingStructureModel);

	return (
		<ToolInputPanel
			active={
				context === "Build" &&
				(structureModel?.Name === "Conveyor" ||
					structureModel?.Name === "Pipeline" ||
					structureModel?.Name === "Railway")
			}
			inputs={[
				`<stroke color="rgb(75, 108, 255)" thickness=".3"><font weight="regular" color="rgb(176,208,255)">Left Mouse Button</font></stroke> to place a single ${structureModel?.Name.lower()}.`,
				`<stroke color="rgb(75, 108, 255)" thickness=".3"><font weight="regular" color="rgb(176,208,255)">Hold & Drag</font></stroke> to draw multiple ${structureModel?.Name.lower()}s.`,
				`<stroke color="rgb(75, 108, 255)" thickness=".3"><font weight="regular" color="rgb(176,208,255)">R</font></stroke> to rotate a single ${structureModel?.Name.lower()} or change the path direction.`,
			]}
			size={new UDim2(0, rem(423), 0, rem(198))}
			inputSize={new UDim2(0.979, 0, 0.25, 0)}
		></ToolInputPanel>
	);
}
