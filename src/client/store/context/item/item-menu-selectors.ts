import { RootState } from "client/store";

export const selectItemMenuItemName = (state: RootState): string => {
	return state.itemMenu.itemName;
};
