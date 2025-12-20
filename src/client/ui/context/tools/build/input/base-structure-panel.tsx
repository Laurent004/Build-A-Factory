import React from "@rbxts/react";
import { ToolInputPanel } from "../../input-panel";
import { useSelector } from "@rbxts/react-reflex";
import { selectContext } from "client/store/context";
import { selectBuildMenuBuildingStructureModel } from "client/store/context/build";
import { useRem } from "client/hooks/use-rem";

export default function BaseStructureBuildInputPanel() {
	const rem = useRem();
	const context = useSelector(selectContext);
	const structureModel = useSelector(selectBuildMenuBuildingStructureModel);

	return (
		<ToolInputPanel
			active={
				context === "Build" &&
				structureModel !== undefined &&
				structureModel.Name !== "Conveyor" &&
				structureModel.Name !== "Pipeline" &&
				structureModel.Name !== "Railway" &&
				structureModel.Name.find("Underground")[0] === undefined &&
				structureModel.Name.find("Lift")[0] === undefined &&
				structureModel.Name !== "Locomotive" &&
				structureModel.Name.find("Freight Car")[0] === undefined &&
				structureModel.Name.find("Freight Platform")[0] === undefined &&
				structureModel.Name !== "Power Line"
			}
			inputs={[
				`<stroke color="rgb(75, 108, 255)" thickness=".3"><font weight="regular" color="rgb(176,208,255)">Left Mouse Button</font></stroke> to place.`,
				`<stroke color="rgb(75, 108, 255)" thickness=".3"><font weight="regular" color="rgb(176,208,255)">R</font></stroke> to rotate.`,
			]}
			size={new UDim2(0, rem(423), 0, rem(92))}
			inputSize={new UDim2(0.979, 0, 0.31, 0)}
		></ToolInputPanel>
	);
}
