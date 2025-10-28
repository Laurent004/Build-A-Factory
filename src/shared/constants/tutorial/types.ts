export interface BaseTutorialStep {
	type: "Build" | "Delete" | "SetAttribute" | "Connect" | "Disconnect" | "Milestone";
	description: string;
}

export type TutorialStep =
	| BuildTutorialStep
	| DeleteTutorialStep
	| SetAttributeTutorialStep
	| ConnectTutorialStep
	| DisconnectTutorialStep
	| MilestoneTutorialStep;

export interface BuildTutorialStep extends BaseTutorialStep {
	type: "Build";
	structuresData: {
		name: string;
		cf: CFrame;
	}[];
}

export interface DeleteTutorialStep extends BaseTutorialStep {
	type: "Delete";
	structuresData: {
		name: string;
		cf: CFrame;
	}[];
}
export interface SetAttributeTutorialStep extends BaseTutorialStep {
	type: "SetAttribute";
	structureName: string;
	attributeName: string;
}

export interface ConnectTutorialStep extends BaseTutorialStep {
	type: "Connect";
	startStructureName: string;
	endStructureName: string;
}

export interface DisconnectTutorialStep extends BaseTutorialStep {
	type: "Disconnect";
	startStructureName: string;
	endStructureName: string;
}

export interface MilestoneTutorialStep extends BaseTutorialStep {
	type: "Milestone";
	milestone: number;
}
