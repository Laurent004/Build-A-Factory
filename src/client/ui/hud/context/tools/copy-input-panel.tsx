import React from "@rbxts/react";
import { useSelector } from "@rbxts/react-reflex";
import { selectContext } from "client/hooks/store/context";
import { ToolInputPanel } from "./input-panel";

export function CopyInputPanel() {
	const context = useSelector(selectContext);

	return (
		<ToolInputPanel
			active={context === "Copy"}
			inputs={[
				`<font weight="regular" color="rgb(176,208,255)">Left Mouse Button</font> to copy a single structure or place.`,
				`Drag <font weight="regular" color="rgb(176,208,255)">Left Mouse Button</font> to copy multiple structures.`,
				`<font weight="regular" color="rgb(176,208,255)">R</font> to rotate.  <font weight="regular" color="rgb(176,208,255)">T</font> to mirror`,
			]}
		></ToolInputPanel>
	);
}
