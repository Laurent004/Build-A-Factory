import { MilestoneData } from "shared/constants/milestones";
import { BlueprintData, PowerLineData, StructureData } from "shared/constants/structures";

export interface DataTemplate {
	structuresData: StructureData[];
	powerLinesData: PowerLineData[];
	blueprintsData: BlueprintData[];
	milestoneData: MilestoneData;

	tutorialStep: number;
	cash: number;
}

export const DATA_TEMPLATE: DataTemplate = {
	structuresData: [
		{
			name: "Straight Conveyor",
			cfsComponents: new Map([["Straight Conveyor", [74, 2, -70, -1, 0, 0, 0, 1, 0, 0, 0, -1]]]),
			attributes: new Map(),
		},
		{
			name: "Straight Conveyor",
			cfsComponents: new Map([["Straight Conveyor", [74, 2, -66, -1, 0, 0, 0, 1, 0, 0, 0, -1]]]),
			attributes: new Map(),
		},
		{
			name: "Straight Conveyor",
			cfsComponents: new Map([["Straight Conveyor", [58, 2, -46, 0, 0, 1, 0, 1, 0, -1, 0, 0]]]),
			attributes: new Map(),
		},

		{
			name: "Straight Conveyor",
			cfsComponents: new Map([["Straight Conveyor", [62, 2, -46, 0, 0, 1, 0, 1, 0, -1, 0, 0]]]),
			attributes: new Map(),
		},

		{
			name: "Delivery Dock",
			cfsComponents: new Map([["Delivery Dock", [46, 2, -46, -1, 0, 0, 0, 1, 0, 0, 0, -1]]]),
			attributes: new Map(),
		},
	],
	powerLinesData: [],
	blueprintsData: [],
	milestoneData: {
		milestone: 0,
		deliveredItems: {},
	},

	tutorialStep: 0,
	cash: 500,
};
