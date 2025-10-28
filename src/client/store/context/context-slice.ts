import { createProducer } from "@rbxts/reflex";
import { Context } from "client/constants/navigation";

export interface ContextState {
	readonly context: Context | undefined;
	readonly contextOpen: boolean | undefined;
}

const initialState: ContextState = {
	context: undefined,
	contextOpen: undefined,
};

export const contextSlice = createProducer(initialState, {
	setContext: (s, context: Context | undefined) => {
		return context === s.context
			? { ...s, context: undefined, contextOpen: undefined }
			: { ...s, context: context, contextOpen: true };
	},

	setContextOpen: (s, open: boolean) => {
		return { ...s, contextOpen: open };
	},
});
