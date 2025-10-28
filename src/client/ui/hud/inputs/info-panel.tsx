import React from "@rbxts/react";
import { useSelector } from "@rbxts/react-reflex";
import { selectContext } from "client/store/context";
import { useRem } from "client/hooks/use-rem";
import { BaseInputPanel } from "./base-panel";
import { selectInfoSelectionStructureModel } from "client/store/context/info";

export default function InfoInputPanel() {
	const rem = useRem();

	const context = useSelector(selectContext);
	const structureModel = useSelector(selectInfoSelectionStructureModel);

	return (
		<BaseInputPanel
			size={new UDim2(0, rem(423), 0, rem(149))}
			inputSize={new UDim2(0.979, 0, 0.393, 0)}
			active={context === "Info" && structureModel === undefined}
			inputs={[
				`<stroke color="rgb(171, 214, 255)" thickness=".4"><font weight="regular" color="rgb(176,208,255)">Left Mouse Button</font></stroke> to configure a single structure.`,
				`<stroke color="rgb(171, 214, 255)" thickness=".4"><font weight="regular" color="rgb(176,208,255)">Hold & Drag</font></stroke> to configure multiple structures.`,
			]}
		></BaseInputPanel>
	);
}
