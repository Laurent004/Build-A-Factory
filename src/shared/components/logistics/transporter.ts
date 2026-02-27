import { Component } from "@flamework/components";
import { STRUCTURES } from "shared/constants/structures";
import Signal from "@rbxts/signal";
import { Object } from "@rbxts/luau-polyfill";
import { Solid } from "shared/constants/items";
import StructureComponent from "../structure";
import TransportService from "shared/services/plot/transport";
import { EventBus } from "shared/event-bus";
import { OnStart } from "@flamework/core";
import PoolService from "shared/services/pool";

@Component({ tag: "Transporter" })
export default class TransporterComponent extends StructureComponent implements OnStart {
	protected readonly poolService = PoolService.getInst();
	protected readonly transportService = TransportService.getInst();
	public readonly fluidCapacity: number =
		(STRUCTURES[this.instance.Name].constants["FluidCapacity"] as number | undefined) ?? math.huge;

	protected readonly inputTransporters = new Set<TransporterComponent>();
	protected readonly outputTransporters = new Map<TransporterComponent, "Solid" | "Fluid">();
	public readonly queuedSolids: Solid[] = [];
	protected readonly solids: Solid[] = [];
	protected readonly fluids = new Map<string, number>();
	public readonly OnInput = new Signal<(item: Solid | string) => void>();
	public readonly OnOutput = new Signal<(item: Solid | string) => void>();

	onStart(): void {
		super.onStart();
		this.initTransporters();
	}

	protected override initEvents(): void {
		super.initEvents();
		for (const object of [
			EventBus.OnStructuresItemsClear.Connect((player, structuresModels) => {
				if (player !== this.player || !structuresModels.includes(this.instance)) return;
				this.clearItems();
			}),
			this.OnInput,
			this.OnOutput,
		]) {
			this.janitor.Add(object);
		}
	}

	protected override onActiveChanged(active: boolean): void {
		super.onActiveChanged(active);
		if (!this.active) return;
		this.transportService.attemptTransport(this);
	}

	protected override onEditStart(): void {
		super.onEditStart();
		for (const inputTransporter of this.inputTransporters) {
			inputTransporter.removeOutputTransporter(this);
		}
		for (const [outputTransporter] of this.outputTransporters) {
			outputTransporter.removeInputTransporter(this);
		}
		this.inputTransporters.clear();
		this.outputTransporters.clear();
		this.clearItems();
	}

	protected override onEdit(): void {
		super.onEdit();
		this.initTransporters();
	}

	protected override onDestroying(): void {
		super.onDestroying();
		for (const inputTransporter of this.inputTransporters) {
			inputTransporter.removeOutputTransporter(this);
		}
		for (const [outputTransporter] of this.outputTransporters) {
			outputTransporter.removeInputTransporter(this);
		}
		this.inputTransporters.clear();
		this.outputTransporters.clear();
		this.clearItems();
	}

	private initTransporters(): void {
		if (
			this.inputTransporters.size() <
			STRUCTURES[this.instance.Name].nodes.inputs.solids.size() +
				STRUCTURES[this.instance.Name].nodes.inputs.fluids.size()
		) {
			this.initInputTransporters();
		}
		if (
			this.outputTransporters.size() <
			STRUCTURES[this.instance.Name].nodes.outputs.solids.size() +
				STRUCTURES[this.instance.Name].nodes.outputs.fluids.size()
		) {
			this.initOutputTransporters();
		}
		if (
			this.inputTransporters.size() < STRUCTURES[this.instance.Name].nodes.connections.size() ||
			this.outputTransporters.size() < STRUCTURES[this.instance.Name].nodes.connections.size()
		) {
			this.initConnectionTransporters();
		}
	}

	private initInputTransporters(): void {
		for (const [inputNodeWorldCF, world] of Object.entries(STRUCTURES[this.instance.Name].nodes.inputs.solids).map(
			([inputNodeLocalCF, world]): [CFrame, boolean] => [this.instance.GetPivot().mul(inputNodeLocalCF), world],
		)) {
			if (world) {
				const inputNodeBackwardCell = this.gridService.getCellInDirection(
					this.player,
					inputNodeWorldCF.Position,
					inputNodeWorldCF.RightVector.mul(-1),
				);
				if (
					inputNodeBackwardCell?.structureModel === undefined ||
					!Object.entries(STRUCTURES[inputNodeBackwardCell.structureModel.Name].nodes.outputs.solids)
						.mapFiltered(([outputNodeLocalCF, world]) =>
							world ? inputNodeBackwardCell.structureModel!.GetPivot().mul(outputNodeLocalCF) : undefined,
						)
						.some(
							(outputNodeWorldCF) =>
								outputNodeWorldCF.Position.FuzzyEq(inputNodeWorldCF.Position, 0.01) &&
								outputNodeWorldCF.RightVector.FuzzyEq(inputNodeWorldCF.RightVector, 0.01),
						)
				)
					continue;
				let transporterComponent: TransporterComponent | undefined;
				while (transporterComponent === undefined) {
					transporterComponent = this.components.getComponents<TransporterComponent>(
						inputNodeBackwardCell.structureModel,
					)[0];
					task.wait();
				}
				this.inputTransporters.add(transporterComponent);
				transporterComponent.addOutputTransporter(this, "Solid");
			} else {
				const structureModel = this.instance.Parent!.GetChildren().find(
					(instance): instance is Model =>
						instance.IsA("Model") &&
						instance.Name in STRUCTURES &&
						instance !== this.instance &&
						Object.entries(STRUCTURES[instance.Name].nodes.outputs.solids)
							.mapFiltered(([outputNodeLocalCF, world]) =>
								world ? undefined : instance.GetPivot().mul(outputNodeLocalCF),
							)
							.some(
								(outputNodeWorldCF) =>
									outputNodeWorldCF.Position.FuzzyEq(inputNodeWorldCF.Position, 0.01) &&
									outputNodeWorldCF.RightVector.FuzzyEq(inputNodeWorldCF.RightVector, 0.01),
							),
				);
				if (structureModel === undefined) continue;
				let transporterComponent: TransporterComponent | undefined;
				while (transporterComponent === undefined) {
					transporterComponent = this.components.getComponents<TransporterComponent>(structureModel)[0];
					task.wait();
				}
				this.inputTransporters.add(transporterComponent);
				transporterComponent.addOutputTransporter(this, "Solid");
			}
		}

		for (const [inputNodeWorldCF, world] of Object.entries(STRUCTURES[this.instance.Name].nodes.inputs.fluids).map(
			([inputNodeLocalCF, world]): [CFrame, boolean] => [this.instance.GetPivot().mul(inputNodeLocalCF), world],
		)) {
			if (world) {
				const inputNodeBackwardCell = this.gridService.getCellInDirection(
					this.player,
					inputNodeWorldCF.Position,
					inputNodeWorldCF.RightVector.mul(-1),
				);
				if (
					inputNodeBackwardCell?.structureModel === undefined ||
					![
						...Object.entries(
							STRUCTURES[inputNodeBackwardCell.structureModel.Name].nodes.outputs.fluids,
						).mapFiltered(([outputNodeLocalCF, world]) => (world ? outputNodeLocalCF : undefined)),
						...Object.entries(
							STRUCTURES[inputNodeBackwardCell.structureModel.Name].nodes.connections,
						).mapFiltered(([connectionNodeLocalCF, world]) => (world ? connectionNodeLocalCF : undefined)),
					]
						.map((nodeLocalCF) => inputNodeBackwardCell.structureModel!.GetPivot().mul(nodeLocalCF))
						.some(
							(nodeWorldCF) =>
								nodeWorldCF.Position.FuzzyEq(inputNodeWorldCF.Position, 0.01) &&
								nodeWorldCF.RightVector.FuzzyEq(inputNodeWorldCF.RightVector, 0.01),
						)
				)
					continue;
				let transporterComponent: TransporterComponent | undefined;
				while (transporterComponent === undefined) {
					transporterComponent = this.components.getComponents<TransporterComponent>(
						inputNodeBackwardCell.structureModel,
					)[0];
					task.wait();
				}
				this.inputTransporters.add(transporterComponent);
				transporterComponent.addOutputTransporter(this, "Fluid");
			} else {
				const structureModel = this.instance
					.Parent!.GetChildren()
					.find(
						(instance): instance is Model =>
							instance.IsA("Model") &&
							instance.Name in STRUCTURES &&
							instance !== this.instance &&
							[
								...Object.entries(STRUCTURES[instance.Name].nodes.outputs.fluids),
								...Object.entries(STRUCTURES[instance.Name].nodes.connections),
							]
								.mapFiltered(([nodeLocalCF, world]) =>
									world ? undefined : instance.GetPivot().mul(nodeLocalCF),
								)
								.some(
									(nodeWorldCF) =>
										nodeWorldCF.Position.FuzzyEq(inputNodeWorldCF.Position, 0.01) &&
										nodeWorldCF.RightVector.FuzzyEq(inputNodeWorldCF.RightVector, 0.01),
								),
					);
				if (structureModel === undefined) continue;
				let transporterComponent: TransporterComponent | undefined;
				while (transporterComponent === undefined) {
					transporterComponent = this.components.getComponents<TransporterComponent>(structureModel)[0];
					task.wait();
				}
				this.inputTransporters.add(transporterComponent);
				transporterComponent.addOutputTransporter(this, "Fluid");
			}
		}
	}

	private initOutputTransporters(): void {
		for (const [outputNodeWorldCF, world] of Object.entries(
			STRUCTURES[this.instance.Name].nodes.outputs.solids,
		).map(([outputNodeLocalCF, world]): [CFrame, boolean] => [
			this.instance.GetPivot().mul(outputNodeLocalCF),
			world,
		])) {
			if (world) {
				const outputNodeWorldCell = this.gridService.getCellAtWorldPosition(
					this.player,
					outputNodeWorldCF.Position,
				);
				if (
					outputNodeWorldCell?.structureModel === undefined ||
					!Object.entries(STRUCTURES[outputNodeWorldCell.structureModel.Name].nodes.inputs.solids)
						.mapFiltered(([inputNodeLocalCF, world]) =>
							world ? outputNodeWorldCell.structureModel!.GetPivot().mul(inputNodeLocalCF) : undefined,
						)
						.some(
							(inputNodeWorldCF) =>
								inputNodeWorldCF.Position.FuzzyEq(outputNodeWorldCF.Position, 0.01) &&
								inputNodeWorldCF.RightVector.FuzzyEq(outputNodeWorldCF.RightVector, 0.01),
						)
				)
					continue;
				let transporterComponent: TransporterComponent | undefined;
				while (transporterComponent === undefined) {
					transporterComponent = this.components.getComponents<TransporterComponent>(
						outputNodeWorldCell.structureModel,
					)[0];
					task.wait();
				}
				this.outputTransporters.set(transporterComponent, "Solid");
				transporterComponent.addInputTransporter(this);
			} else {
				const structureModel = this.instance.Parent!.GetChildren().find(
					(instance): instance is Model =>
						instance.IsA("Model") &&
						instance.Name in STRUCTURES &&
						instance !== this.instance &&
						Object.entries(STRUCTURES[instance.Name].nodes.inputs.solids)
							.mapFiltered(([inputNodeLocalCF, world]) =>
								world ? undefined : instance.GetPivot().mul(inputNodeLocalCF),
							)
							.some(
								(inputNodeWorldCF) =>
									inputNodeWorldCF.Position.FuzzyEq(outputNodeWorldCF.Position, 0.01) &&
									inputNodeWorldCF.RightVector.FuzzyEq(outputNodeWorldCF.RightVector, 0.01),
							),
				);
				if (structureModel === undefined) continue;
				let transporterComponent: TransporterComponent | undefined;
				while (transporterComponent === undefined) {
					transporterComponent = this.components.getComponents<TransporterComponent>(structureModel)[0];
					task.wait();
				}
				this.outputTransporters.set(transporterComponent, "Solid");
				transporterComponent.addInputTransporter(this);
			}
		}

		for (const [outputNodeWorldCF, world] of Object.entries(
			STRUCTURES[this.instance.Name].nodes.outputs.fluids,
		).map(([outputNodeLocalCF, world]): [CFrame, boolean] => [
			this.instance.GetPivot().mul(outputNodeLocalCF),
			world,
		])) {
			const outputNodeWorldCell = this.gridService.getCellAtWorldPosition(
				this.player,
				outputNodeWorldCF.Position,
			);
			if (outputNodeWorldCell === undefined) continue;

			if (world) {
				const outputNodeWorldCell = this.gridService.getCellAtWorldPosition(
					this.player,
					outputNodeWorldCF.Position,
				);
				if (
					outputNodeWorldCell?.structureModel === undefined ||
					!(
						!Object.entries(STRUCTURES[outputNodeWorldCell.structureModel.Name].nodes.inputs.fluids)
							.mapFiltered(([inputNodeLocalCF, world]) =>
								world
									? outputNodeWorldCell.structureModel!.GetPivot().mul(inputNodeLocalCF)
									: undefined,
							)
							.some(
								(inputNodeWorldCF) =>
									inputNodeWorldCF.Position.FuzzyEq(outputNodeWorldCF.Position, 0.01) &&
									inputNodeWorldCF.RightVector.FuzzyEq(outputNodeWorldCF.RightVector, 0.01),
							) &&
						!Object.entries(STRUCTURES[outputNodeWorldCell.structureModel.Name].nodes.connections)
							.mapFiltered(([connectionNodeLocalCF, world]) =>
								world
									? outputNodeWorldCell.structureModel!.GetPivot().mul(connectionNodeLocalCF)
									: undefined,
							)
							.some(
								(connectionNodeWorldCF) =>
									this.gridService.getCellInDirection(
										this.player,
										connectionNodeWorldCF.Position,
										connectionNodeWorldCF.RightVector.mul(-1),
									) === outputNodeWorldCell &&
									connectionNodeWorldCF.RightVector.mul(-1).FuzzyEq(
										outputNodeWorldCF.RightVector,
										0.01,
									),
							)
					)
				)
					continue;
				let transporterComponent: TransporterComponent | undefined;
				while (transporterComponent === undefined) {
					transporterComponent = this.components.getComponents<TransporterComponent>(
						outputNodeWorldCell.structureModel,
					)[0];
					task.wait();
				}
				this.outputTransporters.set(transporterComponent, "Fluid");
				transporterComponent.addInputTransporter(this);
			} else {
				const structureModel = this.instance.Parent!.GetChildren().find(
					(instance): instance is Model =>
						instance.IsA("Model") &&
						instance.Name in STRUCTURES &&
						instance !== this.instance &&
						(Object.entries(STRUCTURES[instance.Name].nodes.inputs.fluids)
							.mapFiltered(([inputNodeLocalCF, world]) =>
								world ? undefined : instance.GetPivot().mul(inputNodeLocalCF),
							)
							.some(
								(inputNodeWorldCF) =>
									inputNodeWorldCF.Position.FuzzyEq(outputNodeWorldCF.Position, 0.01) &&
									inputNodeWorldCF.RightVector.FuzzyEq(outputNodeWorldCF.RightVector, 0.01),
							) ||
							Object.entries(STRUCTURES[instance.Name].nodes.connections)
								.mapFiltered(([connectionNodeLocalCF, world]) =>
									world ? undefined : instance.GetPivot().mul(connectionNodeLocalCF),
								)
								.some(
									(connectionNodeWorldCF) =>
										this.gridService.getCellInDirection(
											this.player,
											connectionNodeWorldCF.Position,
											connectionNodeWorldCF.RightVector.mul(-1),
										) === outputNodeWorldCell &&
										connectionNodeWorldCF.RightVector.mul(-1).FuzzyEq(
											outputNodeWorldCF.RightVector,
											0.01,
										),
								)),
				);
				if (structureModel === undefined) continue;
				let transporterComponent: TransporterComponent | undefined;
				while (transporterComponent === undefined) {
					transporterComponent = this.components.getComponents<TransporterComponent>(structureModel)[0];
					task.wait();
				}
				this.outputTransporters.set(transporterComponent, "Fluid");
				transporterComponent.addInputTransporter(this);
			}
		}
	}

	private initConnectionTransporters(): void {
		for (const [connectionNodeWorldCF, world] of Object.entries(
			STRUCTURES[this.instance.Name].nodes.connections,
		).map(([connectionNodeLocalCF, world]): [CFrame, boolean] => [
			this.instance.GetPivot().mul(connectionNodeLocalCF),
			world,
		])) {
			const connectionNodeWorldCell = this.gridService.getCellAtWorldPosition(
				this.player,
				connectionNodeWorldCF.Position,
			);
			if (connectionNodeWorldCell === undefined) continue;

			if (world) {
				if (connectionNodeWorldCell.structureModel === undefined) continue;
				const isConnectionTransporter = Object.entries(
					STRUCTURES[connectionNodeWorldCell.structureModel.Name].nodes.connections,
				)
					.mapFiltered(([connectionNodeLocalCF, world]) =>
						world
							? connectionNodeWorldCell.structureModel!.GetPivot().mul(connectionNodeLocalCF)
							: undefined,
					)
					.some(
						(otherConnectionNodeWorldCF) =>
							this.gridService.getCellInDirection(
								this.player,
								otherConnectionNodeWorldCF.Position,
								otherConnectionNodeWorldCF.RightVector.mul(-1),
							) === connectionNodeWorldCell &&
							otherConnectionNodeWorldCF.RightVector.mul(-1).FuzzyEq(
								connectionNodeWorldCF.RightVector,
								0.01,
							),
					);
				const isInputTransporter =
					Object.entries(STRUCTURES[connectionNodeWorldCell.structureModel.Name].nodes.outputs.fluids)
						.mapFiltered(([outputNodeLocalCF, world]) =>
							world
								? connectionNodeWorldCell.structureModel!.GetPivot().mul(outputNodeLocalCF)
								: undefined,
						)
						.some(
							(outputNodeWorldCF) =>
								this.gridService.getCellInDirection(
									this.player,
									outputNodeWorldCF.Position,
									outputNodeWorldCF.RightVector.mul(-1),
								) === connectionNodeWorldCell &&
								outputNodeWorldCF.RightVector.mul(-1).FuzzyEq(connectionNodeWorldCF.RightVector, 0.01),
						) || isConnectionTransporter;
				const isOutputTransporter =
					Object.entries(STRUCTURES[connectionNodeWorldCell.structureModel.Name].nodes.inputs.fluids)
						.mapFiltered(([inputNodeLocalCF, world]) =>
							world
								? connectionNodeWorldCell.structureModel!.GetPivot().mul(inputNodeLocalCF)
								: undefined,
						)
						.some(
							(inputNodeWorldCF) =>
								inputNodeWorldCF.Position.FuzzyEq(connectionNodeWorldCF.Position, 0.01) &&
								inputNodeWorldCF.RightVector.FuzzyEq(connectionNodeWorldCF.RightVector, 0.01),
						) || isConnectionTransporter;

				if (isInputTransporter || isOutputTransporter) {
					let transporterComponent: TransporterComponent | undefined;
					while (transporterComponent === undefined) {
						transporterComponent = this.components.getComponents<TransporterComponent>(
							connectionNodeWorldCell.structureModel,
						)[0];
						task.wait();
					}
					if (isInputTransporter) {
						this.inputTransporters.add(transporterComponent);
						transporterComponent.addOutputTransporter(this, "Fluid");
					}
					if (isOutputTransporter) {
						this.outputTransporters.set(transporterComponent, "Fluid");
						transporterComponent.addInputTransporter(this);
					}
				}
			} else {
				for (const structureModel of this.instance
					.Parent!.GetChildren()
					.filter(
						(instance): instance is Model =>
							instance.IsA("Model") && instance.Name in STRUCTURES && instance !== this.instance,
					)) {
					const isConnectionTransporter = Object.entries(STRUCTURES[structureModel.Name].nodes.connections)
						.mapFiltered(([connectionNodeLocalCF, world]) =>
							world ? undefined : structureModel.GetPivot().mul(connectionNodeLocalCF),
						)
						.some(
							(otherConnectionNodeWorldCF) =>
								this.gridService.getCellInDirection(
									this.player,
									otherConnectionNodeWorldCF.Position,
									otherConnectionNodeWorldCF.RightVector.mul(-1),
								) === connectionNodeWorldCell &&
								otherConnectionNodeWorldCF.RightVector.mul(-1).FuzzyEq(
									connectionNodeWorldCF.RightVector,
									0.01,
								),
						);
					const isInputTransporter =
						Object.entries(STRUCTURES[structureModel.Name].nodes.outputs.fluids)
							.mapFiltered(([outputNodeLocalCF, world]) =>
								world ? undefined : structureModel.GetPivot().mul(outputNodeLocalCF),
							)
							.some(
								(outputNodeWorldCF) =>
									this.gridService.getCellInDirection(
										this.player,
										outputNodeWorldCF.Position,
										outputNodeWorldCF.RightVector.mul(-1),
									) === connectionNodeWorldCell &&
									outputNodeWorldCF.RightVector.mul(-1).FuzzyEq(
										connectionNodeWorldCF.RightVector,
										0.01,
									),
							) || isConnectionTransporter;
					const isOutputTransporter =
						Object.entries(STRUCTURES[structureModel.Name].nodes.inputs.fluids)
							.mapFiltered(([inputNodeLocalCF, world]) =>
								world ? undefined : structureModel.GetPivot().mul(inputNodeLocalCF),
							)
							.some(
								(inputNodeWorldCF) =>
									inputNodeWorldCF.Position.FuzzyEq(connectionNodeWorldCF.Position, 0.01) &&
									inputNodeWorldCF.RightVector.FuzzyEq(connectionNodeWorldCF.RightVector, 0.01),
							) || isConnectionTransporter;

					if (isInputTransporter || isOutputTransporter) {
						let transporterComponent: TransporterComponent | undefined;
						while (transporterComponent === undefined) {
							transporterComponent =
								this.components.getComponents<TransporterComponent>(structureModel)[0];
							task.wait();
						}
						if (isInputTransporter) {
							this.inputTransporters.add(transporterComponent);
							transporterComponent.addOutputTransporter(this, "Fluid");
						}
						if (isOutputTransporter) {
							this.outputTransporters.set(transporterComponent, "Fluid");
							transporterComponent.addInputTransporter(this);
						}
						break;
					}
				}
			}
		}
	}

	public addInputTransporter(inputTransporter: TransporterComponent): void {
		this.inputTransporters.add(inputTransporter);
	}

	public addOutputTransporter(
		outputTransporter: TransporterComponent,
		outputTransporterType: "Solid" | "Fluid",
	): void {
		this.outputTransporters.set(outputTransporter, outputTransporterType);
		this.transportService.attemptTransport(this);
	}

	public removeInputTransporter(inputTransporter: TransporterComponent): void {
		this.inputTransporters.delete(inputTransporter);
	}

	public removeOutputTransporter(outputTransporter: TransporterComponent): void {
		this.outputTransporters.delete(outputTransporter);
	}

	protected getTransporterInDirection(position: Vector3, direction: Vector3): TransporterComponent | undefined {
		const cell = this.gridService.getCellInDirection(this.player, position, direction);
		return cell !== undefined && cell.structureModel !== undefined
			? this.components.getComponents<TransporterComponent>(cell.structureModel)[0]
			: undefined;
	}

	public getInputTransporters(): TransporterComponent[] {
		return [...this.inputTransporters];
	}

	public getOutputTransporters(outputTransporterType?: "Solid" | "Fluid"): TransporterComponent[] {
		return outputTransporterType !== undefined
			? Object.entries(this.outputTransporters)
					.filter(([, outputTransporterType_]) => outputTransporterType_ === outputTransporterType)
					.map(([outputTransporter]) => outputTransporter)
			: Object.keys(this.outputTransporters);
	}

	public addQueuedSolid(solid: Solid): void {
		this.queuedSolids.push(solid);
	}

	public inputItem(solid: Solid): void;
	public inputItem(fluid: string, volume: number): void;
	public inputItem(item: Solid | string, volume?: number): void {
		if (typeIs(item, "table")) {
			this.queuedSolids.remove(this.queuedSolids.indexOf(item));
			this.solids.push(item);
		} else {
			this.fluids.set(item, (this.fluids.get(item) ?? 0) + volume!);
		}
		this.OnInput.Fire(item);
	}

	public canInputItem(solid: Solid): boolean;
	public canInputItem(fluid: string): boolean;
	public canInputItem(item: Solid | string): boolean {
		return typeIs(item, "table")
			? this.queuedSolids.size() + this.solids.size() === 0
			: this.fluids.size() === 0 || (this.fluids.get(item) ?? 0) < this.fluidCapacity;
	}

	public outputItem(solid: Solid): void;
	public outputItem(fluid: string, volume: number): void;
	public outputItem(item: Solid | string, volume?: number): void {
		if (typeIs(item, "table")) {
			this.solids.remove(this.solids.indexOf(item));
			this.OnOutput.Fire(item);
			for(const inputTransporter of this.inputTransporters){
				this.transportService.attemptTransport(inputTransporter)
			}
		} else if (this.fluids.has(item)) {
			this.fluids.set(item, this.fluids.get(item)! - volume!);
			if (this.fluids.get(item)! <= 0) {
				this.fluids.delete(item);
			}
			this.OnOutput.Fire(item);
		}
	}

	public canOutputItem(): boolean {
		return this.active && (this.solids.size() > 0 || this.fluids.size() > 0);
	}

	protected clearItems(): void {
		for (const solid of [...this.queuedSolids, ...this.solids]) {
			if (solid.m?.Parent !== undefined) {
				this.poolService.add(solid.m);
			}
			solid.p = -1;
		}
		this.queuedSolids.clear();
		this.solids.clear();
		this.fluids.clear();

		for (const inputTransporter of this.inputTransporters) {
			this.transportService.attemptTransport(inputTransporter);
		}
	}

	public getQueuedSolids(): Solid[] {
		return this.queuedSolids;
	}

	public getSolids(): Solid[] {
		return this.solids;
	}

	public getFluids(): Map<string, number> {
		return this.fluids;
	}
}
