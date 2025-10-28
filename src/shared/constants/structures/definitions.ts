import { HttpService } from "@rbxts/services";
import { IMAGES } from "shared/assets/images";
import { MODELS } from "shared/assets/models";
import { StructureDefinition } from "./types";

export const STRUCTURES: Record<string, StructureDefinition> = {
	//#region Transportation
	"Straight Conveyor": {
		index: 0,
		category: "Transportation",
		subCategory: "Conveyor Belts",
		image: IMAGES.ui["Straight Conveyor"],
		description: "Transports items forward at a steady rate, keeping production lines flowing smoothly.",
		price: 15,

		model: MODELS["Straight Conveyor"],
		tags: ["Transporter"],
		constants: {
			TransportSpeed: 5,
		},
		attributes: {},

		nodes: {
			cells: [new Vector3()],
			inputs: [new CFrame(0, 0, 0, 0, 1, 0, 0, 0, -1, -1, 0, 0)],
			outputs: [new CFrame(0, 0, -4, 0, 1, 0, 0, 0, -1, -1, 0, 0)],
		},

		selectionPriority: 0,
	},

	"Left Turn Conveyor": {
		index: 1,
		category: "Transportation",
		subCategory: "Conveyor Belts",
		image: IMAGES.ui["Straight Conveyor"],
		description: "Redirects items 90° to the left while maintaining speed and flow.",
		price: 15,

		model: MODELS["Left Turn Conveyor"],
		tags: ["Transporter"],
		constants: {
			TransportSpeed: 5,
		},
		attributes: {},

		nodes: {
			cells: [new Vector3()],
			inputs: [new CFrame(0, 0, 0, 1, 0, 0, 0, 0, -1, 0, 1, 0)],
			outputs: [new CFrame(0, 0, -4, 0, 1, 0, 0, 0, -1, -1, 0, 0)],
		},

		selectionPriority: 0,
	},

	"Right Turn Conveyor": {
		index: 2,
		category: "Transportation",
		subCategory: "Conveyor Belts",
		image: IMAGES.ui["Straight Conveyor"],
		description: "Redirects items 90° to the right while maintaining speed and flow.",
		price: 15,

		model: MODELS["Right Turn Conveyor"],
		tags: ["Transporter"],
		constants: {
			TransportSpeed: 5,
		},
		attributes: {},

		nodes: {
			cells: [new Vector3()],
			inputs: [new CFrame(0, 0, 0, -1, 0, -0, 0, 0, -1, 0, -1, -0)],
			outputs: [new CFrame(0, 0, -4, 0, 1, 0, 0, 0, -1, -1, 0, 0)],
		},

		selectionPriority: 0,
	},

	"Underground Belt": {
		index: 3,
		category: "Transportation",
		subCategory: "Conveyor Belts",
		image: IMAGES.ui["Straight Conveyor"],
		description: "Transfers items underground to bypass obstacles.",
		price: 125,

		model: MODELS["Underground Belt"],
		tags: [],
		constants: {},
		attributes: {},

		nodes: {
			cells: [],
			inputs: [],
			outputs: [],
		},

		selectionPriority: 0,
	},

	"Underground Belt Input": {
		index: undefined,
		category: "Transportation",
		subCategory: "Logistics",
		image: "",
		description: "",
		price: 0,

		model: MODELS["Underground Belt Input"],
		tags: ["UndergroundBeltInput"],
		constants: {
			TransportSpeed: 5,
		},
		attributes: {},

		nodes: {
			cells: [new Vector3()],
			inputs: [new CFrame(0, 0, 0, 0, 1, 0, 0, 0, -1, -1, 0, 0)],
			outputs: [],
		},

		selectionPriority: 0,
	},

	"Underground Belt Output": {
		index: undefined,
		category: "Transportation",
		subCategory: "Logistics",
		image: "",
		description: "",
		price: 0,

		model: MODELS["Underground Belt Output"],
		tags: ["UndergroundBeltOutput"],
		constants: {
			TransportSpeed: 5,
		},
		attributes: {},

		nodes: {
			cells: [new Vector3()],
			inputs: [],
			outputs: [new CFrame(0, 0, -4, 0, 1, 0, 0, 0, -1, -1, 0, 0)],
		},

		selectionPriority: 0,
	},

	Merger: {
		index: 0,
		category: "Transportation",
		subCategory: "Logistics",
		image: IMAGES.ui["Straight Conveyor"],
		description: "Combines multiple item streams into one output line.",
		price: 90,

		model: MODELS.Merger,
		tags: ["Merger"],
		constants: {
			TransportSpeed: 5,
		},
		attributes: {},

		nodes: {
			cells: [new Vector3()],
			inputs: [
				new CFrame(0, 0, 0, 0, 1, 0, 0, 0, -1, -1, 0, 0),
				new CFrame(0, 0, 0, 1, 0, 0, 0, 0, -1, 0, 1, 0),
				new CFrame(0, 0, 0, -1, 0, -0, 0, 0, -1, 0, -1, 0),
			],
			outputs: [new CFrame(0, 0, -4, 0, 1, 0, 0, 0, -1, -1, 0, 0)],
		},

		selectionPriority: 1,
	},

	"Priority Merger": {
		index: 1,
		category: "Transportation",
		subCategory: "Logistics",
		image: IMAGES.ui["Straight Conveyor"],
		description: "Combines multiple item streams into one output line with configurable priority settings.",
		price: 200,
		gamepass: 1546305404,

		model: MODELS["Priority Merger"],
		tags: ["PriorityMerger"],
		constants: {
			TransportSpeed: 5,
		},
		attributes: {
			LeftInput: "Low",
			BackwardInput: "Low",
			RightInput: "Low",
		},

		nodes: {
			cells: [new Vector3()],
			inputs: [
				new CFrame(0, 0, 0, 0, 1, 0, 0, 0, -1, -1, 0, 0),
				new CFrame(0, 0, 0, 1, 0, 0, 0, 0, -1, 0, 1, 0),
				new CFrame(0, 0, 0, -1, 0, -0, 0, 0, -1, 0, -1, 0),
			],
			outputs: [new CFrame(0, 0, -4, 0, 1, 0, 0, 0, -1, -1, 0, 0)],
		},

		selectionPriority: 1,
	},

	Splitter: {
		index: 2,
		category: "Transportation",
		subCategory: "Logistics",
		image: IMAGES.ui["Straight Conveyor"],
		description: "Divides incoming items evenly between multiple outputs.",
		price: 90,

		model: MODELS.Splitter,
		tags: ["Splitter"],
		constants: {
			TransportSpeed: 5,
		},
		attributes: {},

		nodes: {
			cells: [new Vector3()],
			inputs: [new CFrame(0, 0, 0, 0, 1, 0, 0, 0, -1, -1, 0, 0)],
			outputs: [
				new CFrame(-4, 0, 0, -1, 0, -0, 0, 0, -1, 0, -1, 0),
				new CFrame(4, 0, 0, 1, 0, 0, 0, 0, -1, 0, 1, 0),
				new CFrame(0, 0, -4, 0, 1, 0, 0, 0, -1, -1, 0, 0),
			],
		},

		selectionPriority: 1,
	},

	"Smart Splitter": {
		index: 3,
		category: "Transportation",
		subCategory: "Logistics",
		image: IMAGES.ui["Straight Conveyor"],
		description: "Divides incoming items evenly between multiple outputs using filters.",
		price: 500,

		model: MODELS["Smart Splitter"],
		tags: ["SmartSplitter"],
		constants: {
			TransportSpeed: 5,
		},
		attributes: {
			LeftOutput: "Any",
			ForwardOutput: "Any",
			RightOutput: "Any",
		},

		nodes: {
			cells: [new Vector3()],
			inputs: [new CFrame(0, 0, 0, 0, 1, 0, 0, 0, -1, -1, 0, 0)],
			outputs: [
				new CFrame(-4, 0, 0, -1, 0, -0, 0, 0, -1, 0, -1, 0),
				new CFrame(4, 0, 0, 1, 0, 0, 0, 0, -1, 0, 1, 0),
				new CFrame(0, 0, -4, 0, 1, 0, 0, 0, -1, -1, 0, 0),
			],
		},

		selectionPriority: 1,
	},

	"Programmable Splitter": {
		index: 4,
		category: "Transportation",
		subCategory: "Logistics",
		image: IMAGES.ui["Straight Conveyor"],
		description: "Divides incoming items evenly between multiple outputs using more filters.",
		price: 1000,
		gamepass: 1546149382,

		model: MODELS["Programmable Splitter"],
		tags: ["ProgrammableSplitter"],
		constants: {
			TransportSpeed: 5,
		},
		attributes: {
			LeftOutput: HttpService.JSONEncode(["Any"]),
			ForwardOutput: HttpService.JSONEncode(["Any"]),
			RightOutput: HttpService.JSONEncode(["Any"]),
		},

		nodes: {
			cells: [new Vector3()],
			inputs: [new CFrame(0, 0, 0, 0, 1, 0, 0, 0, -1, -1, 0, 0)],
			outputs: [
				new CFrame(-4, 0, 0, -1, 0, -0, 0, 0, -1, 0, -1, 0),
				new CFrame(4, 0, 0, 1, 0, 0, 0, 0, -1, 0, 1, 0),
				new CFrame(0, 0, -4, 0, 1, 0, 0, 0, -1, -1, 0, 0),
			],
		},

		selectionPriority: 1,
	},

	"Storage Container": {
		index: 0,
		image: IMAGES.ui["Straight Conveyor"],
		category: "Transportation",
		subCategory: "Storage",
		description: "Stores large quantities of items for buffering or long-term storage.",
		price: 225,

		model: MODELS["Storage Container"],
		tags: ["StorageContainer"],
		constants: {
			TransportSpeed: 5,
			Slots: 20,
			SlotStackSize: 32,
		},
		attributes: {},

		nodes: {
			cells: [
				new Vector3(-4, 0, 0),
				new Vector3(0, 0, -8),
				new Vector3(0, 0, 0),
				new Vector3(-4, 0, -8),
				new Vector3(0, 0, -4),
				new Vector3(-4, 0, -4),
			],
			inputs: [new CFrame(0, 0, 0, 0, 1, 0, 0, 0, -1, -1, 0, 0)],
			outputs: [new CFrame(0, 0, -12, 0, 1, 0, 0, 0, -1, -1, 0, 0)],
		},

		selectionPriority: 0,
	},

	"Delivery Dock": {
		index: 0,
		image: IMAGES.ui["Straight Conveyor"],
		category: "Transportation",
		subCategory: "Miscellaneous",
		description: "Completes milestones by delivering required items.",
		price: 15000,

		model: MODELS["Delivery Dock"],
		tags: ["DeliveryDock"],
		constants: {},
		attributes: {},

		nodes: {
			cells: [
				new Vector3(-4, 0, -4),
				new Vector3(-8, 0, 0),
				new Vector3(4, 0, 4),
				new Vector3(0, 0, -4),
				new Vector3(-4, 0, -8),
				new Vector3(0, 0, 0),
				new Vector3(4, 0, 0),
				new Vector3(-8, 0, -4),
				new Vector3(-8, 0, 4),
				new Vector3(0, 0, 4),
				new Vector3(-8, 0, -8),
				new Vector3(-4, 0, 0),
				new Vector3(4, 0, -8),
				new Vector3(4, 0, -4),
				new Vector3(0, 0, -8),
				new Vector3(-4, 0, 4),
			],
			inputs: [
				new CFrame(-8, 0, -8, 1, 0, 0, 0, 0, -1, 0, 1, 0),
				new CFrame(-8, 0, -4, 1, 0, 0, 0, 0, -1, 0, 1, 0),
				new CFrame(-8, 0, 0, 1, 0, 0, 0, 0, -1, 0, 1, 0),
				new CFrame(-8, 0, 4, 1, 0, 0, 0, 0, -1, 0, 1, 0),
				new CFrame(4, 0, 4, 0, 1, 0, 0, 0, -1, -1, 0, 0),
				new CFrame(0, 0, 4, 0, 1, 0, 0, 0, -1, -1, 0, 0),
				new CFrame(-4, 0, 4, 0, 1, 0, 0, 0, -1, -1, 0, 0),
				new CFrame(-8, 0, 4, 0, 1, 0, 0, 0, -1, -1, 0, 0),
				new CFrame(4, 0, -8, -1, 0, -0, 0, 0, -1, 0, -1, 0),
				new CFrame(4, 0, -4, -1, 0, -0, 0, 0, -1, 0, -1, 0),
				new CFrame(4, 0, 0, -1, 0, -0, 0, 0, -1, 0, -1, 0),
				new CFrame(4, 0, 4, -1, 0, -0, 0, 0, -1, 0, -1, 0),
				new CFrame(-8, 0, -8, 0, -1, 0, 0, 0, -1, 1, 0, 0),
				new CFrame(-4, 0, -8, 0, -1, 0, 0, 0, -1, 1, 0, 0),
				new CFrame(0, 0, -8, 0, -1, 0, 0, 0, -1, 1, 0, 0),
				new CFrame(4, 0, -8, 0, -1, 0, 0, 0, -1, 1, 0, 0),
			],
			outputs: [],
		},

		selectionPriority: 0,
	},
	//#endregion

	//#region Production
	Miner: {
		index: 0,
		category: "Production",
		subCategory: "Extractors",
		image: IMAGES.ui["Straight Conveyor"],
		description: "Automates resource collection by extracting raw materials from deposits.",
		price: 150,

		model: MODELS.Miner,
		tags: ["Miner", "IndicatorLight"],
		constants: {
			TransportSpeed: 5,
			PowerConsumption: 4,
		},
		attributes: {
			SelectedItem: undefined,
		},

		nodes: {
			cells: [new Vector3(0, 0, -4), new Vector3(0, 0, 0)],
			inputs: [],
			outputs: [new CFrame(0, 0, -8, 0, 1, 0, 0, 0, -1, -1, 0, 0)],
		},

		selectionPriority: 2,
	},

	Smelter: {
		index: 1,
		category: "Production",
		subCategory: "Processors",
		image: IMAGES.ui["Straight Conveyor"],
		description: "Refines raw ores into usable metal ingots automatically.",
		price: 200,

		model: MODELS.Smelter,
		tags: ["Manufacturer", "IndicatorLight"],
		constants: {
			TransportSpeed: 5,
			PowerConsumption: 4,
		},
		attributes: {
			SelectedItem: undefined,
		},

		nodes: {
			cells: [new Vector3(0, 0, -4), new Vector3(0, 0, 0)],
			inputs: [new CFrame(0, 0, 0, 0, 1, 0, 0, 0, -1, -1, 0, 0)],
			outputs: [new CFrame(0, 0, -8, 0, 1, 0, 0, 0, -1, -1, 0, 0)],
		},

		selectionPriority: 2,
	},

	Constructor: {
		index: 2,
		category: "Production",
		subCategory: "Manufacturers",
		image: IMAGES.ui["Straight Conveyor"],
		description: "Transforms inputs into configurable outputs for high-volume production.",
		price: 300,

		model: MODELS.Constructor,
		tags: ["Manufacturer", "IndicatorLight"],
		constants: {
			TransportSpeed: 5,
			PowerConsumption: 4,
		},
		attributes: {
			SelectedItem: undefined,
		},

		nodes: {
			cells: [new Vector3(0, 0, -4), new Vector3(0, 0, 0)],
			inputs: [new CFrame(0, 0, 0, 0, 1, 0, 0, 0, -1, -1, 0, 0)],
			outputs: [new CFrame(0, 0, -8, 0, 1, 0, 0, 0, -1, -1, 0, 0)],
		},

		selectionPriority: 2,
	},

	Assembler: {
		index: 3,
		category: "Production",
		subCategory: "Manufacturers",
		image: IMAGES.ui["Straight Conveyor"],
		description: "Combines refined materials to craft advanced components automatically.",
		price: 900,

		model: MODELS.Assembler,
		tags: ["Manufacturer", "IndicatorLight"],

		constants: {
			TransportSpeed: 5,
			PowerConsumption: 4,
		},
		attributes: {
			SelectedItem: undefined,
		},

		nodes: {
			cells: [
				new Vector3(0, 0, 0),
				new Vector3(4, 0, 0),
				new Vector3(-4, 0, 0),
				new Vector3(0, 0, 4),
				new Vector3(0, 0, -4),
				new Vector3(4, 0, 4),
				new Vector3(-4, 0, 4),
				new Vector3(4, 0, -4),
				new Vector3(-4, 0, -4),
			],
			inputs: [
				new CFrame(-4, 0, 4, 0, 1, 0, 0, 0, -1, -1, 0, 0),
				new CFrame(4, 0, 4, 0, 1, 0, 0, 0, -1, -1, 0, 0),
			],
			outputs: [new CFrame(0, 0, -8, 0, 1, 0, 0, 0, -1, -1, 0, 0)],
		},

		selectionPriority: 2,
	},
	//#endregion

	//#region Power
	"Power Line": {
		index: 0,
		category: "Power",
		subCategory: "Power Poles",
		image: IMAGES.ui["Straight Conveyor"],
		description: "Connects structures to transfer electrical power between them.",
		price: 0,

		model: MODELS["Power Line"],
		tags: [],
		constants: {},
		attributes: {},

		nodes: {
			cells: [],
			inputs: [],
			outputs: [],
		},

		selectionPriority: 0,
	},

	"Power Pole": {
		index: 1,
		category: "Power",
		subCategory: "Power Poles",
		image: IMAGES.ui["Straight Conveyor"],
		description: "Extends the power network, allowing multiple power connections.",
		price: 80,

		model: MODELS["Power Pole"],
		tags: [],
		constants: {
			MaxConnections: 5,
		},
		attributes: {},

		nodes: {
			cells: [new Vector3(0, 0, 0)],
			inputs: [],
			outputs: [],
		},

		selectionPriority: 0,
	},

	"Power Switch": {
		index: 2,
		category: "Power",
		subCategory: "Power Poles",
		image: IMAGES.ui["Straight Conveyor"],
		description: "Manually toggles power flow between connected circuits.",
		price: 100,

		model: MODELS["Power Switch"],
		tags: ["PowerSwitch"],
		constants: {},
		attributes: {
			On: false,
		},

		nodes: {
			cells: [new Vector3(0, 0, 0)],
			inputs: [],
			outputs: [],
		},

		selectionPriority: 0,
	},

	"Hand-Crank": {
		index: 0,
		category: "Power",
		subCategory: "Generators",
		image: IMAGES.ui["Straight Conveyor"],
		description: "A simple manual crank that generates a small amount of power through rotation.",
		price: 75,

		model: MODELS["Hand-Crank"],
		tags: ["Hand-Crank"],
		constants: {
			MaxPowerProduction: 70,
			MaxCrankRoundsPerMinute: 250,
		},
		attributes: {},

		nodes: {
			cells: [new Vector3(0, 0, 0)],
			inputs: [],
			outputs: [],
		},

		selectionPriority: 0,
	},

	"Wind Turbine": {
		index: 1,
		category: "Power",
		subCategory: "Generators",
		image: IMAGES.ui["Straight Conveyor"],
		description: "Generates clean, renewable power from wind currents.",
		price: 350,

		model: MODELS["Wind Turbine"],
		tags: ["WindTurbine"],
		constants: {
			MaxPowerProduction: 50,
			MaxRotorSpeed: 12,
		},
		attributes: {},

		nodes: {
			cells: [new Vector3(0, 0, 0)],
			inputs: [],
			outputs: [],
		},

		selectionPriority: 0,
	},
	//#endregion
};
