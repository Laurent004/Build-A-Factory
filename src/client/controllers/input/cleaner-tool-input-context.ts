import { Context } from "client/constants/navigation";
import { InputContext } from "./input-context";
import { InputAction } from "./input-action";
import { StandardActionBuilder } from "@rbxts/mechanism";
import { EventBus } from "client/event-bus";
import { Controller, OnStart } from "@flamework/core";

@Controller({})
export default class CleanerToolInputContext extends InputContext implements OnStart {
	protected context: Context = "Cleaner";
	protected inputActions: InputAction[] = [
		{
			action: new StandardActionBuilder("MouseButton1"),
			activated: () => {
				EventBus.InputEvents.Tools.Cleaner.StartSelection.Fire();
			},
			deactivated: () => {
				EventBus.InputEvents.Tools.Cleaner.Select.Fire();
			},
		},
	];

	onStart(): void {
		super.onStart();
	}
}
