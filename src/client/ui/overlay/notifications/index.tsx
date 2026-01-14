import React, { useState } from "@rbxts/react";
import { useEventListener } from "@rbxts/pretty-react-hooks";
import { Notification } from "./notification";
import { HttpService } from "@rbxts/services";
import { EventBus } from "client/event-bus";
import { Events } from "client/network";
import SoundService from "client/services/sound";
import { Frame } from "client/ui/core";

export function Notifications() {
	const soundService = SoundService.getInst();
	const [notifications, setNotifications] = useState<{ id: string; notification: string; duration: number }[]>([]);

	useEventListener(EventBus.OnNotification, (notification, sound) => {
		const id = HttpService.GenerateGUID();
		setNotifications((previousNotifications) => [
			...previousNotifications,
			{ id: id, notification: notification, duration: 4 },
		]);
		task.delay(4.05, () => {
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
		task.delay(8.05, () => {
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
