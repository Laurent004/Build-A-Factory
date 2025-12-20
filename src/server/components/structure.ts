import { BaseComponent, Component, Components } from "@flamework/components";
import { OnStart } from "@flamework/core";
import Signal from "@rbxts/signal";
import GridService from "server/services/plot/grid-service";
import { StructureState } from "shared/constants/structures";

@Component({})
export default class StructureComponent extends BaseComponent<{}, Model> implements OnStart {
	protected player!: Player;
	protected active: boolean = false;
	protected state: StructureState = "No Connection";
	public readonly onStateChanged = new Signal<(newState: StructureState) => void>();

	constructor(protected readonly components: Components, protected readonly gridService: GridService) {
		super();
	}

	onStart(): void {}

	protected initEvents(): void {}

	protected onPlotInitialization(): void {}

	protected onStructuresPlacement(structuresModels: Model[]): void {}

	protected onStructuresMovementStart(structuresModels: Model[]): void {}

	protected onStructuresMovement(structuresModels: Model[]): void {}

	protected onStructuresDestroying(structuresModels: Model[]): void {}

	public updateState(): void {}

	public getState(): StructureState {
		return this.state;
	}

	public setState(state: StructureState): void {}
}
