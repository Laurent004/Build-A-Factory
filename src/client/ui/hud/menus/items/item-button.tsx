import React, { useEffect } from "@rbxts/react";
import { useStore } from "client/hooks";
import { useSelector } from "@rbxts/react-reflex";
import { useMotion } from "client/hooks";
import { lerpBinding } from "@rbxts/pretty-react-hooks";
import { springs } from "client/constants/springs";
import { Button } from "client/ui/core/button";
import { Image } from "client/ui/core/image";
import { Text } from "client/ui/core/text";
import { fonts } from "client/constants/fonts";
import { selectItemMenuItemName, selectItemMenuItemSearchText } from "client/store/menus/item";
import { colors } from "client/constants/colors";
import { ItemName, ITEMS } from "shared/constants/items";

export interface ItemButtonProps {
	itemName: ItemName;
}

export function ItemButton(props: ItemButtonProps) {
	const store = useStore();
	const itemName = useSelector(selectItemMenuItemName);
	const itemSearchText = useSelector(selectItemMenuItemSearchText);
	const [animation, animationMotion] = useMotion(0);

	useEffect(() => {
		animationMotion.spring(itemName === props.itemName ? 1 : 0, springs.slow);
	}, [itemName]);

	return (
		<Button
			onClick={() => {
				store.setItemMenuItemDefinition(props.itemName);
			}}
			size={new UDim2(1, 0, 0.025, 0)}
			layoutOrder={ITEMS[props.itemName].index}
			visible={string.find(string.lower(props.itemName), string.lower(itemSearchText), 1, true)[0] !== undefined}
		>
			<uistroke
				ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
				Color={colors.lightblue}
				LineJoinMode={Enum.LineJoinMode.Miter}
				Enabled={props.itemName === itemName}
			></uistroke>

			<Image
				anchorPoint={new Vector2(0.5, 0.5)}
				position={new UDim2(0.165, 0, 0.54, 0)}
				size={new UDim2(0.116, 0, 0.92, 0)}
				image={ITEMS[props.itemName].image}
			></Image>
			<Text
				anchorPoint={new Vector2(0.5, 0.5)}
				position={new UDim2(0.626, 0, 0.5, 0)}
				size={new UDim2(0.66, 0, 0.757, 0)}
				font={fonts.josefinSans.regular}
				textSize={16}
				textColor={lerpBinding(animation, colors.white, colors.lightblue)}
				text={props.itemName}
			></Text>

			<Image
				anchorPoint={new Vector2(0.5, 0.5)}
				position={new UDim2(0.5, 0, 0.5, 0)}
				size={new UDim2(2, 0, 2, 0)}
				image="rbxassetid://137197581459632"
				imageColor={colors.lightblue}
				imageTransparency={lerpBinding(animation, 1, 0.75)}
			></Image>
		</Button>
	);
}
