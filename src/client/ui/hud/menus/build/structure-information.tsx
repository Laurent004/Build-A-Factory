import React from "@rbxts/react";
import { useSelector } from "@rbxts/react-reflex";

import { StructureViewportFrame } from "./structure-viewport-frame";
import { Frame } from "client/ui/core/frame";
import { Text } from "client/ui/core/text";
import { fonts } from "client/constants/fonts";
import { selectBuildMenuStructureName } from "client/store/menus/build";
import { colors } from "client/constants/colors";
import { STRUCTURES } from "shared/constants/structures";
import { Object } from "@rbxts/luau-polyfill";

export function StructureInformation() {
	const structureName = useSelector(selectBuildMenuStructureName);

	return (
		<Frame
			anchorPoint={new Vector2(0.5, 0.5)}
			position={new UDim2(0.848, 0, 0.54, 0)}
			size={new UDim2(0.304, 0, 0.92, 0)}
			backgroundTransparency={1}
		>
			<uistroke
				ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
				Color={colors.grey}
				LineJoinMode={Enum.LineJoinMode.Miter}
			></uistroke>

			<StructureViewportFrame></StructureViewportFrame>
			<Text
				anchorPoint={new Vector2(0.5, 0.5)}
				position={new UDim2(0.5, 0, 0.075, 0)}
				size={new UDim2(1, 0, 0.073, 0)}
				font={fonts.josefinSans.medium}
				textSize={25}
				textColor={colors.white}
				text={structureName}
			></Text>

			<Text
				anchorPoint={new Vector2(0.5, 0.5)}
				position={new UDim2(0.5, 0, 0.4, 0)}
				size={new UDim2(0.319, 0, 0.032, 0)}
				font={fonts.josefinSans.regular}
				textSize={13}
				textColor={colors.white}
				text={"Description"}
			></Text>

			<Frame
				anchorPoint={new Vector2(0.5, 0.5)}
				position={new UDim2(0.5, 0, 0.425, 0)}
				size={new UDim2(0.79, 0, 0.002, 0)}
				backgroundColor={colors.grey}
			></Frame>

			<Text
				anchorPoint={new Vector2(0.5, 0.5)}
				position={new UDim2(0.5, 0, 0.488, 0)}
				size={new UDim2(0.79, 0, 0.098, 0)}
				font={fonts.josefinSans.regular}
				lineHeight={1.3}
				textSize={13}
				textColor={colors.white}
				text={STRUCTURES[structureName].description}
				textWrapped={true}
				textXAlignment={Enum.TextXAlignment.Left}
				textYAlignment={Enum.TextYAlignment.Top}
			></Text>

			<Text
				anchorPoint={new Vector2(0.5, 0.5)}
				position={new UDim2(0.5, 0, 0.574, 0)}
				size={new UDim2(0.17, 0, 0.032, 0)}
				font={fonts.josefinSans.regular}
				textSize={13}
				textColor={colors.white}
				text={"Stats"}
			></Text>

			<Frame
				anchorPoint={new Vector2(0.5, 0.5)}
				position={new UDim2(0.5, 0, 0.596, 0)}
				size={new UDim2(0.79, 0, 0.002, 0)}
				backgroundColor={colors.grey}
			></Frame>

			<Frame
				anchorPoint={new Vector2(0.5, 0.5)}
				position={new UDim2(0.5, 0, 0.696, 0)}
				size={new UDim2(0.79, 0, 0.162, 0)}
				backgroundTransparency={1}
			>
				<uilistlayout
					Padding={new UDim(0, 7)}
					HorizontalAlignment={Enum.HorizontalAlignment.Center}
					VerticalAlignment={Enum.VerticalAlignment.Top}
				></uilistlayout>

				{(Object.entries(STRUCTURES[structureName].attributes) as [string, AttributeValue][]).map(
					([attributeName, attributeValue]) => {
						switch (attributeName) {
							case "transportSpeed":
								return (
									<Text
										size={new UDim2(1.0, 0, 0.18, 0)}
										font={fonts.josefinSans.regular}
										textSize={13}
										textColor={colors.white}
										text={`Items/Min : ${60 * (attributeValue as number)}`}
										textXAlignment={Enum.TextXAlignment.Left}
									></Text>
								);
						}
					},
				)}
			</Frame>

			<Text
				anchorPoint={new Vector2(0.5, 0.5)}
				position={new UDim2(0.5, 0, 0.806, 0)}
				size={new UDim2(0.271, 0, 0.032, 0)}
				font={fonts.josefinSans.regular}
				textSize={13}
				textColor={colors.white}
				text={"Materials"}
			></Text>

			<Frame
				anchorPoint={new Vector2(0.5, 0.5)}
				position={new UDim2(0.5, 0, 0.822, 0)}
				size={new UDim2(0.79, 0, 0.002, 0)}
				backgroundColor={colors.grey}
			></Frame>
		</Frame>
	);
}
