import React from "@rbxts/react";
import { ContextMenu } from "../menu";
import { ItemInformation } from "./item-information";
import { ItemRecipes } from "./item-recipes";
import { Frame } from "client/ui/core/frame";

import { ITEMS } from "shared/constants/items";
import { colors } from "client/constants/colors";
import { ItemButtons } from "./item-buttons";
import { Object } from "@rbxts/luau-polyfill";

export function ItemMenu() {
	return (
		<ContextMenu
			context="Items"
			openPosition={new UDim2(0.5, 0, 0.5, 0)}
			closedPosition={new UDim2(0.5, 0, 0.66, 0)}
			openSize={new UDim2(0.473, 0, 0.707, 0)}
		>
		

			<ItemButtons></ItemButtons>
			<ItemInformation></ItemInformation>
			{Object.keys(ITEMS).map((itemName) => (
				<ItemRecipes itemName={itemName}></ItemRecipes>
			))}
		</ContextMenu>
	);
}
