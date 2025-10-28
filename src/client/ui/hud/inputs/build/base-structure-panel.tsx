import React from "@rbxts/react";
import { BaseInputPanel } from "../base-panel";
import { useSelector } from "@rbxts/react-reflex";
import { selectContext } from "client/store/context";
import { selectBuildMenuBuildingStructureModel } from "client/store/context/build";
import { useRem } from "client/hooks/use-rem";

export default function BaseStructureBuildInputPanel() {
	const rem = useRem();

	const context = useSelector(selectContext);
	const structureModel = useSelector(selectBuildMenuBuildingStructureModel);

	return (
		<BaseInputPanel
			size={new UDim2(0, rem(423), 0, rem(92))}
			inputSize={new UDim2(0.979, 0, 0.31, 0)}
			active={
				context === "Build" &&
				structureModel !== undefined &&
				structureModel.Name !== "Straight Conveyor" &&
				structureModel.Name !== "Underground Belt" &&
				structureModel.Name !== "Power Line"
			}
			inputs={[
				`<stroke color="rgb(171, 214, 255)" thickness=".4"><font weight="regular" color="rgb(176,208,255)">Left Mouse Button</font></stroke> to place.`,
				`<stroke color="rgb(171, 214, 255)" thickness=".4"><font weight="regular" color="rgb(176,208,255)">R</font></stroke> to rotate.`,
			]}
		></BaseInputPanel>
	);
}
