import React from "@rbxts/react";
import { Frame } from "client/ui/core/frame";
import { colors, springs } from "client/ui/constants";
import { Object } from "@rbxts/luau-polyfill";
import { SECTIONS } from "client/constants/navigation/sections";
import { useStore } from "client/hooks";
import { useSelector } from "@rbxts/react-reflex";
import { selectContext } from "client/store/context";
import { lerpBinding, useMotion, useUpdateEffect } from "@rbxts/pretty-react-hooks";
import { IMAGES } from "shared/assets/images";
import { Button, Image } from "client/ui/core";

export function SectionBar() {
	const context = useSelector(selectContext);

	return (
		<Frame
			AnchorPoint={new Vector2(0, 1)}
			Position={UDim2.fromScale(0.009, 0.514)}
			Size={UDim2.fromScale(0.044, 0.234)}
			BackgroundColor3={colors.black}
		>
			<uilistlayout
				Padding={new UDim(0, 4)}
				SortOrder={Enum.SortOrder.LayoutOrder}
				HorizontalAlignment={Enum.HorizontalAlignment.Center}
				VerticalFlex={Enum.UIFlexAlignment.SpaceAround}
			></uilistlayout>

			{Object.keys(SECTIONS).map((section) => (
				<SectionButton section={section} isSelected={context === section}></SectionButton>
			))}
		</Frame>
	);
}

interface SectionButtonProps {
	section: string;
	isSelected: boolean;
}

function SectionButton({ section, isSelected }: SectionButtonProps) {
	const store = useStore();
	const [clickAnimation, clickAnimationMotion] = useMotion(0);

	useUpdateEffect(() => {
		clickAnimationMotion.spring(isSelected ? 1 : 0, springs.slow);
	}, [isSelected]);

	return (
		<Button
			AnchorPoint={new Vector2(0.5, 0.5)}
			Position={UDim2.fromScale(0, 0)}
			Size={UDim2.fromScale(0.8, 0.266)}
			LayoutOrder={SECTIONS[section].index}
			Event={{
				MouseButton1Click: () => {
					store.setContext(section);
				},
			}}
		>
			<uistroke
				ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
				Color={lerpBinding(clickAnimation, colors.white, colors.lightblue)}
				LineJoinMode={Enum.LineJoinMode.Miter}
			></uistroke>

			<Image
				AnchorPoint={new Vector2(0.5, 0.5)}
				Position={UDim2.fromScale(0.5, 0.5)}
				Size={UDim2.fromScale(0.58, 0.58)}
				Image={IMAGES.ui[section]}
			></Image>

			<Image
				AnchorPoint={new Vector2(0.5, 0.5)}
				Position={UDim2.fromScale(0.5, 0.5)}
				Size={UDim2.fromScale(1.4, 1.4)}
				Image={IMAGES.ui.Glow}
				ImageColor3={colors.lightblue}
				ImageTransparency={lerpBinding(clickAnimation, 1, 0.7)}
			></Image>
		</Button>
	);
}
