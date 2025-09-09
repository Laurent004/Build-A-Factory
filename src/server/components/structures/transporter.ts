import { BaseComponent, Component, Components } from "@flamework/components";
import { Dependency, OnStart } from "@flamework/core";
import OutputComponent from "../../../shared/components/structures/output";
import { StructureAttributes, StructureName, STRUCTURES } from "shared/constants/structures";
import InputComponent from "../../../shared/components/structures/input";
import { Object } from "@rbxts/luau-polyfill";
import { Events } from "server/network";
import GridService from "server/services/plot/grid-service";
import { Players } from "@rbxts/services";
import { Item, ItemName } from "shared/constants/items";

@Component({ tag: "Transporter" })
export default class TransporterComponent
	extends BaseComponent<Partial<StructureAttributes>, Model>
	implements OnStart
{
	protected readonly components = Dependency<Components>();
	protected inputComponent: InputComponent | undefined;
	protected outputComponent!: OutputComponent;
	protected readonly items: Item[] = [];
	protected readonly queuedItems: Item[] = [];

	constructor(private readonly gridService: GridService) {
		super();
	}

	onStart(): void {
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
		Events.StartStructuresMovement.connect((_, structuresModels) => {
			if (structuresModels.includes(this.instance)) {
				this.clearItems();
			}
		});

		Events.ClearStructuresItems.connect((_, structuresModels) => {
			if (structuresModels.includes(this.instance)) {
				this.clearItems();
			}
		});

		this.instance.Destroying.Connect(() => {
			this.clearItems();
		});
	}

	public addQueuedItem(item: Item) {
		this.queuedItems.push(item);
	}

	public inputItem(item: Item) {
		this.queuedItems.remove(this.queuedItems.indexOf(item));
		this.items.push(item);
	}

	public canInputItem(itemName: ItemName): boolean {
		return this.items.size() === 0 && this.queuedItems.size() === 0;
	}

	public outputItem(): Item | undefined {
		return this.items.pop();
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

	public getItem(): Item | undefined {
		if (this.items.size() <= 0) return undefined;
		return this.items[0];
	}

	protected clearItems() {
		const itemsToClear = [...this.queuedItems, ...this.items];
		for (const itemToClear of itemsToClear) {
			itemToClear.destroy();
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
		const cell = this.gridService.getCellInDirection(
			Players.GetPlayerByUserId(this.instance.Parent!.Parent?.GetAttribute("UserId") as number)!,
			originPosition,
			direction,
		);
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
		const cell = this.gridService.getCellInDirection(
			Players.GetPlayerByUserId(this.instance.Parent!.Parent?.GetAttribute("UserId") as number)!,
			originPosition,
			direction,
		);
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
