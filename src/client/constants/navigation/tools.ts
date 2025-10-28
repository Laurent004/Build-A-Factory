export const TOOLS = {
	Info: {
		index: 0,
		description: "View or configure structures.",
		hotkey: "One",
	},
	Build: {
		index: 1,
		description: "Place new structures.",
		hotkey: "Two",
	},
	Edit: {
		index: 2,
		description: "Move existing structures.",
		hotkey: "Three",
	},
	Copy: {
		index: 3,
		description: "Copy existing structures.",
		hotkey: "Four",
	},
	Cleaner: {
		index: 4,
		description: "Clear items from structures.",
		hotkey: "Five",
	},
	Delete: {
		index: 5,
		description: "Remove structures.",
		hotkey: "Six",
	},
} as const;

export type Tool = keyof typeof TOOLS;
