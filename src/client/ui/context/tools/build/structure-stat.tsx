import { lerpBinding, useMotion } from "@rbxts/pretty-react-hooks";
import React, { useEffect } from "@rbxts/react";
import { useSelector } from "@rbxts/react-reflex";
import { selectContext } from "client/store/context";
import { selectBuildMenuStructureInformation } from "client/store/context/build";
import { colors, fonts, springs } from "client/ui/constants";
import { Frame } from "client/ui/core/frame";
import { Image } from "client/ui/core/image";
import { Text } from "client/ui/core/text";

export interface StructureStatProps {
	index: number;
	image: string;
	text: string;
}

export function StructureStat(props: StructureStatProps) {
	const context = useSelector(selectContext);
	const selectedStructureInformation = useSelector(selectBuildMenuStructureInformation);

	const [onUpdateAnimation, onUpdateAnimationMotion] = useMotion(0);

	useEffect(() => {
		if (context !== "Build") return;
		onUpdateAnimationMotion.immediate(0);
		task.delay((props.index + 1) * 0.025, () => {
			onUpdateAnimationMotion.spring(1, springs.gentle);
		});
	}, [context, selectedStructureInformation]);

	return (
		<Frame size={new UDim2(1, 0, 0.25, 0)} backgroundTransparency={1} layoutOrder={props.index}>
			<Image
				anchorPoint={new Vector2(0, 0.5)}
				position={lerpBinding(
					onUpdateAnimation,
					new UDim2(0, 0, 0.5 + (props.index + 1) * 0.6, 0),
					new UDim2(0, 0, 0.5, 0),
				)}
				size={new UDim2(0.11, 0, 1, 0)}
				image={props.image}
				imageTransparency={onUpdateAnimation.map((value) => 1 - value)}
			></Image>
			<Text
				anchorPoint={new Vector2(1, 0.5)}
				position={lerpBinding(
					onUpdateAnimation,
					new UDim2(1, 0, 0.5 + (props.index + 1) * 0.6, 0),
					new UDim2(1, 0, 0.5, 0),
				)}
				size={new UDim2(0.84, 0, 1, 0)}
				font={fonts.josefinSans.regular}
				textSize={13}
				textTransparency={onUpdateAnimation.map((value) => 1 - value)}
				textColor={colors.white}
				text={props.text}
				textXAlignment={Enum.TextXAlignment.Left}
				textYAlignment={Enum.TextYAlignment.Center}
			></Text>
		</Frame>
	);
}
