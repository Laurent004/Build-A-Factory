import { Networking } from "@flamework/networking";
import { GridData } from "./grid";
import { StructureMovementData, StructuresPlacementData } from "./constants/structures";

interface ClientToServerEvents {
	PlaceStructures: (structuresPlacementData: StructuresPlacementData[]) => void;
	StartStructuresMovement: (structuresModels: Model[]) => void;
	CancelStructuresMovement: (structuresModels: Model[]) => void;
	MoveStructures: (structuresMovementData: StructureMovementData[]) => void;
	ClearStructuresItems: (structuresModels: Model[]) => void;
	DestroyStructures: (structuresModels: Model[]) => void;

	SetStructureAttribute: (
		structureModel: Model,
		attributeName: string,
		attributeValue: AttributeValue | undefined,
	) => void;
}

interface ServerToClientEvents {
	OnPlotInitialization: (player: Player, plot: Model, gridData: GridData) => void;
	OnStructuresPlacement: (player: Player, structuresModels: Model[]) => void;
	OnStructuresMovementStart: (structuresModels: Model[]) => void;
	OnStructuresMovement: (player: Player, structuresModels: Model[]) => void;
	OnStructuresItemsClear: (structuresModels: Model[]) => void;
	OnStructuresDestroying: (structuresModels: Model[]) => void;

	//SetIndicatorLightColor: (indicatorLight: Part, rgb: Vector3int16) => void;
}

interface ClientToServerFunctions {}

interface ServerToClientFunctions {}

export const GlobalEvents = Networking.createEvent<ClientToServerEvents, ServerToClientEvents>();
export const GlobalFunctions = Networking.createFunction<ClientToServerFunctions, ServerToClientFunctions>();
