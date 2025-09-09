import { Context } from "client/constants/navigation";
import { InputContext } from "./input-context";
import { InputAction } from "./input-action";
import { StandardActionBuilder } from "@rbxts/mechanism";
import { Controller, OnStart } from "@flamework/core";
import { EventBus } from "client/event-bus";

@Controller({})
export default class CopyToolInputContext extends InputContext implements OnStart {
	protected context: Context = "Copy";
	protected inputActions: InputAction[] = [
		{
			action: new StandardActionBuilder("MouseButton1"),
			activated: () => {
				EventBus.InputEvents.Tools.Copy.StartSelection.Fire();
			},
			deactivated: () => {
				EventBus.InputEvents.Tools.Copy.Select.Fire();
			},
		},
		
		{
			action: new StandardActionBuilder("R"),
			activated: () => {
				EventBus.InputEvents.Tools.Copy.Rotate.Fire();
			},
		},
		{
			action: new StandardActionBuilder("MouseButton1"),
			activated: () => {
				EventBus.InputEvents.Tools.Copy.StartPlacement.Fire();
			},
			deactivated: () => {
				EventBus.InputEvents.Tools.Copy.EndPlacement.Fire();
			},
		},
	];

	onStart(): void {
		super.onStart();
	}
}
