export interface StructureDefinition {
	index: number | undefined;
	category: StructureCategory;
	subCategory: StructureSubCategory;
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

export const STRUCTURE_CATEGORIES = ["Logistics", "Production", "Power", "Blueprints"] as const;
export type StructureCategory = (typeof STRUCTURE_CATEGORIES)[number];
export const STRUCTURE_SUB_CATEGORIES = {
	Logistics: ["Conveyor Belts", "Pipelines", "Sorting", "Miscellaneous"],
	Production: ["Extractors", "Processors", "Manufacturers"],
	Power: ["Generators", "Power Poles"],
	Blueprints: [],
} as const satisfies Record<StructureCategory, string[]>;
export type StructureSubCategory = (typeof STRUCTURE_SUB_CATEGORIES)[StructureCategory][number];
export type StructureState = "No Connection" | "No Power" | "Standby" | "Working";
