import { Constructor } from "@flamework/core/out/utility";
import { RootState } from "..";
import { BaseComponent, Components } from "@flamework/components";
import { Dependency } from "@flamework/core";

export const selectContext = (state: RootState) => {
	return state.context.context;
};

export const selectContextOpen = (state: RootState) => {
	return state.context.contextOpen;
};

export const selectContextStructureModels = (state: RootState): Model[] => {
	return state.context.structuresModels;
};

export const selectContextStructureModelComponent =
	<T extends BaseComponent>(component: Constructor<T>) =>
	(state: RootState): T | undefined => {
		if (state.context.structuresModels.size() === 0) return undefined;
		return Dependency<Components>().getComponents(state.context.structuresModels[0], component)[0];
	};

export const selectContextStructureModelAttribute =
	(attributeName: string) =>
	(state: RootState): AttributeValue | undefined => {
		return state.context.structureAttributes[attributeName];
	};
