import React, { useEffect } from "@rbxts/react";
import {
	SplitterOutputDirection,
	splitterOutputDirections,
	splitterOutputFilters,
	STRUCTURES,
} from "shared/constants/structures";
import { Panel } from "./panel";
import { Text } from "client/ui/core/text";
import { fonts } from "client/constants/fonts";
import { Frame } from "client/ui/core/frame";
import { Dropdown } from "client/ui/primitive/dropdown";
import { IMAGES } from "shared/assets/images";
import { colors } from "client/constants/colors";
import { splitString } from "shared/utils/string";
import { useSelector } from "@rbxts/react-reflex";
import { selectPanelsStructureAttribute } from "client/store/panels";
import { store } from "client/store";
import { ITEMS } from "shared/constants/items";

export function SplitterPanel() {
	const leftOutput = useSelector(selectPanelsStructureAttribute(SplitterOutputDirection.Left));
	const forwardOutput = useSelector(selectPanelsStructureAttribute(SplitterOutputDirection.Forward));
	const rightOutput = useSelector(selectPanelsStructureAttribute(SplitterOutputDirection.Right));

	function getOutputFilterType(outputDirection: SplitterOutputDirection) {
		switch (outputDirection) {
			case SplitterOutputDirection.Left:
				return leftOutput;
			case SplitterOutputDirection.Forward:
				return forwardOutput;
			case SplitterOutputDirection.Right:
				return rightOutput;
		}
	}

	function getOutputFilterTypeIndex(outputDirection: SplitterOutputDirection) {
		const outputFilterType = getOutputFilterType(outputDirection);
		return outputFilterType !== undefined ? splitterOutputFilters.indexOf(outputFilterType) : undefined;
	}

	function getOutputFilterTypeImage(outputDirection: SplitterOutputDirection) {
		const outputFilterType = getOutputFilterType(outputDirection);
		return outputFilterType !== undefined
			? outputFilterType in ITEMS
				? IMAGES.items[outputFilterType as keyof typeof IMAGES.items]
				: IMAGES.panels.splitter[outputFilterType as keyof typeof IMAGES.panels.splitter]
			: undefined;
	}

	return (
		<Panel
			structureNames={["Splitter"]}
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
				text={STRUCTURES.Splitter.description}
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

					{splitterOutputDirections.map((outputDirection) => {
						return (
							<Frame size={new UDim2(0.331, 0, 1, 0)} backgroundTransparency={1}>
								<Text
									anchorPoint={new Vector2(0.5, 0)}
									position={new UDim2(0.5, 0, 0, 0)}
									size={new UDim2(1, 0, 0.143, 0)}
									font={fonts.josefinSans.regular}
									text={`${splitString(outputDirection, " ")} :`}
									textSize={14}
									textColor={colors.white}
									textXAlignment={Enum.TextXAlignment.Center}
									textYAlignment={Enum.TextYAlignment.Center}
								></Text>

								<Dropdown
									position={new UDim2(0.5, 0, 0.22, 0)}
									size={new UDim2(0.9, 0, 0.171, 0)}
									selectedOptionIndex={getOutputFilterTypeIndex(outputDirection) ?? 0}
									selectedOptionImage={getOutputFilterTypeImage(outputDirection) ?? ""}
									selectedOptionText={getOutputFilterType(outputDirection) ?? ""}
									optionsListSize={new UDim2(1, 0, 4, 0)}
									optionsListCanvasSize={new UDim2(0, 0, 27, 0)}
									optionButtonSize={new UDim2(1, 0, 0.035, 0)}
									optionsButtons={splitterOutputFilters.map((outputFilter) => {
										return {
											image:
												outputFilter in ITEMS
													? IMAGES.items[outputFilter as keyof typeof IMAGES.items]
													: IMAGES.panels.splitter[
															outputFilter as keyof typeof IMAGES.panels.splitter
													  ],
											text: outputFilter,
											onClick: () => {
												store.setPanelsStructureAttribute(outputDirection, outputFilter);
											},
										};
									})}
								></Dropdown>
							</Frame>
						);
					})}
				</Frame>
			</Frame>
		</Panel>
	);
}
