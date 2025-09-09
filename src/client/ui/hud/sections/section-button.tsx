import React from "@rbxts/react";
import { useStore } from "client/hooks";

import { IMAGES } from "shared/assets/images";
import { Section } from "client/constants/navigation";
import { Frame } from "client/ui/core/frame";
import { Button } from "client/ui/core/button";
import { Image } from "client/ui/core/image";
import { springs } from "client/constants/springs";
import { lerpBinding, useMotion, useUpdateEffect } from "@rbxts/pretty-react-hooks";
import { useSelector } from "@rbxts/react-reflex";
import { selectContext } from "client/store/context";
import { colors } from "client/constants/colors";

export interface SectionButtonProps {
	section: Section;
}

export function SectionButton(props: SectionButtonProps) {
	const store = useStore();

	const currentContext = useSelector(selectContext);
	const [animation, animationMotion] = useMotion(0);
	useUpdateEffect(() => {
		animationMotion.spring(currentContext === props.section ? 1 : 0, springs.slow);
	}, [currentContext]);

	return (
		<Button
			anchorPoint={new Vector2(0.5, 0.5)}
			size={new UDim2(0.8, 0, 0.8, 0)}
			onClick={() => {
				store.setContext(props.section);
			}}
		>
			<Frame size={new UDim2(1, 0, 1, 0)} backgroundColor={Color3.fromRGB(25, 25, 25)}>
				<uistroke
					ApplyStrokeMode={Enum.ApplyStrokeMode.Contextual}
					Color={lerpBinding(animation, colors.white, colors.lightblue)}
					LineJoinMode={Enum.LineJoinMode.Round}
				></uistroke>

				<Image
					anchorPoint={new Vector2(0.5, 0.5)}
					position={new UDim2(0.5, 0, 0.5, 0)}
					size={new UDim2(0.58, 0, 0.58, 0)}
					image={IMAGES.context.sections[props.section]}
				></Image>

				<Image
					anchorPoint={new Vector2(0.5, 0.5)}
					position={new UDim2(0.5, 0, 0.5, 0)}
					size={new UDim2(1.4, 0, 1.4, 0)}
					image="rbxassetid://137038247592087"
					imageColor={colors.lightblue}
					imageTransparency={lerpBinding(animation, 1, 0.685)}
				></Image>
			</Frame>
		</Button>
	);
}
