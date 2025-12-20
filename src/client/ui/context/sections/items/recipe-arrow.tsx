import { lerpBinding, useMountEffect, useMotion } from "@rbxts/pretty-react-hooks";
import React, { useEffect } from "@rbxts/react";
import { colors, springs } from "client/ui/constants";
import { Frame } from "client/ui/core/frame";
import { Image } from "client/ui/core/image";
import { IMAGES } from "shared/assets/images";
import { useSelector } from "@rbxts/react-reflex";
import { selectContext } from "client/store/context";
import { selectItemMenuItemName } from "client/store/context/item";

export interface ItemsMenuRecipeArrowProps {
	index: number;
}

export function ItemsMenuRecipeArrow(props: ItemsMenuRecipeArrowProps) {
	const context = useSelector(selectContext);
	const itemName = useSelector(selectItemMenuItemName);
	const [onMountAnimation, onMountAnimationMotion] = useMotion(0);
	const [onUpdateAnimation, onUpdateAnimationMotion] = useMotion(0);

	useMountEffect(() => {
		onMountAnimationMotion.tween(1, {
			time: 1.75,
			style: Enum.EasingStyle.Linear,
			direction: Enum.EasingDirection.In,
			repeatCount: -1,
			reverses: true,
		});
	});

	useEffect(() => {
		if (context === "Items") {
			onUpdateAnimationMotion.immediate(0);
		}
		onUpdateAnimationMotion.spring(context === "Items" ? 1 : 0, springs.responsive);
	}, [context, itemName]);

	return (
		<Frame
			anchorPoint={new Vector2(0, 0)}
			position={new UDim2(0, 0, 0, 0)}
			size={new UDim2(0.064, 0, 0.414, 0)}
			backgroundTransparency={1}
			layoutOrder={props.index}
		>
			<Image
				anchorPoint={new Vector2(0.5, 0.5)}
				position={lerpBinding(onMountAnimation, new UDim2(0.4, 0, 0.5, 0), new UDim2(0.6, 0, 0.5, 0))}
				size={new UDim2(1, 0, 1, 0)}
				image="rbxassetid://87835167641652"
				imageColor={colors.lightblue}
				imageTransparency={onUpdateAnimation.map((value) => 1 - value)}
			>
				<Image
					anchorPoint={new Vector2(0.5, 0.5)}
					position={new UDim2(0.5, 0, 0.5, 0)}
					size={new UDim2(2, 0, 2, 0)}
					image={IMAGES.ui.Glow}
					imageColor={colors.lightblue}
					imageTransparency={lerpBinding(onUpdateAnimation, 1, 0.88)}
				></Image>
			</Image>
		</Frame>
	);
}
