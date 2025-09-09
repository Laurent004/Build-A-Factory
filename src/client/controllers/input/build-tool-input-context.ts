import { InputContext } from "./input-context";
import { InputAction } from "./input-action";
import { StandardActionBuilder } from "@rbxts/mechanism";
import { Controller, OnStart } from "@flamework/core";
import { EventBus } from "client/event-bus";
import { Context } from "client/constants/navigation";

@Controller({})
export default class BuildToolInputContext extends InputContext implements OnStart {
	protected context: Context = "Build";
	protected inputActions: InputAction[] = [
		{
			action: new StandardActionBuilder("R"),
			activated: () => {
				EventBus.InputEvents.Tools.Build.Rotate.Fire();
			},
		},
		{
			action: new StandardActionBuilder("MouseButton1"),
			activated: () => {
				EventBus.InputEvents.Tools.Build.StartPlacement.Fire();
			},
			deactivated: () => {
				EventBus.InputEvents.Tools.Build.EndPlacement.Fire();
			},
		},

		{
			action: new StandardActionBuilder("X"),
			activated: () => {
				EventBus.InputEvents.Tools.Build.SwapStructure.Fire();
			},
		},
	];

	onStart(): void {
		super.onStart();
	}
}
