import { Object } from "@rbxts/luau-polyfill";
import { ITEM_RECIPES, ITEMS } from "shared/constants/items";

export interface SplitterAttributes {
	[SplitterOutputDirection.Left]: SplitterOutputFilter;
	[SplitterOutputDirection.Forward]: SplitterOutputFilter;
	[SplitterOutputDirection.Right]: SplitterOutputFilter;
}

export type SplitterOutputFilter = typeof splitterOutputFilters[number];
export const splitterOutputFilters = [
	"None",
	"Any",
	"Overflow",
	"Any (undefined)",
	...Object.entries(ITEMS)
		.sort(
			([itemAName, itemADefinition], [itemBName, itemBDefinition]) =>
				itemADefinition.index < itemBDefinition.index,
		)
		.map(([itemName, _]) => itemName),
] as const;

export enum SplitterOutputDirection {
	Left = "LeftOutput",
	Forward = "ForwardOutput",
	Right = "RightOutput",
}
export const splitterOutputDirections = [
	SplitterOutputDirection.Left,
	SplitterOutputDirection.Forward,
	SplitterOutputDirection.Right,
] as const;
