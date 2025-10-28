import Signal from "@rbxts/signal";

export const EventBus = {
	PlotEvents: {
		OnStructuresPlacement: new Signal<(player: Player, structuresModels: Model[]) => void>(),
		OnStructuresMovement: new Signal<(structuresModels: Model[]) => void>(),
	},
	ProgressionEvents: {
		OnMilestoneUnlock: new Signal<(player: Player, milestone: number) => void>(),
	},
} as const;
