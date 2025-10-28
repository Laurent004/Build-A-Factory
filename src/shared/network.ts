import { Networking } from "@flamework/networking";
import { GridData } from "./grid";
import { PowerLineData, StructureMovementData, StructuresPlacementData } from "./constants/structures";
import { MilestoneData } from "./constants/milestones";

interface ClientToServerEvents {
	OnPlotInitialization: () => void;
	PlaceStructures: (structuresPlacementData: StructuresPlacementData[], powerLinesData: PowerLineData[]) => void;
	StartStructuresMovement: (structuresModels: Model[]) => void;
	MoveStructures: (structuresMovementData: StructureMovementData[]) => void;
	CancelStructuresMovement: (structuresModels: Model[]) => void;
	DestroyStructures: (structuresModels: Model[]) => void;
	ClearStructuresItems: (structuresModels: Model[]) => void;

	SetStructuresAttribute: (
		structuresModels: Model[],
		attributeName: string,
		attributeValue: AttributeValue | undefined,
	) => void;

	CreatePowerLine: (startPowerAttachment: Attachment, endPowerAttachment: Attachment) => void;
	DestroyPowerLine: (startPowerAttachment: Attachment, endPowerAttachment: Attachment) => void;

	CreateBlueprint: (
		blueprintName: string,
		blueprintDescription: string,
		blueprintSubcategory: string,
		structuresModels: Model[],
	) => void;
	EditBlueprint: (blueprintModel: Model, blueprintName: string, blueprintDescription: string) => void;
	DeleteBlueprint: (blueprintModel: Model) => void;

	UnlockMilestone: (milestone: number) => void;
}

interface ServerToClientEvents {
	OnPlotInitialization: (player: Player, plot: Model, gridData: GridData) => void;
	OnStructuresPlacement: (player: Player, structuresModels: Model[]) => void;
	OnStructuresMovementStart: (player: Player, structuresModels: Model[]) => void;
	OnStructuresMovement: (player: Player, structuresModels: Model[]) => void;
	OnStructuresDestroying: (player: Player, structuresModels: Model[]) => void;
	OnStructuresItemsClear: (structuresModels: Model[]) => void;

	OnPowerLineCreation: (startPowerAttachment: Attachment, endPowerAttachment: Attachment) => void;
	OnPowerLineDestroying: (startPowerAttachment: Attachment, endPowerAttachment: Attachment) => void;

	OnBlueprintCreation: (blueprintModel: Model, blueprintDescription: string, blueprintSubcategory: string) => void;
	OnBlueprintEdit: (blueprintModel: Model, blueprintDescription: string) => void;

	OnTutorialStepUpdate: (tutorialStep: number) => void;
	OnMilestoneDataUpdate: (milestoneData: MilestoneData) => void;
}

interface ClientToServerFunctions {}

interface ServerToClientFunctions {}

export const GlobalEvents = Networking.createEvent<ClientToServerEvents, ServerToClientEvents>();
export const GlobalFunctions = Networking.createFunction<ClientToServerFunctions, ServerToClientFunctions>();
