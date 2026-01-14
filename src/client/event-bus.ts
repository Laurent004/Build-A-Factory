import Signal from "@rbxts/signal";

export const EventBus = {
	OnPlotInitialization: new Signal<(player: Player, plot: Model) => void>(),
	OnStructuresPlacement: new Signal<(player: Player, structuresModels: Model[]) => void>(),
	OnStructuresMovement: new Signal<(player: Player, structuresModels: Model[]) => void>(),
	OnSelection: new Signal<(selectedStructuresModels: Model[]) => void>(),
	OnSettingChange: new Signal<(settingName: string, settingValue: unknown) => void>(),
	OnNotification: new Signal<(notification: string, sound?: string) => void>(),
} as const;
