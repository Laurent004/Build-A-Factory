import { Networking } from "@flamework/networking";
import { BlueprintData, PowerLineData, StructureData, StructureEditData } from "./constants/structures";
import { Data } from "./types/data";

interface ClientToServerEvents {
	CreateSave: () => void;
	LoadSave: (saveId: string) => void;
	UnloadSave: () => void;
	DeleteSave: () => void;
	PurchaseExpansion: (expansion: Part) => void;
	UnlockTech: (techName: string) => void;
	PlaceStructures: (structuresData: StructureData[], powerLinesData: PowerLineData[]) => void;
	StartStructuresEdit: (structuresModels: Model[]) => void;
	EditStructures: (structuresMovementData: StructureEditData[]) => void;
	CancelStructuresMovement: (structuresModels: Model[]) => void;
	ClearStructuresItems: (structuresModels: Model[]) => void;
	DestroyStructures: (structuresModels: Model[]) => void;
	SetStructuresAttribute: (
		structuresModels: Model[],
		attributeName: string,
		attributeValue: AttributeValue | undefined,
	) => void;
	ConnectPowerLine: (startAttachment: Attachment, endAttachment: Attachment) => void;
	CreateBlueprint: (
		structuresModels: Model[],
		blueprintName: string,
		blueprintDescription: string,
		blueprintSubcategory: string,
		blueprintImage: string,
	) => void;
	EditBlueprint: (
		blueprintId: string,
		blueprintName: string,
		blueprintDescription: string,
		blueprintImage: string,
	) => void;
	DeleteBlueprint: (blueprintId: string) => void;
	SetSetting: (settingName: string, settingValue: unknown) => void;
}

interface ServerToClientEvents {
	OnSavesUpdate: (saves: Data["saves"]) => void;
	OnStructuresEditStart: (player: Player, structuresModels: Model[]) => void;
	OnStructuresEdit: (player: Player, structuresModels: Model[]) => void;
	OnStructuresItemsClear: (player: Player, structuresModels: Model[]) => void;
	OnBlueprintsUpdate: (blueprintsData: BlueprintData[]) => void;
	OnNotification: (notification: string, sound?: string) => void;
}

interface ClientToServerFunctions {
	RequestData: () => Data;
}

interface ServerToClientFunctions {}

export const GlobalEvents = Networking.createEvent<ClientToServerEvents, ServerToClientEvents>();
export const GlobalFunctions = Networking.createFunction<ClientToServerFunctions, ServerToClientFunctions>();
