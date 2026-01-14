import { lerpBinding, useMotion, useMountEffect } from "@rbxts/pretty-react-hooks";
import React from "@rbxts/react";
import { fonts, springs } from "client/ui/constants";
import { Frame, Image } from "client/ui/core";
import { Text } from "client/ui/core/text";
import { IMAGES } from "shared/assets/images";

export interface NotificationProps {
	notification: { notification: string; duration: number };
	index: number;
}

export function Notification({ notification, index }: NotificationProps) {
	const [mountAnimation, mountAnimationMotion] = useMotion(0);

	useMountEffect(() => {
		mountAnimationMotion.spring(1, springs.gentle);
		task.delay(notification.duration, () => {
			mountAnimationMotion.spring(0, springs.gentle);
		});
	});

	return (
		<Frame
			Size={lerpBinding(mountAnimation, new UDim2(1, 0, 0, 0), new UDim2(1, 0, 0.052, 0))}
			BackgroundTransparency={1}
			LayoutOrder={index}
		>
			<Text
				Size={new UDim2(1, 0, 1, 0)}
				FontFace={fonts.josefinSans.bold}
				RichText={true}
				Text={notification.notification}
				TextSize={20}
				TextStrokeTransparency={0.65}
				TextTruncate={Enum.TextTruncate.SplitWord}
			></Text>

			<Image
				AnchorPoint={new Vector2(0.5, 0.5)}
				Position={new UDim2(0.5, 0, 0.5, 0)}
				Size={new UDim2(0.7, 0, 2, 0)}
				Image={IMAGES.ui.Glow}
				ImageColor3={Color3.fromRGB(
					tonumber(
						string.match(notification.notification, 'color%s*=%s*"rgb%((%d+),%s*(%d+),%s*(%d+)%)"')[0],
					),
					tonumber(
						string.match(notification.notification, 'color%s*=%s*"rgb%((%d+),%s*(%d+),%s*(%d+)%)"')[1],
					),
					tonumber(
						string.match(notification.notification, 'color%s*=%s*"rgb%((%d+),%s*(%d+),%s*(%d+)%)"')[2],
					),
				)}
				ImageTransparency={0.8}
			></Image>
		</Frame>
	);
}
