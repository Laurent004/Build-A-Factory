import { IMAGES } from "shared/assets/images";
import { ItemDefintion, ItemRecipe } from "./types";
import { MODELS } from "shared/assets/models";

export const ITEMS: Record<string, ItemDefintion> = {
	"Iron Ore": {
		index: 0,
		image: IMAGES.ui["Iron Ore"],
		description: "Common metallic ore used for all structural parts.",
		value: 8,
		model: MODELS["Iron Ore"],
	},
	"Copper Ore": {
		index: 1,
		image: IMAGES.ui["Copper Ore"],
		description: "Conductive ore used for electronics.",
		value: 8,
		model: MODELS["Copper Ore"],
	},
	Coal: {
		index: 2,
		image: IMAGES.ui.Coal,
		description: "Carbon-rich material used for fuel and alloys.",
		value: 6,
		model: MODELS.Coal,
	},
	Silica: {
		index: 3,
		image: IMAGES.ui.Silica,
		description: "Refined quartz for glass and electronics.",
		value: 10,
		model: MODELS.Silica,
	},

	"Iron Ingot": {
		index: 4,
		image: IMAGES.ui["Iron Ingot"],
		description: "Refined iron for structural components.",
		value: 16,
		model: MODELS["Iron Ingot"],
	},
	"Copper Ingot": {
		index: 5,
		image: IMAGES.ui["Copper Ingot"],
		description: "Refined copper for wiring and circuits.",
		value: 16,
		model: MODELS["Copper Ingot"],
	},
	"Steel Ingot": {
		index: 6,
		image: IMAGES.ui["Steel Ingot"],
		description: "Strong alloy for machinery and frames.",
		value: 25,
		model: MODELS["Steel Ingot"],
	},
	Silicon: {
		index: 7,
		image: IMAGES.ui.Silicon,
		description: "Processed silica used in electronics and glass.",
		value: 20,
		model: MODELS.Silicon,
	},

	"Iron Plate": {
		index: 8,
		image: IMAGES.ui["Iron Plate"],
		description: "Flat metal sheets used in most constructions.",
		value: 24,
		model: MODELS["Iron Plate"],
	},
	"Iron Rod": {
		index: 9,
		image: IMAGES.ui["Iron Rod"],
		description: "Basic metal rod for structures and machines.",
		value: 20,
		model: MODELS["Iron Rod"],
	},
	"Copper Wire": {
		index: 10,
		image: IMAGES.ui["Copper Wire"],
		description: "Conductive wire for circuits and motors.",
		value: 20,
		model: MODELS["Copper Wire"],
	},
	"Steel Frame": {
		index: 11,
		image: IMAGES.ui["Steel Frame"],
		description: "Reinforced structural frame for machinery.",
		value: 40,
		model: MODELS["Steel Frame"],
	},
	"Glass Panel": {
		index: 12,
		image: IMAGES.ui["Glass Panel"],
		description: "Transparent panel for sensors and displays.",
		value: 35,
		model: MODELS["Glass Panel"],
	},

	"Circuit Board": {
		index: 13,
		image: IMAGES.ui["Circuit Board"],
		description: "Electronic control board used in automation.",
		value: 50,
		model: MODELS["Circuit Board"],
	},
	Motor: {
		index: 14,
		image: IMAGES.ui.Motor,
		description: "Converts electricity into mechanical motion.",
		value: 70,
		model: MODELS.Motor,
	},
	Battery: {
		index: 15,
		image: IMAGES.ui.Battery,
		description: "Stores electrical energy for machines.",
		value: 60,
		model: MODELS.Battery,
	},
	"Control Unit": {
		index: 16,
		image: IMAGES.ui["Control Unit"],
		description: "Advanced processor for smart automation.",
		value: 120,
		model: MODELS["Control Unit"],
	},
};

export const ITEM_RECIPES: ItemRecipe[] = [
	{ inputItems: {}, outputItem: "Iron Ore", structureName: "Miner", time: 0.1 },
	{ inputItems: {}, outputItem: "Copper Ore", structureName: "Miner", time: 0.1 },
	{ inputItems: {}, outputItem: "Coal", structureName: "Miner", time: 0.1 },
	{ inputItems: {}, outputItem: "Silica", structureName: "Miner", time: 2 },

	// --- Smelter ---
	{ inputItems: { "Iron Ore": 1 }, outputItem: "Iron Ingot", structureName: "Smelter", time: 2.5 },
	{ inputItems: { "Copper Ore": 1 }, outputItem: "Copper Ingot", structureName: "Smelter", time: 2.5 },
	{ inputItems: { "Iron Ore": 1, Coal: 1 }, outputItem: "Steel Ingot", structureName: "Smelter", time: 3 },
	{ inputItems: { Silica: 1 }, outputItem: "Silicon", structureName: "Smelter", time: 3.5 },

	// --- Constructor ---
	{ inputItems: { "Iron Ingot": 1 }, outputItem: "Iron Plate", structureName: "Constructor", time: 2.5 },
	{ inputItems: { "Iron Ingot": 1 }, outputItem: "Iron Rod", structureName: "Constructor", time: 2.5 },
	{ inputItems: { "Copper Ingot": 1 }, outputItem: "Copper Wire", structureName: "Constructor", time: 2 },
	{ inputItems: { "Steel Ingot": 2 }, outputItem: "Steel Frame", structureName: "Constructor", time: 3 },
	{ inputItems: { Silicon: 1 }, outputItem: "Glass Panel", structureName: "Constructor", time: 3 },

	// --- Assembler ---
	{
		inputItems: { "Copper Wire": 2, Silicon: 1 },
		outputItem: "Circuit Board",
		structureName: "Assembler",
		time: 3.5,
	},
	{ inputItems: { "Iron Rod": 2, "Copper Wire": 1 }, outputItem: "Motor", structureName: "Assembler", time: 4 },
	{
		inputItems: { "Copper Wire": 1, Silicon: 1, Coal: 1 },
		outputItem: "Battery",
		structureName: "Assembler",
		time: 4.5,
	},
	{
		inputItems: { "Circuit Board": 1, "Steel Frame": 1 },
		outputItem: "Control Unit",
		structureName: "Assembler",
		time: 5,
	},
];
