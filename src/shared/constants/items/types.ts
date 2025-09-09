import { StructureName } from "../structures";
import { ITEMS } from "./items";

export interface ItemDefintion {
	index: number;
	description: string;
	image: string;
	model: Model;
}

export type ItemName = keyof typeof ITEMS;

export interface ItemRecipe {
	inputItems: Partial<Record<ItemName, number>>;
	outputItem: ItemName;
	structureName: StructureName;
	time: number;
}

export class Item {
	private readonly name: ItemName;
	private destroyed: boolean = false;

	constructor(name: ItemName) {
		this.name = name;
	}

	public destroy(): void {
		this.destroyed = true;
	}

	public getName(): ItemName {
		return this.name;
	}

	public isDestroyed(): boolean {
		return this.destroyed;
	}
}
