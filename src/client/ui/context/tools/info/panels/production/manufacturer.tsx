import React, { useRef, useState } from "@rbxts/react";
import { Text } from "client/ui/core/text";
import { fonts, colors, springs } from "client/ui/constants";
import { Frame } from "client/ui/core/frame";
import { Image } from "client/ui/core/image";
import { Object } from "@rbxts/luau-polyfill";
import { ITEM_RECIPES, ITEMS } from "shared/constants/items";
import { useSelector } from "@rbxts/react-reflex";
import { lerpBinding, useUpdateEffect, useMotion, usePrevious } from "@rbxts/pretty-react-hooks";
import { RunService } from "@rbxts/services";
import { InfoPanelRecipeItem } from "./recipe-item";
import { InfoPanelRecipeButton } from "./recipe-button";
import { IMAGES } from "shared/assets/images";
import { useRem } from "client/hooks/use-rem";
import { BaseInfoPanel } from "../base";
import ManufacturerComponent from "client/components/production/manufacturer";
import { selectContextStructureModelAttribute, selectContextStructureModelComponent } from "client/store/context";

export function ManufacturerInfoPanel() {
	const rem = useRem();
	const manufacturerComponent = useSelector(selectContextStructureModelComponent(ManufacturerComponent));
	const previousManufacturerComponent = usePrevious(manufacturerComponent);
	const recipe = useSelector(selectContextStructureModelAttribute("Recipe")) as string | undefined;
	const productionProgressBarRef = useRef<Frame>();
	const productionProgressConnectionRef = useRef<RBXScriptConnection>();
	const [onMountAnimation, onMountAnimationMotion] = useMotion(0);

	useUpdateEffect(() => {
		productionProgressConnectionRef.current?.Disconnect();
		productionProgressConnectionRef.current = undefined;
		if (
			manufacturerComponent !== undefined &&
			manufacturerComponent.instance.Name !== previousManufacturerComponent?.instance?.Name
		) {
			onMountAnimationMotion.immediate(0);
		}
		onMountAnimationMotion.spring(manufacturerComponent !== undefined ? 1 : 0, springs.gentle);
		if (manufacturerComponent === undefined) return;
		productionProgressConnectionRef.current = RunService.Heartbeat.Connect(() => {
			productionProgressBarRef.current!.Size = new UDim2(
				manufacturerComponent.getProductionProgress(),
				0,
				0.6,
				0,
			);
		});
	}, [manufacturerComponent]);

	return (
		<BaseInfoPanel
			active={manufacturerComponent !== undefined}
			size={new UDim2(0, rem(351), 0, rem(632))}
			headerSize={new UDim2(1, 0, 0.075, 0)}
			headerIconSize={new UDim2(0.062, 0, 0.45, 0)}
			descriptionPosition={new UDim2(0.5, 0, 0.13, 0)}
			descriptionSize={new UDim2(0.915, 0, 0.06, 0)}
		>
			<Frame
				anchorPoint={new Vector2(0.5, 0.5)}
				position={new UDim2(0.5, 0, 0.293, 0)}
				size={new UDim2(0.915, 0, 0.227, 0)}
				backgroundTransparency={1}
			>
				<Text
					anchorPoint={new Vector2(0, 0)}
					position={lerpBinding(onMountAnimation, new UDim2(-0.25, 0, 0, 0), new UDim2(0, 0, 0, 0))}
					size={new UDim2(0.623, 0, 0.158, 0)}
					font={fonts.josefinSans.medium}
					text={"Selected Recipe :"}
					textSize={19}
					textColor={colors.white}
					textTransparency={onMountAnimation.map((value) => 1 - value)}
					textXAlignment={Enum.TextXAlignment.Left}
					textYAlignment={Enum.TextYAlignment.Top}
				></Text>

				<Text
					anchorPoint={new Vector2(0.5, 0.5)}
					position={lerpBinding(onMountAnimation, new UDim2(0.96, 0, 0.44, 0), new UDim2(0.66, 0, 0.44, 0))}
					size={new UDim2(0.623, 0, 0.184, 0)}
					font={fonts.josefinSans.regular}
					text={recipe}
					textSize={21}
					textColor={colors.white}
					textTransparency={onMountAnimation.map((value) => 1 - value)}
					textXAlignment={Enum.TextXAlignment.Left}
					textYAlignment={Enum.TextYAlignment.Center}
				></Text>

				<Frame
					anchorPoint={new Vector2(0.5, 0.5)}
					position={lerpBinding(
						onMountAnimation,
						new UDim2(0.448, 0, 0.635, 0),
						new UDim2(0.648, 0, 0.635, 0),
					)}
					size={new UDim2(0.598, 0, 0.13, 0)}
					backgroundTransparency={1}
				>
					<Text
						anchorPoint={new Vector2(0, 0.5)}
						position={new UDim2(0, 0, 0.5, 0)}
						size={new UDim2(1, 0, 1, 0)}
						font={fonts.josefinSans.light}
						richText={true}
						text={`<font weight="regular" color="rgb(176,208,255)">${
							recipe !== undefined && recipe in ITEM_RECIPES
								? math.floor(60 / ITEM_RECIPES[recipe].time) * ITEM_RECIPES[recipe].outputItems[recipe]
								: 0
						}${
							recipe !== undefined && recipe in ITEM_RECIPES
								? ITEMS[recipe].model !== undefined
									? ""
									: "m³"
								: ""
						}</font> per minute`}
						textSize={15}
						textColor={Color3.fromRGB(225, 225, 225)}
						textTransparency={onMountAnimation.map((value) => 1 - value)}
						textXAlignment={Enum.TextXAlignment.Left}
						textYAlignment={Enum.TextYAlignment.Center}
					></Text>

					<Image
						anchorPoint={new Vector2(0.5, 0.5)}
						position={new UDim2(0.042, 0, 0.5, 0)}
						size={new UDim2(0.171, 0, 1.447, 0)}
						image={IMAGES.ui.Glow}
						imageColor={colors.lightblue}
						imageTransparency={lerpBinding(onMountAnimation, 1, 0.8)}
					></Image>
				</Frame>

				<Image
					anchorPoint={new Vector2(0.5, 0.5)}
					position={lerpBinding(onMountAnimation, new UDim2(0.147, 0, 1, 0), new UDim2(0.147, 0, 0.6, 0))}
					size={new UDim2(0.289, 0, 0.643, 0)}
					image={recipe !== undefined ? ITEMS[recipe].image : undefined}
					imageTransparency={onMountAnimation.map((value) => 1 - value)}
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
						size={new UDim2(0, 0, 0.6, 0)}
						backgroundColor={colors.lightblue}
					>
						<Image
							anchorPoint={new Vector2(0.5, 0.5)}
							position={new UDim2(0.5, 0, 0.5, 0)}
							size={new UDim2(1.06, 0, 3.306, 0)}
							image={IMAGES.ui.Glow}
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
					anchorPoint={new Vector2(0, 0)}
					position={lerpBinding(onMountAnimation, new UDim2(-0.3, 0, 0, 0), new UDim2(0, 0, 0, 0))}
					size={new UDim2(0.299, 0, 0.102, 0)}
					font={fonts.josefinSans.medium}
					text={"Recipes :"}
					textSize={20}
					textColor={colors.white}
					textXAlignment={Enum.TextXAlignment.Left}
					textYAlignment={Enum.TextYAlignment.Top}
				></Text>

				<scrollingframe
					AnchorPoint={new Vector2(0.5, 0.5)}
					Position={new UDim2(0.5, 0, 0.77, 0)}
					Size={new UDim2(1, 0, 1.255, 0)}
					BackgroundTransparency={1}
					BorderSizePixel={0}
					CanvasSize={new UDim2(0, 0, 2, 0)}
					ScrollBarThickness={0}
					ScrollBarImageTransparency={1}
					ScrollingDirection={Enum.ScrollingDirection.Y}
				>
					<uigridlayout
						CellPadding={new UDim2(0, 3, 0, 3)}
						CellSize={new UDim2(0, 76, 0, 76)}
						FillDirection={Enum.FillDirection.Horizontal}
						SortOrder={Enum.SortOrder.LayoutOrder}
						StartCorner={Enum.StartCorner.TopLeft}
						HorizontalAlignment={Enum.HorizontalAlignment.Left}
						VerticalAlignment={Enum.VerticalAlignment.Top}
					></uigridlayout>

					<uipadding
						PaddingTop={new UDim(0, 1)}
						PaddingLeft={new UDim(0, 1)}
						PaddingRight={new UDim(0, 0)}
						PaddingBottom={new UDim(0, 0)}
					></uipadding>

					{manufacturerComponent !== undefined
						? Object.entries(ITEM_RECIPES)
								.filter(
									([, itemRecipeDefinition]) =>
										itemRecipeDefinition.structureName === manufacturerComponent.instance.Name,
								)
								.sort(
									([itemRecipeA], [itemRecipeB]) =>
										ITEM_RECIPES[itemRecipeA].index < ITEM_RECIPES[itemRecipeB].index,
								)
								.map(([itemRecipeName], index) => {
									return (
										<InfoPanelRecipeButton
											recipeName={itemRecipeName}
											index={index}
										></InfoPanelRecipeButton>
									);
								})
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
					anchorPoint={new Vector2(0, 0)}
					position={lerpBinding(onMountAnimation, new UDim2(-0.4, 0, 0, 0), new UDim2(0, 0, 0, 0))}
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
						SortOrder={Enum.SortOrder.LayoutOrder}
						StartCorner={Enum.StartCorner.TopLeft}
						HorizontalAlignment={Enum.HorizontalAlignment.Center}
						VerticalAlignment={Enum.VerticalAlignment.Center}
					></uigridlayout>

					{recipe !== undefined && recipe in ITEM_RECIPES
						? Object.entries(ITEM_RECIPES[recipe].inputItems)
								.sort(([itemNameA], [itemNameB]) => ITEMS[itemNameA].index < ITEMS[itemNameB].index)
								.map(([itemName, count], index) => {
									return (
										<InfoPanelRecipeItem
											index={index}
											itemName={itemName}
											itemCount={count}
											itemPerMinute={count * (60 / ITEM_RECIPES[recipe].time)}
										></InfoPanelRecipeItem>
									);
								})
						: undefined}
				</Frame>
			</Frame>
		</BaseInfoPanel>
	);
}
