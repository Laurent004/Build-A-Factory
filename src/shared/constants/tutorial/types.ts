export type TutorialStepDefinition =
	| BuildTutorialStepDefinition
	| EditTutorialStepDefinition
	| DeleteTutorialStepDefinition
	| SetAttributeTutorialStepDefinition
	| ConnectTutorialStepDefinition
	| DeliveryTutorialStepDefinition;

export interface BaseTutorialStepDefinition {
	type: "Build" | "Edit" | "Delete" | "SetAttribute" | "Connect" | "Delivery";
	description: string;
}

export interface BuildTutorialStepDefinition extends BaseTutorialStepDefinition {
	type: "Build";
	structuresData: {
		name: string;
		position: Vector3;
		rotation?: CFrame;
	}[];
}

export interface EditTutorialStepDefinition extends BaseTutorialStepDefinition {
	type: "Edit";
	structureData: {
		name: string;
		position: Vector3;
		rotation?: CFrame;
	};
}

export interface DeleteTutorialStepDefinition extends BaseTutorialStepDefinition {
	type: "Delete";
	structuresData: {
		name: string;
		position: Vector3;
	}[];
}

export interface SetAttributeTutorialStepDefinition extends BaseTutorialStepDefinition {
	type: "SetAttribute";
	structureName: string;
	attributeName: string;
	attributeValue: AttributeValue | undefined;
}

export interface ConnectTutorialStepDefinition extends BaseTutorialStepDefinition {
	type: "Connect";
	structuresNames: [string, string];
}

export interface DeliveryTutorialStepDefinition extends BaseTutorialStepDefinition {
	type: "Delivery";
}
