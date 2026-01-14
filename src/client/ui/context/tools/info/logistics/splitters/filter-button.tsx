import React, { useEffect } from "@rbxts/react";
import { colors, springs } from "client/ui/constants";
import { IMAGES } from "shared/assets/images";
import { lerpBinding, useMotion } from "@rbxts/pretty-react-hooks";
import { Button, Image, Text } from "client/ui/core";

interface SplitterInfoPanelFilterButtonProps {
	filter: string;
	index: number;
	mouseButton1Click: () => void;
	isVisible: boolean;
	isSelected: boolean;
}

export function SplitterInfoPanelFilterButton({
	filter,
	index,
	mouseButton1Click,
	isVisible,
	isSelected,
}: SplitterInfoPanelFilterButtonProps) {
	const [clickAnimation, clickAnimationMotion] = useMotion(0);

	useEffect(() => {
		clickAnimationMotion.spring(isSelected ? 1 : 0, springs.slow);
	}, [isSelected]);

	return (
		<Button
			Size={UDim2.fromScale(1, 0.33)}
			LayoutOrder={index}
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
				Position={UDim2.fromScale(0.12, 0.5)}
				Size={UDim2.fromScale(0.15, 0)}
				Image={IMAGES.ui[filter]}
			>
				<uiaspectratioconstraint AspectType={Enum.AspectType.ScaleWithParentSize}></uiaspectratioconstraint>
			</Image>

			<Text
				Size={UDim2.fromScale(1, 1)}
				Text={filter}
				TextColor3={lerpBinding(clickAnimation, colors.white, colors.lightblue)}
				TextSize={11}
				TextWrapped={true}
				TextXAlignment={Enum.TextXAlignment.Left}
			>
				<uipadding PaddingLeft={new UDim(0, 27)}></uipadding>
			</Text>

			<Image
				AnchorPoint={new Vector2(0.5, 0.5)}
				Position={UDim2.fromScale(0.5, 0.5)}
				Size={UDim2.fromScale(2, 2)}
				Image={IMAGES.ui.Glow}
				ImageColor3={colors.lightblue}
				ImageTransparency={lerpBinding(clickAnimation, 1, 0.8)}
			></Image>
		</Button>
	);
}
