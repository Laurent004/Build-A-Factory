import React from "@rbxts/react";
import { useSelector } from "@rbxts/react-reflex";

import { Frame } from "client/ui/core/frame";
import { Image } from "client/ui/core/image";
import { Text } from "client/ui/core/text";
import { fonts } from "client/constants/fonts";
import { colors } from "client/constants/colors";
import { selectItemMenuItemName } from "client/store/menus/item";
import { ITEMS } from "shared/constants/items";

export function ItemInformation() {
	const itemName = useSelector(selectItemMenuItemName);

	return (
		<Frame
			anchorPoint={new Vector2(0.5, 0.5)}
			position={new UDim2(0.632, 0, 0.229, 0)}
			size={new UDim2(0.737, 0, 0.299, 0)}
			backgroundTransparency={1}
		>
			<uistroke
				ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
				Color={colors.grey}
				LineJoinMode={Enum.LineJoinMode.Miter}
			></uistroke>

			<Image
				anchorPoint={new Vector2(0.5, 0.5)}
				position={new UDim2(0.176, 0, 0.5, 0)}
				size={new UDim2(0.26, 0, 0.831, 0)}
				image={ITEMS[itemName].image}
			></Image>

			<Text
				anchorPoint={new Vector2(0.5, 0.5)}
				position={new UDim2(0.563, 0, 0.174, 0)}
				size={new UDim2(0.422, 0, 0.184, 0)}
				font={fonts.josefinSans.medium}
				textSize={30}
				textColor={colors.white}
				text={itemName}
				textXAlignment={Enum.TextXAlignment.Left}
			></Text>
			<Text
				anchorPoint={new Vector2(0.5, 0.5)}
				position={new UDim2(0.638, 0, 0.374, 0)}
				size={new UDim2(0.571, 0, 0.164, 0)}
				font={fonts.josefinSans.regular}
				lineHeight={1.3}
				textSize={13}
				textColor={colors.white}
				text={ITEMS[itemName].description}
				textXAlignment={Enum.TextXAlignment.Left}
				textYAlignment={Enum.TextYAlignment.Top}
			></Text>
		</Frame>
	);
}
