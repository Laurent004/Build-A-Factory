import React from "@rbxts/react";
import { useStore } from "client/hooks";
import { IMAGES } from "shared/assets/images";
import { Frame } from "client/ui/core/frame";
import { Button } from "client/ui/core/button";
import { Image } from "client/ui/core/image";
import { springs, colors } from "client/ui/constants";
import { lerpBinding, useMotion, useUpdateEffect } from "@rbxts/pretty-react-hooks";
import { useSelector } from "@rbxts/react-reflex";
import { selectContext } from "client/store/context";
import { Section, SECTIONS } from "client/constants/navigation/sections";

export interface SectionButtonProps {
	section: Section;
}

export function SectionButton(props: SectionButtonProps) {
	const store = useStore();
	const context = useSelector(selectContext);

	const [onClickAnimation, onClickAnimationMotion] = useMotion(0);

	useUpdateEffect(() => {
		onClickAnimationMotion.spring(context === props.section ? 1 : 0, springs.slow);
	}, [context]);

	return (
		<Button
			anchorPoint={new Vector2(0.5, 0.5)}
			size={new UDim2(0.8, 0, 0.266, 0)}
			onClick={() => {
				store.setContext(props.section);
			}}
			layoutOrder={SECTIONS[props.section].index}
		>
			<Frame size={new UDim2(1, 0, 1, 0)} backgroundColor={Color3.fromRGB(25, 25, 25)}>
				<uistroke
					ApplyStrokeMode={Enum.ApplyStrokeMode.Contextual}
					Color={lerpBinding(onClickAnimation, colors.white, colors.lightblue)}
					LineJoinMode={Enum.LineJoinMode.Round}
				></uistroke>

				<Image
					anchorPoint={new Vector2(0.5, 0.5)}
					position={new UDim2(0.5, 0, 0.5, 0)}
					size={new UDim2(0.58, 0, 0.58, 0)}
					image={IMAGES.ui[props.section]}
				></Image>

				<Image
					anchorPoint={new Vector2(0.5, 0.5)}
					position={new UDim2(0.5, 0, 0.5, 0)}
					size={new UDim2(1.4, 0, 1.4, 0)}
					image={IMAGES.ui.Glow}
					imageColor={colors.lightblue}
					imageTransparency={lerpBinding(onClickAnimation, 1, 0.685)}
				></Image>
			</Frame>
		</Button>
	);
}
