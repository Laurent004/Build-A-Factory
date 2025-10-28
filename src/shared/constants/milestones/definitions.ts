import { MilestoneDefinition } from "./types";

export const MILESTONES: Record<string, MilestoneDefinition> = {
	"Getting Started": {
		index: 0,
		itemsToDeliver: {},
		rewards: [
			"Straight Conveyor",
			"Left Turn Conveyor",
			"Right Turn Conveyor",
			"Delivery Dock",
			"Miner",
			"Power Line",
			"Hand-Crank",
		],
	},

	"Early Industry": {
		index: 1,
		itemsToDeliver: {
			"Iron Ore": 6,
			"Copper Ore": 6,
			Coal: 4,
		},
		rewards: ["Smelter", "Constructor", "Power Pole"],
	},

	"Assembly Line": {
		index: 2,
		itemsToDeliver: {
			"Steel Ingot": 12,
			Silica: 15,
			"Copper Wire": 20,
			"Steel Frame": 25,
			"Glass Panel": 25,
		},
		rewards: ["Merger", "Splitter", "Assembler", "Wind Turbine"],
	},

	"Storage Expansion": {
		index: 3,
		itemsToDeliver: {
			"Copper Ingot": 100,
			"Iron Plate": 100,
			"Iron Rod": 100,
			Motor: 150,
		},
		rewards: ["Underground Belt", "Storage Container"],
	},

	"Smart Factory": {
		index: 4,
		itemsToDeliver: {
			"Circuit Board": 500,
			Battery: 500,
			"Control Unit": 500,
		},
		rewards: ["Smart Splitter", "Power Switch"],
	},
};
