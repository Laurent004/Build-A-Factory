export type TechDefinition = ToolTechDefinition | StructureTechDefinition | UpgradeTechDefinition;

export interface BaseTechDefinition {
	type: "Tool" | "Structure" | "Upgrade";
	layout?: { column: number; row: number };
	image: string;
	description: string;
	requirements: string[];
	cost: {
		logisticsData: number;
		productionData: number;
		powerData: number;
	};
}

export interface ToolTechDefinition extends BaseTechDefinition {
	type: "Tool";
}

export interface StructureTechDefinition extends BaseTechDefinition {
	type: "Structure";
	structures: string[];
}

export interface UpgradeTechDefinition extends BaseTechDefinition {
	type: "Upgrade";
	upgradeName: string;
	upgradeIndex: number;
	upgradeValue: number;
}
