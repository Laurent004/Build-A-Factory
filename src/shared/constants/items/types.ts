export interface ItemDefintion {
	index: number;
	image: string;
	description: string;
	value: number;
	model: Model;
}

export interface ItemRecipe {
	inputItems: Partial<Record<string, number>>;
	outputItem: string;
	structureName: string;
	time: number;
}

export class Item {
	public readonly name: string;
	public destroyed: boolean = false;
	constructor(name: string) {
		this.name = name;
	}
}
