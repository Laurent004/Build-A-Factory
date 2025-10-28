import { BaseAction, InputManager, StandardActionBuilder } from "@rbxts/mechanism";
import { Context } from "client/constants/navigation";
import { store } from "client/store";
import { selectContext } from "client/store/context";

export default abstract class ToolController {
	protected abstract readonly context: Context;
	private static readonly inputManager = new InputManager();
	protected abstract readonly inputActions: {
		action: BaseAction;
		activated?: () => void;
		deactivated?: () => void;
	}[];

	protected onInit(): void | Promise<void> {
		this.initInputActions();
		store.subscribe(selectContext, (context, previousContext) => {
			if (context === this.context) {
				this.bindInputActions();
				this.enter();
			} else if (previousContext === this.context) {
				this.unbindInputActions();
				this.exit();
			}
		});
	}

	private initInputActions(): void {
		for (const inputAction of this.inputActions) {
			if (inputAction.action instanceof StandardActionBuilder) {
				inputAction.action.activated.Connect(() => {
					inputAction.activated ? inputAction.activated() : undefined;
				});
				inputAction.action.deactivated.Connect(() => {
					inputAction.deactivated ? inputAction.deactivated() : undefined;
				});
			}
		}
	}

	private bindInputActions(): void {
		for (const inputAction of this.inputActions) {
			ToolController.inputManager.bind(inputAction.action);
		}
	}

	private unbindInputActions(): void {
		for (const inputAction of this.inputActions) {
			ToolController.inputManager.unbind(inputAction.action);
		}
	}

	protected enter(): void {}

	protected exit(): void {}
}
