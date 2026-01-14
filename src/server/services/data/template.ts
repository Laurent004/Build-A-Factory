import { BlueprintData, PowerLineData, StructureData } from "shared/constants/structures";

export interface DataTemplate {
	games: {
		id: string;
		name: string;
		lastPlaytime: number;
		tutorialStep: number;
		cash: number;
		expansions: [number, number, number][];
		structures: StructureData[];
		powerLines: PowerLineData[];
	}[];
	blueprints: BlueprintData[];
	settings: {
		music: number;
		ambient: number;
		sfx: number;
		ui: number;
		simulateFactories: number[];
		renderItems: number[];
	};
}

export const DATA_TEMPLATE: DataTemplate = {
	games: [],
	blueprints: [],
	settings: {
		music: 100,
		ambient: 100,
		sfx: 100,
		ui: 100,
		simulateFactories: [0],
		renderItems: [0],
	},
};
