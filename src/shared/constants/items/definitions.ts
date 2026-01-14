import { IMAGES } from "shared/assets/images";
import { ItemDefintion, ItemRecipe } from "./types";
import { MODELS } from "shared/assets/models";

export const ITEMS: Record<string, ItemDefintion> = {
	"Iron Ore": {
		index: 0,
		image: IMAGES.ui["Iron Ore"],
		description: "Common metallic ore used for all structural parts.",
		energy: 0,
		value: 8,
		model: MODELS["Iron Ore"],
	},
	"Copper Ore": {
		index: 1,
		image: IMAGES.ui["Copper Ore"],
		description: "Conductive ore used for electronics.",
		energy: 0,
		value: 8,
		model: MODELS["Copper Ore"],
	},
	Coal: {
		index: 2,
		image: "rbxassetid://83800666354606",
		description: "Carbon-rich material used for fuel and alloys.",
		energy: 300,
		value: 6,
		model: MODELS.Coal,
	},
	Silica: {
		index: 3,
		image: IMAGES.ui.Silica,
		description: "Refined quartz for glass and electronics.",
		energy: 0,
		value: 10,
		model: MODELS.Silica,
	},

	"Iron Ingot": {
		index: 4,
		image: IMAGES.ui["Iron Ingot"],
		description: "Refined iron for structural components.",
		energy: 0,
		value: 16,
		model: MODELS["Iron Ingot"],
	},
	"Copper Ingot": {
		index: 5,
		image: IMAGES.ui["Copper Ingot"],
		description: "Refined copper for wiring and circuits.",
		energy: 0,
		value: 16,
		model: MODELS["Copper Ingot"],
	},
	"Steel Ingot": {
		index: 6,
		image: IMAGES.ui["Steel Ingot"],
		description: "Strong alloy for machinery and frames.",
		energy: 0,
		value: 25,
		model: MODELS["Steel Ingot"],
	},
	Silicon: {
		index: 7,
		image: IMAGES.ui.Silicon,
		description: "Processed silica used in electronics and glass.",
		energy: 0,
		value: 20,
		model: MODELS.Silicon,
	},

	"Iron Plate": {
		index: 8,
		image: IMAGES.ui["Iron Plate"],
		description: "Flat metal sheets used in most constructions.",
		energy: 0,
		value: 24,
		model: MODELS["Iron Plate"],
	},
	"Iron Rod": {
		index: 9,
		image: IMAGES.ui["Iron Rod"],
		description: "Basic metal rod for structures and machines.",
		energy: 0,
		value: 20,
		model: MODELS["Iron Rod"],
	},
	"Copper Wire": {
		index: 10,
		image: IMAGES.ui["Copper Wire"],
		description: "Conductive wire for circuits and motors.",
		energy: 0,
		value: 20,
		model: MODELS["Copper Wire"],
	},
	"Steel Frame": {
		index: 11,
		image: IMAGES.ui["Steel Frame"],
		description: "Reinforced structural frame for machinery.",
		energy: 0,
		value: 40,
		model: MODELS["Steel Frame"],
	},
	"Glass Panel": {
		index: 12,
		image: IMAGES.ui["Glass Panel"],
		description: "Transparent panel for sensors and displays.",
		energy: 0,
		value: 35,
		model: MODELS["Glass Panel"],
	},

	"Circuit Board": {
		index: 13,
		image: IMAGES.ui["Circuit Board"],
		description: "Electronic control board used in automation.",
		energy: 0,
		value: 50,
		model: MODELS["Circuit Board"],
	},
	Motor: {
		index: 14,
		image: IMAGES.ui.Motor,
		description: "Converts electricity into mechanical motion.",
		energy: 0,
		value: 70,
		model: MODELS.Motor,
	},
	Battery: {
		index: 15,
		image: IMAGES.ui.Battery,
		description: "Stores electrical energy for machines.",
		energy: 0,
		value: 60,
		model: MODELS.Battery,
	},
	"Control Unit": {
		index: 16,
		image: IMAGES.ui["Control Unit"],
		description: "Advanced processor for smart automation.",
		energy: 0,
		value: 120,
		model: MODELS["Control Unit"],
	},

	Water: {
		index: 17,
		image: IMAGES.ui["Water"],
		description: "gloo gloo glo.",
		energy: 0,
		value: 0,
		model: undefined,
	},

	Elixir: {
		index: 18,
		image: IMAGES.ui["Elixir"],
		description: "Gloo gloooo glooo.",
		energy: 0,
		value: 0,
		model: undefined,
	},

	Acid: {
		index: 19,
		image: "rbxassetid://133845205148134",
		description: "ACIDDD.",
		energy: 0,
		value: 0,
		model: undefined,
	},
};

export const ITEM_RECIPES: Record<string, ItemRecipe> = {
	"Iron Ore": {
		index: 0,
		inputItems: {},
		outputItems: {
			"Iron Ore": 1,
		},
		structureName: "Miner",
		time: 0.1,
	},
	"Copper Ore": {
		index: 1,
		inputItems: {},
		outputItems: {
			"Copper Ore": 1,
		},
		structureName: "Miner",
		time: 0.1,
	},
	Coal: {
		index: 2,
		inputItems: {},
		outputItems: {
			Coal: 1,
		},
		structureName: "Miner",
		time: 2,
	},
	Silica: {
		index: 3,
		inputItems: {},
		outputItems: {
			Silica: 1,
		},
		structureName: "Miner",
		time: 2,
	},

	"Iron Ingot": {
		index: 4,
		inputItems: { "Iron Ore": 1 },
		outputItems: {
			"Iron Ingot": 1,
		},
		structureName: "Smelter",
		time: 2.5,
	},
	"Copper Ingot": {
		index: 5,
		inputItems: { "Copper Ore": 1 },
		outputItems: {
			"Copper Ingot": 1,
		},
		structureName: "Smelter",
		time: 2.5,
	},
	"Steel Ingot": {
		index: 6,
		inputItems: { "Iron Ore": 1, Coal: 1 },
		outputItems: {
			"Steel Ingot": 1,
		},
		structureName: "Smelter",
		time: 3,
	},
	Silicon: {
		index: 7,
		inputItems: { Silica: 1 },
		outputItems: {
			Silicon: 1,
		},
		structureName: "Smelter",
		time: 3.5,
	},
	"Iron Plate": {
		index: 8,
		inputItems: { "Iron Ingot": 1 },
		outputItems: {
			"Iron Plate": 1,
		},
		structureName: "Constructor",
		time: 2.5,
	},
	"Iron Rod": {
		index: 9,
		inputItems: { "Iron Ingot": 1 },
		outputItems: {
			"Iron Rod": 1,
		},
		structureName: "Constructor",
		time: 2.5,
	},
	"Copper Wire": {
		index: 10,
		inputItems: { "Copper Ingot": 1 },
		outputItems: {
			"Copper Wire": 1,
		},
		structureName: "Constructor",
		time: 2,
	},
	"Steel Frame": {
		index: 11,
		inputItems: { "Steel Ingot": 2 },
		outputItems: {
			"Steel Frame": 1,
		},
		structureName: "Constructor",
		time: 3,
	},
	"Glass Panel": {
		index: 12,
		inputItems: { Silicon: 1 },
		outputItems: {
			"Glass Panel": 1,
		},
		structureName: "Constructor",
		time: 3,
	},
	"Circuit Board": {
		index: 13,
		inputItems: { "Copper Wire": 2, Silicon: 1 },
		outputItems: {
			"Circuit Board": 1,
		},
		structureName: "Assembler",
		time: 3.5,
	},
	Motor: {
		index: 14,
		inputItems: { "Iron Rod": 2, "Copper Wire": 1 },
		outputItems: {
			Motor: 1,
		},
		structureName: "Assembler",
		time: 4,
	},
	Battery: {
		index: 15,
		inputItems: { "Copper Wire": 1, Silicon: 1, Coal: 1 },
		outputItems: {
			Battery: 1,
		},
		structureName: "Assembler",
		time: 4.5,
	},
	"Control Unit": {
		index: 16,
		inputItems: { "Circuit Board": 1, "Steel Frame": 1 },
		outputItems: {
			"Control Unit": 1,
		},
		structureName: "Assembler",
		time: 5,
	},

	Water: {
		index: 17,
		inputItems: {},
		outputItems: {
			Water: 2,
		},
		structureName: "Water Extractor",
		time: 1,
	},

	Elixir: {
		index: 18,
		inputItems: {
			Water: 2,
		},
		outputItems: {
			"Iron Ore": 1,
			Elixir: 2,
		},
		structureName: "Refinery",
		time: 0.2,
	},

	Acid: {
		index: 19,
		inputItems: {
			Water: 2,
			Elixir: 10,
		},
		outputItems: {
			Acid: 5,
			"Circuit Board": 1,
		},
		structureName: "Blender",
		time: 3,
	},
};
