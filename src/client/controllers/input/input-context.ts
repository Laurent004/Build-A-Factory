import { Context } from "client/constants/navigation";
import { InputAction } from "./input-action";
import { OnStart } from "@flamework/core";
import { AxisActionBuilder, CompositeActionBuilder, InputManager, StandardActionBuilder } from "@rbxts/mechanism";
import { store } from "client/store";
import { selectContext } from "client/store/context";

export abstract class InputContext implements OnStart {
	private readonly inputManager = new InputManager();

	protected abstract context: Context;
	protected abstract inputActions: InputAction[];

	onStart(): void {
		this.initInputActions();
		store.subscribe(selectContext, (context) => {
			if (context === this.context) {
				this.bindAll();
			} else {
				this.unbindAll();
			}
		});
	}

	private initInputActions() {
		for (const inputAction of this.inputActions) {
			if (
				inputAction.action instanceof StandardActionBuilder ||
				inputAction.action instanceof CompositeActionBuilder
			) {
				inputAction.action.activated.Connect(() => {
					if (inputAction.guard && !inputAction.guard()) return;
					if (inputAction.activated !== undefined) inputAction.activated();
				});
				inputAction.action.deactivated.Connect(() => {
					if (inputAction.guard && !inputAction.guard()) return;
					if (inputAction.deactivated !== undefined) inputAction.deactivated();
				});
			} else if (inputAction.action instanceof AxisActionBuilder) {
				inputAction.action.updated.Connect(() => {
					if (inputAction.guard && !inputAction.guard()) return;
					if (inputAction.updated !== undefined) inputAction.updated();
				});
			}
		}
	}

	private bindAll(): void {
		for (const inputAction of this.inputActions) {
			this.inputManager.bind(inputAction.action);
		}
	}

	private unbindAll(): void {
		for (const inputAction of this.inputActions) {
			this.inputManager.unbind(inputAction.action);
		}
	}
}
