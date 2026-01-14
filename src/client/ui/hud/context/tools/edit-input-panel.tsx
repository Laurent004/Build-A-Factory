import React from "@rbxts/react";
import { useSelector } from "@rbxts/react-reflex";
import { selectContext } from "client/store/context";
import { ToolInputPanel } from "./input-panel";

export function EditInputPanel() {
	const context = useSelector(selectContext);

	return (
		<ToolInputPanel
			active={context === "Edit"}
			inputs={[
				`<font weight="regular" color="rgb(176,208,255)">Left Mouse Button</font> to move a single structure.`,
				`Drag <font weight="regular" color="rgb(176,208,255)">Left Mouse Button</font> to move multiple structures.`,
			]}
		></ToolInputPanel>
	);
}
