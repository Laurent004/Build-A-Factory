import React, { useEffect } from "@rbxts/react";
import { lerpBinding, useMotion } from "@rbxts/pretty-react-hooks";
import { fonts, colors, springs } from "client/ui/constants";
import { Button } from "client/ui/core/button";
import { Frame } from "client/ui/core/frame";
import { Image } from "client/ui/core/image";
import { ITEMS } from "shared/constants/items";
import { IMAGES } from "shared/assets/images";
import { useSelector } from "@rbxts/react-reflex";
import { selectContext } from "client/store/context";
import { selectItemMenuItemName } from "client/store/context/item";
import { Text } from "client/ui/core/text";

export interface ItemsMenuRecipeItemProps {
	index: number;
	itemName: string;
	itemCount: number;
	itemPerMinute: number;
}

export function ItemsMenuRecipeItem(props: ItemsMenuRecipeItemProps) {
	const context = useSelector(selectContext);
	const itemName = useSelector(selectItemMenuItemName);
	const [onUpdateAnimation, onUpdateAnimationMotion] = useMotion(0);
	const [onHoverAnimation, onHoverAnimationMotion] = useMotion(0);

	useEffect(() => {
		if (context === "Items") {
			onUpdateAnimationMotion.immediate(0);
			task.delay((props.index + 1) * 0.055, () => {
				onUpdateAnimationMotion.spring(1, springs.gentle);
			});
		} else {
			onUpdateAnimationMotion.spring(0, springs.gentle);
		}
	}, [context, itemName]);

	return (
		<Button
			anchorPoint={new Vector2(0, 0)}
			position={new UDim2(0, 0, 0, 0)}
			size={new UDim2(0.097, 0, 0.63, 0)}
			layoutOrder={props.index}
			onMouseEnter={() => {
				onHoverAnimationMotion.spring(1, springs.responsive);
			}}
			onMouseLeave={() => {
				onHoverAnimationMotion.spring(0, springs.responsive);
			}}
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
					textColor={colors.white}
					textTransparency={onUpdateAnimation.map((value) => 1 - value)}
					textXAlignment={Enum.TextXAlignment.Center}
					textYAlignment={Enum.TextYAlignment.Center}
				></Text>

				<Image
					anchorPoint={new Vector2(0.5, 0.5)}
					position={lerpBinding(onHoverAnimation, new UDim2(0.5, 0, 0.1, 0), new UDim2(0.5, 0, -0.21, 0))}
					size={new UDim2(2.023, 0, 1.549, 0)}
					zIndex={2}
					image="rbxassetid://94570845710788"
					imageColor={colors.darkgrey}
					imageTransparency={onHoverAnimation.map((value) => 1 - value)}
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
							richText={true}
							text={`<font weight="regular" color="rgb(176,208,255)">${props.itemPerMinute}${
								ITEMS[props.itemName].model !== undefined ? "" : "m³"
							}</font> per minute`}
							textSize={11}
							textColor={colors.white}
							textTransparency={onHoverAnimation.map((value) => 1 - value)}
							textXAlignment={Enum.TextXAlignment.Center}
							textYAlignment={Enum.TextYAlignment.Center}
						></Text>
						<Image
							anchorPoint={new Vector2(0.5, 0.5)}
							position={new UDim2(0.242, 0, 0.5, 0)}
							size={new UDim2(0.65, 0, 1.68, 0)}
							image={IMAGES.ui.Glow}
							imageColor={colors.lightblue}
							imageTransparency={lerpBinding(onHoverAnimation, 1, 0.8)}
						></Image>
					</Frame>
				</Image>
			</Frame>
		</Button>
	);
}
