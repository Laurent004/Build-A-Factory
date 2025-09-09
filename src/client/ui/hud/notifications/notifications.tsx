import React from "@rbxts/react";
import { useSelector } from "@rbxts/react-reflex";
import { selectActiveNotifications } from "client/store/notifications/notifications-selectors";
import { Notification } from "./notification";
import { useMountEffect } from "@rbxts/pretty-react-hooks";
import { EventBus } from "client/event-bus";
import { useStore } from "client/hooks";
import { Object } from "@rbxts/luau-polyfill";

export function Notifications() {
	const store = useStore();
	const activeNotifications = useSelector(selectActiveNotifications);

	useMountEffect(() => {
		EventBus.Notify.Connect((notificationText) => {
			store.addNotification(notificationText);
		});
	});

	return (
		<canvasgroup
			AnchorPoint={new Vector2(0.5, 0.5)}
			Position={new UDim2(0.5, 0, 0.243, 0)}
			Size={new UDim2(0.3, 0, 0.345, 0)}
			BackgroundTransparency={1}
		>
			<uigradient
				Color={
					new ColorSequence([
						new ColorSequenceKeypoint(0, Color3.fromRGB(255, 255, 255)),
						new ColorSequenceKeypoint(1, Color3.fromRGB(161, 161, 161)),
					])
				}
				Transparency={
					new NumberSequence([
						new NumberSequenceKeypoint(0, 0),
						new NumberSequenceKeypoint(0.323, 0.275),
						new NumberSequenceKeypoint(1, 1),
					])
				}
				Rotation={-90}
			></uigradient>

			<uilistlayout
				Padding={new UDim(0, 0)}
				HorizontalAlignment={Enum.HorizontalAlignment.Center}
				VerticalAlignment={Enum.VerticalAlignment.Bottom}
			></uilistlayout>

			<uipadding PaddingBottom={new UDim(0, 6)} PaddingTop={new UDim(0, 6)}></uipadding>

			{Object.entries(activeNotifications).map(([id, activeNotification]) => {
				return (
					<Notification
						id={id}
						notificationText={activeNotification}
						notificationDuration={3.5}
					></Notification>
				);
			})}
		</canvasgroup>
	);
}
