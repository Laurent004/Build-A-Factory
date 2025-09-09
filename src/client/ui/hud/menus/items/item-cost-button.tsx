import React, { useState } from "@rbxts/react";
import { colors } from "client/constants/colors";
import { fonts } from "client/constants/fonts";
import { Button } from "client/ui/core/button";
import { Frame } from "client/ui/core/frame";
import { Image } from "client/ui/core/image";
import { Text } from "client/ui/core/text";
import { ItemName, ITEMS } from "shared/constants/items";

export interface ItemCostButtonProps {
	position?: UDim2;
	size?: UDim2;

	hoverBubblePosition: UDim2;
	hoverBubbleSize: UDim2;

	itemName: ItemName;
	cost: number;

	amountPerMinute: number;
	amountPerMinuteTextGlowPosition: UDim2;
	amountPerMinuteTextGlowSize: UDim2;
}

export function ItemCostButton(props: ItemCostButtonProps) {
	const [hovered, setHover] = useState(false);

	return (
		<Button
			position={props.position}
			size={props.size}
			onMouseEnter={() => {
				setHover(true);
			}}
			onMouseLeave={() => {
				setHover(false);
			}}
		>
			<Frame
				anchorPoint={new Vector2(0.5, 0.5)}
				position={new UDim2(0.5, 0, 0.5, 0)}
				size={new UDim2(1, 0, 1, 0)}
				backgroundColor={colors.mediumgrey}
			>
				<uicorner CornerRadius={new UDim(0, 64)}></uicorner>

				<Image
					anchorPoint={new Vector2(0.5, 0.5)}
					position={new UDim2(0.5, 0, 0.5, 0)}
					size={new UDim2(0.7, 0, 0.7, 0)}
					image={ITEMS[props.itemName].image}
				></Image>

				<Text
					anchorPoint={new Vector2(0, 0)}
					position={new UDim2(0.825, 0, 0.825, 0)}
					size={new UDim2(0.257, 0, 0.257, 0)}
					font={fonts.josefinSans.regular}
					text={`x${props.cost}`}
					textSize={18}
					textColor={colors.white}
					textXAlignment={Enum.TextXAlignment.Center}
					textYAlignment={Enum.TextYAlignment.Center}
				></Text>

				<Image
					anchorPoint={new Vector2(0.5, 0.5)}
					position={props.hoverBubblePosition}
					size={props.hoverBubbleSize}
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
							text={`<font weight="regular" color="rgb(176,208,255)">${props.amountPerMinute}</font> per minute`}
							textSize={11}
							textColor={colors.white}
							richText={true}
							textXAlignment={Enum.TextXAlignment.Center}
							textYAlignment={Enum.TextYAlignment.Center}
						></Text>
						<Image
							anchorPoint={new Vector2(0.5, 0.5)}
							position={props.amountPerMinuteTextGlowPosition}
							size={props.amountPerMinuteTextGlowSize}
							image="rbxassetid://137038247592087"
							imageColor={colors.lightblue}
							imageTransparency={0.8}
						></Image>
					</Frame>
				</Image>
			</Frame>
		</Button>
	);
}
