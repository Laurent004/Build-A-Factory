export const STRUCTURE_CATEGORIES: string[] = ["Logistics", "Production", "Power", "Blueprints"];
export const STRUCTURE_SUB_CATEGORIES: Record<string, string[]> = {
	Logistics: ["Conveyor Belts", "Pipelines", "Sorting", "Miscellaneous"],
	Production: ["Extractors", "Smelters", "Processors", "Manufacturers", "Miscellaneous"],
	Power: ["Renewables", "Non-Renewables", "Power Poles"],
	Blueprints: [],
};

export interface StructureDefinition {
	category: string;
	subcategory: string;
	index?: number;
	image: string;
	description: string;
	cost: number;
	gamepass?: number;

	tags: string[];
	constants: Record<string, unknown>;
	attributes: Record<string, AttributeValue>;
	maxElevation: number;
	nodes: {
		cells: Vector3[];
		inputs: {
			solids: Map<CFrame, boolean>;
			fluids: Map<CFrame, boolean>;
		};
		outputs: {
			solids: Map<CFrame, boolean>;
			fluids: Map<CFrame, boolean>;
		};
		connections: Map<CFrame, boolean>;
	};
	priority: number;
}
