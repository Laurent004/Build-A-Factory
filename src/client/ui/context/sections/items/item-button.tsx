import React from "@rbxts/react";
import { useStore } from "client/hooks";
import { lerpBinding, useUpdateEffect, useMotion } from "@rbxts/pretty-react-hooks";
import { springs } from "client/ui/constants";
import { Button } from "client/ui/core/button";
import { Image } from "client/ui/core/image";
import { Text } from "client/ui/core/text";
import { fonts, colors } from "client/ui/constants";
import { ITEM_RECIPES, ITEMS } from "shared/constants/items";
import { IMAGES } from "shared/assets/images";
import { useSelector } from "@rbxts/react-reflex";
import { selectContext } from "client/store/context";
import { selectItemMenuItemName } from "client/store/context/item";
import { Object } from "@rbxts/luau-polyfill";

export interface ItemsMenuItemButtonProps {
	itemName: string;
	searchText: string;
}

export function ItemsMenuItemButton(props: ItemsMenuItemButtonProps) {
	const store = useStore();
	const context = useSelector(selectContext);
	const itemName = useSelector(selectItemMenuItemName);
	const [onMountAnimation, onMountAnimationMotion] = useMotion(0);
	const [onClickAnimation, onClickAnimationMotion] = useMotion(0);

	useUpdateEffect(() => {
		if (context !== "Items") return;
		onMountAnimationMotion.immediate(0);
		task.delay((ITEMS[props.itemName].index + 1) * 0.02, () => {
			onMountAnimationMotion.spring(1, springs.gentle);
		});

		if (itemName === props.itemName) {
			onClickAnimationMotion.immediate(0);
			task.delay((ITEMS[itemName].index + 1) * 0.02, () => {
				onClickAnimationMotion.spring(1, springs.slow);
			});
		}
	}, [context]);

	useUpdateEffect(() => {
		onClickAnimationMotion.spring(itemName === props.itemName ? 1 : 0, springs.slow);
	}, [itemName]);

	return (
		<Button
			anchorPoint={new Vector2(0, 0)}
			position={new UDim2(0, 0, 0, 0)}
			size={new UDim2(1, 0, 0.025, 0)}
			layoutOrder={ITEMS[props.itemName].index}
			visible={
				string.find(string.lower(props.itemName), string.lower(props.searchText), 1, true)[0] !== undefined ||
				Object.entries(ITEM_RECIPES)
					.filter(([, itemRecipeDefinition]) =>
						Object.keys(itemRecipeDefinition.outputItems).includes(props.itemName),
					)
					.find(
						([, itemRecipeDefinition]) =>
							Object.keys(itemRecipeDefinition.outputItems).find(
								(itemName) =>
									string.find(string.lower(itemName), string.lower(props.searchText), 1, true)[0] !==
									undefined,
							) !== undefined,
					) !== undefined
			}
			onClick={() => {
				store.setItemMenuItemName(props.itemName);
			}}
		>
			<uistroke
				ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
				Color={colors.lightblue}
				LineJoinMode={Enum.LineJoinMode.Miter}
				Thickness={1}
				Transparency={onClickAnimation.map((value) => 1 - value)}
			></uistroke>

			<Image
				anchorPoint={new Vector2(0.5, 0.5)}
				position={new UDim2(0.165, 0, 0.54, 0)}
				size={new UDim2(0.116, 0, 0.84, 0)}
				image={ITEMS[props.itemName].image}
				imageTransparency={onMountAnimation.map((value) => 1 - value)}
			></Image>

			<Text
				anchorPoint={new Vector2(0.5, 0.5)}
				position={new UDim2(0.626, 0, 0.5, 0)}
				size={new UDim2(0.66, 0, 0.757, 0)}
				font={fonts.josefinSans.regular}
				text={props.itemName}
				textSize={16}
				textColor={lerpBinding(onClickAnimation, colors.white, colors.lightblue)}
				textTransparency={onMountAnimation.map((value) => 1 - value)}
				textXAlignment={Enum.TextXAlignment.Center}
				textYAlignment={Enum.TextYAlignment.Center}
			></Text>

			<Image
				anchorPoint={new Vector2(0.5, 0.5)}
				position={new UDim2(0.5, 0, 0.5, 0)}
				size={new UDim2(2, 0, 2, 0)}
				image={IMAGES.ui.Glow}
				imageColor={colors.lightblue}
				imageTransparency={lerpBinding(onClickAnimation, 1, 0.75)}
			></Image>
		</Button>
	);
}
