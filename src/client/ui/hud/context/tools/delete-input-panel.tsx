import React from "@rbxts/react";
import { useSelector } from "@rbxts/react-reflex";
import { selectContext } from "client/hooks/store/context";
import { ToolInputPanel } from "./input-panel";

export  function DeleteInputPanel() {
	const context = useSelector(selectContext);

	return (
		<ToolInputPanel
			active={context === "Delete"}
			inputs={[
				`<font weight="regular" color="rgb(255, 120, 120)">Left Mouse Button</font> to remove a single structure.`,
				`Drag <font weight="regular" color="rgb(255, 120,120)">Left Mouse Button</font> to remove multiple structures.`,
			]}
		></ToolInputPanel>
	);
}
