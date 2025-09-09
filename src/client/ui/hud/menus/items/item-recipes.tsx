import React from "@rbxts/react";
import { useSelector } from "@rbxts/react-reflex";
import { fonts } from "client/constants/fonts";

import { ItemRecipe } from "./item-recipe";
import { ITEM_RECIPES, ItemName } from "shared/constants/items";
import { Frame } from "client/ui/core/frame";
import { Text } from "client/ui/core/text";
import { selectItemMenuItemName } from "client/store/menus/item";
import { colors } from "client/constants/colors";

export interface ItemRecipesProps {
	itemName: ItemName;
}

export function ItemRecipes(props: ItemRecipesProps) {
	const itemName = useSelector(selectItemMenuItemName);

	return (
		<Frame
			anchorPoint={new Vector2(0.5, 0.5)}
			position={new UDim2(0.631, 0, 0.691, 0)}
			size={new UDim2(0.737, 0, 0.619, 0)}
			backgroundTransparency={1}
			visible={itemName === props.itemName}
		>
			<Frame
				anchorPoint={new Vector2(0.5, 0.5)}
				position={new UDim2(0.215, 0, 0.052, 0)}
				size={new UDim2(0.428, 0, 0.047, 0)}
				backgroundColor={Color3.fromRGB(225, 225, 225)}
			>
				<uigradient
					Color={
						new ColorSequence([
							new ColorSequenceKeypoint(0, Color3.fromRGB(35, 35, 35)),
							new ColorSequenceKeypoint(1, Color3.fromRGB(139, 139, 139)),
						])
					}
					Transparency={
						new NumberSequence([
							new NumberSequenceKeypoint(0, 0),
							new NumberSequenceKeypoint(0.481, 0.72),
							new NumberSequenceKeypoint(1, 1),
						])
					}
				></uigradient>
				<Text
					anchorPoint={new Vector2(0.5, 0.5)}
					position={new UDim2(0.524, 0, 0.52, 0)}
					size={new UDim2(0.951, 0, 1, 0)}
					font={fonts.josefinSans.regular}
					textSize={14}
					textColor={colors.white}
					text={"Recipes"}
					textXAlignment={Enum.TextXAlignment.Left}
				></Text>
			</Frame>

			<Frame
				anchorPoint={new Vector2(0.5, 0.5)}
				position={new UDim2(0.485, 0, 0.55, 0)}
				size={new UDim2(0.897, 0, 0.848, 0)}
				backgroundTransparency={1}
			>
				<uilistlayout
					Padding={new UDim(0, 15)}
					HorizontalAlignment={Enum.HorizontalAlignment.Center}
					VerticalAlignment={Enum.VerticalAlignment.Top}
				></uilistlayout>
				{ITEM_RECIPES.filter((recipe) => recipe.outputItem === props.itemName).map((itemRecipe) => (
					<ItemRecipe itemRecipe={itemRecipe}></ItemRecipe>
				))}
			</Frame>
		</Frame>
	);
}
