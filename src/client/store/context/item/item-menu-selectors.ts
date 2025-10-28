import { RootState } from "client/store";

export const selectItemMenuItemName = (state: RootState) => {
	return state.itemMenu.itemName;
};
