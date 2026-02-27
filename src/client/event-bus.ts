import Signal from "@rbxts/signal";

export const EventBus = {
	OnNotification: new Signal<(notification: string, sound?: string) => void>(),
} as const;
