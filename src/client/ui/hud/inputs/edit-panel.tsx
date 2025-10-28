import React from "@rbxts/react";
import { useSelector } from "@rbxts/react-reflex";
import { selectContext } from "client/store/context";
import { useRem } from "client/hooks/use-rem";
import { BaseInputPanel } from "./base-panel";

export default function EditInputPanel() {
	const rem = useRem();

	const context = useSelector(selectContext);

	return (
		<BaseInputPanel
			size={new UDim2(0, rem(423), 0, rem(149))}
			inputSize={new UDim2(0.979, 0, 0.393, 0)}
			active={context === "Edit"}
			inputs={[
				`<stroke color="rgb(171, 214, 255)" thickness=".4"><font weight="regular" color="rgb(176,208,255)">Left Mouse Button</font></stroke> to move a single structure.`,
				`<stroke color="rgb(171, 214, 255)" thickness=".4"><font weight="regular" color="rgb(176,208,255)">Hold & Drag</font></stroke> to move multiple structures.`,
			]}
		></BaseInputPanel>
	);
}
