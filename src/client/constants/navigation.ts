import { colors } from "./colors";

export const TOOLS = {
	Info: {
		index: 0,
		description: "Click to view information or configure structures.",
		activatedImageColor: colors.white,
		activatedGlowColor: colors.lightblue,
		hotkey: "One",
	},
	Build: {
		index: 1,
		description: "Build structures.",
		activatedImageColor: colors.white,
		activatedGlowColor: colors.lightblue,
		hotkey: "Two",
	},
	Edit: {
		index: 2,
		description: "Edit structures.",
		activatedImageColor: colors.white,
		activatedGlowColor: colors.lightblue,
		hotkey: "Three",
	},
	Copy: {
		index: 3,
		description: "Copy structures.",
		activatedImageColor: colors.white,
		activatedGlowColor: colors.lightblue,
		hotkey: "Four",
	},
	Cleaner: {
		index: 4,
		description: "Clear items from structures.",
		activatedImageColor: colors.white,
		activatedGlowColor: colors.lightblue,
		hotkey: "Five",
	},
	Delete: {
		index: 5,
		description: "Delete structures.",
		activatedImageColor: colors.lightred,
		activatedGlowColor: colors.lightred,
		hotkey: "Six",
	},
} as const;
export type Tool = keyof typeof TOOLS;

export const SECTIONS = { Items: {} } as const;
export type Section = keyof typeof SECTIONS;

export type Context = Tool | Section;
