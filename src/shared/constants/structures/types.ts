import {  StructureAttributes } from "./attributes";
import { STRUCTURES } from "./structures";

export interface StructureDefinition {
	tag: string;
	attributes:Partial<StructureAttributes>

	index:number
	description:string;
	image:string;
	category: StructureCategory;
	subCategory: StructureSubCategory;
	
	model: Model;
	nodes:{
		cells:Vector3[];
		inputs:CFrame[]
		outputs:CFrame[];
		item:CFrame;
	}
}

export type StructureName=keyof typeof STRUCTURES
export const STRUCTURE_CATEGORIES = ["Transportation", "Production"] as const;
export type StructureCategory = typeof STRUCTURE_CATEGORIES[number];
export const STRUCTURE_SUB_CATEGORIES={
    "Transportation":["Logistics"],
    "Production":["Production"],
} as const satisfies Record<StructureCategory,string[]>
export type StructureSubCategory = typeof STRUCTURE_SUB_CATEGORIES[keyof typeof STRUCTURE_SUB_CATEGORIES][number]

export interface StructuresPlacementData{
	structureName:StructureName,
	targetCF:CFrame,
	structureAttributes:Record<string,AttributeValue>
}
export interface StructureMovementData{
	structureModel:Model,
	targetCF:CFrame
}
export interface StructureSaveData{
	name:StructureName,
	cfComponents:[number, number, number, number, number, number, number, number, number, number, number, number]
	attributes:Map<string,AttributeValue>
}

export type StructureState="Working" | "Standby" | "Disconnected" | "No Configured Recipe"

