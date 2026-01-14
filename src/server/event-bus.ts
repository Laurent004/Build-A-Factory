import Signal from "@rbxts/signal";

export const EventBus: Record<string, Signal> = {
	OnGameLoad: new Signal<(player: Player) => void>(),
	OnGameUnload: new Signal<(player: Player) => void>(),
	OnPlotReset: new Signal<(player: Player) => void>(),
	OnStructuresPlacement: new Signal<(player: Player, structuresModels: Model[]) => void>(),
	OnStructuresMovement: new Signal<(player: Player, structuresModels: Model[]) => void>(),
} ;
