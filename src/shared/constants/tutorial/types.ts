export type TutorialStepDefinition =
	| BuildTutorialStepDefinition
	| DeleteTutorialStepDefinition
	| SetAttributeTutorialStepDefinition
	| ConnectTutorialStepDefinition
	| DisconnectTutorialStepDefinition;

export interface BaseTutorialStepDefinition {
	type: "Build" | "Delete" | "SetAttribute" | "Connect" | "Disconnect" | "Milestone";
	description: string;
}

export interface BuildTutorialStepDefinition extends BaseTutorialStepDefinition {
	type: "Build";
	structuresData: {
		name: string;
		cf: CFrame;
	}[];
}

export interface DeleteTutorialStepDefinition extends BaseTutorialStepDefinition {
	type: "Delete";
	structuresData: {
		name: string;
		cf: CFrame;
	}[];
}
export interface SetAttributeTutorialStepDefinition extends BaseTutorialStepDefinition {
	type: "SetAttribute";
	structureName: string;
	attributeName: string;
}

export interface ConnectTutorialStepDefinition extends BaseTutorialStepDefinition {
	type: "Connect";
	startStructureName: string;
	endStructureName: string;
}

export interface DisconnectTutorialStepDefinition extends BaseTutorialStepDefinition {
	type: "Disconnect";
	startStructureName: string;
	endStructureName: string;
}
