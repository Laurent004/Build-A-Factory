import { Context } from "client/constants/navigation";
import { InputContext } from "./input-context";
import { InputAction } from "./input-action";
import { StandardActionBuilder } from "@rbxts/mechanism";
import { Controller, OnStart } from "@flamework/core";
import { EventBus } from "client/event-bus";

@Controller({})
export default class EditToolInputContext extends InputContext implements OnStart {
	protected context: Context = "Edit";
	protected inputActions: InputAction[] = [
		{
			action: new StandardActionBuilder("MouseButton1"),
			activated: () => {
				EventBus.InputEvents.Tools.Edit.StartSelection.Fire();
			},
			deactivated: () => {
				EventBus.InputEvents.Tools.Edit.Select.Fire();
			},
		},

		{
			action: new StandardActionBuilder("R"),
			activated: () => {
				EventBus.InputEvents.Tools.Edit.Rotate.Fire();
			},
		},
		{
			action: new StandardActionBuilder("MouseButton1"),
			activated: () => {
				EventBus.InputEvents.Tools.Edit.Place.Fire();
			},
		},
	];

	onStart(): void {
		super.onStart();
	}
}
