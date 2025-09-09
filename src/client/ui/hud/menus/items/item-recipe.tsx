import { Object } from "@rbxts/luau-polyfill";
import React from "@rbxts/react";
import { Frame } from "client/ui/core/frame";
import { Image } from "client/ui/core/image";
import { Text } from "client/ui/core/text";
import { fonts } from "client/constants/fonts";

import { ItemRecipeArrow } from "./item-recipe-arrow";
import { ITEMS } from "shared/constants/items";
import { ItemRecipe } from "shared/constants/items";
import { ItemCostButton } from "./item-cost-button";
import { colors } from "client/constants/colors";
import { STRUCTURES } from "shared/constants/structures";

export interface ItemRecipeProps {
	itemRecipe: ItemRecipe;
}

export function ItemRecipe(props: ItemRecipeProps) {
	return (
		<Frame size={new UDim2(1, 0, 0.217, 0)} backgroundColor={Color3.fromRGB(30, 30, 30)}>
			<uicorner CornerRadius={new UDim(0, 12)}></uicorner>
			<uistroke Color={Color3.fromRGB(50, 50, 50)} Thickness={1}></uistroke>
			<Frame
				anchorPoint={new Vector2(0.5, 0.5)}
				position={new UDim2(0.396, 0, 0.5, 0)}
				size={new UDim2(0.72, 0, 1, 0)}
				backgroundTransparency={1}
			>
				<uilistlayout
					Padding={new UDim(0, 8)}
					FillDirection={Enum.FillDirection.Horizontal}
					HorizontalAlignment={Enum.HorizontalAlignment.Left}
					VerticalAlignment={Enum.VerticalAlignment.Center}
				></uilistlayout>

				{Object.entries(props.itemRecipe.inputItems).map(([itemName, itemCount]) => {
					return (
						<ItemCostButton
							size={new UDim2(0.134, 0, 0.725, 0)}
							hoverBubblePosition={new UDim2(0.5, 0, -0.21, 0)}
							hoverBubbleSize={new UDim2(2.023, 0, 1.549, 0)}
							amountPerMinuteTextGlowPosition={new UDim2(0.242, 0, 0.5, 0)}
							amountPerMinuteTextGlowSize={new UDim2(0.447, 0, 1.68, 0)}
							itemName={itemName}
							cost={itemCount}
							amountPerMinute={math.ceil(itemCount * (60 / props.itemRecipe.time))}
						></ItemCostButton>
					);
				})}

				<ItemRecipeArrow></ItemRecipeArrow>

				<Frame size={new UDim2(0.134, 0, 0.725, 0)} backgroundColor={colors.mediumgrey}>
					<uicorner CornerRadius={new UDim(0, 64)}></uicorner>

					<Image
						anchorPoint={new Vector2(0.5, 0.5)}
						position={new UDim2(0.5, 0, 0.5, 0)}
						size={new UDim2(0.7, 0, 0.7, 0)}
						image={STRUCTURES[props.itemRecipe.structureName].image}
					></Image>
					<Text
						anchorPoint={new Vector2(0.5, 0.5)}
						position={new UDim2(0.36, 0, 1, 0)}
						size={new UDim2(0.311, 0, 0.307, 0)}
						font={fonts.josefinSans.medium}
						text={`${props.itemRecipe.time}s`}
						textSize={18}
						textColor={colors.white}
					>
						<Image
							anchorPoint={new Vector2(0.5, 0.5)}
							position={new UDim2(1.85, 0, 0.42, 0)}
							size={new UDim2(0.981, 0, 1, 0)}
							image="rbxassetid://121749492491165"
						></Image>
					</Text>
				</Frame>

				<ItemRecipeArrow></ItemRecipeArrow>

				<Frame size={new UDim2(0.134, 0, 0.725, 0)} backgroundColor={colors.mediumgrey}>
					<uicorner CornerRadius={new UDim(0, 64)}></uicorner>

					<Image
						anchorPoint={new Vector2(0.5, 0.5)}
						position={new UDim2(0.5, 0, 0.5, 0)}
						size={new UDim2(0.7, 0, 0.7, 0)}
						image={ITEMS[props.itemRecipe.outputItem].image}
					></Image>
					<Text
						anchorPoint={new Vector2(0.5, 0.5)}
						position={new UDim2(1, 0, 1, 0)}
						size={new UDim2(0.1, 0, 0.1, 0)}
						font={fonts.josefinSans.medium}
						text={`x${1}`}
						textSize={18}
						textColor={colors.white}
					></Text>
				</Frame>
			</Frame>
			<Image
				anchorPoint={new Vector2(0.5, 0.5)}
				position={new UDim2(0.5, 0, 0.5, 0)}
				size={new UDim2(1, 0, 1, 0)}
				image="rbxassetid://122009683399101"
				imageTransparency={0.94}
				zIndex={0}
			></Image>
		</Frame>
	);
}
