export const SECTIONS = {
	Shop: {
		index: 0,
	},
	Milestones: {
		index: 1,
	},
	Items: {
		index: 2,
	},
} as const;
export type Section = keyof typeof SECTIONS;
