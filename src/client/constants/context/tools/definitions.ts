import { ToolDefinition } from "./types";

export const TOOLS: Record<string, ToolDefinition> = {
	Info: {
		index: 0,
		description: "View or configure structures.",
		key: "One",
	},
	Build: {
		index: 1,
		description: "Place new structures.",
		key: "Two",
	},
	Edit: {
		index: 2,
		description: "Move existing structures.",
		key: "Three",
	},
	Copy: {
		index: 3,
		description: "Copy existing structures.",
		key: "Four",
	},
	Cleaner: {
		index: 4,
		description: "Clear items from structures.",
		key: "Five",
	},
	Delete: {
		index: 5,
		description: "Remove structures.",
		key: "Six",
	},
};
