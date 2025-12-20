import { lerpBinding, useMotion } from "@rbxts/pretty-react-hooks";
import React, { useEffect } from "@rbxts/react";
import { colors, fonts, springs } from "client/ui/constants";
import { Frame } from "client/ui/core/frame";
import { Text } from "client/ui/core/text";

export interface ToolInputPanelTextProps {
	index: number;
	active: boolean;
	size: UDim2;
	text: string;
}

export function ToolInputPanelText(props: ToolInputPanelTextProps) {
	const [onMountAnimation, onMountAnimationMotion] = useMotion(0);

	useEffect(() => {
		if (props.active) {
			onMountAnimationMotion.immediate(0);
		}
		task.delay((props.index + 1) * 0.035, () => {
			onMountAnimationMotion.spring(props.active ? 1 : 0, springs.gentle);
		});
	}, [props.active]);

	return (
		<Frame
			anchorPoint={new Vector2(0, 0)}
			position={new UDim2(0, 0, 0, 0)}
			size={props.size}
			backgroundTransparency={1}
			layoutOrder={props.index}
		>
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
				text={props.text}
				textSize={18}
				textColor={colors.white}
				textTransparency={onMountAnimation.map((value) => 1 - value)}
				textWrapped={true}
				textXAlignment={Enum.TextXAlignment.Left}
				textYAlignment={Enum.TextYAlignment.Center}
			></Text>
		</Frame>
	);
}
