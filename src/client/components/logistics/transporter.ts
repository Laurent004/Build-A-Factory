import { Component } from "@flamework/components";
import { OnStart } from "@flamework/core";
import { STRUCTURES } from "shared/constants/structures";
import { Events } from "client/network";
import Signal from "@rbxts/signal";
import StructureComponent from "../structure";
import TransportService from "client/services/plot/transport";
import { Object } from "@rbxts/luau-polyfill";
import { Solid } from "shared/constants/items";
import { EventBus } from "client/event-bus";

@Component({ tag: "Transporter" })
export default class TransporterComponent extends StructureComponent implements OnStart {
	protected readonly transportService = TransportService.getInst();
	protected readonly inputTransporters = new Set<TransporterComponent>();
	protected readonly outputTransporters = new Map<TransporterComponent, "Solid" | "Fluid">();

	protected readonly queuedSolids: Solid[] = [];
	protected readonly solids: Solid[] = [];
	protected readonly fluids = new Map<string, number>();

	public readonly OnInput = new Signal<(item: Solid | string, count: number) => void>();
	public readonly OnOutput = new Signal<(item: Solid | string, count: number) => void>();

	protected override initEvents(): void {
		super.initEvents();
		if (this.active) {
			this.initInputTransporters();
			this.initOutputTransporters();
			this.initConnectionTransporters();
		} else {
			this.connections.push(
				this.OnActiveChanged.Connect(() => {
					if (!this.active) return;
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
				}),
			);
		}
		this.connections.push(
			Events.OnStructuresItemsClear.connect((player, structuresModels) => {
				if (player === this.player && structuresModels.includes(this.instance)) {
					this.clearItems();
				}
			}),
			EventBus.OnSettingChange.Connect((settingName, settingValue) => {
				if (settingName === "renderItems" && !(settingValue as number[]).includes(this.player.UserId)) {
					for (const solid of [...this.queuedSolids, ...this.solids]) {
						solid.model?.Destroy();
					}
				}
			}),
		);
	}

	protected override onStructuresPlacement(structuresModels: Model[]): void {
		super.onStructuresPlacement(structuresModels);
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
			for (const [outputTransporter] of this.outputTransporters) {
				if (structuresModels.includes(outputTransporter.instance)) {
					this.outputTransporters.delete(outputTransporter);
				}
			}
		}
	}

	protected override onStructuresMovement(structuresModels: Model[]): void {
		super.onStructuresMovement(structuresModels);
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

	protected override onStructuresDestroying(structuresModels: Model[]): void {
		super.onStructuresDestroying(structuresModels);
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
			for (const [outputTransporter] of this.outputTransporters) {
				if (structuresModels.includes(outputTransporter.instance)) {
					this.outputTransporters.delete(outputTransporter);
				}
			}
		}
	}

	protected initInputTransporters(): void {
		for (const [inputNodeWorldCF, visible] of Object.entries(
			STRUCTURES[this.instance.Name].nodes.inputs.solids,
		).map(
			([inputNodeLocalCF, visible]) =>
				[this.instance.GetPivot().mul(inputNodeLocalCF), visible] as [CFrame, boolean],
		)) {
			if (visible) {
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
				if (
					transporterComponents.size() > 0 &&
					Object.entries(STRUCTURES[inputNodeWorldBackwardCell.structureModel.Name].nodes.outputs.solids)
						.filter(([, visible]) => visible)
						.map(([outputNodeLocalCF]) =>
							inputNodeWorldBackwardCell.structureModel!.GetPivot().mul(outputNodeLocalCF),
						)
						.find(
							(outputNodeWorldCF) =>
								outputNodeWorldCF.Position.FuzzyEq(inputNodeWorldCF.Position, 0.01) &&
								outputNodeWorldCF.RightVector.FuzzyEq(inputNodeWorldCF.RightVector, 0.01),
						) !== undefined
				) {
					this.inputTransporters.add(transporterComponents[0]);
					this.transportService.attemptTransport(transporterComponents[0]);
				}
			} else {
				for (const structureModel of this.instance
					.Parent!.GetChildren()
					.filter(
						(instance): instance is Model =>
							instance.IsA("Model") && instance.Name in STRUCTURES && instance !== this.instance,
					)) {
					const transporterComponents = this.components.getComponents<TransporterComponent>(structureModel);
					if (
						transporterComponents.size() > 0 &&
						Object.keys(STRUCTURES[structureModel.Name].nodes.outputs.solids)
							.map((outputNodeLocalCF) => structureModel.GetPivot().mul(outputNodeLocalCF))
							.find(
								(outputNodeWorldCF) =>
									outputNodeWorldCF.Position.FuzzyEq(inputNodeWorldCF.Position, 0.01) &&
									outputNodeWorldCF.RightVector.FuzzyEq(inputNodeWorldCF.RightVector, 0.01),
							) !== undefined
					) {
						this.inputTransporters.add(transporterComponents[0]);
						this.transportService.attemptTransport(transporterComponents[0]);
						break;
					}
				}
			}
		}
		for (const [inputNodeWorldCF, visible] of Object.entries(
			STRUCTURES[this.instance.Name].nodes.inputs.fluids,
		).map(
			([inputNodeLocalCF, visible]) =>
				[this.instance.GetPivot().mul(inputNodeLocalCF), visible] as [CFrame, boolean],
		)) {
			if (visible) {
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
				if (
					transporterComponents.size() > 0 &&
					[
						...Object.entries(
							STRUCTURES[inputNodeWorldBackwardCell.structureModel.Name].nodes.outputs.fluids,
						)
							.filter(([, visible]) => visible)
							.map(([outputNodeLocalCF]) => outputNodeLocalCF),
						...Object.entries(STRUCTURES[inputNodeWorldBackwardCell.structureModel.Name].nodes.connections)
							.filter(([, visible]) => visible)
							.map(([connectionNodeLocalCF]) => connectionNodeLocalCF),
					]
						.map((nodeLocalCF) => inputNodeWorldBackwardCell.structureModel!.GetPivot().mul(nodeLocalCF))
						.find(
							(nodeWorldCF) =>
								nodeWorldCF.Position.FuzzyEq(inputNodeWorldCF.Position, 0.01) &&
								nodeWorldCF.RightVector.FuzzyEq(inputNodeWorldCF.RightVector, 0.01),
						) !== undefined
				) {
					this.inputTransporters.add(transporterComponents[0]);
				}
			} else {
				for (const structureModel of this.instance
					.Parent!.GetChildren()
					.filter(
						(instance): instance is Model =>
							instance.IsA("Model") && instance.Name in STRUCTURES && instance !== this.instance,
					)) {
					const transporterComponents = this.components.getComponents<TransporterComponent>(structureModel);
					if (
						transporterComponents.size() > 0 &&
						[
							...Object.keys(STRUCTURES[structureModel.Name].nodes.outputs.fluids),
							...Object.keys(STRUCTURES[structureModel.Name].nodes.connections),
						]
							.map((nodeLocalCF) => structureModel.GetPivot().mul(nodeLocalCF))
							.find(
								(nodeWorldCF) =>
									nodeWorldCF.Position.FuzzyEq(inputNodeWorldCF.Position, 0.01) &&
									nodeWorldCF.RightVector.FuzzyEq(inputNodeWorldCF.RightVector, 0.01),
							) !== undefined
					) {
						this.inputTransporters.add(transporterComponents[0]);
						break;
					}
				}
			}
		}
	}

	protected initOutputTransporters(): void {
		for (const [outputNodeWorldCF, visible] of Object.entries(
			STRUCTURES[this.instance.Name].nodes.outputs.solids,
		).map(
			([outputNodeLocalCF, visible]) =>
				[this.instance.GetPivot().mul(outputNodeLocalCF), visible] as [CFrame, boolean],
		)) {
			if (visible) {
				const outputNodeWorldCell = this.gridService.getCellAtWorldPosition(
					this.player,
					outputNodeWorldCF.Position,
				);
				if (outputNodeWorldCell === undefined || outputNodeWorldCell.structureModel === undefined) continue;
				const transporterComponents = this.components.getComponents<TransporterComponent>(
					outputNodeWorldCell.structureModel,
				);
				if (
					transporterComponents.size() > 0 &&
					Object.entries(STRUCTURES[outputNodeWorldCell.structureModel.Name].nodes.inputs.solids)
						.filter(([, visible]) => visible)
						.map(([inputNodeLocalCF]) =>
							outputNodeWorldCell.structureModel!.GetPivot().mul(inputNodeLocalCF),
						)
						.find(
							(inputNodeWorldCF) =>
								inputNodeWorldCF.Position.FuzzyEq(outputNodeWorldCF.Position, 0.01) &&
								inputNodeWorldCF.RightVector.FuzzyEq(outputNodeWorldCF.RightVector, 0.01),
						) !== undefined
				) {
					this.outputTransporters.set(transporterComponents[0], "Solid");
					this.transportService.attemptTransport(this);
				}
			} else {
				for (const structureModel of this.instance
					.Parent!.GetChildren()
					.filter(
						(instance): instance is Model =>
							instance.IsA("Model") && instance.Name in STRUCTURES && instance !== this.instance,
					)) {
					const transporterComponents = this.components.getComponents<TransporterComponent>(structureModel);
					if (
						transporterComponents.size() > 0 &&
						Object.keys(STRUCTURES[structureModel.Name].nodes.inputs.solids)
							.map((inputNodeLocalCF) => structureModel.GetPivot().mul(inputNodeLocalCF))
							.find(
								(inputNodeWorldCF) =>
									inputNodeWorldCF.Position.FuzzyEq(outputNodeWorldCF.Position, 0.01) &&
									inputNodeWorldCF.RightVector.FuzzyEq(outputNodeWorldCF.RightVector, 0.01),
							) !== undefined
					) {
						this.outputTransporters.set(transporterComponents[0], "Solid");
						this.transportService.attemptTransport(this);
						break;
					}
				}
			}
		}

		for (const [outputNodeWorldCF, visible] of Object.entries(
			STRUCTURES[this.instance.Name].nodes.outputs.fluids,
		).map(
			([outputNodeLocalCF, visible]) =>
				[this.instance.GetPivot().mul(outputNodeLocalCF), visible] as [CFrame, boolean],
		)) {
			const outputNodeWorldCell = this.gridService.getCellAtWorldPosition(
				this.player,
				outputNodeWorldCF.Position,
			);
			if (outputNodeWorldCell === undefined) continue;

			if (visible) {
				if (outputNodeWorldCell.structureModel === undefined) continue;
				const transporterComponents = this.components.getComponents<TransporterComponent>(
					outputNodeWorldCell.structureModel,
				);
				if (transporterComponents.size() === 0) continue;
				if (
					Object.entries(STRUCTURES[outputNodeWorldCell.structureModel.Name].nodes.inputs.fluids)
						.filter(([, visible]) => visible)
						.map(([inputNodeLocalCF]) =>
							outputNodeWorldCell.structureModel!.GetPivot().mul(inputNodeLocalCF),
						)
						.find(
							(inputNodeWorldCF) =>
								inputNodeWorldCF.Position.FuzzyEq(outputNodeWorldCF.Position, 0.01) &&
								inputNodeWorldCF.RightVector.FuzzyEq(outputNodeWorldCF.RightVector, 0.01),
						) !== undefined ||
					Object.entries(STRUCTURES[outputNodeWorldCell.structureModel.Name].nodes.connections)
						.filter(([, visible]) => visible)
						.map(([connectionNodeLocalCF]) =>
							outputNodeWorldCell.structureModel!.GetPivot().mul(connectionNodeLocalCF),
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
					this.outputTransporters.set(transporterComponents[0], "Fluid");
				}
			} else {
				for (const structureModel of this.instance
					.Parent!.GetChildren()
					.filter(
						(instance): instance is Model =>
							instance.IsA("Model") && instance.Name in STRUCTURES && instance !== this.instance,
					)) {
					const transporterComponents = this.components.getComponents<TransporterComponent>(structureModel);
					if (transporterComponents.size() === 0) continue;
					if (
						Object.keys(STRUCTURES[structureModel.Name].nodes.inputs.fluids)
							.map((inputNodeLocalCF) => structureModel.GetPivot().mul(inputNodeLocalCF))
							.find(
								(inputNodeWorldCF) =>
									inputNodeWorldCF.Position.FuzzyEq(outputNodeWorldCF.Position, 0.01) &&
									inputNodeWorldCF.RightVector.FuzzyEq(outputNodeWorldCF.RightVector, 0.01),
							) !== undefined ||
						Object.keys(STRUCTURES[structureModel.Name].nodes.connections)
							.map((connectionNodeLocalCF) => structureModel!.GetPivot().mul(connectionNodeLocalCF))
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
						this.outputTransporters.set(transporterComponents[0], "Fluid");
						break;
					}
				}
			}
		}
	}

	private initConnectionTransporters(): void {
		for (const [connectionNodeWorldCF, visible] of Object.entries(
			STRUCTURES[this.instance.Name].nodes.connections,
		).map(
			([connectionNodeLocalCF, visible]) =>
				[this.instance.GetPivot().mul(connectionNodeLocalCF), visible] as [CFrame, boolean],
		)) {
			const connectionNodeWorldCell = this.gridService.getCellAtWorldPosition(
				this.player,
				connectionNodeWorldCF.Position,
			);
			if (connectionNodeWorldCell === undefined) continue;

			if (visible) {
				if (connectionNodeWorldCell.structureModel === undefined) continue;
				const transporterComponents = this.components.getComponents<TransporterComponent>(
					connectionNodeWorldCell.structureModel,
				);
				if (transporterComponents.size() === 0) continue;
				if (
					Object.entries(STRUCTURES[connectionNodeWorldCell.structureModel.Name].nodes.inputs.fluids)
						.filter(([, visible]) => visible)
						.map(([inputNodeLocalCF]) =>
							connectionNodeWorldCell.structureModel!.GetPivot().mul(inputNodeLocalCF),
						)
						.find(
							(inputNodeWorldCF) =>
								inputNodeWorldCF.Position.FuzzyEq(connectionNodeWorldCF.Position, 0.01) &&
								inputNodeWorldCF.RightVector.FuzzyEq(connectionNodeWorldCF.RightVector, 0.01),
						) !== undefined
				) {
					this.outputTransporters.set(transporterComponents[0], "Fluid");
				} else if (
					Object.entries(STRUCTURES[connectionNodeWorldCell.structureModel.Name].nodes.outputs.fluids)
						.filter(([, visible]) => visible)
						.map(([outputNodeLocalCF]) =>
							connectionNodeWorldCell.structureModel!.GetPivot().mul(outputNodeLocalCF),
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
					this.inputTransporters.add(transporterComponents[0]);
				} else if (
					Object.entries(STRUCTURES[connectionNodeWorldCell.structureModel.Name].nodes.connections)
						.filter(([, visible]) => visible)
						.map(([connectionNodeLocalCF]) =>
							connectionNodeWorldCell.structureModel!.GetPivot().mul(connectionNodeLocalCF),
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
					this.inputTransporters.add(transporterComponents[0]);
					this.outputTransporters.set(transporterComponents[0], "Fluid");
				}
			} else {
				for (const structureModel of this.instance
					.Parent!.GetChildren()
					.filter(
						(instance): instance is Model =>
							instance.IsA("Model") && instance.Name in STRUCTURES && instance !== this.instance,
					)) {
					const transporterComponents = this.components.getComponents<TransporterComponent>(structureModel);
					if (transporterComponents.size() === 0) continue;
					if (
						Object.keys(STRUCTURES[structureModel.Name].nodes.inputs.fluids)
							.map((inputNodeLocalCF) => structureModel.GetPivot().mul(inputNodeLocalCF))
							.find(
								(inputNodeWorldCF) =>
									inputNodeWorldCF.Position.FuzzyEq(connectionNodeWorldCF.Position, 0.01) &&
									inputNodeWorldCF.RightVector.FuzzyEq(connectionNodeWorldCF.RightVector, 0.01),
							) !== undefined
					) {
						this.outputTransporters.set(transporterComponents[0], "Fluid");
						break;
					} else if (
						Object.keys(STRUCTURES[structureModel.Name].nodes.outputs.fluids)
							.map((outputNodeLocalCF) => structureModel.GetPivot().mul(outputNodeLocalCF))
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
						this.inputTransporters.add(transporterComponents[0]);
						break;
					} else if (
						Object.keys(STRUCTURES[structureModel.Name].nodes.connections)
							.map((connectionNodeLocalCF) => structureModel.GetPivot().mul(connectionNodeLocalCF))
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
						this.inputTransporters.add(transporterComponents[0]);
						this.outputTransporters.set(transporterComponents[0], "Fluid");
						break;
					}
				}
			}
		}
	}

	public getInputTransporters(): TransporterComponent[] {
		return [...this.inputTransporters];
	}

	public getOutputTransporters(outputTransporterType: "Solid" | "Fluid"): TransporterComponent[] {
		return Object.entries(this.outputTransporters)
			.filter(([, outputTransporterType_]) => outputTransporterType_ === outputTransporterType)
			.map(([outputTransporter]) => outputTransporter);
	}

	protected getTransporterInDirection(position: Vector3, direction: Vector3): TransporterComponent | undefined {
		const cell = this.gridService.getCellInDirection(this.player, position, direction);
		return cell !== undefined && cell.structureModel !== undefined
			? this.components.getComponents<TransporterComponent>(cell.structureModel)[0]
			: undefined;
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
			this.OnInput.Fire(item, 1);
		} else {
			this.fluids.set(item, (this.fluids.get(item) ?? 0) + volume!);
			this.OnInput.Fire(item, volume!);
		}
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
			this.OnOutput.Fire(item, 1);
		} else if (this.fluids.has(item)) {
			this.fluids.set(item, this.fluids.get(item)! - volume!);
			if (this.fluids.get(item)! <= 0) this.fluids.delete(item);
			this.OnOutput.Fire(item, volume!);
		}
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
