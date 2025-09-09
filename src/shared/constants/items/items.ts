import { IMAGES } from "shared/assets/images";
import { ItemDefintion, ItemRecipe } from "./types";
import { MODELS } from "shared/assets/models";

export const ITEMS= {
	"Iron Ore":{
		index:0,
		description: "Raw material used to make iron ingots.",
		image:IMAGES.items["Iron Ore"],
		model: MODELS.items.IronOre,
	},
	"Copper Ore":{
		index:1,
		description: "Smelted iron used in crafting and building.",
		image:IMAGES.items["Copper Ore"],
		model: MODELS.items.CopperOre,
	},
	"Iron Ingot":{
		index:2,
		description: "Smelted iron used in crafting and building.",
		image:IMAGES.items["Iron Ingot"],
		model: MODELS.items.IronIngot,
	},
	"Copper Ingot":{
		index:3,
		description: "Smelted iron used in crafting and building.",
		image:IMAGES.items["Copper Ingot"],
		model: MODELS.items.CopperIngot,
	},
	"Iron Plate":{
		index:4,
		description: "Smelted iron used in crafting and building.",
		image:IMAGES.items["Iron Plate"],
		model: MODELS.items.IronPlate,
	},
 } as const satisfies Record<string,ItemDefintion>

export const ITEM_RECIPES=[
{
		inputItems:{},
		outputItem:"Iron Ore",
		structureName:"Extractor",
		time:.5,
	},

	{
		inputItems:{},
		outputItem:"Copper Ore",
		structureName:"Extractor",
		time:.5,
	},

	{
		inputItems:{
			"Iron Ore":1,
		},
		outputItem:"Iron Ingot",
		structureName:"Smelter",
		time:.5,
	},
	{
		inputItems:{
			"Copper Ore":1,
		},
		outputItem:"Copper Ingot",
		structureName:"Smelter",
		time:.5,
	},
	{
		inputItems:{
			"Iron Ingot":1,
			"Copper Ingot":1,
		},
		outputItem:"Iron Plate",
		structureName:"Assembler",
		time:.85,
	},

] as const satisfies readonly ItemRecipe[]