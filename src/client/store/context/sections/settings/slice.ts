import { createProducer } from "@rbxts/reflex";
import { Data } from "shared/types/data";

interface SettingsState {
	settings: Data["settings"];
}

const intialState: SettingsState = {
	settings: { music: 100, ambient: 100, sfx: 100, ui: 100, simulateFactories: [0], renderItems: [0] },
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
