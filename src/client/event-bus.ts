import Signal from "@rbxts/signal";

export const EventBus = {
	Notify: new Signal<(notificationText: string) => void>(),
	InputEvents: {
		Tools: {
			Info: {
				Select: new Signal(),
			},
			Build: {
				Rotate: new Signal(),
				StartPlacement: new Signal(),
				EndPlacement: new Signal(),
				SwapStructure: new Signal(),
			},
			Edit: {
				StartSelection: new Signal(),
				Select: new Signal(),
				Rotate: new Signal(),
				Place: new Signal(),
			},
			Copy: {
				StartSelection: new Signal(),
				Select: new Signal(),
				Rotate: new Signal(),
				StartPlacement: new Signal(),
				EndPlacement: new Signal(),
			},
			Cleaner: {
				StartSelection: new Signal(),
				Select: new Signal(),
			},
			Delete: {
				StartSelection: new Signal(),
				Select: new Signal(),
			},
		},
	},
	ToolEvents: {
		Info: {
			OnSelection: new Signal<(structuresModels: Model[]) => void>(),
		},
	},
	PlotEvents: {
		OnPlotInitialization: new Signal<(player: Player) => void>(),
		OnStructuresPlacement: new Signal<(player: Player, structuresModels: Model[]) => void>(),
	},
} as const;
