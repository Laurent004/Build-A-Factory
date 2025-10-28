import { Components } from "@flamework/components";
import { Dependency } from "@flamework/core";
import { Object } from "@rbxts/luau-polyfill";
import { Workspace } from "@rbxts/services";
import Signal from "@rbxts/signal";
import IndicatorLightComponent from "client/components/indicator-light";
import PowerGeneratorComponent from "client/components/power/power-generator";
import StructureComponent from "client/components/structure";
import { EventBus } from "client/event-bus";
import { Events } from "client/network";
import { STRUCTURES } from "shared/constants/structures";

export interface PowerNetworkInfo {
	consumption: number;
	production: number;
	maxConsumption: number;
	maxProduction: number;
}

export class PowerService {
	//#region Singleton
	private static _inst: PowerService;
	public static getInst(): PowerService {
		this._inst = this._inst ?? new PowerService();
		return this._inst;
	}
	//#endregion

	private readonly components = Dependency<Components>();
	private readonly structures = new Set<StructureComponent>();

	private readonly powerNetworks = new Map<Attachment, number>();
	private readonly powerOutputs = new Map<Attachment, Set<Attachment>>();
	private readonly powerAttachmentsHistories = new Map<Attachment, PowerNetworkInfo[]>();
	public readonly onUpdate = new Signal();

	private currentPowerNetworkId: number = 0;

	private constructor() {
		this.initEvents();
		this.startUpdating();
	}

	private initEvents(): void {
		this.components.onComponentAdded<StructureComponent>((structureComponent, structureModel) => {
			if (this.components.getComponent<IndicatorLightComponent>(structureModel) !== undefined) {
				this.structures.add(structureComponent);
			}
		});

		this.components.onComponentRemoved<StructureComponent>((structureComponent) => {
			if (this.structures.has(structureComponent)) {
				this.structures.delete(structureComponent);
			}
		});

		EventBus.PlotEvents.OnPlotInitialization.Connect((_, plot) => {
			for (const powerLine of plot.WaitForChild("PowerLines").GetChildren() as RopeConstraint[]) {
				while (powerLine.Attachment0 === undefined || powerLine.Attachment1 === undefined) {
					task.wait();
				}
				this.connect(powerLine.Attachment0, powerLine.Attachment1);
			}
		});

		EventBus.PlotEvents.OnStructuresPlacement.Connect((player) => {
			for (const powerLine of Workspace.WaitForChild("Plots")
				.GetChildren()
				.find((plot): plot is Model => plot.GetAttribute("UserId") === player.UserId)!
				.WaitForChild("PowerLines")
				.GetChildren() as RopeConstraint[]) {
				while (powerLine.Attachment0 === undefined || powerLine.Attachment1 === undefined) {
					task.wait();
				}

				if (
					(!this.powerOutputs.has(powerLine.Attachment0) && !this.powerOutputs.has(powerLine.Attachment1)) ||
					(this.powerOutputs.has(powerLine.Attachment0) &&
						!this.powerOutputs.get(powerLine.Attachment0)!.has(powerLine.Attachment1)) ||
					(this.powerOutputs.has(powerLine.Attachment1) &&
						!this.powerOutputs.get(powerLine.Attachment1)!.has(powerLine.Attachment0))
				) {
					this.connect(powerLine.Attachment0, powerLine.Attachment1);
				}
			}
		});

		Events.OnPowerLineCreation.connect((startPowerAttachment, endPowerAttachment) => {
			this.connect(startPowerAttachment, endPowerAttachment);
		});

		Events.OnPowerLineDestroying.connect((startPowerAttachment, endPowerAttachment) => {
			this.disconnect(startPowerAttachment, endPowerAttachment);
		});
	}

	private startUpdating(): void {
		task.spawn(() => {
			while (task.wait(0.1)) {
				this.updateStructuresStates();
			}
		});

		task.spawn(() => {
			while (task.wait(1)) {
				this.updatePowerAttachmentsHistories();
				this.onUpdate.Fire();
			}
		});
	}

	private updateStructuresStates(): void {
		for (const structure of this.structures) {
			if (
				this.powerNetworks.get(
					structure.instance
						.GetDescendants()
						.find(
							(instance): instance is Attachment =>
								instance.IsA("Attachment") && instance.Name === "PowerAttachment",
						)!,
				) === undefined
			) {
				structure.setState("No Connection");
			}
		}

		for (const powerNetworkId of [...new Set(Object.values(this.powerNetworks))]) {
			const powerNetworkConsumption = this.getPowerNetworkConsumption(powerNetworkId);
			const powerNetworkProduction = this.getPowerNetworkProduction(powerNetworkId);

			const powerNetworkStructures = [...this.structures].filter(
				(structure) =>
					this.powerNetworks.get(
						structure.instance
							.GetDescendants()
							.find(
								(instance): instance is Attachment =>
									instance.IsA("Attachment") && instance.Name === "PowerAttachment",
							)!,
					) === powerNetworkId,
			);

			if (powerNetworkProduction <= 0 || powerNetworkConsumption > powerNetworkProduction) {
				for (const structure of powerNetworkStructures) {
					structure.setState("No Power");
				}
			} else {
				for (const structure of powerNetworkStructures) {
					structure.updateState();
				}
			}
		}
	}

	private updatePowerAttachmentsHistories(): void {
		for (const [powerAttachment, powerNetworkId] of this.powerNetworks) {
			const newPowerAttachmentHistory = [
				...(this.powerAttachmentsHistories.get(powerAttachment) ?? []),
				{
					consumption: this.getPowerNetworkConsumption(powerNetworkId),
					production: this.getPowerNetworkProduction(powerNetworkId),
					maxConsumption: this.getPowerNetworkMaxConsumption(powerNetworkId),
					maxProduction: this.getPowerNetworkMaxProduction(powerNetworkId),
				},
			];
			if (newPowerAttachmentHistory.size() === 30) {
				newPowerAttachmentHistory.shift();
			}
			this.powerAttachmentsHistories.set(powerAttachment, newPowerAttachmentHistory);
		}
	}

	public attemptConnect(startPowerAttachment: Attachment, endPowerAttachment: Attachment): void {
		if (!this.canConnect(startPowerAttachment, endPowerAttachment)) return;
		if (
			this.powerOutputs.get(startPowerAttachment)?.has(endPowerAttachment) &&
			this.powerOutputs.get(endPowerAttachment)?.has(startPowerAttachment)
		) {
			Events.DestroyPowerLine(startPowerAttachment, endPowerAttachment);
			return;
		}
		Events.CreatePowerLine(startPowerAttachment, endPowerAttachment);
	}

	private connect(startPowerAttachment: Attachment, endPowerAttachment: Attachment): void {
		if (this.powerNetworks.has(startPowerAttachment) || this.powerNetworks.has(endPowerAttachment)) {
			const startStructureModel = startPowerAttachment.FindFirstAncestorOfClass("Model")!;
			const endStructureModel = endPowerAttachment.FindFirstAncestorOfClass("Model")!;

			const startPowerOutputs = this.powerOutputs.get(startPowerAttachment);
			const endPowerOutputs = this.powerOutputs.get(endPowerAttachment);

			if (
				startStructureModel !== endStructureModel &&
				startPowerOutputs?.size() ===
					(startStructureModel.Name === "Power Pole"
						? (STRUCTURES["Power Pole"].constants["MaxConnections"] as number)
						: 1)
			) {
				const powerOutputToRemove = [...startPowerOutputs].find(
					(powerOutput) => powerOutput.FindFirstAncestorOfClass("Model") !== startStructureModel,
				);
				if (powerOutputToRemove !== undefined) {
					Events.DestroyPowerLine.fire(startPowerAttachment, powerOutputToRemove);
				}
			}

			if (
				startStructureModel !== endStructureModel &&
				endPowerOutputs?.size() ===
					(endStructureModel.Name === "Power Pole"
						? (STRUCTURES["Power Pole"].constants["MaxConnections"] as number)
						: 1)
			) {
				const powerOutputToRemove = [...endPowerOutputs].find(
					(powerOutput) => powerOutput.FindFirstAncestorOfClass("Model") !== endStructureModel,
				);
				if (powerOutputToRemove !== undefined) {
					Events.DestroyPowerLine.fire(endPowerAttachment, powerOutputToRemove);
				}
			}

			const startPowerNetworkId = this.powerNetworks.get(startPowerAttachment);
			const endPowerNetworkId = this.powerNetworks.get(endPowerAttachment);
			const mergedPowerNetworkId = (startPowerNetworkId ?? endPowerNetworkId)!;

			this.powerNetworks.set(startPowerAttachment, mergedPowerNetworkId);
			this.powerNetworks.set(endPowerAttachment, mergedPowerNetworkId);

			if (startPowerNetworkId !== undefined && endPowerNetworkId !== undefined) {
				const powerNetworkIdToRemove =
					mergedPowerNetworkId === startPowerNetworkId ? endPowerNetworkId : startPowerNetworkId;
				for (const [powerAttachment, powerNetworkId] of this.powerNetworks) {
					if (powerNetworkId === powerNetworkIdToRemove) {
						this.powerNetworks.set(powerAttachment, mergedPowerNetworkId);
					}
				}
			}
		} else {
			const newPowerNetworkId = this.currentPowerNetworkId++;
			this.powerNetworks.set(startPowerAttachment, newPowerNetworkId);
			this.powerNetworks.set(endPowerAttachment, newPowerNetworkId);
		}

		this.powerOutputs.set(
			startPowerAttachment,
			this.powerOutputs.has(startPowerAttachment)
				? new Set([...this.powerOutputs.get(startPowerAttachment)!, endPowerAttachment])
				: new Set([endPowerAttachment]),
		);
		this.powerOutputs.set(
			endPowerAttachment,
			this.powerOutputs.has(endPowerAttachment)
				? new Set([...this.powerOutputs.get(endPowerAttachment)!, startPowerAttachment])
				: new Set([startPowerAttachment]),
		);
	}

	private canConnect(startPowerAttachment: Attachment, endPowerAttachment: Attachment): boolean {
		return (
			startPowerAttachment.FindFirstAncestorOfClass("Model") !==
			endPowerAttachment.FindFirstAncestorOfClass("Model")
		);
	}

	private disconnect(startPowerAttachment: Attachment, endPowerAttachment: Attachment): void {
		const startPowerOutputs = this.powerOutputs.get(startPowerAttachment);
		const endPowerOutputs = this.powerOutputs.get(endPowerAttachment);

		if (startPowerOutputs !== undefined) {
			const newPowerOutputs = new Set([...startPowerOutputs]);
			newPowerOutputs.delete(endPowerAttachment);

			if (newPowerOutputs.size() > 0) {
				const newPowerNetworkId = this.currentPowerNetworkId++;
				this.powerNetworks.set(startPowerAttachment, newPowerNetworkId);

				let powerNetworkOutputs: Attachment[] = [...newPowerOutputs];
				while (powerNetworkOutputs.size() > 0) {
					const newPowerNetworkOutputs: Attachment[] = [];
					for (const powerNetworkOutput of powerNetworkOutputs) {
						this.powerNetworks.set(powerNetworkOutput, newPowerNetworkId);

						for (const powerOutput of [...this.powerOutputs.get(powerNetworkOutput)!].filter(
							(powerOutput) => this.powerNetworks.get(powerOutput) !== newPowerNetworkId,
						)) {
							newPowerNetworkOutputs.push(powerOutput);
						}
						powerNetworkOutputs = newPowerNetworkOutputs;
					}
				}

				this.powerOutputs.set(startPowerAttachment, newPowerOutputs);
			} else {
				this.powerNetworks.delete(startPowerAttachment);
				this.powerOutputs.delete(startPowerAttachment);
				this.powerAttachmentsHistories.delete(startPowerAttachment);
			}
		}

		if (endPowerOutputs !== undefined) {
			const newPowerOutputs = new Set([...endPowerOutputs]);
			newPowerOutputs.delete(startPowerAttachment);

			if (newPowerOutputs.size() > 0) {
				const newEndPowerNetworkId = this.currentPowerNetworkId++;
				this.powerNetworks.set(endPowerAttachment, newEndPowerNetworkId);

				let powerNetworkOutputs: Attachment[] = [...newPowerOutputs];
				while (powerNetworkOutputs.size() > 0) {
					const newPowerNetworkOutputs: Attachment[] = [];
					for (const powerNetworkOutput of powerNetworkOutputs) {
						this.powerNetworks.set(powerNetworkOutput, newEndPowerNetworkId);

						for (const powerOutput of [...this.powerOutputs.get(powerNetworkOutput)!].filter(
							(powerOutput) => this.powerNetworks.get(powerOutput) !== newEndPowerNetworkId,
						)) {
							newPowerNetworkOutputs.push(powerOutput);
						}
						powerNetworkOutputs = newPowerNetworkOutputs;
					}
				}

				this.powerOutputs.set(endPowerAttachment, newPowerOutputs);
			} else {
				this.powerNetworks.delete(endPowerAttachment);
				this.powerOutputs.delete(endPowerAttachment);
				this.powerAttachmentsHistories.delete(endPowerAttachment);
			}
		}
	}

	//#region Helpers
	private getPowerNetworkConsumption(networkId: number): number {
		let powerNetworkConsumption: number = 0;
		for (const [powerAttachment, powerNetworkId] of this.powerNetworks) {
			if (powerNetworkId !== networkId) continue;

			const structureModel = powerAttachment.FindFirstAncestorOfClass("Model")!;
			const powerConsumption = STRUCTURES[structureModel.Name].constants["PowerConsumption"] as
				| number
				| undefined;
			if (powerConsumption === undefined) continue;

			const structureComponent = this.components.getComponents<StructureComponent>(structureModel)[0];
			if (structureComponent.getState() === "No Power" || structureComponent.getState() === "Working") {
				powerNetworkConsumption += powerConsumption;
			}
		}
		return powerNetworkConsumption;
	}

	private getPowerNetworkMaxConsumption(networkId: number): number {
		let powerNetworkMaxConsumption: number = 0;
		for (const [powerAttachment, powerNetworkId] of this.powerNetworks) {
			if (powerNetworkId !== networkId) continue;

			const structureModel = powerAttachment.FindFirstAncestorOfClass("Model")!;
			powerNetworkMaxConsumption +=
				(STRUCTURES[structureModel.Name].constants["PowerConsumption"] as number | undefined) ?? 0;
		}
		return powerNetworkMaxConsumption;
	}

	private getPowerNetworkProduction(networkId: number): number {
		let powerNetworkProduction: number = 0;
		for (const [powerAttachment, powerNetworkId] of this.powerNetworks) {
			if (powerNetworkId !== networkId) continue;

			const structureModel = powerAttachment.FindFirstAncestorOfClass("Model")!;
			const powerGeneratorComponents = this.components.getComponents<PowerGeneratorComponent>(structureModel);
			const powerGeneratorComponent =
				powerGeneratorComponents.size() > 0 ? powerGeneratorComponents[0] : undefined;
			if (powerGeneratorComponent === undefined) continue;
			powerNetworkProduction += powerGeneratorComponent.getPowerProduction();
		}
		return powerNetworkProduction;
	}

	private getPowerNetworkMaxProduction(networkId: number): number {
		let powerNetworkMaxProduction: number = 0;
		for (const [powerAttachment, powerNetworkId] of this.powerNetworks) {
			if (powerNetworkId !== networkId) continue;

			const structureModel = powerAttachment.FindFirstAncestorOfClass("Model")!;
			powerNetworkMaxProduction +=
				(STRUCTURES[structureModel.Name].constants["MaxPowerProduction"] as number | undefined) ?? 0;
		}
		return powerNetworkMaxProduction;
	}

	public getPowerNetworkId(powerAttachment: Attachment): number | undefined {
		return this.powerNetworks.get(powerAttachment);
	}

	public getPowerNetworkHistory(powerAttachment: Attachment) {
		return this.powerAttachmentsHistories.get(powerAttachment);
	}
	//#endregion
}
