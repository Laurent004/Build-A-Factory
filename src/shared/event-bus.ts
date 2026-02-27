import Signal from "@rbxts/signal";

export const EventBus = {
	OnStructuresEditStart: new Signal<(player: Player, structuresModels: Model[]) => void>(),
	OnStructuresEdit: new Signal<(player: Player, structuresModels: Model[]) => void>(),
	OnStructuresItemsClear: new Signal<(player: Player, structuresModels: Model[]) => void>(),
	OnNotification: new Signal<(notification: string, sound?: string) => void>(),
} as const;
