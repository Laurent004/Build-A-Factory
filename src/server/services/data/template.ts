import { BlueprintData, PowerLineData, StructureData } from "shared/constants/structures";
import { Data } from "shared/types/data";

export interface DataTemplate {
	games: {
		id: string;
		tutorialStep: number;
		cash: number;
		logisticsData: number;
		productionData: number;
		powerData: number;
		expansions: [number, number, number][];
		structures: StructureData[];
		powerLines: PowerLineData[];
	}[];
	blueprints: BlueprintData[];
	settings: Data["settings"];
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
