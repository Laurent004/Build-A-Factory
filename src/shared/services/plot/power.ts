import { Components } from "@flamework/components";
import { Dependency } from "@flamework/core";
import { Object } from "@rbxts/luau-polyfill";
import { RunService, Workspace } from "@rbxts/services";
import Signal from "@rbxts/signal";
import StructureComponent from "shared/components/structure";
import { createPowerLine, STRUCTURES } from "shared/constants/structures";

export interface PowerConsumer {
	state: string;
	readonly OnStateChanged: Signal<(state: string) => void>;
	getPowerConsumption(): number;
	getEfficiency(): number;
	setState(state: string): void;
	updateState(): void;
}

export interface PowerProducer {
	state?: string;
	OnStateChanged?: Signal<(state: string) => void>;
	getPowerProduction(): number;
	getEfficiency?(): number;
	setState?(state: string): void;
	updateState?(): void;
}

export function isPowerConsumer(object: unknown): object is PowerConsumer {
	return typeIs(object, "table") && "getPowerConsumption" in object && typeIs(object.getPowerConsumption, "function");
}

export function isPowerProducer(object: unknown): object is PowerProducer {
	return typeIs(object, "table") && "getPowerProduction" in object && typeIs(object.getPowerProduction, "function");
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
	private readonly structures = new Set<StructureComponent & (PowerConsumer | PowerProducer)>();
	private readonly powerNetworks = new Map<Attachment, Set<Attachment>>();

	private constructor() {
		this.initEvents();
		this.startUpdatingStructuresStates();
	}

	private initEvents(): void {
		this.components.onComponentAdded<StructureComponent>((structureComponent) => {
			if (!isPowerConsumer(structureComponent) && !isPowerProducer(structureComponent)) return;
			this.structures.add(structureComponent);
		});

		this.components.onComponentRemoved<StructureComponent>((structureComponent) => {
			if (!isPowerConsumer(structureComponent) && !isPowerProducer(structureComponent)) return;
			this.structures.delete(structureComponent);
		});
	}

	private startUpdatingStructuresStates(): void {
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
				) !== undefined
			)
				continue;
			structure.setState?.("No Connection");
		}

		for (const powerNetwork of [...new Set(Object.values(this.powerNetworks))]) {
			const powerNetworkConsumption = this.getPowerNetworkConsumption(powerNetwork);
			const powerNetworkProduction = this.getPowerNetworkProduction(powerNetwork);
			const structures = [...this.structures].filter(
				(structure) =>
					this.powerNetworks.get(
						structure.instance
							.GetDescendants()
							.find(
								(instance): instance is Attachment =>
									instance.IsA("Attachment") && instance.Name === "PowerAttachment",
							)!,
					) === powerNetwork,
			);
			if (powerNetworkProduction <= 0 || powerNetworkConsumption > powerNetworkProduction) {
				for (const structure of structures) {
					structure.setState?.("No Power");
				}
			} else {
				for (const structure of structures) {
					structure.updateState?.();
				}
			}
		}
	}

	public connect(player: Player, startAttachment: Attachment, endAttachment: Attachment): void {
		const isServer = RunService.IsServer();
		if (isServer) {
			const powerLines = Workspace.WaitForChild("Plots")
				.GetChildren()
				.find((plot) => plot.GetAttribute("UserId") === player.UserId)!
				.WaitForChild("PowerLines")
				.GetChildren() as RopeConstraint[];

			const startStructureModel = startAttachment.FindFirstAncestorOfClass("Model")!;
			const startStructureModelPowerLines = powerLines.filter(
				(powerLine) =>
					(powerLine.Attachment0 === startAttachment &&
						powerLine.Attachment1?.FindFirstAncestorOfClass("Model") !== startStructureModel) ||
					(powerLine.Attachment1 === startAttachment &&
						powerLine.Attachment0?.FindFirstAncestorOfClass("Model") !== startStructureModel),
			);

			const endStructureModel = endAttachment.FindFirstAncestorOfClass("Model")!;
			const endStructureModelPowerLines = powerLines.filter(
				(powerLine) =>
					(powerLine.Attachment0 === endAttachment &&
						powerLine.Attachment1?.FindFirstAncestorOfClass("Model") !== endStructureModel) ||
					(powerLine.Attachment1 === endAttachment &&
						powerLine.Attachment0?.FindFirstAncestorOfClass("Model") !== endStructureModel),
			);

			if (
				[...startStructureModelPowerLines, ...endStructureModelPowerLines].find(
					(powerLine) =>
						(powerLine.Attachment0 === startAttachment && powerLine.Attachment1 === endAttachment) ||
						(powerLine.Attachment0 === endAttachment && powerLine.Attachment1 === startAttachment),
				)
			) {
				this.disconnect(player, startAttachment, endAttachment);
				return;
			}

			if (
				startStructureModel !== endStructureModel &&
				startStructureModelPowerLines.size() ===
					(STRUCTURES[startStructureModel.Name].constants["MaxConnections"] !== undefined
						? (STRUCTURES[startStructureModel.Name].constants["MaxConnections"] as number) /
						  startStructureModel
								.GetDescendants()
								.filter(
									(instance): instance is Attachment =>
										instance.IsA("Attachment") && instance.Name === "PowerAttachment",
								)
								.size()
						: 1)
			) {
				this.disconnect(
					player,
					startStructureModelPowerLines[0].Attachment0!,
					startStructureModelPowerLines[0].Attachment1!,
				);
			}

			if (
				startStructureModel !== endStructureModel &&
				endStructureModelPowerLines.size() ===
					(STRUCTURES[endStructureModel.Name].constants["MaxConnections"] !== undefined
						? (STRUCTURES[endStructureModel.Name].constants["MaxConnections"] as number) /
						  endStructureModel
								.GetDescendants()
								.filter(
									(instance): instance is Attachment =>
										instance.IsA("Attachment") && instance.Name === "PowerAttachment",
								)
								.size()
						: 1)
			) {
				this.disconnect(
					player,
					endStructureModelPowerLines[0].Attachment0!,
					endStructureModelPowerLines[0].Attachment1!,
				);
			}
		}

		const startPowerNetwork = this.powerNetworks.get(startAttachment);
		const endPowerNetwork = this.powerNetworks.get(endAttachment);
		if (startPowerNetwork !== undefined || endPowerNetwork !== undefined) {
			const newPowerNetwork = new Set<Attachment>([startAttachment, endAttachment]);
			if (startPowerNetwork !== undefined) {
				for (const attachment of startPowerNetwork) {
					newPowerNetwork.add(attachment);
				}
			}
			if (endPowerNetwork !== undefined) {
				for (const attachment of endPowerNetwork) {
					newPowerNetwork.add(attachment);
				}
			}
			this.powerNetworks.set(startAttachment, newPowerNetwork);
			this.powerNetworks.set(endAttachment, newPowerNetwork);
			for (const [attachment, powerNetwork] of this.powerNetworks) {
				if (powerNetwork !== startPowerNetwork && powerNetwork !== endPowerNetwork) continue;
				this.powerNetworks.set(attachment, newPowerNetwork);
			}
		} else {
			const newPowerNetwork = new Set<Attachment>([startAttachment, endAttachment]);
			this.powerNetworks.set(startAttachment, newPowerNetwork);
			this.powerNetworks.set(endAttachment, newPowerNetwork);
		}

		if (isServer) {
			createPowerLine(
				startAttachment,
				endAttachment,
				Workspace.WaitForChild("Plots")
					.GetChildren()
					.find((plot): plot is Model => plot.GetAttribute("UserId") === player.UserId)!
					.WaitForChild("PowerLines"),
			);
		}
	}

	public canConnect(startAttachment: Attachment, endAttachment: Attachment): boolean {
		if (startAttachment === endAttachment) return false;
		const startStructureModel = startAttachment.FindFirstAncestorOfClass("Model")!;
		const endStructureModel = endAttachment.FindFirstAncestorOfClass("Model")!;
		if (startStructureModel === endStructureModel) return false;
		const startStructureDefinition = STRUCTURES[startStructureModel.Name];
		const endStructureDefinition = STRUCTURES[endStructureModel.Name];
		const isStartPowerPole = startStructureDefinition.constants["MaxConnections"] !== undefined;
		const isEndPowerPole = endStructureDefinition.constants["MaxConnections"] !== undefined;
		const isStartPowerSwitch =
			startStructureModel
				.GetDescendants()
				.filter(
					(instance): instance is Attachment =>
						instance.IsA("Attachment") && instance.Name === "PowerAttachment",
				)
				.size() > 1;
		const isEndPowerSwitch =
			endStructureModel
				.GetDescendants()
				.filter(
					(instance): instance is Attachment =>
						instance.IsA("Attachment") && instance.Name === "PowerAttachment",
				)
				.size() > 1;
		return (
			((startStructureDefinition.constants["PowerProduction"] !== undefined ||
				isStartPowerPole ||
				isStartPowerSwitch) &&
				(endStructureDefinition.constants["PowerConsumption"] !== undefined ||
					isEndPowerPole ||
					isEndPowerSwitch)) ||
			((startStructureDefinition.constants["PowerConsumption"] !== undefined ||
				isStartPowerPole ||
				isStartPowerSwitch) &&
				(endStructureDefinition.constants["PowerProduction"] !== undefined ||
					isEndPowerPole ||
					isEndPowerSwitch))
		);
	}

	public disconnect(player: Player, startAttachment: Attachment, endAttachment: Attachment): void {
		const powerLinesFolder = Workspace.WaitForChild("Plots")
			.GetChildren()
			.find((plot) => plot.GetAttribute("UserId") === player.UserId)!
			.WaitForChild("PowerLines");
		const otherPowerLines = (powerLinesFolder.GetChildren() as RopeConstraint[]).filter(
			(powerLine) =>
				(powerLine.Attachment0 !== startAttachment || powerLine.Attachment1 !== endAttachment) &&
				(powerLine.Attachment0 !== endAttachment || powerLine.Attachment1 !== startAttachment),
		);

		const newStartPowerNetwork = new Set<Attachment>([startAttachment]);
		const newStartPowerNetworkQueue = [startAttachment];
		while (newStartPowerNetworkQueue.size() > 0) {
			const attachment = newStartPowerNetworkQueue.shift()!;
			for (const powerLine of otherPowerLines.filter(
				(powerLine) =>
					(powerLine.Attachment0 === attachment || powerLine.Attachment1 === attachment) &&
					powerLine !==
						otherPowerLines.find(
							(powerLine) =>
								(powerLine.Attachment0 === startAttachment &&
									powerLine.Attachment1 === endAttachment) ||
								(powerLine.Attachment1 === startAttachment && powerLine.Attachment0 === endAttachment),
						)!,
			)) {
				if (!newStartPowerNetwork.has(powerLine.Attachment0!)) {
					newStartPowerNetwork.add(powerLine.Attachment0!);
					newStartPowerNetworkQueue.push(powerLine.Attachment0!);
				}
				if (!newStartPowerNetwork.has(powerLine.Attachment1!)) {
					newStartPowerNetwork.add(powerLine.Attachment1!);
					newStartPowerNetworkQueue.push(powerLine.Attachment1!);
				}
			}
		}
		if (newStartPowerNetwork.size() === 1) {
			this.powerNetworks.delete(startAttachment);
		} else {
			for (const attachment of [startAttachment, ...newStartPowerNetwork]) {
				this.powerNetworks.set(attachment, newStartPowerNetwork);
			}
		}

		const newEndPowerNetwork = new Set<Attachment>([endAttachment]);
		const newEndPowerNetworkQueue = [endAttachment];
		while (newEndPowerNetworkQueue.size() > 0) {
			const attachment = newEndPowerNetworkQueue.shift()!;
			for (const powerLine of otherPowerLines.filter(
				(powerLine) => powerLine.Attachment0 === attachment || powerLine.Attachment1 === attachment,
			)) {
				if (!newEndPowerNetwork.has(powerLine.Attachment0!)) {
					newEndPowerNetwork.add(powerLine.Attachment0!);
					newEndPowerNetworkQueue.push(powerLine.Attachment0!);
				}
				if (!newEndPowerNetwork.has(powerLine.Attachment1!)) {
					newEndPowerNetwork.add(powerLine.Attachment1!);
					newEndPowerNetworkQueue.push(powerLine.Attachment1!);
				}
			}
		}
		if (newEndPowerNetwork.size() === 1) {
			this.powerNetworks.delete(endAttachment);
		} else {
			for (const attachment of [endAttachment, ...newEndPowerNetwork]) {
				this.powerNetworks.set(attachment, newEndPowerNetwork);
			}
		}

		if (RunService.IsServer()) {
			(powerLinesFolder.GetChildren() as RopeConstraint[])
				.find(
					(powerLine) =>
						(powerLine.Attachment0 === startAttachment && powerLine.Attachment1 === endAttachment) ||
						(powerLine.Attachment1 === startAttachment && powerLine.Attachment0 === endAttachment),
				)
				?.Destroy();
		}
	}

	public getPowerNetworks(): Map<Attachment, Set<Attachment>> {
		return this.powerNetworks;
	}

	public getPowerNetworkConsumption(powerNetwork: Set<Attachment>): number {
		let powerNetworkConsumption = 0;
		for (const attachment of powerNetwork) {
			powerNetworkConsumption +=
				this.components
					.getComponents<PowerConsumer>(attachment.FindFirstAncestorOfClass("Model")!)[0]
					?.getPowerConsumption() ?? 0;
		}
		return powerNetworkConsumption;
	}

	public getPowerNetworkMaxConsumption(powerNetwork: Set<Attachment>): number {
		let powerNetworkMaxConsumption = 0;
		for (const attachment of powerNetwork) {
			powerNetworkMaxConsumption += (STRUCTURES[attachment.FindFirstAncestorOfClass("Model")!.Name].constants[
				"PowerConsumption"
			] ?? 0) as number;
		}
		return powerNetworkMaxConsumption;
	}

	public getPowerNetworkProduction(powerNetwork: Set<Attachment>): number {
		let powerNetworkProduction = 0;
		for (const attachment of powerNetwork) {
			powerNetworkProduction +=
				this.components
					.getComponents<PowerProducer>(attachment.FindFirstAncestorOfClass("Model")!)[0]
					?.getPowerProduction() ?? 0;
		}
		return powerNetworkProduction;
	}

	public getPowerNetworkMaxProduction(powerNetwork: Set<Attachment>): number {
		let powerNetworkMaxProduction = 0;
		for (const attachment of powerNetwork) {
			powerNetworkMaxProduction += (STRUCTURES[attachment.FindFirstAncestorOfClass("Model")!.Name].constants[
				"PowerProduction"
			] ?? 0) as number;
		}
		return powerNetworkMaxProduction;
	}
}
