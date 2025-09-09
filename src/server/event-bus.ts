import Signal from "@rbxts/signal";

export const EventBus = {
	OnStructureMovement: new Signal<(player: Player, structuresModels: Model[]) => void>(),
} as const;
