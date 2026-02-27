import { createProducer } from "@rbxts/reflex";
import { Data } from "shared/types/data";

interface SettingsState {
	settings: Data["settings"];
}

const intialState: SettingsState = {
	settings: { music: 0, ambient: 0, sfx: 0, ui: 0, simulateFactories: [], renderItems: [] },
};

export const settingsSlice = createProducer(intialState, {
	setSettings: (s, settings: Data["settings"]): SettingsState => {
		return {
			...s,
			settings: settings,
		};
	},
	setSetting: (s, settingName: string, settingValue: unknown): SettingsState => {
		return {
			...s,
			settings: {
				...s.settings,
				[settingName]: settingValue,
			},
		};
	},
});
