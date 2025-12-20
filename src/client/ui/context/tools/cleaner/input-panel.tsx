import React from "@rbxts/react";
import { useSelector } from "@rbxts/react-reflex";
import { selectContext } from "client/store/context";
import { useRem } from "client/hooks/use-rem";
import { ToolInputPanel } from "../input-panel";

export default function CleanerInputPanel() {
	const rem = useRem();
	const context = useSelector(selectContext);

	return (
		<ToolInputPanel
			active={context === "Cleaner"}
			inputs={[
				`<stroke color="rgb(75, 108, 255)" thickness=".3"><font weight="regular" color="rgb(176,208,255)">Left Mouse Button</font></stroke> to clear the items of a single structure.`,
				`<stroke color="rgb(75, 108, 255)" thickness=".3"><font weight="regular" color="rgb(176,208,255)">Hold & Drag</font></stroke> to clear the items of multiple structures.`,
			]}
			size={new UDim2(0, rem(423), 0, rem(149))}
			inputSize={new UDim2(0.979, 0, 0.393, 0)}
		></ToolInputPanel>
	);
}
