export type TechNodeDefinition = StructureTechNodeDefinition | UpgradeTechNodeDefinition;

export interface BaseTechNodeDefinition {
	type: "Structure" | "Upgrade";
	layout: { row: number; column: number };
	image: string;
	description: string;
	requirements: string[];
	cost: {
		logisticData?: number;
		productionData?: number;
		powerData?: number;
	};
}

export interface StructureTechNodeDefinition extends BaseTechNodeDefinition {
	type: "Structure";
	structures: string[];
}

export interface UpgradeTechNodeDefinition extends BaseTechNodeDefinition {
	type: "Upgrade";
	upgrade: string;
	upgradeValue: number;
}
