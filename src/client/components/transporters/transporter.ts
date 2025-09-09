import { BaseComponent, Component, Components } from "@flamework/components";
import { Dependency, OnStart } from "@flamework/core";
import { StructureAttributes, StructureName, STRUCTURES } from "shared/constants/structures";
import { Object } from "@rbxts/luau-polyfill";
import GridService from "client/services/plot/grid-service";
import { Events } from "client/network";
import { Players } from "@rbxts/services";
import InputComponent from "shared/components/structures/input";
import OutputComponent from "shared/components/structures/output";
import { ItemName } from "shared/constants/items";
import Signal from "@rbxts/signal";
@Component({ tag: "Transporter" })
export default class TransporterComponent
	extends BaseComponent<Partial<StructureAttributes>, Model>
	implements OnStart
{
	protected readonly components = Dependency<Components>();
	private readonly gridService = GridService.getInst();
	private player!: Player;
	protected inputComponent: InputComponent | undefined;
	protected outputComponent!: OutputComponent;
	protected readonly items: Model[] = [];
	protected readonly queuedItems: Model[] = [];

	public readonly OnInput = new Signal();
	public readonly OnOutput = new Signal();

	onStart(): void {
		this.player = Players.GetPlayerByUserId(this.instance.Parent!.Parent!.GetAttribute("UserId") as number)!;
		this.initComponents();
		this.initEvents();
	}

	protected initComponents() {
		if (STRUCTURES[this.instance.Name as StructureName].nodes.inputs.size() > 0) {
			this.inputComponent = this.components.addComponent(this.instance, InputComponent);
		}
		this.outputComponent = this.components.addComponent(this.instance, OutputComponent);
	}

	protected initEvents() {
		Events.OnStructuresMovementStart.connect((structuresModels) => {
			if (structuresModels.includes(this.instance)) {
				this.clearItems();
			}
		});
		Events.OnStructuresItemsClear.connect((structuresModels) => {
			if (structuresModels.includes(this.instance)) {
				this.clearItems();
			}
		});
		this.instance.Destroying.Connect(() => {
			this.clearItems();
		});
	}

	public addQueuedItem(item: Model) {
		this.queuedItems.push(item);
	}

	public inputItem(item: Model) {
		this.queuedItems.remove(this.queuedItems.indexOf(item));
		this.items.push(item);
		this.OnInput.Fire();
	}

	public canInputItem(itemName: ItemName): boolean {
		return this.items.size() === 0 && this.queuedItems.size() === 0;
	}

	public outputItem(): Model | undefined {
		const item = this.items.pop();
		if (item !== undefined) {
			this.OnOutput.Fire();
		}
		return item;
	}

	public canOutputItem(): boolean {
		return this.items.size() > 0;
	}

	public getInputsTransporters(): TransporterComponent[] {
		return this.getConnectedOutputsTransporters();
	}

	public getOutputTransporter(): TransporterComponent | undefined {
		const connectedInputsTransporters = this.getConnectedInputsTransporters();
		return connectedInputsTransporters.size() > 0 ? connectedInputsTransporters[0] : undefined;
	}

	public getItem(): Model | undefined {
		if (this.items.size() <= 0) return undefined;
		return this.items[0];
	}

	protected clearItems() {
		for (const itemToClear of [...this.queuedItems, ...this.items]) {
			itemToClear.Destroy();
		}
		this.queuedItems.clear();
		this.items.clear();
	}

	protected getConnectedInputsTransporters() {
		const connectedInputComponents = Object.values(this.outputComponent.getConnectedInputs());
		return connectedInputComponents.map((inputComponent) => {
			return this.components.getComponents<TransporterComponent>(inputComponent.instance)[0];
		});
	}

	protected getConnectedOutputsTransporters() {
		const connectedOutputComponents = Object.values(this.inputComponent!.getConnectedOutputs());
		return connectedOutputComponents.map((outputComponent) => {
			return this.components.getComponents<TransporterComponent>(outputComponent.instance)[0];
		});
	}

	protected getConnectedOutputTransporterInDirection(originPosition: Vector3, direction: Vector3) {
		const cell = this.gridService.getCellInDirection(this.player, originPosition, direction);
		if (cell === undefined || cell.structureModel === undefined) return undefined;
		const structureModel = cell.structureModel;
		const outputComponent = this.components.getComponent<OutputComponent>(structureModel);
		if (outputComponent === undefined) return undefined;
		const connectedOutputsComponents = Object.values(this.inputComponent!.getConnectedOutputs());
		if (connectedOutputsComponents.includes(outputComponent))
			return this.components.getComponents<TransporterComponent>(structureModel)[0];
		return undefined;
	}

	protected getConnectedInputTransporterInDirection(originPosition: Vector3, direction: Vector3) {
		const cell = this.gridService.getCellInDirection(this.player, originPosition, direction);
		if (cell === undefined || cell.structureModel === undefined) return undefined;
		const structureModel = cell.structureModel;
		const inputComponent = this.components.getComponent<InputComponent>(structureModel);
		if (inputComponent === undefined) return undefined;
		const connectedInputsComponents = Object.values(this.outputComponent!.getConnectedInputs());
		if (connectedInputsComponents.includes(inputComponent))
			return this.components.getComponents<TransporterComponent>(structureModel)[0];
		return undefined;
	}
}
