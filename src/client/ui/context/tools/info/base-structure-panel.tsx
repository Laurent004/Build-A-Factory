import React from "@rbxts/react";
import { BaseInfoPanel } from "./base-panel";
import { useRem } from "client/hooks/use-rem";
import { Object } from "@rbxts/luau-polyfill";
import { STRUCTURES } from "shared/constants/structures";

export function BaseStructureInfoPanel() {
	const rem = useRem();

	return (
		<BaseInfoPanel
			structuresNames={Object.entries(STRUCTURES)
				.filter(([_, structureDefinition]) => Object.entries(structureDefinition.attributes).size() === 0)
				.map(([structureName]) => structureName)}
			size={new UDim2(0, rem(351), 0, rem(118))}
			headerSize={new UDim2(1, 0, 0.309, 0)}
			headerIconSize={new UDim2(0.062, 0, 0.582, 0)}
			descriptionPosition={new UDim2(0.5, 0, 0.637, 0)}
			descriptionSize={new UDim2(0.924, 0, 0.341, 0)}
		></BaseInfoPanel>
	);
}
