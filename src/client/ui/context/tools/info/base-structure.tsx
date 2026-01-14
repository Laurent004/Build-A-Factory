import React from "@rbxts/react";
import { BaseInfoPanel } from "./base";
import { useSelector } from "@rbxts/react-reflex";
import { selectContextStructureModels } from "client/store/context";

export function BaseStructureInfoPanel() {
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
					"Delivery Dock",
					"Hand-Crank",
					"Solar Panel",
					"Wind Turbine",
				].includes(structureModel.Name)
			}
			size={UDim2.fromScale(0.183, 0.093)}
		></BaseInfoPanel>
	);
}
