import React, { useState } from "@rbxts/react";
import { useEventListener } from "@rbxts/pretty-react-hooks";
import { HttpService } from "@rbxts/services";
import { EventBus } from "client/event-bus";
import { Events } from "client/network";
import SoundService from "client/services/sound";
import { Frame, Image, Text } from "client/ui/core";
import { fonts } from "client/ui/constants";
import { IMAGES } from "shared/assets/images";

export function Notifications() {
	const soundService = SoundService.getInst();
	const [notifications, setNotifications] = useState<{ id: string; notification: string; duration: number }[]>([]);

	useEventListener(EventBus.OnNotification, (notification, sound) => {
		const id = HttpService.GenerateGUID();
		setNotifications((previousNotifications) => [
			...previousNotifications,
			{ id: id, notification: notification, duration: 4 },
		]);
		task.delay(4, () => {
			setNotifications((previousNotifications) =>
				previousNotifications.filter((notification) => notification.id !== id),
			);
		});
		if (sound !== undefined) {
			soundService.playSound(sound);
		}
	});

	useEventListener(Events.OnNotification, (notification, sound) => {
		const id = HttpService.GenerateGUID();
		setNotifications((previousNotifications) => [
			...previousNotifications,
			{ id: id, notification: notification, duration: 8 },
		]);
		task.delay(8, () => {
			setNotifications((previousNotifications) =>
				previousNotifications.filter((notification) => notification.id !== id),
			);
		});
		if (sound !== undefined) {
			soundService.playSound(sound);
		}
	});

	return (
		<Frame
			AnchorPoint={new Vector2(0.5, 0.5)}
			Position={UDim2.fromScale(0.5, 0.652)}
			Size={UDim2.fromScale(0.259, 0.658)}
			BackgroundTransparency={1}
			ZIndex={0}
		>
			<uilistlayout SortOrder={Enum.SortOrder.LayoutOrder}></uilistlayout>

			{notifications.map((notification, index) => (
				<Notification key={notification.id} notification={notification} index={index}></Notification>
			))}
		</Frame>
	);
}

interface NotificationProps {
	notification: { notification: string; duration: number };
	index: number;
}

function Notification({ notification, index }: NotificationProps) {
	return (
		<Frame Size={new UDim2(1, 0, 0.052, 0)} BackgroundTransparency={1} LayoutOrder={index}>
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
				Image={IMAGES.Glow}
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
