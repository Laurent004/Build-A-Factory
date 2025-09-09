import React, { useRef, useState } from "@rbxts/react";
import { STRUCTURES } from "shared/constants/structures";
import { Text } from "client/ui/core/text";
import { fonts } from "client/constants/fonts";
import { Frame } from "client/ui/core/frame";
import { Image } from "client/ui/core/image";
import { Panel } from "./panel";
import { colors } from "client/constants/colors";
import { ITEM_RECIPES, ITEMS } from "shared/constants/items";
import { PanelItemButton } from "./panel-item-button";
import { useSelector } from "@rbxts/react-reflex";
import { selectPanelsStructureAttribute, selectPanelsStructureModel } from "client/store/panels";
import { useUpdateEffect } from "@rbxts/pretty-react-hooks";
import { Dependency } from "@flamework/core";
import { Components } from "@flamework/components";
import { RunService } from "@rbxts/services";
import ExtractorComponent from "client/components/transporters/extractor";

export function ExtractorPanel() {
	const components = Dependency<Components>();
	const structureModel = useSelector(selectPanelsStructureModel);
	const selectedItem = useSelector(selectPanelsStructureAttribute("selectedItem"));
	const selectedItemRecipe = ITEM_RECIPES.find(
		(itemRecipe) => itemRecipe.structureName === "Extractor" && itemRecipe.outputItem === selectedItem,
	);

	const extractionProgressBarRef = useRef<Frame>();
	const extractionProgressConnectionRef = useRef<RBXScriptConnection>();

	useUpdateEffect(() => {
		extractionProgressConnectionRef.current?.Disconnect();
		extractionProgressConnectionRef.current = undefined;

		if (structureModel === undefined) return;
		const extractorComponent = components.getComponent<ExtractorComponent>(structureModel);
		if (extractorComponent !== undefined) {
			extractionProgressConnectionRef.current = RunService.Heartbeat.Connect(() => {
				const extractionProgress = extractorComponent.getExtractionProgress();
				if (extractionProgressBarRef.current !== undefined) {
					extractionProgressBarRef.current.Size = new UDim2(extractionProgress, 0, 0.6, 0);
				}
			});
		}
	}, [structureModel]);

	return (
		<Panel
			structureNames={["Extractor"]}
			openPosition={new UDim2(0.896, 0, 0.761, 0)}
			closedPosition={new UDim2(0.896, 0, 0.979, 0)}
			openSize={new UDim2(0.183, 0, 0.454, 0)}
			closedSize={new UDim2(0.183, 0, 0, 0)}
			//
			headerSize={new UDim2(1, 0, 0.086, 0)}
			headerIconPosition={new UDim2(0.064, 0, 0.5, 0)}
			headerIconSize={new UDim2(0.053, 0, 0.504, 0)}
			headerTextPosition={new UDim2(0.251, 0, 0.5, 0)}
			headerTextSize={new UDim2(0.252, 0, 0.59, 0)}
		>
			<Text
				anchorPoint={new Vector2(0.5, 0.5)}
				position={new UDim2(0.459, 0, 0.155, 0)}
				size={new UDim2(0.829, 0, 0.083, 0)}
				font={fonts.josefinSans.medium}
				lineHeight={1.4}
				text={STRUCTURES.Extractor.description}
				textSize={14}
				textColor={colors.white}
				textWrapped={true}
				textXAlignment={Enum.TextXAlignment.Left}
				textYAlignment={Enum.TextYAlignment.Top}
			></Text>

			<Frame
				anchorPoint={new Vector2(0.5, 0.5)}
				position={new UDim2(0.5, 0, 0.357, 0)}
				size={new UDim2(0.915, 0, 0.266, 0)}
				backgroundTransparency={1}
			>
				<Text
					size={new UDim2(0.582, 0, 0.18, 0)}
					font={fonts.josefinSans.medium}
					text={"Selected Item :"}
					textSize={19}
					textColor={colors.white}
					textXAlignment={Enum.TextXAlignment.Left}
					textYAlignment={Enum.TextYAlignment.Top}
				></Text>

				<Text
					anchorPoint={new Vector2(0.5, 0.5)}
					position={new UDim2(0.655, 0, 0.439, 0)}
					size={new UDim2(0.648, 0, 0.184, 0)}
					font={fonts.josefinSans.regular}
					text={selectedItem ?? "undefined"}
					textSize={21}
					textColor={colors.white}
					textXAlignment={Enum.TextXAlignment.Left}
					textYAlignment={Enum.TextYAlignment.Center}
				></Text>

				<Frame
					anchorPoint={new Vector2(0.5, 0.5)}
					position={new UDim2(0.66, 0, 0.65, 0)}
					size={new UDim2(0.657, 0, 0.13, 0)}
					backgroundTransparency={1}
				>
					<Text
						anchorPoint={new Vector2(0, 0.5)}
						position={new UDim2(0, 0, 0.5, 0)}
						size={new UDim2(1, 0, 1, 0)}
						font={fonts.josefinSans.light}
						text={`<font weight="regular" color="rgb(176,208,255)">${
							selectedItemRecipe !== undefined ? math.floor(60 / selectedItemRecipe.time) : 0
						}</font> per minute`}
						textSize={15}
						textColor={Color3.fromRGB(225, 225, 225)}
						richText={true}
						textXAlignment={Enum.TextXAlignment.Left}
						textYAlignment={Enum.TextYAlignment.Center}
					></Text>

					<Image
						anchorPoint={new Vector2(0.5, 0.5)}
						position={new UDim2(0.037, 0, 0.5, 0)}
						size={new UDim2(0.171, 0, 1.447, 0)}
						image="rbxassetid://137038247592087"
						imageColor={colors.lightblue}
						imageTransparency={0.8}
					></Image>
				</Frame>

				<Image
					anchorPoint={new Vector2(0.5, 0.5)}
					position={new UDim2(0.135, 0, 0.6, 0)}
					size={new UDim2(0.252, 0, 0.703, 0)}
					image={selectedItem ? ITEMS[selectedItem].image : ""}
				></Image>

				<Frame
					anchorPoint={new Vector2(0.5, 0.5)}
					position={new UDim2(0.655, 0, 0.829, 0)}
					size={new UDim2(0.647, 0, 0.064, 0)}
					backgroundColor={Color3.fromRGB(32, 32, 32)}
				>
					<Frame
						ref={extractionProgressBarRef}
						anchorPoint={new Vector2(0, 0.5)}
						position={new UDim2(0, 0, 0.5, 0)}
						size={new UDim2(0.24, 0, 0.6, 0)}
						backgroundColor={colors.lightblue}
					>
						<Image
							anchorPoint={new Vector2(0.5, 0.5)}
							position={new UDim2(0.5, 0, 0.5, 0)}
							size={new UDim2(1.06, 0, 3.306, 0)}
							image="rbxassetid://137038247592087"
							imageColor={colors.lightblue}
							imageTransparency={0.7}
						></Image>
					</Frame>
				</Frame>
			</Frame>

			<Frame
				anchorPoint={new Vector2(0.5, 0.5)}
				position={new UDim2(0.5, 0, 0.746, 0)}
				size={new UDim2(0.91, 0, 0.489, 0)}
				backgroundTransparency={1}
			>
				<Text
					size={new UDim2(0.299, 0, 0.102, 0)}
					font={fonts.josefinSans.medium}
					text={"Items :"}
					textSize={20}
					textColor={colors.white}
					textXAlignment={Enum.TextXAlignment.Left}
					textYAlignment={Enum.TextYAlignment.Top}
				></Text>

				<scrollingframe
					AnchorPoint={new Vector2(0.5, 0.5)}
					Position={new UDim2(0.5, 0, 0.77, 0)}
					Size={new UDim2(1, 0, 1.255, 0)}
					CanvasSize={new UDim2(0, 0, 2, 0)}
					BackgroundTransparency={1}
					ScrollBarThickness={0}
					ScrollBarImageTransparency={1}
				>
					<uigridlayout
						CellPadding={new UDim2(0, 3, 0, 3)}
						CellSize={new UDim2(0, 76, 0, 76)}
						HorizontalAlignment={Enum.HorizontalAlignment.Left}
						VerticalAlignment={Enum.VerticalAlignment.Top}
					></uigridlayout>

					<uipadding PaddingLeft={new UDim(0, 1)} PaddingTop={new UDim(0, 1)}></uipadding>

					{ITEM_RECIPES.filter((itemRecipe) => itemRecipe.structureName === "Extractor").map((itemRecipe) => {
						return <PanelItemButton itemName={itemRecipe.outputItem}></PanelItemButton>;
					})}
				</scrollingframe>
			</Frame>
		</Panel>
	);
}
