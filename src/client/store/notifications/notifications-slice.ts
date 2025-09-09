import { createProducer } from "@rbxts/reflex";

export interface NotificationsState {
	activeNotifications: Map<number, string>;
	notificationId: number;
}

const initialState: NotificationsState = {
	activeNotifications: new Map<number, string>(),
	notificationId: 0,
};

export const notificationsSlice = createProducer(initialState, {
	addNotification: (s, notificationText: string) => {
		const newId = s.notificationId;
		const newActiveNotifications = new Map([...s.activeNotifications]);
		newActiveNotifications.set(newId, notificationText);
		return {
			...s,
			activeNotifications: newActiveNotifications,
			notificationId: newId + 1,
		};
	},

	removeNotification: (s, id: number) => {
		const newActiveNotifications = new Map<number, string>([...s.activeNotifications]);
		newActiveNotifications.delete(id);
		return {
			...s,
			activeNotifications: newActiveNotifications,
		};
	},
});
