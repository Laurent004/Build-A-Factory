import { OnInit } from "@flamework/core";
import { Context } from "client/constants/navigation";
import { store } from "client/store";
import { selectContext } from "client/store/context";

export abstract class ToolController implements OnInit {
	protected abstract context: Context;

	onInit(): void {
		store.subscribe(selectContext, (context) => {
			if (context !== this.context) {
				this.exit();
			}
		});
	}
	protected exit(): void {}
}
