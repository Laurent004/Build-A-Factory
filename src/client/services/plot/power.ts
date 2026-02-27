import { Components } from "@flamework/components";
import { Dependency } from "@flamework/core";
import { Object } from "@rbxts/luau-polyfill";
import { Players, Workspace } from "@rbxts/services";
import IndicatorLightComponent from "client/components/indicator-light";
import PowerGeneratorComponent from "client/components/power/power-generator";
import StructureComponent from "client/components/structure";
import { Events } from "client/network";
import { STRUCTURES } from "shared/constants/structures";

export default class PowerService {
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

	private constructor() {
		this.initEvents();
		this.startUpdatingStructuresStates();
	}

	private initEvents(): void {
		for (const plot of Workspace.WaitForChild("Plots").GetChildren()) {
			plot.WaitForChild("Power Lines").ChildAdded.Connect((child) => {
				if (!child.IsA("RopeConstraint")) return;
				while (child.Attachment0 === undefined || child.Attachment1 === undefined) task.wait();
				this.connect(child.Attachment0, child.Attachment1);
			});
			plot.WaitForChild("Power Lines").ChildRemoved.Connect((child) => {
				if (!child.IsA("RopeConstraint")) return;
				this.disconnect(
					Players.GetPlayerByUserId(plot.GetAttribute("UserId") as number)!,
					child.Attachment0!,
					child.Attachment1!,
				);
			});
		}

		this.components.onComponentAdded<StructureComponent>((structureComponent, structureModel) => {
			if (this.components.getComponent<IndicatorLightComponent>(structureModel) === undefined) return;
			this.structures.add(structureComponent);
		});

		this.components.onComponentRemoved<StructureComponent>((structureComponent) => {
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
			Events.DestroyPowerLine(
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
	}

	public canConnect(startAttachment: Attachment, endAttachment: Attachment): boolean {
		if (startAttachment === endAttachment) return false;
		const startStructureModel = startAttachment.FindFirstAncestorOfClass("Model")!;
		const endStructureModel = endAttachment.FindFirstAncestorOfClass("Model")!;
		if (startStructureModel === endStructureModel) return false;
		const endStructureDefinition = STRUCTURES[endStructureModel.Name];
		return (
			(STRUCTURES[startStructureModel.Name].constants["PowerProduction"] !== undefined
				? endStructureDefinition.constants["PowerConsumption"] !== undefined
				: STRUCTURES[startStructureModel.Name].constants["MaxConnections"] !== undefined ||
				  endStructureDefinition.constants["PowerProduction"] !== undefined) ||
			endStructureDefinition.constants["MaxConnections"] !== undefined ||
			endStructureDefinition.model
				.GetDescendants()
				.filter(
					(instance): instance is Attachment =>
						instance.IsA("Attachment") && instance.Name === "PowerAttachment",
				)
				.size() > 1
		);
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
		const newStartPowerNetworkQueue = [startAttachment];
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
		} else {
			for (const attachment of [startAttachment, ...newStartPowerNetwork]) {
				this.powerNetworks.set(attachment, newStartPowerNetwork);
			}
		}

		const newEndPowerNetwork = new Set<Attachment>([endAttachment]);
		const newEndPowerNetworkQueue = [endAttachment];
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
		} else {
			for (const attachment of [endAttachment, ...newEndPowerNetwork]) {
				this.powerNetworks.set(attachment, newEndPowerNetwork);
			}
		}
	}

	public getPowerNetworks(): Map<Attachment, Set<Attachment>> {
		return this.powerNetworks;
	}

	public getPowerNetworkConsumption(powerNetwork: Set<Attachment>): number {
		let powerNetworkConsumption = 0;
		for (const attachment of powerNetwork) {
			const structureModel = attachment.FindFirstAncestorOfClass("Model")!;
			const powerConsumption = STRUCTURES[structureModel.Name].constants["PowerConsumption"];
			if (powerConsumption === undefined) continue;
			if (
				this.components
					.getComponents<StructureComponent>(structureModel)
					.some(
						(structureComponent) =>
							structureComponent.state === "No Power" || structureComponent.state === "Working",
					)
			) {
				powerNetworkConsumption += powerConsumption as number;
			}
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
			for (const powerGeneratorComponent of this.components.getComponents<PowerGeneratorComponent>(
				attachment.FindFirstAncestorOfClass("Model")!,
			)) {
				powerNetworkProduction += powerGeneratorComponent.getPowerProduction();
			}
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
