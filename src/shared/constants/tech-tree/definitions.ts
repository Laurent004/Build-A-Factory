import { TechNodeDefinition } from "./types";

export const TECH_TREE: Record<string, TechNodeDefinition> = {
	//#region Logistics
	"Conveyor Speed Lvl 1": {
		type: "Upgrade",
		layout: { row: 0, column: 0 },
		image: "",
		description: "",
		requirements: [],
		cost: {
			logisticData: 0,
		},
		upgrade: "Conveyor Speed",
		upgradeValue: 300,
	},

	"Conveyor Speed Lvl 2": {
		type: "Upgrade",
		layout: { row: 0, column: 0 },
		image: "",
		description: "",
		requirements: ["Conveyor Speed Lvl 1"],
		cost: {
			logisticData: 0,
		},
		upgrade: "Conveyor Speed",
		upgradeValue: 300,
	},

	"Conveyor Speed Lvl 3": {
		type: "Upgrade",
		layout: { row: 0, column: 0 },
		image: "",
		description: "",
		requirements: ["Conveyor Speed Lvl 2"],
		cost: {
			logisticData: 0,
		},
		upgrade: "Conveyor Speed",
		upgradeValue: 300,
	},

	"Conveyor Speed Lvl 4": {
		type: "Upgrade",
		layout: { row: 0, column: 0 },
		image: "",
		description: "",
		requirements: ["Conveyor Speed Lvl 3"],
		cost: {
			logisticData: 0,
		},
		upgrade: "Conveyor Speed",
		upgradeValue: 300,
	},

	"Conveyor Speed Lvl 5": {
		type: "Upgrade",
		layout: { row: 0, column: 0 },
		image: "",
		description: "",
		requirements: ["Conveyor Speed Lvl 4"],
		cost: {
			logisticData: 0,
		},
		upgrade: "Conveyor Speed",
		upgradeValue: 300,
	},

	"Conveyor Throughput Counter": {
		type: "Structure",
		layout: { row: 0, column: 0 },
		image: "",
		description: "",
		requirements: ["Conveyor Speed Lvl 2"],
		cost: {
			logisticData: 0,
		},
		structures: ["Conveyor Throughput Counter"],
	},

	Incinerator: {
		type: "Structure",
		layout: { row: 0, column: 0 },
		image: "",
		description: "",
		requirements: ["Conveyor Speed Lvl 2"],
		cost: {
			logisticData: 0,
		},
		structures: ["Incinerator"],
	},

	"Underground Conveyor": {
		type: "Structure",
		layout: { row: 0, column: 0 },
		image: "",
		description: "",
		requirements: ["Conveyor Speed Lvl 1"],
		cost: {
			logisticData: 0,
		},
		structures: ["Underground Conveyor"],
	},

	"Underground Distance 7": {
		type: "Upgrade",
		layout: { row: 0, column: 0 },
		image: "",
		description: "",
		requirements: ["Underground Conveyor"],
		cost: {
			logisticData: 0,
		},
		upgrade: "Underground Distance",
		upgradeValue: 10,
	},

	"Underground Distance 10": {
		type: "Upgrade",
		layout: { row: 0, column: 0 },
		image: "",
		description: "",
		requirements: ["Underground Conveyor"],
		cost: {
			logisticData: 0,
		},
		upgrade: "Underground Distance",
		upgradeValue: 10,
	},

	"Underground Distance 16": {
		type: "Upgrade",
		layout: { row: 0, column: 0 },
		image: "",
		description: "",
		requirements: ["Underground Conveyor 10"],
		cost: {
			logisticData: 0,
		},
		upgrade: "Underground Distance",
		upgradeValue: 16,
	},

	"Conveyor Lift": {
		type: "Structure",
		layout: { row: 0, column: 0 },
		image: "",
		description: "",
		requirements: ["Conveyor Speed Lvl 1"],
		cost: {
			logisticData: 0,
		},
		structures: ["Conveyor Lift"],
	},

	"Lift Height 3": {
		type: "Upgrade",
		layout: { row: 0, column: 0 },
		image: "",
		description: "",
		requirements: ["Conveyor Lift"],
		cost: {
			logisticData: 0,
		},
		upgrade: "Lift Height",
		upgradeValue: 3,
	},

	"Lift Height 6": {
		type: "Upgrade",
		layout: { row: 0, column: 0 },
		image: "",
		description: "",
		requirements: ["Lift Height 3"],
		cost: {
			logisticData: 0,
		},
		upgrade: "Lift Height",
		upgradeValue: 6,
	},

	Merger: {
		type: "Structure",
		layout: { row: 0, column: 0 },
		image: "",
		description: "",
		requirements: [],
		cost: {
			logisticData: 0,
		},
		structures: ["Merger"],
	},

	"Priority Merger": {
		type: "Structure",
		layout: { row: 0, column: 0 },
		image: "",
		description: "",
		requirements: ["Merger"],
		cost: {
			logisticData: 0,
		},
		structures: ["Priority Merger"],
	},

	Spltter: {
		type: "Structure",
		layout: { row: 0, column: 0 },
		image: "",
		description: "",
		requirements: [],
		cost: {
			logisticData: 0,
		},
		structures: ["Spltter"],
	},

	"Smart Spltter": {
		type: "Structure",
		layout: { row: 0, column: 0 },
		image: "",
		description: "",
		requirements: ["Spltter"],
		cost: {
			logisticData: 0,
		},
		structures: ["Smart Spltter"],
	},

	"Programmable Spltter": {
		type: "Structure",
		layout: { row: 0, column: 0 },
		image: "",
		description: "",
		requirements: ["Smart Spltter"],
		cost: {
			logisticData: 0,
		},
		structures: ["Programmable Spltter"],
	},

	"Data Analysis Lvl 1": {
		type: "Upgrade",
		layout: { row: 0, column: 0 },
		image: "",
		description: "",
		requirements: [],
		cost: {
			logisticData: 0,
		},
		upgrade: "Data Analysis",
		upgradeValue: 6,
	},

	"Data Analysis Lvl 2": {
		type: "Upgrade",
		layout: { row: 0, column: 0 },
		image: "",
		description: "",
		requirements: ["Data Analysis Lvl 1"],
		cost: {
			logisticData: 0,
		},
		upgrade: "Data Analysis",
		upgradeValue: 4,
	},

	"Data Analysis Lvl 3": {
		type: "Upgrade",
		layout: { row: 0, column: 0 },
		image: "",
		description: "",
		requirements: ["Data Analysis Lvl 2"],
		cost: {
			logisticData: 0,
		},
		upgrade: "Data Analysis",
		upgradeValue: 2.5,
	},
	//#endregion
};
