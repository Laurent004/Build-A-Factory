import { Controller, OnInit } from "@flamework/core";
import { BaseAction, InputManager, StandardActionBuilder } from "@rbxts/mechanism";
import { store } from "client/hooks/store";
import { selectContext } from "client/hooks/store/context";

@Controller()
export default abstract class ToolController implements OnInit {
	protected active: boolean = false;
	protected abstract readonly context: string;
	private static readonly inputManager = new InputManager();
	protected abstract readonly inputActions: {
		action: BaseAction;
		activated?: () => void;
		deactivated?: () => void;
	}[];

	onInit(): void | Promise<void> {
		this.initInputActions();
		this.initEvents();
	}

	protected initEvents(): void {
		store.subscribe(selectContext, (context, previousContext) => {
			if (context === this.context) {
				for (const inputAction of this.inputActions) {
					ToolController.inputManager.bind(inputAction.action);
				}
				this.enter();
			} else if (previousContext === this.context) {
				for (const inputAction of this.inputActions) {
					ToolController.inputManager.unbind(inputAction.action);
				}
				this.exit();
			}
		});
	}

	private initInputActions(): void {
		for (const inputAction of this.inputActions) {
			if (inputAction.action instanceof StandardActionBuilder) {
				inputAction.action.activated.Connect(() => {
					inputAction.activated !== undefined ? inputAction.activated() : undefined;
				});
				inputAction.action.deactivated.Connect(() => {
					inputAction.deactivated !== undefined ? inputAction.deactivated() : undefined;
				});
			}
		}
	}

	protected enter(): void {
		this.active = true;
	}

	protected exit(): void {
		this.active = false;
	}
}
