export type SettingDefinition = SoundSliderSettingDefinition | PerformanceDropdownSettingDefinition;

export interface BaseSettingDefinition {
	category: string;
	index: number;
	type: "SoundSlider" | "PerformanceDropdown";
	text: string;
}

export interface SoundSliderSettingDefinition extends BaseSettingDefinition {
	type: "SoundSlider";
}

export interface PerformanceDropdownSettingDefinition extends BaseSettingDefinition {
	type: "PerformanceDropdown";
	dropdownText: string;
}

export const SETTING_CATEGORIES: string[] = ["Sound", "Performance"];
