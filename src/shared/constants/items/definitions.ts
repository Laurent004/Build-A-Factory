import { IMAGES } from "shared/assets/images";
import { ItemDefintion, ItemRecipe } from "./types";

export const ITEMS: Record<string, ItemDefintion> = {
	//#region Miner
	"Iron Ore": {
		index: 0,
		image: IMAGES["Iron Ore"],
		description: "Common metallic ore used for all structural parts.",
		energy: 0,
		value: {
			cash: 4,
			logisticsData: 0,
			productionData: 0,
			powerData: 0,
		},
	},
	"Copper Ore": {
		index: 1,
		image: IMAGES["Copper Ore"],
		description: "Conductive ore used for electronics.",
		energy: 0,
		value: {
			cash: 0,
			logisticsData: 0,
			productionData: 0,
			powerData: 0,
		},
	},
	Coal: {
		index: 2,
		image: IMAGES.Coal,
		description: "Carbon-rich material used for fuel and alloys.",
		energy: 300,
		value: {
			cash: 0,
			logisticsData: 0,
			productionData: 0,
			powerData: 0,
		},
	},
	Stone: {
		index: 3,
		image: "",
		description: "",
		energy: 300,
		value: {
			cash: 0,
			logisticsData: 0,
			productionData: 0,
			powerData: 0,
		},
	},
	"Gold Ore": {
		index: 4,
		image: "",
		description: "",
		energy: 0,
		value: {
			cash: 0,
			logisticsData: 0,
			productionData: 0,
			powerData: 0,
		},
	},
	Bauxite: {
		index: 5,
		image: "",
		description: "",
		energy: 0,
		value: {
			cash: 0,
			logisticsData: 0,
			productionData: 0,
			powerData: 0,
		},
	},
	"Raw Quartz": {
		index: 6,
		image: "",
		description: "",
		energy: 0,
		value: {
			cash: 0,
			logisticsData: 0,
			productionData: 0,
			powerData: 0,
		},
	},
	//#endregion
	//#region Water Extractor
	Water: {
		index: 7,
		image: "",
		description: "",
		energy: 0,
	},
	//#endregion
	//#region Oil Extractor
	"Crude Oil": {
		index: 8,
		image: "",
		description: "",
		energy: 0,
	},
	//#endregion
	//#region Smelter
	"Iron Ingot": {
		index: 9,
		image: "",
		description: "",
		energy: 0,
		value: {
			cash: 0,
			logisticsData: 0,
			productionData: 0,
			powerData: 0,
		},
	},
	"Copper Ingot": {
		index: 10,
		image: "",
		description: "",
		energy: 0,
		value: {
			cash: 0,
			logisticsData: 0,
			productionData: 0,
			powerData: 0,
		},
	},
	"Stone Brick": {
		index: 11,
		image: "",
		description: "",
		energy: 0,
		value: {
			cash: 0,
			logisticsData: 0,
			productionData: 0,
			powerData: 0,
		},
	},
	"Gold Ingot": {
		index: 12,
		image: "",
		description: "",
		energy: 0,
		value: {
			cash: 0,
			logisticsData: 0,
			productionData: 0,
			powerData: 0,
		},
	},
	Glass: {
		index: 13,
		image: "",
		description: "",
		energy: 0,
		value: {
			cash: 0,
			logisticsData: 0,
			productionData: 0,
			powerData: 0,
		},
	},
	//#endregion
	//#region Crusher
	"Iron Dust": {
		index: 14,
		image: "",
		description: "",
		energy: 0,
		value: {
			cash: 0,
			logisticsData: 0,
			productionData: 0,
			powerData: 0,
		},
	},
	"Copper Dust": {
		index: 15,
		image: "",
		description: "",
		energy: 0,
		value: {
			cash: 0,
			logisticsData: 0,
			productionData: 0,
			powerData: 0,
		},
	},
	Gravel: {
		index: 16,
		image: "",
		description: "",
		energy: 0,
		value: {
			cash: 0,
			logisticsData: 0,
			productionData: 0,
			powerData: 0,
		},
	},
	"Pulverized Coal": {
		index: 17,
		image: "",
		description: "",
		energy: 480,
		value: {
			cash: 0,
			logisticsData: 0,
			productionData: 0,
			powerData: 0,
		},
	},
	Sand: {
		index: 18,
		image: "",
		description: "",
		energy: 0,
		value: {
			cash: 0,
			logisticsData: 0,
			productionData: 0,
			powerData: 0,
		},
	},
	"Crushed Bauxite": {
		index: 19,
		image: "",
		description: "",
		energy: 0,
		value: {
			cash: 0,
			logisticsData: 0,
			productionData: 0,
			powerData: 0,
		},
	},
	Silica: {
		index: 20,
		image: "",
		description: "",
		energy: 0,
		value: {
			cash: 0,
			logisticsData: 0,
			productionData: 0,
			powerData: 0,
		},
	},
	//#endregion
	//#region Press
	"Iron Plate": {
		index: 21,
		image: "",
		description: "",
		energy: 0,
		value: {
			cash: 0,
			logisticsData: 0,
			productionData: 0,
			powerData: 0,
		},
	},
	"Iron Gear": {
		index: 22,
		image: "",
		description: "",
		energy: 0,
		value: {
			cash: 0,
			logisticsData: 0,
			productionData: 0,
			powerData: 0,
		},
	},
	"Copper Sheet": {
		index: 23,
		image: "",
		description: "",
		energy: 0,
		value: {
			cash: 0,
			logisticsData: 0,
			productionData: 0,
			powerData: 0,
		},
	},
	"Gold Foil": {
		index: 24,
		image: "",
		description: "",
		energy: 0,
		value: {
			cash: 0,
			logisticsData: 0,
			productionData: 0,
			powerData: 0,
		},
	},
	"Aluminium Sheet": {
		index: 25,
		image: "",
		description: "",
		energy: 0,
		value: {
			cash: 0,
			logisticsData: 0,
			productionData: 0,
			powerData: 0,
		},
	},
	"Steel Beam": {
		index: 26,
		image: "",
		description: "",
		energy: 0,
		value: {
			cash: 0,
			logisticsData: 0,
			productionData: 0,
			powerData: 0,
		},
	},
	//#endregion
	//#region Boiler
	Steam: {
		index: 27,
		image: "",
		description: "",
		energy: 0,
	},
	//#endregion
	//#region Foundry
	"Steel Ingot": {
		index: 28,
		image: "",
		description: "",
		energy: 0,
		value: {
			cash: 0,
			logisticsData: 0,
			productionData: 0,
			powerData: 0,
		},
	},
	"Aluminium Ingot": {
		index: 29,
		image: "",
		description: "",
		energy: 0,
		value: {
			cash: 0,
			logisticsData: 0,
			productionData: 0,
			powerData: 0,
		},
	},
	"Silicon Ingot": {
		index: 30,
		image: "",
		description: "",
		energy: 0,
		value: {
			cash: 0,
			logisticsData: 0,
			productionData: 0,
			powerData: 0,
		},
	},
	//#endregion
	//#region Constructor
	Wire: {
		index: 31,
		image: "",
		description: "",
		energy: 0,
		value: {
			cash: 0,
			logisticsData: 0,
			productionData: 0,
			powerData: 0,
		},
	},
	Lens: {
		index: 32,
		image: "",
		description: "",
		energy: 0,
		value: {
			cash: 0,
			logisticsData: 0,
			productionData: 0,
			powerData: 0,
		},
	},
	"Fan Blade": {
		index: 33,
		image: "",
		description: "",
		energy: 0,
		value: {
			cash: 0,
			logisticsData: 0,
			productionData: 0,
			powerData: 0,
		},
	},
	"Heat Sink": {
		index: 34,
		image: "",
		description: "",
		energy: 0,
		value: {
			cash: 0,
			logisticsData: 0,
			productionData: 0,
			powerData: 0,
		},
	},
	Spring: {
		index: 35,
		image: "",
		description: "",
		energy: 0,
		value: {
			cash: 0,
			logisticsData: 0,
			productionData: 0,
			powerData: 0,
		},
	},
	Microchip: {
		index: 36,
		image: "",
		description: "",
		energy: 0,
		value: {
			cash: 0,
			logisticsData: 0,
			productionData: 0,
			powerData: 0,
		},
	},
	//#endregion
	//#region Assembler
	"Electric Motor": {
		index: 37,
		image: "",
		description: "",
		energy: 0,
		value: {
			cash: 0,
			logisticsData: 0,
			productionData: 0,
			powerData: 0,
		},
	},
	Battery: {
		index: 38,
		image: "",
		description: "",
		energy: 0,
		value: {
			cash: 0,
			logisticsData: 0,
			productionData: 0,
			powerData: 0,
		},
	},
	"Concrete Block": {
		index: 39,
		image: "",
		description: "",
		energy: 0,
		value: {
			cash: 0,
			logisticsData: 0,
			productionData: 0,
			powerData: 0,
		},
	},
	"Circuit Board": {
		index: 40,
		image: "",
		description: "",
		energy: 0,
		value: {
			cash: 0,
			logisticsData: 0,
			productionData: 0,
			powerData: 0,
		},
	},
	CPU: {
		index: 41,
		image: "",
		description: "",
		energy: 0,
		value: {
			cash: 0,
			logisticsData: 0,
			productionData: 0,
			powerData: 0,
		},
	},
	GPU: {
		index: 42,
		image: "",
		description: "",
		energy: 0,
		value: {
			cash: 0,
			logisticsData: 0,
			productionData: 0,
			powerData: 0,
		},
	},
	RAM: {
		index: 43,
		image: "",
		description: "",
		energy: 0,
		value: {
			cash: 0,
			logisticsData: 0,
			productionData: 0,
			powerData: 0,
		},
	},
	Piston: {
		index: 44,
		image: "",
		description: "",
		energy: 0,
		value: {
			cash: 0,
			logisticsData: 0,
			productionData: 0,
			powerData: 0,
		},
	},
	Wheel: {
		index: 45,
		image: "",
		description: "",
		energy: 0,
		value: {
			cash: 0,
			logisticsData: 0,
			productionData: 0,
			powerData: 0,
		},
	},
	//#endregion
	//#region Refinery
	Plastic: {
		index: 46,
		image: "",
		description: "",
		energy: 0,
		value: {
			cash: 0,
			logisticsData: 0,
			productionData: 0,
			powerData: 0,
		},
	},
	Rubber: {
		index: 47,
		image: "",
		description: "",
		energy: 0,
		value: {
			cash: 0,
			logisticsData: 0,
			productionData: 0,
			powerData: 0,
		},
	},
	//#endregio
};

export const ITEM_RECIPES: Record<string, ItemRecipe> = {
	//#region Miner
	"Iron Ore": {
		index: 0,
		structureName: "Miner",
		inputItems: {},
		outputItems: {
			"Iron Ore": 1,
		},
		time: 0.5,
	},
	"Copper Ore": {
		index: 1,
		structureName: "Miner",
		inputItems: {},
		outputItems: {
			"Copper Ore": 1,
		},
		time: 4,
	},
	Coal: {
		index: 2,
		structureName: "Miner",
		inputItems: {},
		outputItems: {
			Coal: 1,
		},
		time: 4,
	},
	Stone: {
		index: 3,
		structureName: "Miner",
		inputItems: {},
		outputItems: {
			Stone: 1,
		},
		time: 4,
	},
	"Gold Ore": {
		index: 4,
		structureName: "Miner",
		inputItems: {},
		outputItems: {
			"Gold Ore": 1,
		},
		time: 4,
	},
	Bauxite: {
		index: 5,
		structureName: "Miner",
		inputItems: {},
		outputItems: {
			Bauxite: 1,
		},
		time: 4,
	},
	"Raw Quartz": {
		index: 6,
		structureName: "Miner",
		inputItems: {},
		outputItems: {
			"Raw Quartz": 1,
		},
		time: 4,
	},
	//#endregion
	//#region Water Extractor
	Water: {
		index: 7,
		structureName: "Water Extractor",
		inputItems: {},
		outputItems: {
			Water: 2,
		},
		time: 2,
	},
	//#endregion
	//#region Oil Extractor
	"Crude Oil": {
		index: 8,
		structureName: "Oil Extractor",
		inputItems: {},
		outputItems: {
			"Crude Oil": 5,
		},
		time: 1,
	},
	//#endregion
	//#region Smelter
	"Iron Ingot": {
		index: 9,
		structureName: "Smelter",
		inputItems: {
			"Iron Ore": 1,
		},
		outputItems: {
			"Iron Ingot": 1,
		},
		time: 4,
	},
	"Iron Ingot Alt": {
		index: 10,
		structureName: "Smelter",
		inputItems: {
			"Iron Dust": 1,
		},
		outputItems: {
			"Iron Ingot": 1,
		},
		time: 3,
	},
	"Copper Ingot": {
		index: 11,
		structureName: "Smelter",
		inputItems: {
			"Copper Ore": 1,
		},
		outputItems: {
			"Copper Ingot": 1,
		},
		time: 4,
	},
	"Copper Ingot Alt": {
		index: 12,
		structureName: "Smelter",
		inputItems: {
			"Copper Dust": 1,
		},
		outputItems: {
			"Copper Ingot": 1,
		},
		time: 3,
	},
	"Stone Brick": {
		index: 13,
		structureName: "Smelter",
		inputItems: {
			Stone: 1,
		},
		outputItems: {
			"Stone Brick": 1,
		},
		time: 4,
	},
	"Gold Ingot": {
		index: 14,
		structureName: "Smelter",
		inputItems: {
			"Gold Ore": 1,
		},
		outputItems: {
			"Gold Ingot": 1,
		},
		time: 4,
	},
	Glass: {
		index: 15,
		structureName: "Smelter",
		inputItems: {
			Sand: 1,
		},
		outputItems: {
			Glass: 1,
		},
		time: 3,
	},
	//#endregion
	//#region Crusher
	"Iron Dust": {
		index: 16,
		structureName: "Crusher",
		inputItems: {
			"Iron Ore": 1,
		},
		outputItems: {
			"Iron Dust": 1,
			Gravel: 1,
		},
		time: 4,
	},
	"Copper Dust": {
		index: 17,
		structureName: "Crusher",
		inputItems: {
			"Copper Ore": 1,
		},
		outputItems: {
			"Copper Dust": 1,
			Gravel: 1,
		},
		time: 4,
	},
	"Pulverized Coal": {
		index: 18,
		structureName: "Crusher",
		inputItems: {
			Coal: 1,
		},
		outputItems: {
			"Pulverized Coal": 1,
		},
		time: 4,
	},
	Sand: {
		index: 19,
		structureName: "Crusher",
		inputItems: {
			Stone: 1,
		},
		outputItems: {
			Sand: 2,
		},
		time: 3.5,
	},
	"Crushed Bauxite": {
		index: 20,
		structureName: "Crusher",
		inputItems: {
			Bauxite: 1,
		},
		outputItems: {
			"Crushed Bauxite": 1,
		},
		time: 4,
	},
	Silica: {
		index: 21,
		structureName: "Crusher",
		inputItems: {
			"Raw Quartz": 1,
		},
		outputItems: {
			Silica: 1,
		},
		time: 4,
	},
	//#endregion
	//#region Press
	"Iron Plate": {
		index: 22,
		structureName: "Press",
		inputItems: {
			"Iron Ingot": 1,
		},
		outputItems: {
			"Iron Plate": 1,
		},
		time: 4,
	},
	"Iron Gear": {
		index: 23,
		structureName: "Press",
		inputItems: {
			"Iron Plate": 1,
		},
		outputItems: {
			"Iron Gear": 1,
		},
		time: 4,
	},
	"Copper Sheet": {
		index: 24,
		structureName: "Press",
		inputItems: {
			"Copper Ingot": 1,
		},
		outputItems: {
			"Copper Sheet": 1,
		},
		time: 4,
	},
	"Gold Foil": {
		index: 25,
		structureName: "Press",
		inputItems: {
			"Gold Ingot": 1,
		},
		outputItems: {
			"Gold Foil": 1,
		},
		time: 4,
	},
	"Aluminium Sheet": {
		index: 26,
		structureName: "Press",
		inputItems: {
			"Aluminium Ingot": 1,
		},
		outputItems: {
			"Aluminium Sheet": 1,
		},
		time: 4,
	},
	"Steel Beam": {
		index: 27,
		structureName: "Press",
		inputItems: {
			"Steel Ingot": 3,
		},
		outputItems: {
			"Steel Beam": 1,
		},
		time: 4,
	},
	//#endregion
	//#region Boiler
	Steam: {
		index: 28,
		structureName: "Boiler",
		inputItems: {
			Water: 3,
			Coal: 1,
		},
		outputItems: {
			Steam: 2,
		},
		time: 1,
	},
	//#endregion
	//#region Foundry
	"Steel Ingot": {
		index: 29,
		structureName: "Foundry",
		inputItems: {
			"Iron Ingot": 1,
			"Pulverized Coal": 1,
		},
		outputItems: {
			"Steel Ingot": 1,
		},
		time: 5,
	},
	"Aluminium Ingot": {
		index: 30,
		structureName: "Foundry",
		inputItems: {
			"Crushed Bauxite": 1,
			"Pulverized Coal": 1,
		},
		outputItems: {
			"Aluminium Ingot": 1,
		},
		time: 5,
	},
	"Silicon Ingot": {
		index: 31,
		structureName: "Foundry",
		inputItems: {
			Silica: 1,
			"Pulverized Coal": 1,
		},
		outputItems: {
			"Silicon Ingot": 1,
		},
		time: 5,
	},
	//#endregion
	//#region Constructor
	Wire: {
		index: 32,
		structureName: "Constructor",
		inputItems: {
			"Copper Ingot": 1,
		},
		outputItems: {
			Wire: 2,
		},
		time: 4,
	},
	Lens: {
		index: 33,
		structureName: "Constructor",
		inputItems: {
			Glass: 1,
		},
		outputItems: {
			Lens: 1,
		},
		time: 4,
	},
	"Fan Blade": {
		index: 34,
		structureName: "Constructor",
		inputItems: {
			"Aluminium Sheet": 1,
		},
		outputItems: {
			"Fan Blade": 1,
		},
		time: 4,
	},
	"Heat Sink": {
		index: 35,
		structureName: "Constructor",
		inputItems: {
			"Aluminium Sheet": 1,
		},
		outputItems: {
			"Heat Sink": 1,
		},
		time: 4,
	},
	Spring: {
		index: 36,
		structureName: "Constructor",
		inputItems: {
			"Steel Ingot": 1,
		},
		outputItems: {
			Spring: 1,
		},
		time: 4,
	},
	Microchip: {
		index: 37,
		structureName: "Constructor",
		inputItems: {
			"Silicon Ingot": 1,
		},
		outputItems: {
			Microchip: 1,
		},
		time: 4,
	},
	//#endregion
	//#region Assembler
	"Electric Motor": {
		index: 39,
		structureName: "Assembler",
		inputItems: {
			"Iron Gear": 2,
			Wire: 4,
		},
		outputItems: {
			"Electric Motor": 1,
		},
		time: 4,
	},
	Battery: {
		index: 40,
		structureName: "Assembler",
		inputItems: {
			"Copper Sheet": 1,
			Plastic: 1,
		},
		outputItems: {
			Battery: 1,
		},
		time: 4,
	},
	"Concrete Block": {
		index: 41,
		structureName: "Assembler",
		inputItems: {
			Gravel: 2,
			Sand: 2,
		},
		outputItems: {
			"Concrete Block": 1,
		},
		time: 4,
	},
	"Circuit Board": {
		index: 42,
		structureName: "Assembler",
		inputItems: {
			"Copper Sheet": 2,
			Plastic: 3,
		},
		outputItems: {
			"Circuit Board": 1,
		},
		time: 4,
	},
	CPU: {
		index: 43,
		structureName: "Assembler",
		inputItems: {
			Microchip: 2,
			"Circuit Board": 1,
		},
		outputItems: {
			CPU: 1,
		},
		time: 4,
	},
	GPU: {
		index: 44,
		structureName: "Assembler",
		inputItems: {
			"Heat Sink": 1,
			CPU: 1,
		},
		outputItems: {
			GPU: 1,
		},
		time: 4,
	},
	RAM: {
		index: 45,
		structureName: "Assembler",
		inputItems: {
			"Gold Foil": 2,
			"Circuit Board": 1,
		},
		outputItems: {
			RAM: 1,
		},
		time: 4,
	},
	Piston: {
		index: 46,
		structureName: "Assembler",
		inputItems: {
			"Steel Beam": 1,
			Spring: 1,
		},
		outputItems: {
			Piston: 1,
		},
		time: 4,
	},
	Wheel: {
		index: 47,
		structureName: "Assembler",
		inputItems: {
			"Steel Beam": 1,
			Rubber: 1,
		},
		outputItems: {
			Wheel: 1,
		},
		time: 4,
	},
	//#endregion
	//#region Refinery
	Plastic: {
		index: 48,
		structureName: "Refinery",
		inputItems: {
			"Crude Oil": 3,
		},
		outputItems: {
			Plastic: 1,
		},
		time: 5,
	},
	Rubber: {
		index: 49,
		structureName: "Refinery",
		inputItems: {
			"Crude Oil": 3,
		},
		outputItems: {
			Rubber: 1,
		},
		time: 5,
	},
	//#endregion
};
