import Signal from "@rbxts/signal";
import { Data } from "shared/types";

export const EventBus = {
	ToolEvents: {
		OnSelection: new Signal<(selectedStructuresModels: Model[]) => void>(),
	},
	PlotEvents: {
		OnPlotInitialization: new Signal<(player: Player, plot: Model) => void>(),
		OnStructuresPlacement: new Signal<(player: Player, structuresModels: Model[]) => void>(),
		OnStructuresMovement: new Signal<(player: Player, structuresModels: Model[]) => void>(),
	},
	OnSettingChange: new Signal<
		<K extends keyof Data["settings"]>(settingName: K, settingValue: Data["settings"][K]) => void
	>(),
	OnNotification: new Signal<(notification: string) => void>(),
} as const;
