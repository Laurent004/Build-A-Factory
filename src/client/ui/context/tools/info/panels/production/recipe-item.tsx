import React, { useEffect } from "@rbxts/react";
import { lerpBinding, useMotion, usePrevious } from "@rbxts/pretty-react-hooks";
import { useState } from "@rbxts/react";
import { colors, fonts, springs } from "client/ui/constants";
import { Frame } from "client/ui/core/frame";
import { Image } from "client/ui/core/image";
import { Text } from "client/ui/core/text";
import { ITEMS } from "shared/constants/items";
import { Button } from "client/ui/core/button";
import { IMAGES } from "shared/assets/images";
import { useSelector } from "@rbxts/react-reflex";
import { selectContextStructureModels } from "client/store/context";

export interface InfoPanelRecipeItemProps {
	index: number;
	itemName: string;
	itemCount: number;
	itemPerMinute: number;
}

export function InfoPanelRecipeItem(props: InfoPanelRecipeItemProps) {
	const structureModel = useSelector(selectContextStructureModels)[0];
	const previousStructureModel = usePrevious(structureModel);
	const [onMountAnimation, onMountAnimationMotion] = useMotion(0);
	const [onHoverAnimation, onHoverAnimationMotion] = useMotion(0);

	useEffect(() => {
		if (structureModel === undefined) {
			onMountAnimationMotion.spring(0, springs.gentle);
			return;
		} else if (structureModel.Name !== previousStructureModel?.Name) {
			onMountAnimationMotion.immediate(0);
		}
		task.delay((props.index + 1) * 0.05, () => {
			onMountAnimationMotion.spring(1, springs.gentle);
		});
	}, [structureModel]);

	return (
		<Button
			anchorPoint={new Vector2(0, 0)}
			position={new UDim2(0, 0, 0, 0)}
			size={new UDim2(0, 0, 0, 0)}
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
					position={lerpBinding(onHoverAnimation, new UDim2(0.5, 0, -0.19, 0), new UDim2(0.5, 0, -0.5, 0))}
					size={new UDim2(3.5, 0, 2.4, 0)}
					zIndex={2}
					image="rbxassetid://94570845710788"
					imageColor={colors.darkgrey}
					imageTransparency={onHoverAnimation.map((value) => 1 - value)}
				>
					<Frame
						anchorPoint={new Vector2(0.5, 0.5)}
						position={new UDim2(0.5, 0, 0.405, 0)}
						size={new UDim2(1, 0, 0.31, 0)}
						backgroundTransparency={1}
					>
						<Text
							anchorPoint={new Vector2(0.5, 0.5)}
							position={new UDim2(0.5, 0, 0.5, 0)}
							size={new UDim2(1, 0, 1, 0)}
							font={fonts.josefinSans.light}
							richText={true}
							text={`<font weight="regular" color="rgb(176,208,255)">${math.ceil(props.itemPerMinute)}${
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
							position={new UDim2(0.24, 0, 0.5, 0)}
							size={new UDim2(0.465, 0, 1.68, 0)}
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
