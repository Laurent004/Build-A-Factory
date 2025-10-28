import { Component } from "@flamework/components";
import { STRUCTURES } from "shared/constants/structures";
import { Item } from "shared/constants/items";
import StructureComponent from "../structure";
import GridService from "server/services/plot/grid-service";
import TransportService from "server/services/plot/transport-service";
import { Events } from "server/network";
import Signal from "@rbxts/signal";

@Component({ tag: "Transporter" })
export default class TransporterComponent extends StructureComponent {
	protected readonly inputTransporters = new Set<TransporterComponent>();
	protected readonly outputTransporters = new Set<TransporterComponent>();
	protected readonly queuedItems: Item[] = [];
	protected readonly items: Item[] = [];

	public readonly OnInput = new Signal<(item: Item) => void>();
	public readonly OnOutput = new Signal<(item: Item) => void>();

	constructor(gridService: GridService, protected readonly transportService: TransportService) {
		super(gridService);
	}

	protected override initEvents(): void {
		super.initEvents();
		if (this.active) {
			this.initInputTransporters();
			this.initOutputTransporters();

			const connection = this.components.onComponentAdded<TransporterComponent>(() => {
				if (this.inputTransporters.size() < STRUCTURES[this.instance.Name].nodes.inputs.size()) {
					this.initInputTransporters();
				}
				if (this.outputTransporters.size() < STRUCTURES[this.instance.Name].nodes.outputs.size()) {
					this.initOutputTransporters();
				}
			});
			task.delay(0.02, () => {
				connection.Disconnect();
			});
		}

		Events.ClearStructuresItems.connect((_, structuresModels) => {
			if (structuresModels.includes(this.instance)) {
				this.clearItems();
			}
		});
	}

	protected onPlotInitialization(): void {
		super.onPlotInitialization();
		this.initInputTransporters();
		this.initOutputTransporters();
	}

	protected override onStructuresPlacement(): void {
		super.onStructuresPlacement();
		if (this.inputTransporters.size() < STRUCTURES[this.instance.Name].nodes.inputs.size()) {
			this.initInputTransporters();
		}
		if (this.outputTransporters.size() < STRUCTURES[this.instance.Name].nodes.outputs.size()) {
			this.initOutputTransporters();
		}
	}

	protected override onStructuresMovementStart(structuresModels: Model[]): void {
		super.onStructuresMovementStart(structuresModels);
		if (structuresModels.includes(this.instance)) {
			this.clearItems();
			this.inputTransporters.clear();
			this.outputTransporters.clear();
		} else {
			for (const inputTransporter of this.inputTransporters) {
				if (structuresModels.includes(inputTransporter.instance)) {
					this.inputTransporters.delete(inputTransporter);
				}
			}
			for (const outputTransporter of this.outputTransporters) {
				if (structuresModels.includes(outputTransporter.instance)) {
					this.outputTransporters.delete(outputTransporter);
				}
			}
		}
	}

	protected override onStructuresMovement(structuresModels: Model[]): void {
		super.onStructuresMovement(structuresModels);
		if (this.inputTransporters.size() < STRUCTURES[this.instance.Name].nodes.inputs.size()) {
			this.initInputTransporters();
		}
		if (this.outputTransporters.size() < STRUCTURES[this.instance.Name].nodes.outputs.size()) {
			this.initOutputTransporters();
		}
	}

	protected override onStructuresDestroying(structuresModels: Model[]): void {
		super.onStructuresDestroying(structuresModels);
		for (const inputTransporter of this.inputTransporters) {
			if (structuresModels.includes(inputTransporter.instance)) {
				this.inputTransporters.delete(inputTransporter);
			}
		}
		for (const outputTransporter of this.outputTransporters) {
			if (structuresModels.includes(outputTransporter.instance)) {
				this.outputTransporters.delete(outputTransporter);
			}
		}
	}

	protected override onDestroying(): void {
		super.onDestroying();
		this.clearItems();
		this.inputTransporters.clear();
		this.outputTransporters.clear();
	}

	protected initInputTransporters(): void {
		for (const inputNodeWorldCF of STRUCTURES[this.instance.Name].nodes.inputs.map((inputNodeLocalCF) =>
			this.instance.GetPivot().mul(inputNodeLocalCF),
		)) {
			const inputNodeWorldBackwardCell = this.gridService.getCellInDirection(
				this.player,
				inputNodeWorldCF.Position,
				inputNodeWorldCF.RightVector.mul(-1),
			);
			if (inputNodeWorldBackwardCell === undefined || inputNodeWorldBackwardCell.structureModel === undefined)
				continue;

			const transporterComponents = this.components.getComponents<TransporterComponent>(
				inputNodeWorldBackwardCell.structureModel,
			);
			if (transporterComponents.size() <= 0) continue;

			for (const outputNodeWorldCF of STRUCTURES[
				inputNodeWorldBackwardCell.structureModel.Name
			].nodes.outputs.map((outputNodeLocalCF) =>
				inputNodeWorldBackwardCell.structureModel!.GetPivot().mul(outputNodeLocalCF),
			)) {
				if (inputNodeWorldCF.FuzzyEq(outputNodeWorldCF, 0.1)) {
					this.inputTransporters.add(transporterComponents[0]);
					break;
				}
			}
		}
	}

	protected initOutputTransporters(): void {
		for (const outputNodeWorldCF of STRUCTURES[this.instance.Name].nodes.outputs.map((outputNodeLocalCF) =>
			this.instance.GetPivot().mul(outputNodeLocalCF),
		)) {
			const outputNodeWorldCell = this.gridService.getCellAtWorldPosition(
				this.player,
				outputNodeWorldCF.Position,
			);
			if (outputNodeWorldCell === undefined || outputNodeWorldCell.structureModel === undefined) continue;
			const transporterComponents = this.components.getComponents<TransporterComponent>(
				outputNodeWorldCell.structureModel,
			);
			if (transporterComponents.size() <= 0) continue;

			for (const inputNodeWorldCF of STRUCTURES[outputNodeWorldCell.structureModel.Name].nodes.inputs.map(
				(inputNodeLocalCF) => outputNodeWorldCell.structureModel!.GetPivot().mul(inputNodeLocalCF),
			)) {
				if (outputNodeWorldCF.FuzzyEq(inputNodeWorldCF, 0.1)) {
					this.outputTransporters.add(transporterComponents[0]);
					break;
				}
			}
		}
	}

	public getInputTransporters(): TransporterComponent[] {
		return [...this.inputTransporters];
	}

	public getOutputTransporter(): TransporterComponent | undefined {
		return this.outputTransporters.size() > 0 ? [...this.outputTransporters][0] : undefined;
	}

	public addQueuedItem(item: Item): void {
		this.queuedItems.push(item);
	}

	public inputItem(item: Item): void {
		this.queuedItems.remove(this.queuedItems.indexOf(item));
		this.items.push(item);
		this.OnInput.Fire(item);
	}

	public canInputItem(item: Item): boolean {
		return this.items.size() === 0 && this.queuedItems.size() === 0;
	}

	public outputItem(): Item | undefined {
		const item = this.items.shift();
		if (item !== undefined) {
			this.OnOutput.Fire(item);
		}
		return item;
	}

	public canOutputItem(): boolean {
		return this.items.size() > 0;
	}

	public getQueuedItems(): Item[] {
		return this.queuedItems;
	}

	public getItems(): Item[] {
		return this.items;
	}

	public getTransportDuration(): number {
		return 1 / (STRUCTURES[this.instance.Name].constants["TransportSpeed"] as number);
	}

	protected getTransporterInDirection(originPosition: Vector3, direction: Vector3): TransporterComponent | undefined {
		const cell = this.gridService.getCellInDirection(this.player, originPosition, direction);
		if (cell === undefined || cell.structureModel === undefined) return undefined;
		const transporterComponents = this.components.getComponents<TransporterComponent>(cell.structureModel);
		return transporterComponents.size() > 0 ? transporterComponents[0] : undefined;
	}

	protected clearItems(): void {
		for (const item of [...this.queuedItems, ...this.items]) {
			item.destroyed = true;
		}
		this.queuedItems.clear();
		this.items.clear();
	}
}
