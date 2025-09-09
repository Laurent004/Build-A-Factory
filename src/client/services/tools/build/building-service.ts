import { StructureDefinition } from "shared/constants/structures";

export default interface BuildingService {
	enter(structureDefinition: StructureDefinition): void;
	exit(): void;

	rotate(): void;
	startPlacement(): void;
}
