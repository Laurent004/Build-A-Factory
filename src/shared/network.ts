import { Networking } from "@flamework/networking";
import { PowerLineData, StructureData, StructureMovementData } from "./constants/structures";
import { Data } from "./types";

interface ClientToServerEvents {
	CreateGame: () => void;
	LoadGame: (id: string) => void;
	UnloadGame: () => void;
	DeleteGame: () => void;

	PlaceStructures: (structuresData: StructureData[], powerLinesData: PowerLineData[]) => void;
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
	CreatePowerLine: (startAttachment: Attachment, endAttachment: Attachment) => void;
	DestroyPowerLine: (startAttachment: Attachment, endAttachment: Attachment) => void;
	CreateBlueprint: (
		structuresModels: Model[],
		blueprintSubcategory: string,
		blueprintName: string,
		blueprintImage: string,
		blueprintDescription: string,
	) => void;
	EditBlueprint: (
		blueprintModel: Model,
		blueprintName: string,
		blueprintImage: string,
		blueprintDescription: string,
	) => void;
	DeleteBlueprint: (blueprintModel: Model) => void;
	SetFactoryName: (name: string) => void;
	SetSetting: <K extends keyof Data["settings"]>(settingName: K, settingValue: Data["settings"][K]) => void;
}

interface ServerToClientEvents {
	OnGamesUpdate: (games: Data["games"]) => void;
	OnDataInitialization: (data: Data) => void;
	OnPlotInitialization: (player: Player, plot: Model) => void;
	OnPlotReset: (player: Player) => void;
	OnStructuresPlacement: (player: Player, structuresModels: Model[]) => void;
	OnStructuresMovementStart: (player: Player, structuresModels: Model[]) => void;
	OnStructuresMovement: (player: Player, structuresModels: Model[]) => void;
	OnStructuresDestroying: (player: Player, structuresModels: Model[]) => void;
	OnStructuresItemsClear: (player: Player, structuresModels: Model[]) => void;
	OnPowerLineCreation: (player: Player, powerLine: RopeConstraint) => void;
	OnPowerLineDestroying: (player: Player, startAttachment: Attachment, endAttachment: Attachment) => void;
	OnBlueprintCreation: (
		blueprintModel: Model,
		blueprintSubcategory: string,
		blueprintImage: string,
		blueprintDescription: string,
	) => void;
	OnBlueprintEdit: (blueprintModel: Model, blueprintImage: string, blueprintDescription: string) => void;
	OnTutorialStepUpdate: (tutorialStep: number) => void;
	OnNotification: (notification: string) => void;
}

interface ClientToServerFunctions {}

interface ServerToClientFunctions {}

export const GlobalEvents = Networking.createEvent<ClientToServerEvents, ServerToClientEvents>();
export const GlobalFunctions = Networking.createFunction<ClientToServerFunctions, ServerToClientFunctions>();
