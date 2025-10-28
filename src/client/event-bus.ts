import Signal from "@rbxts/signal";

export const EventBus = {
	ToolEvents: {
		Info: {
			OnSelection: new Signal<(selection: Model | undefined) => void>(),
		},
		Copy: {
			OnSelection: new Signal<(selection: Model | undefined) => void>(),
		},
	},

	PlotEvents: {
		OnPlotInitialization: new Signal<(player: Player, plot: Model) => void>(),
		OnStructuresPlacement: new Signal<(player: Player) => void>(),
		OnStructuresMovement: new Signal<(structuresModels: Model[]) => void>(),
	},
} as const;
