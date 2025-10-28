import React from "@rbxts/react";
import { useMotion, useMountEffect } from "@rbxts/pretty-react-hooks";
import { useState } from "@rbxts/react";
import { colors, fonts, springs } from "client/ui/constants";
import { Frame } from "client/ui/core/frame";
import { Image } from "client/ui/core/image";
import { Text } from "client/ui/core/text";
import { ITEMS } from "shared/constants/items";
import { Button } from "client/ui/core/button";
import { IMAGES } from "shared/assets/images";

export interface InfoPanelItemCostButtonProps {
	index: number;
	itemName: string;
	itemCount: number;
	itemPerMinute: number;
}

export function InfoPanelItemCostButton(props: InfoPanelItemCostButtonProps) {
	const [hovered, setHovered] = useState(false);
	const [onMountAnimation, onMountAnimationMotion] = useMotion(0);

	useMountEffect(() => {
		task.delay((props.index + 1) * 0.04, () => {
			onMountAnimationMotion.spring(1, springs.gentle);
		});
	});

	return (
		<Button
			onMouseEnter={() => {
				setHovered(true);
			}}
			onMouseLeave={() => {
				setHovered(false);
			}}
		>
			<Frame
				anchorPoint={new Vector2(0.5, 0.5)}
				position={new UDim2(0.5, 0, 0.5, 0)}
				size={new UDim2(1, 0, 1, 0)}
				backgroundColor={colors.mediumgrey}
				backgroundTransparency={onMountAnimation.map((value) => 1 - value)}
			>
				<uicorner CornerRadius={new UDim(0, 64)}></uicorner>

				<Image
					anchorPoint={new Vector2(0.5, 0.5)}
					position={new UDim2(0.5, 0, 0.5, 0)}
					size={new UDim2(0.7, 0, 0.7, 0)}
					image={ITEMS[props.itemName].image}
					imageTransparency={onMountAnimation.map((value) => 1 - value)}
				></Image>

				<Text
					anchorPoint={new Vector2(0, 0)}
					position={new UDim2(0.825, 0, 0.825, 0)}
					size={new UDim2(0.257, 0, 0.257, 0)}
					font={fonts.josefinSans.regular}
					text={`x${props.itemCount}`}
					textSize={18}
					textColor={colors.white}
					textTransparency={onMountAnimation.map((value) => 1 - value)}
					textXAlignment={Enum.TextXAlignment.Center}
					textYAlignment={Enum.TextYAlignment.Center}
				></Text>

				<Image
					anchorPoint={new Vector2(0.5, 0.5)}
					position={new UDim2(0.5, 0, -0.38, 0)}
					size={new UDim2(2.791, 0, 2.137, 0)}
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
							text={`<font weight="regular" color="rgb(176,208,255)">${math.ceil(
								props.itemPerMinute,
							)}</font> per minute`}
							textSize={11}
							textColor={colors.white}
							richText={true}
							textXAlignment={Enum.TextXAlignment.Center}
							textYAlignment={Enum.TextYAlignment.Center}
						></Text>
						<Image
							anchorPoint={new Vector2(0.5, 0.5)}
							position={new UDim2(0.193, 0, 0.5, 0)}
							size={new UDim2(0.465, 0, 1.68, 0)}
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
