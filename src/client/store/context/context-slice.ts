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
		if (context === s.context) {
			return { ...s, context: undefined, contextOpen: undefined };
		}
		return { ...s, context: context, contextOpen: true };
	},

	setContextOpen: (s, open: boolean) => {
		if (s.context !== undefined) {
			return { ...s, contextOpen: open };
		}
		return { ...s, contextOpen: undefined };
	},
});
