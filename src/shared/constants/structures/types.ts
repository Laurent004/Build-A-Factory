export interface StructureDefinition {
	category: string;
	subcategory: string;
	index: number | undefined;
	image: string;
	description: string;
	cost: number;
	gamepass?: number;

	model: Model;
	tags: string[];
	constants: Record<string, AttributeValue>;
	attributes: Record<string, AttributeValue | undefined>;
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
		railway: Vector3[];
	};
	priority: number;
}

export const STRUCTURE_CATEGORIES: string[] = ["Logistics", "Production", "Power", "Blueprints"];
export const STRUCTURE_SUB_CATEGORIES: Record<string, string[]> = {
	Logistics: ["Conveyor Belts", "Pipelines", "Sorting", "Miscellaneous"],
	Production: ["Extractors", "Smelters", "Manufacturers"],
	Power: ["Generators", "Power Poles"],
	Blueprints: [],
};
