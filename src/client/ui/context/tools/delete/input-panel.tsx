import React from "@rbxts/react";
import { useSelector } from "@rbxts/react-reflex";
import { selectContext } from "client/store/context";
import { useRem } from "client/hooks/use-rem";
import { ToolInputPanel } from "../input-panel";

export default function DeleteInputPanel() {
	const rem = useRem();
	const context = useSelector(selectContext);

	return (
		<ToolInputPanel
			active={context === "Delete"}
			inputs={[
				`<stroke color="rgb(255, 80, 80)" thickness=".4"><font weight="regular" color="rgb(255, 120, 120)">Left Mouse Button</font></stroke> to remove a single structure.`,
				`<stroke color="rgb(255, 80, 80)" thickness=".4"><font weight="regular" color="rgb(255, 120,120)">Hold & Drag</font></stroke> to remove multiple structures.`,
			]}
			size={new UDim2(0, rem(423), 0, rem(149))}
			inputSize={new UDim2(0.979, 0, 0.393, 0)}
		></ToolInputPanel>
	);
}
