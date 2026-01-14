import { RootState } from "..";
import { BaseComponent, Components } from "@flamework/components";
import { AbstractConstructorRef } from "@flamework/components/out/utility";
import { Dependency } from "@flamework/core";
import { STRUCTURES } from "shared/constants/structures";

export const selectContext = (state: RootState): string | undefined => {
	return state.context.context;
};

export const selectContextOpen = (state: RootState): boolean | undefined => {
	return state.context.isContextOpen;
};

export const selectContextStructureModels = (state: RootState): Model[] => {
	return state.context.structuresModels;
};

export const selectContextStructureComponents =
	<T extends BaseComponent>(component: AbstractConstructorRef<T>) =>
	(state: RootState): T[] => {
		if (state.context.structuresModels.size() === 0) return [];
		const components = Dependency<Components>();
		return [state.context.structuresModels[0], ...state.context.structuresModels[0].GetDescendants()]
			.filter((instance): instance is Model => instance.IsA("Model") && instance.Name in STRUCTURES)
			.mapFiltered((structureModel) => components.getComponents(structureModel, component)[0]);
	};

export const selectContextStructureAttribute =
	(attributeName: string) =>
	(state: RootState): AttributeValue | undefined => {
		return state.context.structureAttributes[attributeName];
	};
