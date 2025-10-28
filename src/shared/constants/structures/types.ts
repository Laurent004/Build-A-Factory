export interface StructureDefinition {
	index:number|undefined;
	category: StructureCategory;
	subCategory: StructureSubCategory;
	image:string;
	description:string;
	price:number
	gamepass?:number;

	model: Model;
	tags: string[];
	constants:Record<string,AttributeValue>
	attributes:Record<string,AttributeValue|undefined>

	nodes:{
		cells:Vector3[]
		inputs:CFrame[]
		outputs:CFrame[]
	}

	selectionPriority:number
}

export const STRUCTURE_CATEGORIES = ["Transportation","Production","Power","Blueprint"] as const;
export type StructureCategory = typeof STRUCTURE_CATEGORIES[number];
export const STRUCTURE_SUB_CATEGORIES={
    "Transportation":["Conveyor Belts","Logistics","Storage","Miscellaneous"],
    "Production":["Extractors","Processors","Manufacturers"],
	"Power":["Power Poles","Generators"],
	"Blueprint":[],
} as const satisfies Record<StructureCategory,string[]>
export type StructureSubCategory = typeof STRUCTURE_SUB_CATEGORIES[StructureCategory][number]
export type StructureState="No Connection" | "No Power" | "Standby" | "Working" 
