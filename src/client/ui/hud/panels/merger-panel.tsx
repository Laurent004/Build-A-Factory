import React from "@rbxts/react";
import { mergerInputDirections, STRUCTURES } from "shared/constants/structures";
import { Panel } from "./panel";
import { Text } from "client/ui/core/text";
import { fonts } from "client/constants/fonts";
import { Frame } from "client/ui/core/frame";
import { Slider } from "client/ui/primitive/slider";
import { colors } from "client/constants/colors";
import { splitString } from "shared/utils/string";

export function MergerPanel() {
	return (
		<Panel
			structureNames={["Merger"]}
			openPosition={new UDim2(0.882, 0, 0.792, 0)}
			closedPosition={new UDim2(0.882, 0, 0.979, 0)}
			openSize={new UDim2(0.213, 0, 0.371, 0)}
			closedSize={new UDim2(0.213, 0, 0, 0)}
			//
			headerSize={new UDim2(1, 0, 0.119, 0)}
			headerIconPosition={new UDim2(0.069, 0, 0.5, 0)}
			headerIconSize={new UDim2(0.059, 0, 0.551, 0)}
			headerTextPosition={new UDim2(0.234, 0, 0.5, 0)}
			headerTextSize={new UDim2(0.219, 0, 1, 0)}
		>
			<Text
				anchorPoint={new Vector2(0.5, 0.5)}
				position={new UDim2(0.498, 0, 0.23, 0)}
				size={new UDim2(0.913, 0, 0.114, 0)}
				font={fonts.josefinSans.regular}
				lineHeight={1.4}
				text={STRUCTURES.Merger.description}
				textSize={14}
				textColor={colors.white}
				textWrapped={true}
				textXAlignment={Enum.TextXAlignment.Left}
				textYAlignment={Enum.TextYAlignment.Top}
			></Text>
			<Frame
				anchorPoint={new Vector2(0.5, 0.5)}
				position={new UDim2(0.497, 0, 0.626, 0)}
				size={new UDim2(0.913, 0, 0.657, 0)}
				backgroundTransparency={1}
			>
				<Text
					size={new UDim2(0.5, 0, 0.109, 0)}
					font={fonts.josefinSans.medium}
					text={"Configuration"}
					textSize={20}
					textColor={colors.white}
					textXAlignment={Enum.TextXAlignment.Left}
					textYAlignment={Enum.TextYAlignment.Top}
				></Text>

				<Frame
					anchorPoint={new Vector2(0.5, 0.5)}
					position={new UDim2(0.5, 0, 0.567, 0)}
					size={new UDim2(0.999, 0, 0.899, 0)}
					backgroundTransparency={1}
				>
					<uilistlayout
						FillDirection={Enum.FillDirection.Horizontal}
						HorizontalAlignment={Enum.HorizontalAlignment.Left}
						VerticalAlignment={Enum.VerticalAlignment.Top}
					></uilistlayout>

					{mergerInputDirections.map((inputDirection) => {
						return (
							<Frame size={new UDim2(0.331, 0, 1, 0)} backgroundTransparency={1}>
								<Text
									anchorPoint={new Vector2(0.5)}
									position={new UDim2(0.5, 0, 0, 0)}
									size={new UDim2(1, 0, 0.143, 0)}
									font={fonts.josefinSans.regular}
									text={splitString(inputDirection, " ")}
									textSize={14}
									textColor={colors.white}
									textXAlignment={Enum.TextXAlignment.Center}
									textYAlignment={Enum.TextYAlignment.Center}
								></Text>

								<Slider
									barPosition={new UDim2(0.5, 0, 0.5, 0)}
									barSize={new UDim2(0.104, 0, 0.718, 0)}
									maxValue={2}
									onSliderMoved={(position) => {}}
								></Slider>
							</Frame>
						);
					})}
				</Frame>
			</Frame>
		</Panel>
	);
}
