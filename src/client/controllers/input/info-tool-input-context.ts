import { Context } from "client/constants/navigation";
import { InputContext } from "./input-context";
import { InputAction } from "./input-action";
import { StandardActionBuilder } from "@rbxts/mechanism";
import { Controller, OnStart } from "@flamework/core";
import { EventBus } from "client/event-bus";

@Controller({})
export default class InfoToolInputContext extends InputContext implements OnStart {
	protected context: Context = "Info";
	protected inputActions: InputAction[] = [
		{
			action: new StandardActionBuilder("MouseButton1"),
			activated: () => {
				EventBus.InputEvents.Tools.Info.Select.Fire();
			},
		},
	];

	onStart(): void {
		super.onStart();
	}
}
