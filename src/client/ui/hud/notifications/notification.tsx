import { lerp, lerpBinding, useMountEffect } from "@rbxts/pretty-react-hooks";
import React, { useEffect } from "@rbxts/react";
import { colors } from "client/constants/colors";
import { fonts } from "client/constants/fonts";
import { springs } from "client/constants/springs";
import { useMotion, useStore } from "client/hooks";
import { Image } from "client/ui/core/image";
import { Text } from "client/ui/core/text";

export interface NotifcationProps {
	id: number;
	notificationText: string;
	notificationDuration: number;
}

export function Notification(props: NotifcationProps) {
	const store = useStore();
	const [animation, animationMotion] = useMotion(0);

	useMountEffect(() => {
		animationMotion.spring(1, springs.gentle);
	});

	useEffect(() => {
		task.delay(props.notificationDuration - 1, () => {
			animationMotion.spring(0, springs.slow);
		});
		task.delay(props.notificationDuration, () => {
			store.removeNotification(props.id);
		});
	}, [props.id]);

	return (
		<Text
			size={lerpBinding(animation, new UDim2(0.6, 0, 0.11, 0), new UDim2(1, 0, 0.11, 0))}
			layoutOrder={props.id}
			font={fonts.josefinSans.regular}
			text={props.notificationText}
			textColor={colors.rosered}
			textTransparency={lerpBinding(animation, 1, 0)}
			textSize={19}
			textXAlignment={Enum.TextXAlignment.Center}
			textYAlignment={Enum.TextYAlignment.Center}
		>
			<uistroke
				ApplyStrokeMode={Enum.ApplyStrokeMode.Contextual}
				Color={colors.black}
				Transparency={lerpBinding(animation, 1, 0)}
				LineJoinMode={Enum.LineJoinMode.Bevel}
			></uistroke>

			<Image
				anchorPoint={new Vector2(0.5, 0.5)}
				position={new UDim2(0.5, 0, 0.5, 0)}
				size={new UDim2(0.7, 0, 1.2, 0)}
				backgroundTransparency={1}
				image="rbxassetid://137038247592087"
				imageColor={colors.rosered}
				imageTransparency={lerpBinding(animation, 1, 0.64)}
			></Image>
		</Text>
	);
}
