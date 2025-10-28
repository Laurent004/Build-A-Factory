import { Components } from "@flamework/components";
import { OnInit, OnStart, Service } from "@flamework/core";
import { Object } from "@rbxts/luau-polyfill";
import PowerGeneratorComponent from "server/components/power/power-generator";
import StructureComponent from "server/components/structure";
import { STRUCTURES } from "shared/constants/structures";

@Service({})
export default class PowerService implements OnInit, OnStart {
	private readonly structures = new Set<StructureComponent>();

	private readonly powerNetworks = new Map<Attachment, number>();
	private readonly powerOutputs = new Map<Attachment, Set<Attachment>>();

	private currentPowerNetworkId: number = 0;

	constructor(private readonly components: Components) {}

	onInit(): void | Promise<void> {
		this.initEvents();
	}

	onStart(): void {
		this.startUpdating();
	}

	private initEvents(): void {
		this.components.onComponentAdded<StructureComponent>((structureComponent, structureModel) => {
			if (structureModel.HasTag("IndicatorLight")) {
				this.structures.add(structureComponent);
			}
		});

		this.components.onComponentRemoved<StructureComponent>((structureComponent) => {
			if (this.structures.has(structureComponent)) {
				this.structures.delete(structureComponent);
			}
		});
	}

	private startUpdating(): void {
		task.spawn(() => {
			while (task.wait(0.1)) {
				this.updateStructuresStates();
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

	public connect(startPowerAttachment: Attachment, endPowerAttachment: Attachment): void {
		if (this.powerNetworks.has(startPowerAttachment) || this.powerNetworks.has(endPowerAttachment)) {
			const startStructureModel = startPowerAttachment.FindFirstAncestorOfClass("Model")!;
			const endStructureModel = endPowerAttachment.FindFirstAncestorOfClass("Model")!;

			const startPowerOutputs = this.powerOutputs.get(startPowerAttachment);
			const endPowerOutputs = this.powerOutputs.get(endPowerAttachment);
			if (startPowerOutputs?.has(endPowerAttachment) && endPowerOutputs?.has(startPowerAttachment)) {
				this.disconnect(startPowerAttachment, endPowerAttachment);
				return;
			}

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
					this.disconnect(startPowerAttachment, endPowerAttachment);
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
					this.disconnect(startPowerAttachment, endPowerAttachment);
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

	public canConnect(startPowerAttachment: Attachment, endPowerAttachment: Attachment): boolean {
		if (startPowerAttachment === endPowerAttachment) return false;
		const startStructureModel = startPowerAttachment.FindFirstAncestorOfClass("Model")!;
		const endStructureModel = endPowerAttachment.FindFirstAncestorOfClass("Model")!;

		const startStructureDefinition = STRUCTURES[startStructureModel.Name];
		const endStructureDefinition = STRUCTURES[endStructureModel.Name];

		switch (startStructureModel.Name) {
			case "Power Pole":
				return (
					endStructureDefinition.constants["PowerConsumption"] !== undefined ||
					endStructureDefinition.category === "Power"
				);
			case "Power Switch":
				return (
					startStructureModel !== endStructureModel &&
					(endStructureDefinition.constants["PowerConsumption"] !== undefined ||
						endStructureDefinition.category === "Power")
				);
			case "Power Storage":
				return (
					endStructureDefinition.constants["PowerConsumption"] !== undefined ||
					endStructureDefinition.category === "Power"
				);
			default:
				return startStructureDefinition.constants["MaxPowerProduction"] !== undefined
					? endStructureDefinition.constants["PowerConsumption"] !== undefined ||
							(endStructureDefinition.category === "Power" &&
								endStructureDefinition.constants["MaxPowerProduction"] === undefined)
					: endStructureDefinition.category === "Power";
		}
	}

	public disconnect(startPowerAttachment: Attachment, endPowerAttachment: Attachment): void {
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
			}
		}

		if (endPowerOutputs !== undefined) {
			const newPowerOutputs = new Set([...endPowerOutputs]);
			newPowerOutputs.delete(startPowerAttachment);

			if (newPowerOutputs.size() > 0) {
				const newPowerNetworkId = this.currentPowerNetworkId++;
				this.powerNetworks.set(endPowerAttachment, newPowerNetworkId);

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

				this.powerOutputs.set(endPowerAttachment, newPowerOutputs);
			} else {
				this.powerNetworks.delete(endPowerAttachment);
				this.powerOutputs.delete(endPowerAttachment);
			}
		}
	}

	//#region Helpers
	private getPowerNetworkConsumption(networkId: number): number {
		let powerNetworkPowerConsumption: number = 0;
		for (const [powerAttachment, powerNetworkId] of this.powerNetworks) {
			if (powerNetworkId !== networkId) continue;

			const structureModel = powerAttachment.FindFirstAncestorOfClass("Model")!;
			const powerConsumption = STRUCTURES[structureModel.Name].constants["PowerConsumption"] as
				| number
				| undefined;
			if (powerConsumption === undefined) continue;

			const structureComponent = this.components.getComponents<StructureComponent>(structureModel)[0];
			if (structureComponent.getState() === "No Power" || structureComponent.getState() === "Working") {
				powerNetworkPowerConsumption += powerConsumption;
			}
		}
		return powerNetworkPowerConsumption;
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
	//#endregion
}
