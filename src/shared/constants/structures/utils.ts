import { STRUCTURES } from "./structures";
import { StructureName } from "./types";

export function getStructureCellsNodesWorldPositions(structureModel: Model): Vector3[] {
	const structureGridPart = structureModel.WaitForChild("GridPart") as Part;
	const structureDefinition = STRUCTURES[structureModel.Name as StructureName];
	const structureCellsNodesLocalPositions = structureDefinition.nodes.cells;
	const structureCellsNodesWorldPositions: Vector3[] = [];
	for (const structureCellNodeLocalPosition of structureCellsNodesLocalPositions) {
		const structureOutputNodeWorldCF = structureGridPart.CFrame.PointToWorldSpace(structureCellNodeLocalPosition);
		structureCellsNodesWorldPositions.push(structureOutputNodeWorldCF);
	}
	return structureCellsNodesWorldPositions;
}

export function getStructureInputsNodesWorldCFs(structureModel: Model): CFrame[] {
	const structureGridPart = structureModel.WaitForChild("GridPart") as Part;
	const structureDefinition = STRUCTURES[structureModel.Name as StructureName];
	const structureInputsNodesLocalCFs = structureDefinition.nodes.inputs;
	const structureInputsNodesWorldCFs: CFrame[] = [];
	for (const structureInputNodeLocalCF of structureInputsNodesLocalCFs) {
		const structureInputNodeWorldCF = structureGridPart.CFrame.mul(structureInputNodeLocalCF);
		structureInputsNodesWorldCFs.push(structureInputNodeWorldCF);
	}
	return structureInputsNodesWorldCFs;
}

export function getStructureOutputsNodesWorldCFs(structureModel: Model): CFrame[] {
	const structureGridPart = structureModel.WaitForChild("GridPart") as Part;
	const structureDefinition = STRUCTURES[structureModel.Name as StructureName];
	const structureOutputsNodesLocalCFs = structureDefinition.nodes.outputs;
	const structureOutputsNodesWorldCFs: CFrame[] = [];
	for (const structureOutputNodeLocalCF of structureOutputsNodesLocalCFs) {
		const structureOutputNodeWorldCF = structureGridPart.CFrame.mul(structureOutputNodeLocalCF);
		structureOutputsNodesWorldCFs.push(structureOutputNodeWorldCF);
	}
	return structureOutputsNodesWorldCFs;
}

export function getStructureItemNodeWorldCF(structureModel: Model): CFrame {
	const structureGridPart = structureModel.WaitForChild("GridPart") as Part;
	const structureDefinition = STRUCTURES[structureModel.Name as StructureName];
	const structureItemNodeLocalCF = structureDefinition.nodes.item;
	const structureOutputNodeWorldCF = structureGridPart.CFrame.mul(structureItemNodeLocalCF);
	return structureOutputNodeWorldCF;
}
