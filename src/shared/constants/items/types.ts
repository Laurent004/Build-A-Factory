import { Workspace } from "@rbxts/services";
import { ITEMS } from "./definitions";

export interface ItemDefintion {
	index: number;
	image: string;
	description: string;
	energy: number;
	value: {
		cash: number;
		logisticData?: number;
		productionData?: number;
		powerData?: number;
	};
	model: Model | undefined;
}

export interface ItemRecipe {
	index: number;
	inputItems: Record<string, number>;
	outputItems: Record<string, number>;
	structureName: string;
	time: number;
}

export class Solid {
	public readonly name: string;
	public readonly model: Model | undefined;
	public destroyed: boolean = false;
	constructor(name: string, model?: boolean) {
		this.name = name;
		if (model) {
			this.model = ITEMS[name].model!.Clone();
			this.model.Parent = Workspace;
		}
	}
}
