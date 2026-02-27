import { BaseComponent, Component, Components } from "@flamework/components";
import Signal from "@rbxts/signal";
import GridService from "server/services/plot/grid";

@Component({})
export default class StructureComponent extends BaseComponent<{}, Model>  {
	protected player!: Player;
	protected active: boolean = false;
	protected state: string = "No Connection";
	public readonly onStateChanged = new Signal<(state: string) => void>();

	constructor(protected readonly components: Components, protected readonly gridService: GridService) {
		super();
	}


	public updateState(): void {}

	public getState(): string {
		return this.state;
	}

	public setState(state: string): void {}
}
