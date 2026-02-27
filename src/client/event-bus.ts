import Signal from "@rbxts/signal";

export const EventBus = {
	OnStructuresPlacement: new Signal<(player: Player, structuresModels: Model[]) => void>(),
	OnStructuresMovement: new Signal<(player: Player, structuresModels: Model[]) => void>(),
	OnSelection: new Signal<(selectedStructuresModels: Model[]) => void>(),
	OnNotification: new Signal<(notification: string, sound?: string) => void>(),
} as const;
