import { TutorialStepDefinition } from "./types";

export const TUTORIAL: TutorialStepDefinition[] = [
	{
		type: "Edit",
		description: "",
		structureData: {
			name: "Miner",
			position: new Vector3(-38.0, 2.25, -110.0),
			rotation: new CFrame(0, 0, 0, -1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, -1.0),
		},
	},

	{
		type: "Build",
		description: "",
		structuresData: [
			{
				name: "Conveyor",
				position: new Vector3(-10.0, 2.25, -78.0),
				rotation: new CFrame(0, 0, 0, 0.0, 0.0, -1.0, 0.0, 1.0, 0.0, 1.0, 0.0, 0.0),
			},
			{
				name: "Conveyor",
				position: new Vector3(-14.0, 2.25, -78.0),
				rotation: new CFrame(0, 0, 0, 0.0, 0.0, -1.0, 0.0, 1.0, 0.0, 1.0, 0.0, 0.0),
			},
			{
				name: "Conveyor",
				position: new Vector3(-18.0, 2.25, -78.0),
				rotation: new CFrame(0, 0, 0, 0.0, 0.0, -1.0, 0.0, 1.0, 0.0, 1.0, 0.0, 0.0),
			},
			{
				name: "Conveyor",
				position: new Vector3(-22.0, 2.25, -78.0),
				rotation: new CFrame(0, 0, 0, 0.0, 0.0, -1.0, 0.0, 1.0, 0.0, 1.0, 0.0, 0.0),
			},
			{
				name: "Conveyor",
				position: new Vector3(-26.0, 2.25, -78.0),
				rotation: new CFrame(0, 0, 0, 0.0, 0.0, -1.0, 0.0, 1.0, 0.0, 1.0, 0.0, 0.0),
			},
			{
				name: "Conveyor",
				position: new Vector3(-38.0, 2.25, -102.0),
				rotation: new CFrame(0, 0, 0, -1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, -1.0),
			},
			{
				name: "Conveyor",
				position: new Vector3(-38.0, 2.25, -98.0),
				rotation: new CFrame(0, 0, 0, -1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, -1.0),
			},
			{
				name: "Conveyor",
				position: new Vector3(-38.0, 2.25, -94.0),
				rotation: new CFrame(0, 0, 0, -1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, -1.0),
			},
			{
				name: "Conveyor",
				position: new Vector3(-38.0, 2.25, -90.0),
				rotation: new CFrame(0, 0, 0, -1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, -1.0),
			},
			{
				name: "Conveyor",
				position: new Vector3(-38.0, 2.25, -86.0),
				rotation: new CFrame(0, 0, 0, -1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, -1.0),
			},
			{
				name: "Conveyor",
				position: new Vector3(-38.0, 2.25, -82.0),
				rotation: new CFrame(0, 0, 0, -1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, -1.0),
			},
			{
				name: "Left Turn Conveyor",
				position: new Vector3(-38.0, 2.25, -78.0),
				rotation: new CFrame(0, 0, 0, 0.0, 0.0, -1.0, 0.0, 1.0, 0.0, 1.0, 0.0, 0.0),
			},
			{
				name: "Conveyor",
				position: new Vector3(-34.0, 2.25, -78.0),
				rotation: new CFrame(0, 0, 0, 0.0, 0.0, -1.0, 0.0, 1.0, 0.0, 1.0, 0.0, 0.0),
			},
			{
				name: "Conveyor",
				position: new Vector3(-30.0, 2.25, -78.0),
				rotation: new CFrame(0, 0, 0, 0.0, 0.0, -1.0, 0.0, 1.0, 0.0, 1.0, 0.0, 0.0),
			},
		],
	},

	{
		type: "Build",
		description: "",
		structuresData: [
			{
				name: "Hand-Crank",
				position: new Vector3(-22.0, 2.25, -98.0),
				rotation: new CFrame(0, 0, 0, 0.0, 0.0, -1.0, 0.0, 1.0, 0.0, 1.0, 0.0, 0.0),
			},
		],
	},

	{
		type: "Connect",
		description: "",
		structuresNames: ["Hand-Crank", "Miner"],
	},

	{
		type: "SetAttribute",
		description: "",
		structureName: "Miner",
		attributeName: "Recipe",
		attributeValue: "Iron Ore",
	},

	{
		type: "Delivery",
		description: "",
	},

	{
		type: "Delete",
		description: "",
		structuresData: [
			{
				name: "Conveyor",
				position: new Vector3(-10.0, 2.25, -78.0),
			},
			{
				name: "Conveyor",
				position: new Vector3(-14.0, 2.25, -78.0),
			},
		],
	},

	{
		type: "Build",
		description: "",
		structuresData: [
			{
				name: "Smelter",
				position: new Vector3(-14.0, 2.25, -78.0),
				rotation: new CFrame(0, 0, 0, 0.0, 0.0, -1.0, 0.0, 1.0, 0.0, 1.0, 0.0, 0.0),
			},
		],
	},

	{
		type: "Build",
		description: "",
		structuresData: [
			{
				name: "Power Pole",
				position: new Vector3(-14.0, 8.25, -98.0),
			},
		],
	},

	{
		type: "Connect",
		description: "",
		structuresNames: ["Hand-Crank", "Power Pole"],
	},

	{
		type: "Connect",
		description: "",
		structuresNames: ["Power Pole", "Miner"],
	},

	{
		type: "Connect",
		description: "",
		structuresNames: ["Power Pole", "Smelter"],
	},

	{
		type: "SetAttribute",
		description: "",
		structureName: "Smelter",
		attributeName: "Recipe",
		attributeValue: "Iron Ingot",
	},

	{
		type: "Delivery",
		description: "",
	},
];
