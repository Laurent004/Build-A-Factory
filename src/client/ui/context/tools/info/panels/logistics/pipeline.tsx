import React from "@rbxts/react";
import { BaseInfoPanel } from "../base";
import { useRem } from "client/hooks";
import { useSelector } from "@rbxts/react-reflex";
import { STRUCTURES } from "shared/constants/structures";
import { InfoPanelFluidInfo } from "../fluid-info";
import { selectContextStructureModels } from "client/store/context";

export function PipelineInfoPanel() {
	const rem = useRem();
	const structureModel = useSelector(selectContextStructureModels)[0];

	return (
		<BaseInfoPanel
			active={structureModel !== undefined && STRUCTURES[structureModel.Name].subCategory === "Pipelines"}
			size={new UDim2(0, rem(351), 0, rem(257))}
			headerSize={new UDim2(1, 0, 0.175, 0)}
			headerIconSize={new UDim2(0.06, 0, 0.477, 0)}
			descriptionPosition={new UDim2(0.5, 0, 0.298, 0)}
			descriptionSize={new UDim2(0.924, 0, 0.129, 0)}
		>
			<InfoPanelFluidInfo
				position={new UDim2(0.5, 0, 0.693, 0)}
				size={new UDim2(0.91, 0, 0.505, 0)}
			></InfoPanelFluidInfo>
		</BaseInfoPanel>
	);
}
