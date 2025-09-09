import { AxisActionBuilder, CompositeActionBuilder, StandardActionBuilder } from "@rbxts/mechanism";

export interface InputAction {
	action: StandardActionBuilder | AxisActionBuilder | CompositeActionBuilder;
	guard?: () => boolean;
	activated?: () => void;
	updated?: () => void;
	deactivated?: () => void;
}
