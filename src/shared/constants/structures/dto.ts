export interface StructureData {
	name: string;
	cf: [number, number, number, number, number, number, number, number, number, number, number, number];
	attributes: Map<string, AttributeValue>;
	children: unknown;
}

export interface StructureMovementData {
	model: Model;
	cf: CFrame;
}

export interface PowerLineData {
	startAttachmentCF: [number, number, number, number, number, number, number, number, number, number, number, number];
	endAttachmentCF: [number, number, number, number, number, number, number, number, number, number, number, number];
}

export interface BlueprintData {
	id: string;
	subcategory: string;
	name: string;
	image: string;
	description: string;
	structures: StructureData[];
	powerLines: PowerLineData[];
}
