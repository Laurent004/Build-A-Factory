import React, { useEffect, useState } from "@rbxts/react";
import { useMotion } from "@rbxts/pretty-react-hooks";
import { fonts, colors, springs } from "client/ui/constants";

import { Button } from "client/ui/core/button";
import { Frame } from "client/ui/core/frame";
import { Image } from "client/ui/core/image";
import { Text } from "client/ui/core/text";
import { ITEMS } from "shared/constants/items";
import { IMAGES } from "shared/assets/images";
import { useSelector } from "@rbxts/react-reflex";
import { selectContext } from "client/store/context";
import { selectItemMenuItemName } from "client/store/context/item";

export interface ItemRecipeItemProps {
	index: number;
	itemName: string;
	itemCount: number;
	itemPerMinute: number;
}

export function ItemRecipeItem(props: ItemRecipeItemProps) {
	const context = useSelector(selectContext);
	const selectedItemName = useSelector(selectItemMenuItemName);

	const [hovered, setHovered] = useState(false);
	const [onUpdateAnimation, onUpdaeAnimationMotion] = useMotion(0);

	useEffect(() => {
		if (context !== "Items") return;
		onUpdaeAnimationMotion.immediate(0);
		task.delay((props.index + 1) * 0.055, () => {
			onUpdaeAnimationMotion.spring(1, springs.gentle);
		});
	}, [context, selectedItemName]);

	return (
		<Button
			size={new UDim2(0.097, 0, 0.63, 0)}
			onMouseEnter={() => {
				setHovered(true);
			}}
			onMouseLeave={() => {
				setHovered(false);
			}}
			layoutOrder={props.index}
		>
			<Frame
				anchorPoint={new Vector2(0.5, 0.5)}
				position={new UDim2(0.5, 0, 0.5, 0)}
				size={new UDim2(1, 0, 1, 0)}
				backgroundColor={colors.mediumgrey}
				backgroundTransparency={onUpdateAnimation.map((value) => 1 - value)}
			>
				<uicorner CornerRadius={new UDim(0, 64)}></uicorner>

				<Image
					anchorPoint={new Vector2(0.5, 0.5)}
					position={new UDim2(0.5, 0, 0.5, 0)}
					size={new UDim2(0.7, 0, 0.7, 0)}
					image={ITEMS[props.itemName].image}
					imageTransparency={onUpdateAnimation.map((value) => 1 - value)}
				></Image>

				<Text
					anchorPoint={new Vector2(0, 0)}
					position={new UDim2(0.825, 0, 0.825, 0)}
					size={new UDim2(0.257, 0, 0.257, 0)}
					font={fonts.josefinSans.regular}
					text={`x${props.itemCount}`}
					textSize={18}
					textTransparency={onUpdateAnimation.map((value) => 1 - value)}
					textColor={colors.white}
					textXAlignment={Enum.TextXAlignment.Center}
					textYAlignment={Enum.TextYAlignment.Center}
				></Text>

				<Image
					anchorPoint={new Vector2(0.5, 0.5)}
					position={new UDim2(0.5, 0, -0.21, 0)}
					size={new UDim2(2.023, 0, 1.549, 0)}
					zIndex={2}
					image="rbxassetid://94570845710788"
					imageColor={colors.darkgrey}
					visible={hovered}
				>
					<Frame
						anchorPoint={new Vector2(0.5, 0.5)}
						position={new UDim2(0.5, 0, 0.405, 0)}
						size={new UDim2(1, 0, 0.316, 0)}
						backgroundTransparency={1}
					>
						<Text
							anchorPoint={new Vector2(0.5, 0.5)}
							position={new UDim2(0.5, 0, 0.5, 0)}
							size={new UDim2(1, 0, 1, 0)}
							font={fonts.josefinSans.light}
							text={`<font weight="regular" color="rgb(176,208,255)">${props.itemPerMinute}</font> per minute`}
							textSize={11}
							textColor={colors.white}
							richText={true}
							textXAlignment={Enum.TextXAlignment.Center}
							textYAlignment={Enum.TextYAlignment.Center}
						></Text>
						<Image
							anchorPoint={new Vector2(0.5, 0.5)}
							position={new UDim2(0.242, 0, 0.5, 0)}
							size={new UDim2(0.447, 0, 1.68, 0)}
							image={IMAGES.ui.Glow}
							imageColor={colors.lightblue}
							imageTransparency={0.8}
						></Image>
					</Frame>
				</Image>
			</Frame>
		</Button>
	);
}
