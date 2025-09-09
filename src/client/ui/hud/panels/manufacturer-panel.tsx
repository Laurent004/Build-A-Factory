import React, { useRef } from "@rbxts/react";
import { STRUCTURES } from "shared/constants/structures";
import { Text } from "client/ui/core/text";
import { fonts } from "client/constants/fonts";
import { Frame } from "client/ui/core/frame";
import { Image } from "client/ui/core/image";
import { Panel } from "./panel";
import { ItemCostButton } from "../menus/items/item-cost-button";
import { Object } from "@rbxts/luau-polyfill";
import { colors } from "client/constants/colors";
import { PanelItemButton } from "./panel-item-button";
import { ITEM_RECIPES, ItemName, ITEMS } from "shared/constants/items";
import { useSelector } from "@rbxts/react-reflex";
import { selectPanelsStructureAttribute, selectPanelsStructureModel } from "client/store/panels";
import { Dependency } from "@flamework/core";
import { Components } from "@flamework/components";
import { useUpdateEffect } from "@rbxts/pretty-react-hooks";
import { RunService } from "@rbxts/services";
import ManufacturerComponent from "client/components/transporters/manufacturer";

export function ManufacturerPanel() {
	const components = Dependency<Components>();
	const structureModel = useSelector(selectPanelsStructureModel);
	const selectedItem = useSelector(selectPanelsStructureAttribute("selectedItem"));
	const selectedItemRecipe = ITEM_RECIPES.find(
		(itemRecipe) => itemRecipe.structureName === structureModel?.Name && itemRecipe.outputItem === selectedItem,
	);

	const productionProgressBarRef = useRef<Frame>();
	const productionProgressConnectionRef = useRef<RBXScriptConnection>();

	useUpdateEffect(() => {
		productionProgressConnectionRef.current?.Disconnect();
		productionProgressConnectionRef.current = undefined;

		if (structureModel === undefined) return;
		const manufacturerComponent = components.getComponent<ManufacturerComponent>(structureModel);
		if (manufacturerComponent !== undefined) {
			productionProgressConnectionRef.current = RunService.Heartbeat.Connect(() => {
				const productionProgress = manufacturerComponent.getProductionProgress();
				if (productionProgressBarRef.current !== undefined) {
					productionProgressBarRef.current.Size = new UDim2(productionProgress, 0, 0.6, 0);
				}
			});
		}
	}, [structureModel]);

	return (
		<Panel
			structureNames={Object.entries(STRUCTURES)
				.filter(([_, structureDefinition]) => {
					return structureDefinition.tag === "Manufacturer";
				})
				.map(([strutureName, _]) => strutureName)}
			openPosition={new UDim2(0.896, 0, 0.695, 0)}
			closedPosition={new UDim2(0.896, 0, 0.979, 0)}
			openSize={new UDim2(0.183, 0, 0.586, 0)}
			closedSize={new UDim2(0.183, 0, 0, 0)}
			//
			headerSize={new UDim2(1, 0, 0.086, 0)}
			headerIconPosition={new UDim2(0.07, 0, 0.5, 0)}
			headerIconSize={new UDim2(0.064, 0, 0.465, 0)}
			headerTextPosition={new UDim2(0.5, 0, 0.5, 0)}
			headerTextSize={new UDim2(0.75, 0, 0.59, 0)}
		>
			<Text
				anchorPoint={new Vector2(0.5, 0.5)}
				position={new UDim2(0.5, 0, 0.143, 0)}
				size={new UDim2(0.906, 0, 0.065, 0)}
				font={fonts.josefinSans.medium}
				lineHeight={1.4}
				text={"Automated mining device that extracts raw resources from deposits at a steady rate."}
				textSize={14}
				textColor={colors.white}
				textWrapped={true}
				textXAlignment={Enum.TextXAlignment.Left}
				textYAlignment={Enum.TextYAlignment.Top}
			></Text>

			<Frame
				anchorPoint={new Vector2(0.5, 0.5)}
				position={new UDim2(0.5, 0, 0.314, 0)}
				size={new UDim2(0.915, 0, 0.227, 0)}
				backgroundTransparency={1}
			>
				<Text
					size={new UDim2(0.623, 0, 0.158, 0)}
					font={fonts.josefinSans.medium}
					text={"Selected Item :"}
					textSize={19}
					textColor={colors.white}
					textXAlignment={Enum.TextXAlignment.Left}
					textYAlignment={Enum.TextYAlignment.Top}
				></Text>

				<Text
					anchorPoint={new Vector2(0.5, 0.5)}
					position={new UDim2(0.66, 0, 0.44, 0)}
					size={new UDim2(0.623, 0, 0.184, 0)}
					font={fonts.josefinSans.regular}
					text={selectedItem ?? "undefined"}
					textSize={21}
					textColor={colors.white}
					textXAlignment={Enum.TextXAlignment.Left}
					textYAlignment={Enum.TextYAlignment.Center}
				></Text>

				<Frame
					anchorPoint={new Vector2(0.5, 0.5)}
					position={new UDim2(0.648, 0, 0.635, 0)}
					size={new UDim2(0.598, 0, 0.13, 0)}
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
						position={new UDim2(0.042, 0, 0.5, 0)}
						size={new UDim2(0.171, 0, 1.447, 0)}
						image="rbxassetid://137038247592087"
						imageColor={colors.lightblue}
						imageTransparency={0.8}
					></Image>
				</Frame>

				<Image
					anchorPoint={new Vector2(0.5, 0.5)}
					position={new UDim2(0.14, 0, 0.586, 0)}
					size={new UDim2(0.278, 0, 0.698, 0)}
					image={selectedItem ? ITEMS[selectedItem].image : ""}
				></Image>

				<Frame
					anchorPoint={new Vector2(0.5, 0.5)}
					position={new UDim2(0.648, 0, 0.808, 0)}
					size={new UDim2(0.598, 0, 0.064, 0)}
					backgroundColor={Color3.fromRGB(32, 32, 32)}
				>
					<Frame
						ref={productionProgressBarRef}
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
				position={new UDim2(0.5, 0, 0.603, 0)}
				size={new UDim2(0.91, 0, 0.346, 0)}
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

					{structureModel !== undefined
						? ITEM_RECIPES.filter((itemRecipe) => itemRecipe.structureName === structureModel.Name).map(
								(itemRecipe) => {
									return <PanelItemButton itemName={itemRecipe.outputItem}></PanelItemButton>;
								},
						  )
						: undefined}
				</scrollingframe>
			</Frame>

			<Frame
				anchorPoint={new Vector2(0.5, 0.5)}
				position={new UDim2(0.5, 0, 0.885, 0)}
				size={new UDim2(0.91, 0, 0.153, 0)}
				backgroundTransparency={1}
			>
				<Text
					size={new UDim2(0.269, 0, 0.25, 0)}
					font={fonts.josefinSans.medium}
					text={"Cost :"}
					textSize={20}
					textColor={colors.white}
					textXAlignment={Enum.TextXAlignment.Left}
					textYAlignment={Enum.TextYAlignment.Top}
				></Text>

				<Frame
					anchorPoint={new Vector2(0.5, 1)}
					position={new UDim2(0.5, 0, 1, 0)}
					size={new UDim2(1, 0, 0.7, 0)}
					backgroundTransparency={1}
				>
					<uigridlayout
						CellPadding={new UDim2(0, 5, 0, 5)}
						CellSize={new UDim2(0, 35, 0, 35)}
						FillDirection={Enum.FillDirection.Horizontal}
						HorizontalAlignment={Enum.HorizontalAlignment.Center}
						VerticalAlignment={Enum.VerticalAlignment.Center}
					></uigridlayout>

					{selectedItemRecipe !== undefined
						? Object.entries(selectedItemRecipe.inputItems as Record<ItemName, number>).map(
								([itemName, itemCount]) => {
									return (
										<ItemCostButton
											hoverBubblePosition={new UDim2(0.5, 0, -0.38, 0)}
											hoverBubbleSize={new UDim2(2.791, 0, 2.137, 0)}
											amountPerMinuteTextGlowPosition={new UDim2(0.173, 0, 0.5, 0)}
											amountPerMinuteTextGlowSize={new UDim2(0.465, 0, 1.68, 0)}
											itemName={itemName}
											cost={itemCount}
											amountPerMinute={math.ceil(itemCount * (60 / selectedItemRecipe.time))}
										></ItemCostButton>
									);
								},
						  )
						: undefined}
				</Frame>
			</Frame>
		</Panel>
	);
}
