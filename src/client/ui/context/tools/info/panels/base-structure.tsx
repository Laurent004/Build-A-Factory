import React from "@rbxts/react";
import { useRem } from "client/hooks/use-rem";
import { BaseInfoPanel } from "./base";
import { useSelector } from "@rbxts/react-reflex";
import { selectContextStructureModels } from "client/store/context";

export function BaseStructureInfoPanel() {
	const rem = useRem();
	const structureModel = useSelector(selectContextStructureModels)[0];

	return (
		<BaseInfoPanel
			active={
				structureModel !== undefined &&
				[
					"Conveyor",
					"Left Turn Conveyor",
					"Right Turn Conveyor",
					"Underground Conveyor",
					"Conveyor Lift",
					"Merger",
					"Splitter",
					"Railway",
					"Railway Turn",
					"Railway Junction",
					"Railway Three-Way",
					"Delivery Dock",
					"Hand-Crank",
					"Solar Panel",
					"Wind Turbine",
				].includes(structureModel.Name)
			}
			size={new UDim2(0, rem(351), 0, rem(118))}
			headerSize={new UDim2(1, 0, 0.309, 0)}
			headerIconSize={new UDim2(0.062, 0, 0.582, 0)}
			descriptionPosition={new UDim2(0.5, 0, 0.637, 0)}
			descriptionSize={new UDim2(0.924, 0, 0.341, 0)}
		></BaseInfoPanel>
	);
}
