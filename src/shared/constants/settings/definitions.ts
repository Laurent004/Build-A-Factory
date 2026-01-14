import { SettingDefinition } from "./types";

export const SETTINGS: Record<string, SettingDefinition> = {
	music: {
		category: "Sound",
		index: 0,
		type: "SoundSlider",
		text: "Music Volume",
	},
	ambient: {
		category: "Sound",
		index: 1,
		type: "SoundSlider",
		text: "Ambient Volume",
	},
	sfx: {
		category: "Sound",
		index: 2,
		type: "SoundSlider",
		text: "SFX Volume",
	},
	ui: {
		category: "Sound",
		index: 3,
		type: "SoundSlider",
		text: "UI Volume",
	},
	simulateFactories: {
		category: "Performance",
		index: 0,
		type: "PerformanceDropdown",
		text: "Simulate Factories",
		dropdownText: "Simulating",
	},
	renderItems: {
		category: "Performance",
		index: 1,
		type: "PerformanceDropdown",
		text: "Render Items",
		dropdownText: "Rendering",
	},
};
