export interface StructuresPlacementData {
	structureName: string;
	targetCFs: Map<string, CFrame>;
	structureAttributes: Map<string, AttributeValue>;
}

export interface StructureMovementData {
	structureModel: Model;
	targetCF: CFrame;
}

export interface StructureData {
	name: string;
	cfsComponents: Map<
		string,
		[number, number, number, number, number, number, number, number, number, number, number, number]
	>;
	attributes: Map<string, AttributeValue>;
}

export interface PowerLineData {
	startPowerAttachmentCfComponents: [
		number,
		number,
		number,
		number,
		number,
		number,
		number,
		number,
		number,
		number,
		number,
		number,
	];
	endPowerAttachmentCfComponents: [
		number,
		number,
		number,
		number,
		number,
		number,
		number,
		number,
		number,
		number,
		number,
		number,
	];
}

export interface BlueprintStructureData {
	name: string;
	cfsComponents: Map<
		string,
		[number, number, number, number, number, number, number, number, number, number, number, number]
	>;
	attributes: Map<string, AttributeValue>;
	isPrimary: boolean;
}

export interface BlueprintData {
	id: string;
	name: string;
	description: string;
	subcategory: string;
	structuresData: BlueprintStructureData[];
	powerLinesData: PowerLineData[];
}
