import React from "@rbxts/react";
import { useSelector } from "@rbxts/react-reflex";
import { selectContext } from "client/store/context";
import { ToolInputPanel } from "./input-panel";

export function CopyInputPanel() {
	const context = useSelector(selectContext);

	return (
		<ToolInputPanel
			active={context === "Copy"}
			inputs={[
				`<font weight="regular" color="rgb(176,208,255)">Left Mouse Button</font> to copy a single structure.`,
				`Drag <font weight="regular" color="rgb(176,208,255)">Left Mouse Button</font> to copy multiple structures.`,
				`<font weight="regular" color="rgb(176,208,255)">Select</font> to copy structures and open the blueprint designer to create blueprints.`,
			]}
		></ToolInputPanel>
	);
}
