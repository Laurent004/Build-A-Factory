import { lerpBinding, useMotion, useUpdateEffect } from "@rbxts/pretty-react-hooks";
import React from "@rbxts/react";
import { colors, fonts, springs } from "client/ui/constants";
import { Frame } from "client/ui/core/frame";
import { Text } from "client/ui/core/text";

export interface InputPanelInputProps {
	index: number;
	size: UDim2;
	active: boolean;
	input: string;
}

export function InputPanelInput(props: InputPanelInputProps) {
	const [onMountAnimation, onMountAnimationMotion] = useMotion(0);

	useUpdateEffect(() => {
		if (!props.active) return;
		onMountAnimationMotion.immediate(0);
		task.delay((props.index + 1) * 0.035, () => {
			onMountAnimationMotion.spring(1, springs.gentle);
		});
	}, [props.active]);

	return (
		<Frame size={props.size} backgroundTransparency={1} layoutOrder={props.index}>
			<Text
				anchorPoint={new Vector2(0.5, 0.5)}
				position={lerpBinding(
					onMountAnimation,
					new UDim2(-props.index * 0.035, 0, 0.5, 0),
					new UDim2(0.5, 0, 0.5, 0),
				)}
				size={new UDim2(1, 0, 1, 0)}
				font={fonts.josefinSans.medium}
				lineHeight={1.35}
				richText={true}
				text={props.input}
				textSize={18}
				textTransparency={onMountAnimation.map((value) => 1 - value)}
				textColor={colors.white}
				textWrapped={true}
				textXAlignment={Enum.TextXAlignment.Left}
				textYAlignment={Enum.TextYAlignment.Center}
			></Text>
		</Frame>
	);
}
