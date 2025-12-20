import React, { useState } from "@rbxts/react";
import { Frame } from "../../core/frame";
import { useEventListener } from "@rbxts/pretty-react-hooks";
import { Notification } from "./notification";
import { HttpService } from "@rbxts/services";
import { EventBus } from "client/event-bus";
import { useRem } from "client/hooks";
import { Events } from "client/network";

export function Notifications() {
	const rem = useRem();
	const [notifications, setNotifications] = useState<{ id: string; notification: string }[]>([]);

	useEventListener(EventBus.OnNotification, (notification) => {
		const id = HttpService.GenerateGUID();
		setNotifications((previousNotifications) => {
			return [...previousNotifications, { id: id, notification: notification }];
		});
		task.delay(4, () => {
			setNotifications((previousNotifications) => [
				...previousNotifications.filter((notification) => notification.id !== id),
			]);
		});
	});

	useEventListener(Events.OnNotification, (notification) => {
		const id = HttpService.GenerateGUID();
		setNotifications((previousNotifications) => {
			return [...previousNotifications, { id: id, notification: notification }];
		});
		task.delay(8, () => {
			setNotifications((previousNotifications) => [
				...previousNotifications.filter((notification) => notification.id !== id),
			]);
		});
	});

	return (
		<Frame
			anchorPoint={new Vector2(0.5, 1)}
			position={new UDim2(0.5, 0, 1, 0)}
			size={new UDim2(0, rem(498), 0, rem(710))}
			backgroundTransparency={1}
			zIndex={0}
		>
			<uilistlayout
				Padding={new UDim(0, 0)}
				FillDirection={Enum.FillDirection.Vertical}
				SortOrder={Enum.SortOrder.LayoutOrder}
				HorizontalAlignment={Enum.HorizontalAlignment.Left}
				VerticalAlignment={Enum.VerticalAlignment.Top}
			></uilistlayout>

			{notifications.map((notification, index) => (
				<Notification
					key={notification.id}
					index={index}
					notification={notification.notification}
				></Notification>
			))}
		</Frame>
	);
}
