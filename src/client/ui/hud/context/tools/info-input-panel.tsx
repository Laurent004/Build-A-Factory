import React from "@rbxts/react";
import { useSelector } from "@rbxts/react-reflex";
import { selectContext, selectContextStructureModels } from "client/store/context";
import { ToolInputPanel } from "./input-panel";

export function InfoInputPanel() {
	const context = useSelector(selectContext);
	const structuresModels = useSelector(selectContextStructureModels);

	return (
		<ToolInputPanel
			active={context === "Info" && structuresModels.size() === 0}
			inputs={[
				`<font weight="regular" color="rgb(176,208,255)">Left Mouse Button</font> to configure a single structure.`,
				`Drag <font weight="regular" color="rgb(176,208,255)">Left Mouse Button</font> to configure multiple structures of the same type.`,
			]}
		></ToolInputPanel>
	);
}
