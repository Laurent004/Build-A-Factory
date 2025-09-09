import React from "@rbxts/react";
import { StructureName, STRUCTURES } from "shared/constants/structures";
import { Text } from "client/ui/core/text";
import { fonts } from "client/constants/fonts";
import { Panel } from "./panel";
import { colors } from "client/constants/colors";
import { useSelector } from "@rbxts/react-reflex";
import { selectPanelsStructureModel } from "client/store/panels";

export function StructurePanel() {
	const structureModel = useSelector(selectPanelsStructureModel);
	return (
		<Panel
			structureNames={["Straight Conveyor", "Left Turn Conveyor", "Right Turn Conveyor", "Merger"]}
			openPosition={new UDim2(0.896, 0, 0.927, 0)}
			closedPosition={new UDim2(0.896, 0, 0.979, 0)}
			openSize={new UDim2(0.183, 0, 0.122, 0)}
			closedSize={new UDim2(0.183, 0, 0, 0)}
			//
			headerSize={new UDim2(1, 0, 0.309, 0)}
			headerIconPosition={new UDim2(0.064, 0, 0.5, 0)}
			headerIconSize={new UDim2(0.053, 0, 0.504, 0)}
			headerTextPosition={new UDim2(0.547, 0, 0.5, 0)}
			headerTextSize={new UDim2(0.843, 0, 0.59, 0)}
		>
			<Text
				anchorPoint={new Vector2(0.5, 0.5)}
				position={new UDim2(0.459, 0, 0.68, 0)}
				size={new UDim2(0.829, 0, 0.484, 0)}
				font={fonts.josefinSans.medium}
				lineHeight={1.4}
				text={structureModel !== undefined ? STRUCTURES[structureModel.Name as StructureName].description : ""}
				textSize={14}
				textColor={colors.white}
				textWrapped={true}
				textXAlignment={Enum.TextXAlignment.Left}
				textYAlignment={Enum.TextYAlignment.Top}
			></Text>
		</Panel>
	);
}
