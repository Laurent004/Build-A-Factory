import React from "@rbxts/react";
import { useSelector } from "@rbxts/react-reflex";
import { selectContext } from "client/store/context";
import { useRem } from "client/hooks/use-rem";
import { BaseInputPanel } from "./base-panel";

export default function DeleteInputPanel() {
	const rem = useRem();

	const context = useSelector(selectContext);

	return (
		<BaseInputPanel
			size={new UDim2(0, rem(423), 0, rem(149))}
			inputSize={new UDim2(0.979, 0, 0.393, 0)}
			active={context === "Delete"}
			inputs={[
				`<stroke color="rgb(255, 18, 18)" thickness=".4"><font weight="regular" color="rgb(255, 120, 120)">Left Mouse Button</font></stroke> to remove a single structure.`,
				`<stroke color="rgb(255, 18, 18)" thickness=".4"><font weight="regular" color="rgb(255, 120,120)">Hold & Drag</font></stroke> to remove multiple structures.`,
			]}
		></BaseInputPanel>
	);
}
