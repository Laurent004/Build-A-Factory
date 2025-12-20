import { Components } from "@flamework/components";
import { Dependency } from "@flamework/core";
import { Object } from "@rbxts/luau-polyfill";
import { Players, Workspace } from "@rbxts/services";
import Signal from "@rbxts/signal";
import IndicatorLightComponent from "client/components/indicator-light";
import PowerGeneratorComponent from "client/components/power/power-generator";
import StructureComponent from "client/components/structure";
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
	private readonly powerNetworks = new Map<Attachment, Set<Attachment>>();
	private readonly attachmentsHistories = new Map<Attachment, PowerNetworkInfo[]>();
	public readonly onUpdate = new Signal<() => void>();

	private constructor() {
		this.initEvents();
		this.startUpdating();
	}

	private initEvents(): void {
		Events.OnPlotReset.connect(() => {
			for (const [attachment] of this.powerNetworks) {
				if (attachment.Parent !== undefined) continue;
				this.powerNetworks.delete(attachment);
				this.attachmentsHistories.delete(attachment);
			}
		});

		Events.OnPowerLineCreation.connect((_, powerLine) => {
			while (powerLine.Attachment0 === undefined || powerLine.Attachment1 === undefined) task.wait();
			this.connect(powerLine.Attachment0, powerLine.Attachment1);
		});

		Events.OnPowerLineDestroying.connect((player, startAttachment, endAttachment) => {
			this.disconnect(player, startAttachment, endAttachment);
		});

		this.components.onComponentAdded<StructureComponent>((structureComponent, structureModel) => {
			if (this.components.getComponent<IndicatorLightComponent>(structureModel) !== undefined) {
				this.structures.add(structureComponent);
			}
		});

		this.components.onComponentRemoved<StructureComponent>((structureComponent) => {
			this.structures.delete(structureComponent);
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
				this.updateAttachmentsHistories();
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

		for (const powerNetwork of [...new Set(Object.values(this.powerNetworks))]) {
			const powerNetworkStructures = [...this.structures].filter(
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

			if (
				this.getPowerNetworkProduction(powerNetwork) <= 0 ||
				this.getPowerNetworkConsumption(powerNetwork) > this.getPowerNetworkProduction(powerNetwork)
			) {
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

	private updateAttachmentsHistories(): void {
		for (const [attachment, powerNetwork] of this.powerNetworks) {
			const newAttachmentHistory = [
				...(this.attachmentsHistories.get(attachment) ?? []),
				{
					consumption: this.getPowerNetworkConsumption(powerNetwork),
					production: this.getPowerNetworkProduction(powerNetwork),
					maxConsumption: this.getPowerNetworkMaxConsumption(powerNetwork),
					maxProduction: this.getPowerNetworkMaxProduction(powerNetwork),
				},
			];
			if (newAttachmentHistory.size() === 30) {
				newAttachmentHistory.shift();
			}
			this.attachmentsHistories.set(attachment, newAttachmentHistory);
		}
	}

	public attemptConnect(startAttachment: Attachment, endAttachment: Attachment): void {
		if (!this.canConnect(startAttachment, endAttachment)) return;
		const startStructureModel = startAttachment.FindFirstAncestorOfClass("Model")!;
		const endStructureModel = endAttachment.FindFirstAncestorOfClass("Model")!;
		const startStructureModelPowerLines = (
			Workspace.WaitForChild("Plots")
				.GetChildren()
				.find((plot) => plot.GetAttribute("UserId") === Players.LocalPlayer.UserId)!
				.WaitForChild("Power Lines")
				.GetChildren() as RopeConstraint[]
		).filter(
			(powerLine) =>
				(powerLine.Attachment0 === startAttachment &&
					powerLine.Attachment1?.FindFirstAncestorOfClass("Model") !== startStructureModel) ||
				(powerLine.Attachment1 === startAttachment &&
					powerLine.Attachment0?.FindFirstAncestorOfClass("Model") !== startStructureModel),
		);
		const endStructureModelPowerLines = (
			Workspace.WaitForChild("Plots")
				.GetChildren()
				.find((plot) => plot.GetAttribute("UserId") === Players.LocalPlayer.UserId)!
				.WaitForChild("Power Lines")
				.GetChildren() as RopeConstraint[]
		).filter(
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
			Events.DestroyPowerLine(startAttachment, endAttachment);
			return;
		}

		if (
			startStructureModel !== endStructureModel &&
			startStructureModelPowerLines?.size() ===
				(startStructureModel.Name === "Power Pole"
					? (STRUCTURES["Power Pole"].constants["MaxConnections"] as number)
					: 1)
		) {
			Events.DestroyPowerLine(
				startStructureModelPowerLines[0].Attachment0!,
				startStructureModelPowerLines[0].Attachment1!,
			);
		}

		if (
			startStructureModel !== endStructureModel &&
			endStructureModelPowerLines?.size() ===
				(endStructureModel.Name === "Power Pole"
					? (STRUCTURES["Power Pole"].constants["MaxConnections"] as number)
					: 1)
		) {
			Events.DestroyPowerLine(
				endStructureModelPowerLines[0].Attachment0!,
				endStructureModelPowerLines[0].Attachment1!,
			);
		}

		Events.CreatePowerLine(startAttachment, endAttachment);
	}

	private connect(startAttachment: Attachment, endAttachment: Attachment): void {
		if (this.powerNetworks.has(startAttachment) || this.powerNetworks.has(endAttachment)) {
			const startPowerNetwork = this.powerNetworks.get(startAttachment);
			const endPowerNetwork = this.powerNetworks.get(endAttachment);

			const newPowerNetwork = new Set<Attachment>([
				startAttachment,
				endAttachment,
				...[...(startPowerNetwork ?? new Set<Attachment>())],
				...[...(endPowerNetwork ?? new Set<Attachment>())],
			]);
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
	}

	public canConnect(startAttachment: Attachment, endAttachment: Attachment): boolean {
		if (startAttachment === endAttachment) return false;
		const startStructureModel = startAttachment.FindFirstAncestorOfClass("Model")!;
		const endStructureModel = endAttachment.FindFirstAncestorOfClass("Model")!;
		if (startStructureModel === endStructureModel) return false;
		const startStructureDefinition = STRUCTURES[startStructureModel.Name];
		const endStructureDefinition = STRUCTURES[endStructureModel.Name];
		if (startStructureModel.Name === "Power Pole" || startStructureModel.Name === "Power Switch") {
			return (
				endStructureDefinition.constants["PowerConsumption"] !== undefined ||
				endStructureDefinition.category === "Power"
			);
		}
		return startStructureDefinition.constants["PowerProduction"] !== undefined
			? endStructureDefinition.constants["PowerConsumption"] !== undefined ||
					(endStructureDefinition.category === "Power" &&
						endStructureDefinition.constants["PowerProduction"] === undefined)
			: endStructureDefinition.category === "Power";
	}

	private disconnect(player: Player, startAttachment: Attachment, endAttachment: Attachment): void {
		const powerLines = (
			Workspace.WaitForChild("Plots")
				.GetChildren()
				.find((plot) => plot.GetAttribute("UserId") === player.UserId)!
				.WaitForChild("Power Lines")
				.GetChildren() as RopeConstraint[]
		).filter(
			(powerLine) =>
				!(
					(powerLine.Attachment0 === startAttachment && powerLine.Attachment1 === endAttachment) ||
					(powerLine.Attachment0 === endAttachment && powerLine.Attachment1 === startAttachment)
				),
		);

		const newStartPowerNetwork = new Set<Attachment>([startAttachment]);
		const newStartPowerNetworkQueue: Attachment[] = [startAttachment];
		while (newStartPowerNetworkQueue.size() > 0) {
			const attachment = newStartPowerNetworkQueue.shift()!;
			for (const powerLine of powerLines.filter(
				(powerLine) => powerLine.Attachment0 === attachment || powerLine.Attachment1 === attachment,
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
			this.attachmentsHistories.delete(startAttachment);
		} else {
			for (const attachment of [startAttachment, ...newStartPowerNetwork]) {
				this.powerNetworks.set(attachment, newStartPowerNetwork);
			}
		}

		const newEndPowerNetwork = new Set<Attachment>([endAttachment]);
		const newEndPowerNetworkQueue: Attachment[] = [endAttachment];
		while (newEndPowerNetworkQueue.size() > 0) {
			const attachment = newEndPowerNetworkQueue.shift()!;
			for (const powerLine of powerLines.filter(
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
			this.attachmentsHistories.delete(endAttachment);
		} else {
			for (const attachment of [endAttachment, ...newEndPowerNetwork]) {
				this.powerNetworks.set(attachment, newEndPowerNetwork);
			}
		}
	}

	private getPowerNetworkConsumption(powerNetwork: Set<Attachment>): number {
		let powerNetworkConsumption: number = 0;
		for (const attachment of powerNetwork) {
			const structureModel = attachment.FindFirstAncestorOfClass("Model")!;
			const powerConsumption = STRUCTURES[structureModel.Name].constants["PowerConsumption"] as
				| number
				| undefined;
			if (powerConsumption === undefined) continue;
			if (
				this.components
					.getComponents<StructureComponent>(structureModel)
					.find(
						(structureComponent) =>
							structureComponent.getState() === "No Power" || structureComponent.getState() === "Working",
					)
			) {
				powerNetworkConsumption += powerConsumption;
			}
		}
		return powerNetworkConsumption;
	}

	private getPowerNetworkMaxConsumption(powerNetwork: Set<Attachment>): number {
		let powerNetworkMaxConsumption: number = 0;
		for (const attachment of powerNetwork) {
			powerNetworkMaxConsumption +=
				(STRUCTURES[attachment.FindFirstAncestorOfClass("Model")!.Name].constants["PowerConsumption"] as
					| number
					| undefined) ?? 0;
		}
		return powerNetworkMaxConsumption;
	}

	private getPowerNetworkProduction(powerNetwork: Set<Attachment>): number {
		let powerNetworkProduction: number = 0;
		for (const attachment of powerNetwork) {
			for (const powerGeneratorComponent of this.components.getComponents<PowerGeneratorComponent>(
				attachment.FindFirstAncestorOfClass("Model")!,
			)) {
				powerNetworkProduction += powerGeneratorComponent.getPowerProduction();
			}
		}
		return powerNetworkProduction;
	}

	private getPowerNetworkMaxProduction(powerNetwork: Set<Attachment>): number {
		let powerNetworkMaxProduction: number = 0;
		for (const attachment of powerNetwork) {
			powerNetworkMaxProduction +=
				(STRUCTURES[attachment.FindFirstAncestorOfClass("Model")!.Name].constants["PowerProduction"] as
					| number
					| undefined) ?? 0;
		}
		return powerNetworkMaxProduction;
	}

	public getAttachmentHistory(attachment: Attachment): PowerNetworkInfo[] | undefined {
		return this.attachmentsHistories.get(attachment);
	}
}
