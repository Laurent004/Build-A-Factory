import React, { useEffect } from "@rbxts/react";
import { lerpBinding, useMotion } from "@rbxts/pretty-react-hooks";
import { springs } from "client/ui/constants";
import { colors } from "client/ui/constants";
import { ITEMS } from "shared/constants/items";
import { IMAGES } from "shared/assets/images";
import { Button, Image, Text } from "client/ui/core";

export interface ItemsMenuItemButtonProps {
	itemName: string;
	mouseButton1Click: () => void;
	index: number;
	isVisible: boolean;
	isSelected: boolean;
}

export function ItemsMenuItemButton({
	itemName,
	mouseButton1Click,
	index,
	isVisible,
	isSelected,
}: ItemsMenuItemButtonProps) {
	const [clickAnimation, clickAnimationMotion] = useMotion(0);

	useEffect(() => {
		clickAnimationMotion.spring(isSelected ? 1 : 0, springs.slow);
	}, [isSelected]);

	return (
		<Button
			Size={UDim2.fromScale(1, 0.05)}
			LayoutOrder={index + 1}
			Visible={isVisible}
			Event={{
				MouseButton1Click: () => {
					mouseButton1Click();
				},
			}}
		>
			<uistroke
				ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
				Color={colors.lightblue}
				LineJoinMode={Enum.LineJoinMode.Miter}
				Transparency={clickAnimation.map((value) => 1 - value)}
			></uistroke>

			<Image
				AnchorPoint={new Vector2(0.5, 0.5)}
				Position={UDim2.fromScale(0.165, 0.5)}
				Size={UDim2.fromScale(0.116, 0.77)}
				Image={ITEMS[itemName].image}
			></Image>

			<Text
				AnchorPoint={new Vector2(0.5, 0.5)}
				Position={UDim2.fromScale(0.626, 0.5)}
				Size={UDim2.fromScale(0.62, 0.4)}
				Text={itemName}
				TextColor3={lerpBinding(clickAnimation, colors.white, colors.lightblue)}
				TextSize={16}
			></Text>

			<Image
				AnchorPoint={new Vector2(0.5, 0.5)}
				Position={UDim2.fromScale(0.5, 0.5)}
				Size={UDim2.fromScale(2, 2)}
				Image={IMAGES.Glow}
				ImageColor3={colors.lightblue}
				ImageTransparency={lerpBinding(clickAnimation, 1, 0.8)}
			></Image>
		</Button>
	);
}
