import Signal from "@rbxts/signal";

export const EventBus = {
	GameEvents: {
		OnGameLoad: new Signal<(player: Player) => void>(),
		OnGameUnload: new Signal<(player: Player) => void>(),
	},
	PlotEvents: {
		OnPlotReset: new Signal<(player: Player) => void>(),
		OnStructuresPlacement: new Signal<(player: Player, structuresModels: Model[]) => void>(),
		OnStructuresMovement: new Signal<(player: Player, structuresModels: Model[]) => void>(),
	},
} as const;
