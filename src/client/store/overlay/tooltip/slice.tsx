import { createProducer } from "@rbxts/reflex";

export interface TooltipState {
	tips: string[];
}

const intialState: TooltipState = {
	tips: [],
};

export const tooltipSlice = createProducer(intialState, {
	setTips: (s, tips: string[]): TooltipState => ({
		...s,
		tips: tips,
	}),
});
