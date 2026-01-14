import { TutorialStepDefinition } from "./types";

export const TUTORIAL: TutorialStepDefinition[] = [
	{
		type: "Build",
		description: `Open the build menu with the hammer tool. Select the <stroke color="rgb(75, 108, 255)" thickness=".3"><font color="rgb(176,208,255)">Conveyor</font></stroke> by double-clicking on it. Click and drag to place it over the highlighted area.`,
		structuresData: [
			{ name: "Conveyor", cf: new CFrame(-22, 2.25, -82, -1, 0, 0, 0, 1, 0, 0, 0, -1) },
			{ name: "Conveyor", cf: new CFrame(-18, 2.25, -78, 0, 0, -1, 0, 1, 0, 1, 0, 0) },
			{ name: "Conveyor", cf: new CFrame(-14, 2.25, -78, 0, 0, -1, 0, 1, 0, 1, 0, 0) },
			{
				name: "Conveyor",
				cf: new CFrame(-22, 2.25, -90, -1, 0, -0, 0, 1, 0, 0, 0, -1),
			},
			{
				name: "Conveyor",
				cf: new CFrame(-22, 2.25, -94, -1, 0, -0, 0, 1, 0, 0, 0, -1),
			},

			{
				name: "Conveyor",
				cf: new CFrame(-22, 2.25, -86, -1, 0, -0, 0, 1, 0, 0, 0, -1),
			},
			{ name: "Left Turn Conveyor", cf: new CFrame(-22, 2.25, -78, 0, 0, -1, 0, 1, 0, 1, 0, 0) },
		],
	},

	{
		type: "Build",
		description: `From the Production tab, select the <stroke color="rgb(75, 108, 255)" thickness=".3"><font color="rgb(176,208,255)">Miner</font></stroke> and place it on the highlighted area.`,
		structuresData: [
			{
				name: "Miner",
				cf: new CFrame(-22, 2.25, -110, -1, 0, -0, 0, 1, 0, 0, 0, -1),
			},
		],
	},

	{
		type: "SetAttribute",
		description: `Equip the <stroke color="rgb(75, 108, 255)" thickness=".3"><font color="rgb(176,208,255)">info</font></stroke> tool, the first tool of your toolbar, select the Miner, and choose a resource you'd like to extract by double-clicking on it.`,
		structureName: "Miner",
		attributeName: "Recipe",
	},
	{
		type: "Build",
		description: `From the Power tab, place a <stroke color="rgb(75, 108, 255)" thickness=".3"><font color="rgb(176,208,255)">Hand-Crank</font></stroke> in the highlighted area. To produce power, hold and spin the crank handle with your mouse.`,
		structuresData: [
			{
				name: "Hand-Crank",
				cf: new CFrame(-10, 2.25, -102, 0, 0, 1, 0, 1, 0, -1, 0, 0),
			},
		],
	},

	{
		type: "Connect",
		description: `Use a <stroke color="rgb(75, 108, 255)" thickness=".3"><font color="rgb(176,208,255)">Power Line</font></stroke> to connect the Hand-Crank to the Miner.`,
		startStructureName: "Hand-Crank",
		endStructureName: "Miner",
	},

	{
		type: "Delete",
		description: `Use the <stroke color="rgb(255, 80, 80)" thickness=".3"><font color="rgb(255,120,120)">Delete</font></stroke> tool to remove the highlighted conveyors. You can click to do a single selection or hold and drag to select multiple.`,
		structuresData: [
			{
				name: "Conveyor",
				cf: new CFrame(-10, 2.25, -78, 0, 0, -1, 0, 1, 0, 1, 0, 0),
			},
			{
				name: "Conveyor",
				cf: new CFrame(-6, 2.25, -78, 0, 0, -1, 0, 1, 0, 1, 0, 0),
			},
		],
	},

	{
		type: "Build",
		description: `Place a <stroke color="rgb(75, 108, 255)" thickness=".3"><font color="rgb(176,208,255)">Smelter</font></stroke> in the highlighted area.`,
		structuresData: [
			{
				name: "Smelter",
				cf: new CFrame(-10, 2.25, -78, 0, 0, -1, 0, 1, 0, 1, 0, 0),
			},
		],
	},

	{
		type: "SetAttribute",
		description: `Select the Smelter with the info tool and choose a recipe to craft.`,
		structureName: "Smelter",
		attributeName: "Recipe",
	},

	{
		type: "Disconnect",
		description: `<stroke color="rgb(75, 108, 255)" thickness=".3"><font color="rgb(176,208,255)">Disconnect</font></stroke> the Hand-Crank from the Miner by using a power line.`,
		startStructureName: "Hand-Crank",
		endStructureName: "Miner",
	},

	{
		type: "Build",
		description: `Place a <stroke color="rgb(75, 108, 255)" thickness=".3"><font color="rgb(176,208,255)">Power Pole</font></stroke> in the highlighted area.`,
		structuresData: [
			{
				name: "Power Pole",
				cf: new CFrame(-10, 8.25, -90, -1, 0, -0, 0, 1, 0, 0, 0, -1),
			},
		],
	},

	{
		type: "Connect",
		description: `Connect the Hand-Crank to the Power Pole.`,
		startStructureName: "Hand-Crank",
		endStructureName: "Power Pole",
	},

	{
		type: "Connect",
		description: `Connect the Power Pole to the Miner.`,
		startStructureName: "Power Pole",
		endStructureName: "Miner",
	},

	{
		type: "Connect",
		description: `Connect the Power Pole to the Smelter.`,
		startStructureName: "Power Pole",
		endStructureName: "Smelter",
	},
];
