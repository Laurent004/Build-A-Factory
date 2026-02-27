import { TechDefinition } from "./types";

export const TECHS: Record<string, TechDefinition> = {
	//#region Logistics
	"Conveyor Speed Lvl 1": {
		type: "Upgrade",
		layout: { row: 0, column: 0 },
		image: "",
		description: "Conveyor speed 60/min",
		requirements: [],
		cost: {
			logisticsData: 0,
			productionData: 0,
			powerData: 0,
		},
		upgradeName: "ConveyorSpeed",
		upgradeIndex: 0,
		upgradeValue: 60,
	},

	"Conveyor Speed Lvl 2": {
		type: "Upgrade",
		layout: { row: 1, column: 0 },
		image: "",
		description: "Conveyor speed 120/min",
		requirements: ["Conveyor Speed Lvl 1"],
		cost: {
			logisticsData: 0,
			productionData: 0,
			powerData: 0,
		},
		upgradeName: "ConveyorSpeed",
		upgradeIndex: 1,
		upgradeValue: 120,
	},

	"Conveyor Speed Lvl 3": {
		type: "Upgrade",
		layout: { row: 3, column: 0 },
		image: "",
		description: "Conveyor speed 270/min",
		requirements: ["Conveyor Speed Lvl 2"],
		cost: {
			logisticsData: 0,
			productionData: 0,
			powerData: 0,
		},
		upgradeName: "ConveyorSpeed",
		upgradeIndex: 2,
		upgradeValue: 270,
	},

	"Conveyor Speed Lvl 4": {
		type: "Upgrade",
		layout: { row: 4, column: 0 },
		image: "",
		description: "Conveyor speed 480/min",
		requirements: ["Conveyor Speed Lvl 3"],
		cost: {
			logisticsData: 0,
			productionData: 0,
			powerData: 0,
		},
		upgradeName: "ConveyorSpeed",
		upgradeIndex: 3,
		upgradeValue: 480,
	},

	"Conveyor Speed Lvl 5": {
		type: "Upgrade",
		layout: { row: 5, column: 0 },
		image: "",
		description: "Conveyor Speed 780/min",
		requirements: ["Conveyor Speed Lvl 4"],
		cost: {
			logisticsData: 0,
			productionData: 0,
			powerData: 0,
		},
		upgradeName: "ConveyorSpeed",
		upgradeIndex: 4,
		upgradeValue: 780,
	},

	"Conveyor Throughput Counter": {
		type: "Structure",
		layout: { row: 2, column: 1 },
		image: "",
		description: "",
		requirements: ["Conveyor Speed Lvl 2"],
		cost: {
			logisticsData: 0,
			productionData: 0,
			powerData: 0,
		},
		structures: ["Conveyor Throughput Counter"],
	},

	"Data Capacity Lvl 0": {
		type: "Upgrade",
		layout: undefined,
		image: "",
		description: "",
		requirements: [],
		cost: {
			logisticsData: 0,
			productionData: 0,
			powerData: 0,
		},
		upgradeName: "DataCapacity",
		upgradeIndex: 0,
		upgradeValue: 30,
	},

	"Data Capacity Lvl 1": {
		type: "Upgrade",
		layout: { row: 4, column: 1 },
		image: "",
		description: "",
		requirements: ["Conveyor Speed Lvl 3", "Data Capacity Lvl 0"],
		cost: {
			logisticsData: 0,
			productionData: 0,
			powerData: 0,
		},
		upgradeName: "DataCapacity",
		upgradeIndex: 1,
		upgradeValue: 50,
	},

	"Data Capacity Lvl 2": {
		type: "Upgrade",
		layout: { row: 5, column: 1 },
		image: "",
		description: "",
		requirements: ["Data Capacity Lvl 1"],
		cost: {
			logisticsData: 0,
			productionData: 0,
			powerData: 0,
		},
		upgradeName: "DataCapacity",
		upgradeIndex: 2,
		upgradeValue: 100,
	},

	"New Conveyors": {
		type: "Structure",
		layout: { row: 1, column: -1 },
		image: "",
		description: "",
		requirements: ["Conveyor Speed Lvl 1"],
		cost: {
			logisticsData: 0,
			productionData: 0,
			powerData: 0,
		},
		structures: [
			"Transporter",
			"Underground Conveyor",
			"Underground Conveyor Input",
			"Underground Conveyor Output",
			"Conveyor Lift",
			"Conveyor Lift Input",
			"Conveyor Lift Elevator",
			"Conveyor Lift Output",
		],
	},

	"Underground Distance 8": {
		type: "Upgrade",
		layout: undefined,
		image: "",
		description: "",
		requirements: [],
		cost: {
			logisticsData: 0,
			productionData: 0,
			powerData: 0,
		},
		upgradeName: "UndergroundDistance",
		upgradeIndex: 0,
		upgradeValue: 8,
	},

	"Underground Distance 12": {
		type: "Upgrade",
		layout: { row: 2, column: -2 },
		image: "",
		description: "",
		requirements: ["Underground Distance 8"],
		cost: {
			logisticsData: 0,
			productionData: 0,
			powerData: 0,
		},
		upgradeName: "UndergroundDistance",
		upgradeIndex: 1,
		upgradeValue: 12,
	},

	"Underground Distance 18": {
		type: "Upgrade",
		layout: { row: 3, column: -2 },
		image: "",
		description: "",
		requirements: ["Underground Distance 12"],
		cost: {
			logisticsData: 0,
			productionData: 0,
			powerData: 0,
		},
		upgradeName: "UndergroundDistance",
		upgradeIndex: 2,
		upgradeValue: 18,
	},

	"Lift Height 1": {
		type: "Upgrade",
		layout: undefined,
		image: "",
		description: "",
		requirements: [],
		cost: {
			logisticsData: 0,
			productionData: 0,
			powerData: 0,
		},
		upgradeName: "LiftHeight",
		upgradeIndex: 0,
		upgradeValue: 1,
	},

	"Lift Height 2": {
		type: "Upgrade",
		layout: { row: 2, column: -1 },
		image: "",
		description: "",
		requirements: ["Lift Height 1"],
		cost: {
			logisticsData: 0,
			productionData: 0,
			powerData: 0,
		},
		upgradeName: "LiftHeight",
		upgradeIndex: 1,
		upgradeValue: 2,
	},

	"Lift Height 4": {
		type: "Upgrade",
		layout: { row: 3, column: -1 },
		image: "",
		description: "",
		requirements: ["Lift Height 2"],
		cost: {
			logisticsData: 0,
			productionData: 0,
			powerData: 0,
		},
		upgradeName: "LiftHeight",
		upgradeIndex: 2,
		upgradeValue: 4,
	},

	Distribution: {
		type: "Structure",
		layout: { row: 1, column: 3 },
		image: "",
		description: "",
		requirements: ["Conveyor Speed Lvl 1"],
		cost: {
			logisticsData: 0,
			productionData: 0,
			powerData: 0,
		},
		structures: ["Merger", "Splitter"],
	},

	"Priority Merger": {
		type: "Structure",
		layout: { row: 2, column: 3 },
		image: "",
		description: "",
		requirements: ["Distribution"],
		cost: {
			logisticsData: 0,
			productionData: 0,
			powerData: 0,
		},
		structures: ["Priority Merger"],
	},

	"Smart Splitter": {
		type: "Structure",
		layout: { row: 2, column: 2 },
		image: "",
		description: "",
		requirements: ["Conveyor Speed Lvl 2", "Distribution"],
		cost: {
			logisticsData: 0,
			productionData: 0,
			powerData: 0,
		},
		structures: ["Smart Splitter"],
	},

	"Programmable Splitter": {
		type: "Structure",
		layout: { row: 3, column: 2 },
		image: "",
		description: "",
		requirements: ["Smart Splitter"],
		cost: {
			logisticsData: 0,
			productionData: 0,
			powerData: 0,
		},
		structures: ["Programmable Splitter"],
	},

	Pipelines: {
		type: "Structure",
		layout: { row: 0, column: -3 },
		image: "",
		description: "",
		requirements: [],
		cost: {
			logisticsData: 2,
			productionData: 0,
			powerData: 0,
		},
		structures: ["Pipeline", "Pipeline Turn", "Pipeline Junction"],
	},

	"Underground Pipeline": {
		type: "Structure",
		layout: { row: 1, column: -3 },
		image: "",
		description: "",
		requirements: ["Pipelines"],
		cost: {
			logisticsData: 0,
			productionData: 0,
			powerData: 0,
		},
		structures: ["Fluid Transporter", "Underground Pipeline"],
	},

	"Flow Rate Lvl 0": {
		type: "Upgrade",
		layout: undefined,
		image: "",
		description: "",
		requirements: [],
		cost: {
			logisticsData: 0,
			productionData: 0,
			powerData: 0,
		},
		upgradeIndex: 0,
		upgradeName: "FlowRate",
		upgradeValue: 200,
	},

	"Flow Rate Lvl 1": {
		type: "Upgrade",
		layout: { row: 1, column: -4 },
		image: "",
		description: "",
		requirements: ["Pipelines", "Flow Rate Lvl 0"],
		cost: {
			logisticsData: 0,
			productionData: 0,
			powerData: 0,
		},
		upgradeIndex: 1,
		upgradeName: "FlowRate",
		upgradeValue: 300,
	},

	"Flow Rate Lvl 2": {
		type: "Upgrade",
		layout: { row: 2, column: -4 },
		image: "",
		description: "",
		requirements: ["Flow Rate Lvl 1"],
		cost: {
			logisticsData: 0,
			productionData: 0,
			powerData: 0,
		},
		upgradeIndex: 2,
		upgradeName: "FlowRate",
		upgradeValue: 600,
	},
	//#endregion
};
