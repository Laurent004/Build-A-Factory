export const SECTIONS = {
	Shop: {
		index: 0,
	},
	Items: {
		index: 1,
	},
	Settings: {
		index: 2,
	},
} as const;
export type Section = keyof typeof SECTIONS;
