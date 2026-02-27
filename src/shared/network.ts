import { Networking } from "@flamework/networking";
import { PowerLineData, StructureData, StructureMovementData } from "./constants/structures";
import { Data } from "./types/data";

interface ClientToServerEvents {
	CreateGame: () => void;
	LoadGame: (id: string) => void;
	UnloadGame: () => void;
	DeleteGame: () => void;

	OnPlotInitialization: () => void;
	PurchaseExpansion: (expansion: Part) => void;
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
		blueprintName: string,
		blueprintDescription: string,
		blueprintSubcategory: string,
		blueprintImage: string,
	) => void;
	EditBlueprint: (
		blueprintModel: Model,
		blueprintName: string,
		blueprintDescription: string,
		blueprintImage: string,
	) => void;
	DeleteBlueprint: (blueprintModel: Model) => void;
	SetSetting: (settingName: string, settingValue: unknown) => void;
}

interface ServerToClientEvents {
	OnDataInitialization: (data: Data) => void;
	OnPlotInitialization: (player: Player, plot: Model) => void;
	OnPlotReset: (player: Player) => void;
	OnExpansionPurchase: (player: Player, expansion: Part) => void;
	OnStructuresPlacement: (player: Player, structuresModels: Model[]) => void;
	OnStructuresMovementStart: (player: Player, structuresModels: Model[]) => void;
	OnStructuresMovement: (player: Player, structuresModels: Model[]) => void;
	OnStructuresDestroying: (player: Player, structuresModels: Model[]) => void;
	OnStructuresItemsClear: (player: Player, structuresModels: Model[]) => void;
	OnBlueprintCreation: (
		blueprintModel: Model,
		blueprintDescription: string,
		blueprintSubcategory: string,
		blueprintImage: string,
	) => void;
	OnBlueprintEdit: (blueprintModel: Model, blueprintDescription: string, blueprintImage: string) => void;
	OnTutorialStepUpdate: (tutorialStep: number) => void;
	OnNotification: (notification: string, sound?: string) => void;
}

interface ClientToServerFunctions {}

interface ServerToClientFunctions {}

export const GlobalEvents = Networking.createEvent<ClientToServerEvents, ServerToClientEvents>();
export const GlobalFunctions = Networking.createFunction<ClientToServerFunctions, ServerToClientFunctions>();
