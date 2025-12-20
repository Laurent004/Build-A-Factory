import React, { useEffect } from "@rbxts/react";
import { Text, TextProps } from "../text";
import { Frame } from "../frame";
import { lerpBinding, useMotion, useMountEffect } from "@rbxts/pretty-react-hooks";
import { springs } from "client/ui/constants";

export interface NumberSpinnerDigitProps extends TextProps {
	value: number;
	duration: number;
}

export function NumberSpinnerDigit(props: NumberSpinnerDigitProps) {
	const [onMountAnimation, onMountAnimationMotion] = useMotion(0);
	const [onUpdateAnimation, onUpdateAnimationMotion] = useMotion(new UDim2(0, 0, -props.value, 0));

	useMountEffect(() => {
		onMountAnimationMotion.spring(1, springs.gentle);
	});

	return (
		<Frame
			anchorPoint={props.anchorPoint}
			position={props.position}
			size={lerpBinding(onMountAnimation, new UDim2(0, 0, 0, 0), props.size as UDim2)}
			backgroundTransparency={1}
			layoutOrder={props.layoutOrder}
			clipsDescendants={true}
		>
			<Frame
				anchorPoint={new Vector2(0, 0)}
				position={onUpdateAnimation}
				size={new UDim2(1, 0, 10, 0)}
				backgroundTransparency={1}
			>
				{[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((_, index) => {
					useEffect(() => {
						if (props.value !== index) return;
						onUpdateAnimationMotion.tween(new UDim2(0, 0, -index, 0), { time: props.duration });
					}, [props.value]);

					return (
						<Text
							anchorPoint={new Vector2(0, 0)}
							position={new UDim2(0, 0, index * 0.1, 0)}
							size={new UDim2(1, 0, 0.1, 0)}
							font={props.font}
							text={tostring(index)}
							textSize={props.textSize}
							textColor={props.textColor}
							textTransparency={props.textTransparency}
							textStrokeColor={props.textStrokeColor}
							textStrokeTransparency={props.textStrokeTransparency}
							textTruncate={props.textTruncate}
							textWrapped={props.textWrapped}
							textXAlignment={props.textXAlignment}
							textYAlignment={props.textYAlignment}
						></Text>
					);
				})}
			</Frame>
		</Frame>
	);
}
