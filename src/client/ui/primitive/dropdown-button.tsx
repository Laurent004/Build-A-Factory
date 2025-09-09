import React, { useEffect } from "@rbxts/react";
import { Button } from "../core/button";
import { colors } from "client/constants/colors";
import { fonts } from "client/constants/fonts";
import { useMotion } from "client/hooks";
import { springs } from "client/constants/springs";
import { lerpBinding } from "@rbxts/pretty-react-hooks";
import { Image } from "../core/image";
import { Text } from "../core/text";
export interface DropdownButtonProps {
	size: UDim2;
	image: string;
	text: string;

	index: number;
	selectedOptionIndex: number;
	onClick: () => void;
}

export function DropdownButton(props: DropdownButtonProps) {
	const [animation, animationMotion] = useMotion(0);
	useEffect(() => {
		animationMotion.spring(props.selectedOptionIndex === props.index ? 1 : 0, springs.slow);
	}, [props.selectedOptionIndex]);

	return (
		<Button
			size={props.size}
			onClick={() => {
				props.onClick();
			}}
			layoutOrder={props.index}
		>
			<uistroke
				ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
				Color={colors.lightblue}
				LineJoinMode={Enum.LineJoinMode.Miter}
				Enabled={props.selectedOptionIndex === props.index}
			></uistroke>

			<Image
				anchorPoint={new Vector2(0.5, 0.5)}
				position={new UDim2(0.12, 0, 0.5, 0)}
				size={new UDim2(0.142, 0, 0.449, 0)}
				image={props.image}
			></Image>

			<Text
				anchorPoint={new Vector2(0.5, 0.5)}
				position={new UDim2(0.625, 0, 0.5, 0)}
				size={new UDim2(0.76, 0, 1, 0)}
				font={fonts.josefinSans.regular}
				text={props.text}
				textSize={11}
				textColor={lerpBinding(animation, colors.white, colors.lightblue)}
				textWrapped={true}
				textXAlignment={Enum.TextXAlignment.Left}
				textYAlignment={Enum.TextYAlignment.Center}
			></Text>

			<Image
				anchorPoint={new Vector2(0.5, 0.5)}
				position={new UDim2(0.5, 0, 0.5, 0)}
				size={new UDim2(2, 0, 2, 0)}
				image="rbxassetid://137197581459632"
				imageColor={colors.lightblue}
				imageTransparency={lerpBinding(animation, 1, 0.75)}
			></Image>
		</Button>
	);
}
