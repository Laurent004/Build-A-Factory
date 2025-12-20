import { lerpBinding, useMotion, useMountEffect } from "@rbxts/pretty-react-hooks";
import React from "@rbxts/react";
import { colors, fonts, springs } from "client/ui/constants";
import { Frame } from "client/ui/core/frame";
import { Image } from "client/ui/core/image";
import { Text } from "client/ui/core/text";
import { IMAGES } from "shared/assets/images";

export interface NotificationProps {
	index: number;
	notification: string;
}

export function Notification(props: NotificationProps) {
	const [onMountAnimation, onMountAnimationMotion] = useMotion(0);

	useMountEffect(() => {
		onMountAnimationMotion.spring(1, springs.gentle);
		task.delay(3.75, () => {
			onMountAnimationMotion.spring(0, springs.gentle);
		});
	});

	return (
		<Frame
			anchorPoint={new Vector2(0, 0)}
			position={new UDim2(0, 0, 0, 0)}
			size={lerpBinding(onMountAnimation, new UDim2(1, 0, 0, 0), new UDim2(1, 0, 0.052, 0))}
			backgroundTransparency={1}
			layoutOrder={props.index}
		>
			<Text
				anchorPoint={new Vector2(0.5, 0.5)}
				position={lerpBinding(onMountAnimation, new UDim2(0.5, 0, 2.5, 0), new UDim2(0.5, 0, 0.5, 0))}
				size={new UDim2(1, 0, 1, 0)}
				font={fonts.josefinSans.bold}
				richText={true}
				text={props.notification}
				textSize={20}
				textColor={colors.white}
				textTransparency={onMountAnimation.map((value) => 1 - value)}
				textStrokeColor={Color3.fromRGB(0, 0, 0)}
				textStrokeTransparency={lerpBinding(onMountAnimation, 1, 0.65)}
				textTruncate={Enum.TextTruncate.SplitWord}
				textXAlignment={Enum.TextXAlignment.Center}
				textYAlignment={Enum.TextYAlignment.Center}
			></Text>

			<Image
				anchorPoint={new Vector2(0.5, 0.5)}
				position={new UDim2(0.5, 0, 0.5, 0)}
				size={new UDim2(0.7, 0, 2, 0)}
				image={IMAGES.ui.Glow}
				imageColor={Color3.fromRGB(
					tonumber(string.match(props.notification, 'color%s*=%s*"rgb%((%d+),%s*(%d+),%s*(%d+)%)"')[0]),
					tonumber(string.match(props.notification, 'color%s*=%s*"rgb%((%d+),%s*(%d+),%s*(%d+)%)"')[1]),
					tonumber(string.match(props.notification, 'color%s*=%s*"rgb%((%d+),%s*(%d+),%s*(%d+)%)"')[2]),
				)}
				imageTransparency={lerpBinding(onMountAnimation, 1, 0.8)}
			></Image>
		</Frame>
	);
}
