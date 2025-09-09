import { MergerInputDirection, SplitterOutputDirection } from "./attributes";
import { MODELS } from "shared/assets/models";
import { IMAGES } from "shared/assets/images";
import { StructureDefinition } from "./types";

export const STRUCTURES = {
	"Straight Conveyor": {
		tag: "Transporter",
		attributes: {
			transportSpeed: 5,
		},

		index:0,
		description:
			"Moves items in a straight line at a consistent speed. Ideal for linking machines and maintaining smooth item flow.",
		image: IMAGES.structures["Straight Conveyor"],

		category: "Transportation",
		subCategory: "Logistics",

		model: MODELS.structures.StraightConveyor,
		nodes:{
			cells:[new Vector3()],
			inputs:[new CFrame(0, 0, 0, 0, 1, 0, 0, 0, -1, -1, 0, 0)],
			outputs:[new CFrame(0, 0, -4, 0, 1, 0, 0, 0, -1, -1, 0, 0)],
			item:new CFrame()
		},
	},
	"Left Turn Conveyor": {
		tag: "Transporter",
		attributes: {
			transportSpeed:5,
		},

				index:1,
		description:
			"Redirects items 90 degrees to the left while maintaining transport speed. Useful for changing conveyor directions in tight spaces.",
		image: IMAGES.structures["Straight Conveyor"],

		category: "Transportation",
		subCategory: "Logistics",

		model: MODELS.structures.LeftTurnConveyor,
		nodes:{
			cells:[new Vector3()],
			inputs:[new CFrame(0, 0, 0, 1, 0, 0, 0, 0, -1, 0, 1, 0)],
			outputs:[new CFrame(0, 0, -4, 0, 1, 0, 0, 0, -1, -1, 0, 0)],
			item:new CFrame()
		}},

	"Right Turn Conveyor": {
		tag: "Transporter",
		attributes: {
			transportSpeed: 5,
		},

				index:2,
		description:
			"Redirects items 90 degrees to the right while maintaining transport speed. Useful for changing conveyor directions in tight spaces.",
		image: IMAGES.structures["Straight Conveyor"],

		category: "Transportation",
		subCategory: "Logistics",

		model: MODELS.structures.RightTurnConveyor,
		nodes:{
			cells:[new Vector3()],
			inputs:[new CFrame(0, 0, 0, -1, 0, -0, 0, 0, -1, 0, -1, -0)],
			outputs:[new CFrame(0,0, -4, 0, 1, 0, 0, 0, -1, -1, 0, 0)],
			item:new CFrame()
		},
	},
	Merger: {
		tag: "Merger",
		attributes: {
			transportSpeed: 5,
		},

		index:3,
		description:
			"Merges two conveyor lines into one, combining item streams efficiently. Essential for consolidating production lines.",
		image: IMAGES.structures["Straight Conveyor"],

		category: "Transportation",
		subCategory: "Logistics",

		model: MODELS.structures.Merger,
		nodes:{
			cells:[new Vector3()],
			inputs:[new CFrame(0, 0, 0, 0, 1, 0, 0, 0, -1, -1, 0, 0),new CFrame(0, 0, 0, 1, 0, 0, 0, 0, -1, 0, 1, 0 ),new CFrame(0, 0, 0, -1, 0, -0, 0, 0, -1, 0, -1, 0)],
			outputs:[new CFrame(0, 0, -4, 0, 1, 0, 0, 0, -1, -1, 0, 0)],
			item:new CFrame()
		},
	},

	Splitter: {
		tag: "Splitter",
		attributes: {
			transportSpeed: 5,
			[SplitterOutputDirection.Forward]: "Any",
			[SplitterOutputDirection.Left]: "Any",
			[SplitterOutputDirection.Right]: "Any",
		},

		index:4,
		description:
			"Divides an incoming item stream into multiple outputs based on configurable filters. Useful for distributing materials evenly or selectively.",
		image: IMAGES.structures["Straight Conveyor"],

		category: "Transportation",
		subCategory: "Logistics",

		model: MODELS.structures.Splitter,
		nodes:{
			cells:[new Vector3()],
			inputs:[new CFrame(0, 0, 0, 0, 1, 0, 0, 0, -1, -1, 0, 0)],
			outputs:[new CFrame(-4, 0, 0, -1, 0, -0, 0, 0, -1, 0, -1, 0),new CFrame(4, 0, 0, 1, 0, 0, 0, 0, -1, 0, 1, 0),new CFrame(0, 0, -4, 0, 1, 0, 0, 0, -1, -1, 0, 0)],
			item:new CFrame()
		},
	},
	"Storage Container": {
		tag: "StorageContainer",
		attributes: {
			transportSpeed: 5,
			storedItems:"",
			itemsSlots:21,
			itemsPerSlot:16,
		},

		index:5,
		description:
			"Contains stuff.",
		image: IMAGES.structures["Straight Conveyor"],

		category: "Transportation",
		subCategory: "Logistics",

		model: MODELS.structures.StorageContainer,
		nodes:{
			cells:[new Vector3(2, 0, 4),new Vector3(-2, 0, 0),new Vector3(-2, 0, -4),new Vector3(2, 0, -4),new Vector3(-2, 0, 4),new Vector3(2, 0, 0)],
			inputs:[new CFrame(2, 0, 4, 0, 1, 0, 0, 0, -1, -1, 0, 0)],
			outputs:[new CFrame(2, 0, -8, 0, 1, 0, 0, 0, -1, -1, 0, 0)],
			item:new CFrame(2, 0, 0, 0, 0, 1, 0, 1, 0, -1, 0, 0)
		},
	},
	Extractor: {
		tag: "Extractor",
		attributes: {
			selectedItem:undefined,
			transportSpeed: 5,
		},

		index:0,
		description:
			"Automated mining device that extracts raw resources from deposits at a steady rate. Essential for resource gathering.",
		image: IMAGES.structures["Straight Conveyor"],

		category: "Production",
		subCategory: "Production",

		model: MODELS.structures.Extractor,
		nodes:{
			cells:[new Vector3(0, 0, 2), new Vector3(0, 0, -2)],
			inputs:[],
			outputs:[new CFrame(0, 0, -6, 0, 1, 0, 0, 0, -1, -1, 0, 0 )],
			item:new CFrame()
		},
	},
	Smelter: {
		tag: "Manufacturer",
		attributes: {
			transportSpeed:5,
			selectedItem: undefined,
		},

		index:1,
		description:
			"Automated mining device that extracts raw resources from deposits at a steady rate. Essential for resource gathering.",
		image: IMAGES.structures["Straight Conveyor"],

		category: "Production",
		subCategory: "Production",

		model: MODELS.structures.Smelter,
		nodes:{
			cells:[new Vector3(0, 0, 2), new Vector3(0, 0, -2)],
			inputs:[new CFrame(0, 0, 2, 0, 1, 0, 0, 0, -1, -1, 0, 0)],
			outputs:[new CFrame(0, 0, -6, 0, 1, 0, 0, 0, -1, -1, 0, 0)],
			item:new CFrame()
		},

	},
	Assembler: {
		tag: "Manufacturer",
		attributes: {
			transportSpeed: 5,
			selectedItem:undefined,
		},

		index:2,
		description:
			"Automated mining device that extracts raw resources from deposits at a steady rate. Essential for resource gathering.",
		image: IMAGES.structures["Straight Conveyor"],

		category: "Production",
		subCategory: "Production",

		model: MODELS.structures.Assembler,
		nodes:{
			cells:[new Vector3(0, 0, 0),
			new Vector3(4, 0, 0),
			new Vector3(-4, 0, 0),
			new Vector3(0, 0, 4),
			new Vector3(0, 0, -4),
			new Vector3(4, 0, 4),
			new Vector3(-4, 0, 4),
			new Vector3(4, 0, -4),
			new Vector3(-4, 0, -4)],
			
			inputs:[new CFrame(-4, 0, 4, 0, 1, 0, 0, 0, -1, -1, 0, 0),new CFrame(4, 0, 4, 0, 1, 0, 0, 0, -1, -1, 0, 0)],
			outputs:[new CFrame(0, 0, -8, 0, 1, 0, 0, 0, -1, -1, 0, 0)],
			item:new CFrame()
		},
	},
} as const satisfies Record<string,StructureDefinition>
