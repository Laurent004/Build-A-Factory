import { Component } from "@flamework/components";
import { OnStart } from "@flamework/core";
import { STRUCTURES } from "shared/constants/structures";
import { Events } from "client/network";
import Signal from "@rbxts/signal";
import StructureComponent from "../structure";
import TransportService from "client/services/plot/transport";
import { Object } from "@rbxts/luau-polyfill";
import { Solid } from "shared/constants/items";
import { store } from "client/store";
import { selectSettings } from "client/store/context/sections";

@Component({ tag: "Transporter" })
export default class TransporterComponent extends StructureComponent implements OnStart {
	protected readonly transportService = TransportService.getInst();
	protected readonly inputTransporters = new Set<TransporterComponent>();
	protected readonly outputTransporters = new Map<TransporterComponent, "Solid" | "Fluid">();
	
	protected readonly queuedSolids: Solid[] = [];
	protected readonly solids: Solid[] = [];
	protected readonly fluids = new Map<string, number>();
	public readonly OnInput = new Signal<(item: Solid | string) => void>();
	public readonly OnOutput = new Signal<(item: Solid | string) => void>();

	protected override initEvents(): void {
		super.initEvents();
		this.initTransporters()
		for(const connection of [
			this.OnActiveChanged.Connect(() => {
				if (!this.active) return;
				this.transportService.attemptTransport(this)
			}),
			Events.OnStructuresItemsClear.connect((player, structuresModels) => {
				if (player === this.player && structuresModels.includes(this.instance)) {
					this.clearItems();
				}
			})
		]){
			this.janitor.Add(connection);
		}
		store.subscribe(selectSettings,(settings)=>{
			if (!(settings["renderItems"] as number[]).includes(this.player.UserId)) {
				for (const solid of [...this.queuedSolids, ...this.solids]) {
					solid.model?.Destroy();
				}
			}
		})
	}

	protected override onStructuresPlacement(structuresModels: Model[]): void {
		super.onStructuresPlacement(structuresModels);
		this.initTransporters();
	}

	protected override onStructuresMovementStart(structuresModels: Model[]): void {
		super.onStructuresMovementStart(structuresModels);
		if (structuresModels.includes(this.instance)) {
			this.inputTransporters.clear();
			this.outputTransporters.clear();
			this.clearItems();
		} else {
			for (const inputTransporter of this.inputTransporters) {
				if (structuresModels.includes(inputTransporter.instance)) {
					this.inputTransporters.delete(inputTransporter);
				}
			}
			for (const [outputTransporter] of this.outputTransporters) {
				if (structuresModels.includes(outputTransporter.instance)) {
					this.outputTransporters.delete(outputTransporter);
				}
			}
		}
	}

	protected override onStructuresMovement(structuresModels: Model[]): void {
		super.onStructuresMovement(structuresModels);
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
		this.outputTransporters.clear()
		this.clearItems();
	}

	private initTransporters():void{
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
		for (const [inputNodeWorldCF, world] of Object.entries(
			STRUCTURES[this.instance.Name].nodes.inputs.solids,
		).map(
			([inputNodeLocalCF, world]):[CFrame, boolean] =>
				[this.instance.GetPivot().mul(inputNodeLocalCF), world],
		)) {
			if (world) {
				const inputNodeWorldBackwardCell = this.gridService.getCellInDirection(
					this.player,
					inputNodeWorldCF.Position,
					inputNodeWorldCF.RightVector.mul(-1),
				);
				if (inputNodeWorldBackwardCell === undefined || inputNodeWorldBackwardCell.structureModel === undefined)
					continue;
				const transporterComponent = this.components.getComponents<TransporterComponent>(
					inputNodeWorldBackwardCell.structureModel,
				)[0];
				if (
					transporterComponent!==undefined &&
					Object.entries(STRUCTURES[transporterComponent.instance.Name].nodes.outputs.solids)
						.filter(([, world]) => world)
						.map(([outputNodeLocalCF]) =>
							transporterComponent.instance.GetPivot().mul(outputNodeLocalCF),
						)
						.find(
							(outputNodeWorldCF) =>
								outputNodeWorldCF.Position.FuzzyEq(inputNodeWorldCF.Position, 0.01) &&
								outputNodeWorldCF.RightVector.FuzzyEq(inputNodeWorldCF.RightVector, 0.01),
						) !== undefined
				) {
					this.inputTransporters.add(transporterComponent);
					this.transportService.attemptTransport(transporterComponent);
				}
			} else {
				for (const transporterComponent of this.instance
					.Parent!.GetChildren()
					.mapFiltered(
						(instance) =>
							instance.IsA("Model") && instance.Name in STRUCTURES && instance !== this.instance?this.components.getComponents<TransporterComponent>(instance)[0]:undefined
					)) {
					if (
						Object.keys(STRUCTURES[transporterComponent.instance.Name].nodes.outputs.solids)
							.map((outputNodeLocalCF) => transporterComponent.instance.GetPivot().mul(outputNodeLocalCF))
							.find(
								(outputNodeWorldCF) =>
									outputNodeWorldCF.Position.FuzzyEq(inputNodeWorldCF.Position, 0.01) &&
									outputNodeWorldCF.RightVector.FuzzyEq(inputNodeWorldCF.RightVector, 0.01),
							) !== undefined
					) {
						this.inputTransporters.add(transporterComponent);
						this.transportService.attemptTransport(transporterComponent);
						break;
					}
				}
			}
		}
		for (const [inputNodeWorldCF, world] of Object.entries(
			STRUCTURES[this.instance.Name].nodes.inputs.fluids,
		).map(
			([inputNodeLocalCF, world]):[CFrame, boolean] =>
				[this.instance.GetPivot().mul(inputNodeLocalCF), world],
		)) {
			if (world) {
				const transporterComponent=this.getTransporterInDirection(inputNodeWorldCF.Position,inputNodeWorldCF.RightVector.mul(-1))
				if (
					transporterComponent!==undefined&&
					[
						...Object.entries(
							STRUCTURES[transporterComponent.instance.Name].nodes.outputs.fluids,
						)
							.filter(([, world]) => world)
							.map(([outputNodeLocalCF]) => outputNodeLocalCF),
						...Object.entries(STRUCTURES[transporterComponent.instance.Name].nodes.connections)
							.filter(([, world]) => world)
							.map(([connectionNodeLocalCF]) => connectionNodeLocalCF),
					]
						.map((nodeLocalCF) => transporterComponent.instance.GetPivot().mul(nodeLocalCF))
						.find(
							(nodeWorldCF) =>
								nodeWorldCF.Position.FuzzyEq(inputNodeWorldCF.Position, 0.01) &&
								nodeWorldCF.RightVector.FuzzyEq(inputNodeWorldCF.RightVector, 0.01),
						) !== undefined
				) {
					this.inputTransporters.add(transporterComponent);
				}
			} else {
				for (const transporterComponent of this.instance
					.Parent!.GetChildren()
					.mapFiltered(
						(instance) =>
							instance.IsA("Model") && instance.Name in STRUCTURES && instance !== this.instance?this.components.getComponents<TransporterComponent>(instance)[0]:undefined
					))  {
					if (
						transporterComponent!==undefined &&
						[
							...Object.keys(STRUCTURES[transporterComponent.instance.Name].nodes.outputs.fluids),
							...Object.keys(STRUCTURES[transporterComponent.instance.Name].nodes.connections),
						]
							.map((nodeLocalCF) => transporterComponent.instance.GetPivot().mul(nodeLocalCF))
							.find(
								(nodeWorldCF) =>
									nodeWorldCF.Position.FuzzyEq(inputNodeWorldCF.Position, 0.01) &&
									nodeWorldCF.RightVector.FuzzyEq(inputNodeWorldCF.RightVector, 0.01),
							) !== undefined
					) {
						this.inputTransporters.add(transporterComponent);
						break;
					}
				}
			}
		}
	}

	private initOutputTransporters(): void {
		for (const [outputNodeWorldCF, world] of Object.entries(
			STRUCTURES[this.instance.Name].nodes.outputs.solids,
		).map(
			([outputNodeLocalCF, world]):[CFrame, boolean] =>
				[this.instance.GetPivot().mul(outputNodeLocalCF), world],
		)) {
			if (world) {
				const outputNodeWorldCell = this.gridService.getCellAtWorldPosition(
					this.player,
					outputNodeWorldCF.Position,
				);
				if (outputNodeWorldCell === undefined || outputNodeWorldCell.structureModel === undefined) continue;
				const transporterComponent = this.components.getComponents<TransporterComponent>(
					outputNodeWorldCell.structureModel,
				)[0];
				if (
					transporterComponent!==undefined &&
					Object.entries(STRUCTURES[transporterComponent.instance.Name].nodes.inputs.solids)
						.filter(([, world]) => world)
						.map(([inputNodeLocalCF]) =>
							transporterComponent.instance.GetPivot().mul(inputNodeLocalCF),
						)
						.find(
							(inputNodeWorldCF) =>
								inputNodeWorldCF.Position.FuzzyEq(outputNodeWorldCF.Position, 0.01) &&
								inputNodeWorldCF.RightVector.FuzzyEq(outputNodeWorldCF.RightVector, 0.01),
						) !== undefined
				) {
					this.outputTransporters.set(transporterComponent, "Solid");
					this.transportService.attemptTransport(this);
				}
			} else {
				for (const transporterComponent of this.instance
					.Parent!.GetChildren()
					.mapFiltered(
						(instance) =>
							instance.IsA("Model") && instance.Name in STRUCTURES && instance !== this.instance?this.components.getComponents<TransporterComponent>(instance)[0]:undefined
					)) {
					if (
						Object.keys(STRUCTURES[transporterComponent.instance.Name].nodes.inputs.solids)
							.map((inputNodeLocalCF) => transporterComponent.instance.GetPivot().mul(inputNodeLocalCF))
							.find(
								(inputNodeWorldCF) =>
									inputNodeWorldCF.Position.FuzzyEq(outputNodeWorldCF.Position, 0.01) &&
									inputNodeWorldCF.RightVector.FuzzyEq(outputNodeWorldCF.RightVector, 0.01),
							) !== undefined
					) {
						this.outputTransporters.set(transporterComponent, "Solid");
						this.transportService.attemptTransport(this);
						break;
					}
				}
			}
		}

		for (const [outputNodeWorldCF, world] of Object.entries(
			STRUCTURES[this.instance.Name].nodes.outputs.fluids,
		).map(
			([outputNodeLocalCF, world]):[CFrame, boolean] =>
				[this.instance.GetPivot().mul(outputNodeLocalCF), world]
		)) {
			const outputNodeWorldCell = this.gridService.getCellAtWorldPosition(
				this.player,
				outputNodeWorldCF.Position,
			);
			if (outputNodeWorldCell === undefined) continue;

			if (world) {
				if (outputNodeWorldCell.structureModel === undefined) continue;
				const transporterComponent = this.components.getComponents<TransporterComponent>(
					outputNodeWorldCell.structureModel,
				)[0];
				if (transporterComponent===undefined) continue;
				if (
					Object.entries(STRUCTURES[transporterComponent.instance.Name].nodes.inputs.fluids)
						.filter(([, world]) => world)
						.map(([inputNodeLocalCF]) =>
							transporterComponent.instance.GetPivot().mul(inputNodeLocalCF),
						)
						.find(
							(inputNodeWorldCF) =>
								inputNodeWorldCF.Position.FuzzyEq(outputNodeWorldCF.Position, 0.01) &&
								inputNodeWorldCF.RightVector.FuzzyEq(outputNodeWorldCF.RightVector, 0.01),
						) !== undefined ||
					Object.entries(STRUCTURES[transporterComponent.instance.Name].nodes.connections)
						.filter(([, world]) => world)
						.map(([connectionNodeLocalCF]) =>
							transporterComponent.instance.GetPivot().mul(connectionNodeLocalCF),
						)
						.find(
							(connectionNodeWorldCF) =>
								this.gridService.getCellInDirection(
									this.player,
									connectionNodeWorldCF.Position,
									connectionNodeWorldCF.RightVector.mul(-1),
								) === outputNodeWorldCell &&
								connectionNodeWorldCF.RightVector.mul(-1).FuzzyEq(outputNodeWorldCF.RightVector, 0.01),
						) !== undefined
				) {
					this.outputTransporters.set(transporterComponent, "Fluid");
				}
			} else {
				for (const transporterComponent of this.instance
					.Parent!.GetChildren()
					.mapFiltered(
						(instance) =>
							instance.IsA("Model") && instance.Name in STRUCTURES && instance !== this.instance?this.components.getComponents<TransporterComponent>(instance)[0]:undefined
					)) {
					if (
						Object.keys(STRUCTURES[transporterComponent.instance.Name].nodes.inputs.fluids)
							.map((inputNodeLocalCF) => transporterComponent.instance.GetPivot().mul(inputNodeLocalCF))
							.find(
								(inputNodeWorldCF) =>
									inputNodeWorldCF.Position.FuzzyEq(outputNodeWorldCF.Position, 0.01) &&
									inputNodeWorldCF.RightVector.FuzzyEq(outputNodeWorldCF.RightVector, 0.01),
							) !== undefined ||
						Object.keys(STRUCTURES[transporterComponent.instance.Name].nodes.connections)
							.map((connectionNodeLocalCF) => transporterComponent.instance.GetPivot().mul(connectionNodeLocalCF))
							.find(
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
							) !== undefined
					) {
						this.outputTransporters.set(transporterComponent, "Fluid");
						break;
					}
				}
			}
		}
	}

	private initConnectionTransporters(): void {
		for (const [connectionNodeWorldCF, world] of Object.entries(
			STRUCTURES[this.instance.Name].nodes.connections,
		).map(
			([connectionNodeLocalCF, world]):[CFrame, boolean] =>
				[this.instance.GetPivot().mul(connectionNodeLocalCF), world],
		)) {
			const connectionNodeWorldCell = this.gridService.getCellAtWorldPosition(
				this.player,
				connectionNodeWorldCF.Position,
			);
			if (connectionNodeWorldCell === undefined) continue;

			if (world) {
				if (connectionNodeWorldCell.structureModel === undefined) continue;
				const transporterComponent = this.components.getComponents<TransporterComponent>(
					connectionNodeWorldCell.structureModel,
				)[0];
				if (transporterComponent === undefined) continue;
				if (
					Object.entries(STRUCTURES[transporterComponent.instance.Name].nodes.inputs.fluids)
						.filter(([, world]) => world)
						.map(([inputNodeLocalCF]) =>
							transporterComponent.instance.GetPivot().mul(inputNodeLocalCF),
						)
						.find(
							(inputNodeWorldCF) =>
								inputNodeWorldCF.Position.FuzzyEq(connectionNodeWorldCF.Position, 0.01) &&
								inputNodeWorldCF.RightVector.FuzzyEq(connectionNodeWorldCF.RightVector, 0.01),
						) !== undefined
				) {
					this.outputTransporters.set(transporterComponent, "Fluid");
				} else if (
					Object.entries(STRUCTURES[transporterComponent.instance.Name].nodes.outputs.fluids)
						.filter(([, world]) => world)
						.map(([outputNodeLocalCF]) =>
							transporterComponent.instance.GetPivot().mul(outputNodeLocalCF),
						)
						.find(
							(outputNodeWorldCF) =>
								this.gridService.getCellInDirection(
									this.player,
									outputNodeWorldCF.Position,
									outputNodeWorldCF.RightVector.mul(-1),
								) === connectionNodeWorldCell &&
								outputNodeWorldCF.RightVector.mul(-1).FuzzyEq(connectionNodeWorldCF.RightVector, 0.01),
						) !== undefined
				) {
					this.inputTransporters.add(transporterComponent);
				} else if (
					Object.entries(STRUCTURES[transporterComponent.instance.Name].nodes.connections)
						.filter(([, world]) => world)
						.map(([connectionNodeLocalCF]) =>
							transporterComponent.instance.GetPivot().mul(connectionNodeLocalCF),
						)
						.find(
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
						) !== undefined
				) {
					this.inputTransporters.add(transporterComponent);
					this.outputTransporters.set(transporterComponent, "Fluid");
				}
			} else {
				for (const transporterComponent of this.instance
					.Parent!.GetChildren()
					.mapFiltered(
						(instance) =>
							instance.IsA("Model") && instance.Name in STRUCTURES && instance !== this.instance?this.components.getComponents<TransporterComponent>(instance)[0]:undefined
					)) {
					if (
						Object.keys(STRUCTURES[transporterComponent.instance.Name].nodes.inputs.fluids)
							.map((inputNodeLocalCF) => transporterComponent.instance.GetPivot().mul(inputNodeLocalCF))
							.find(
								(inputNodeWorldCF) =>
									inputNodeWorldCF.Position.FuzzyEq(connectionNodeWorldCF.Position, 0.01) &&
									inputNodeWorldCF.RightVector.FuzzyEq(connectionNodeWorldCF.RightVector, 0.01),
							) !== undefined
					) {
						this.outputTransporters.set(transporterComponent, "Fluid");
						break;
					} else if (
						Object.keys(STRUCTURES[transporterComponent.instance.Name].nodes.outputs.fluids)
							.map((outputNodeLocalCF) => transporterComponent.instance.GetPivot().mul(outputNodeLocalCF))
							.find(
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
							) !== undefined
					) {
						this.inputTransporters.add(transporterComponent);
						break;
					} else if (
						Object.keys(STRUCTURES[transporterComponent.instance.Name].nodes.connections)
							.map((connectionNodeLocalCF) => transporterComponent.instance.GetPivot().mul(connectionNodeLocalCF))
							.find(
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
							) !== undefined
					) {
						this.inputTransporters.add(transporterComponent);
						this.outputTransporters.set(transporterComponent, "Fluid");
						break;
					}
				}
			}
		}
	}

	public removeInputTransporter(inputTransporter:TransporterComponent): void{
		this.inputTransporters.delete(inputTransporter)
	}

	public removeOutputTransporter(outputTransporter:TransporterComponent): void{
		this.outputTransporters.delete(outputTransporter)
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
		return outputTransporterType!==undefined?
			Object.entries(this.outputTransporters)
			.filter(([, outputTransporterType_]) => outputTransporterType_ === outputTransporterType)
			.map(([outputTransporter]) => outputTransporter)
			:Object.keys(this.outputTransporters)
	}

	public addQueuedSolid(solid: Solid): void {
		this.queuedSolids.push(solid);
	}

	public inputItem(solid: Solid): void;
	public inputItem(fluid: string, volume: number): void;
	public inputItem(item: Solid | string, volume?: number): void {
		if (item instanceof Solid) {
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
		return item instanceof Solid
			? this.queuedSolids.size() + this.solids.size() === 0
			: this.fluids.size() === 0 ||
					(this.fluids.get(item) ?? 0) <
						(STRUCTURES[this.instance.Name].constants["FluidCapacity"] as number);
	}

	public outputItem(solid: Solid): void;
	public outputItem(fluid: string, volume: number): void;
	public outputItem(item: Solid | string, volume?: number): void {
		if (item instanceof Solid) {
			this.solids.remove(this.solids.indexOf(item));
			for (const inputTransporter of this.inputTransporters) {
				this.transportService.attemptTransport(inputTransporter);
			}
		} else if (this.fluids.has(item)) {
			this.fluids.set(item, this.fluids.get(item)! - volume!);
			if (this.fluids.get(item)! <= 0) this.fluids.delete(item);
		}
		this.OnOutput.Fire(item);
	}

	public canOutputItem(): boolean {
		return this.active && (this.solids.size() > 0 || this.fluids.size() > 0);
	}

	protected clearItems(): void {
		for (const solid of [...this.queuedSolids, ...this.solids]) {
			solid.model?.Destroy();
			solid.destroyed = true;
		}
		this.queuedSolids.clear();
		this.solids.clear();
		this.fluids.clear();
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
