import { Components } from "@flamework/components";
import { OnInit, OnStart, Service } from "@flamework/core";
import { Object } from "@rbxts/luau-polyfill";
import { Workspace } from "@rbxts/services";
import StructureComponent from "server/components/structure";
import { STRUCTURES } from "shared/constants/structures";
import { Events } from "server/network";
import { EventBus } from "server/event-bus";
import FactoryService from "shared/services/factory";

@Service({})
export default class PowerService implements OnInit, OnStart {
	private readonly factoryService = FactoryService.getInst();
	private readonly structures = new Set<StructureComponent>();
	private readonly powerNetworks = new Map<Attachment, Set<Attachment>>();

	constructor(private readonly components: Components) {}

	onInit(): void | Promise<void> {
		this.initEvents();
	}

	onStart(): void {
		this.startUpdatingStructuresStates();
	}

	private initEvents(): void {
		EventBus.OnPlotReset.Connect(() => {
			for (const [attachment] of this.powerNetworks) {
				if (attachment.Parent === undefined) this.powerNetworks.delete(attachment);
			}
		});

		this.components.onComponentAdded<StructureComponent>((structureComponent, structureModel) => {
			if (!structureModel.HasTag("IndicatorLight")) return;
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
		for (const structure of [...this.structures].filter(
			(structure) =>
				this.powerNetworks.get(
					structure.instance
						.GetDescendants()
						.find(
							(instance): instance is Attachment =>
								instance.IsA("Attachment") && instance.Name === "PowerAttachment",
						)!,
				) === undefined,
		)) {
			structure.setState("No Connection");
		}
		for (const powerNetwork of [...new Set(Object.values(this.powerNetworks))]) {
			const powerNetworkProduction = this.getPowerNetworkProduction(powerNetwork);
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
			if (powerNetworkProduction <= 0 || this.getPowerNetworkConsumption(powerNetwork) > powerNetworkProduction) {
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

	public attemptConnect(player: Player, startAttachment: Attachment, endAttachment: Attachment): void {
		if (!this.canConnect(startAttachment, endAttachment)) return;
		this.connect(player, startAttachment, endAttachment);
		Events.OnPowerLineCreation.broadcast(
			player,
			Workspace.WaitForChild("Plots")
				.GetChildren()
				.find((plot): plot is Model => plot.GetAttribute("UserId") === player.UserId)!
				.WaitForChild("Power Lines")
				.GetChildren()
				.find(
					(powerLine): powerLine is RopeConstraint =>
						powerLine.IsA("RopeConstraint") &&
						powerLine.Attachment0 === startAttachment &&
						powerLine.Attachment1 === endAttachment,
				)!,
		);
	}

	public connect(player: Player, startAttachment: Attachment, endAttachment: Attachment): void {
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

		this.factoryService.createPowerLine(
			startAttachment,
			endAttachment,
			Workspace.WaitForChild("Plots")
				.GetChildren()
				.find((plot): plot is Model => plot.GetAttribute("UserId") === player.UserId)!
				.WaitForChild("Power Lines"),
		);
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

	public attemptDisconnect(player: Player, startAttachment: Attachment, endAttachment: Attachment): void {
		if (!this.canDisconnect(player, startAttachment, endAttachment)) return;
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
		} else {
			for (const attachment of [endAttachment, ...newEndPowerNetwork]) {
				this.powerNetworks.set(attachment, newEndPowerNetwork);
			}
		}

		Events.OnPowerLineDestroying.broadcast(player, startAttachment, endAttachment);
		(
			Workspace.WaitForChild("Plots")
				.GetChildren()
				.find((plot): plot is Model => plot.GetAttribute("UserId") === player.UserId)!
				.WaitForChild("Power Lines")
				.GetChildren() as RopeConstraint[]
		)
			.find(
				(powerLine) =>
					(powerLine.Attachment0 === startAttachment && powerLine.Attachment1 === endAttachment) ||
					(powerLine.Attachment1 === startAttachment && powerLine.Attachment0 === endAttachment),
			)!
			.Destroy();
	}

	public canDisconnect(player: Player, startAttachment: Attachment, endAttachment: Attachment): boolean {
		const startStructureModel = startAttachment.FindFirstAncestorOfClass("Model")!;
		const endStructureModel = endAttachment.FindFirstAncestorOfClass("Model")!;
		const startStructureModelPowerLines = (
			Workspace.WaitForChild("Plots")
				.GetChildren()
				.find((plot) => plot.GetAttribute("UserId") === player.UserId)!
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
				.find((plot) => plot.GetAttribute("UserId") === player.UserId)!
				.WaitForChild("Power Lines")
				.GetChildren() as RopeConstraint[]
		).filter(
			(powerLine) =>
				(powerLine.Attachment0 === endAttachment &&
					powerLine.Attachment1?.FindFirstAncestorOfClass("Model") !== endStructureModel) ||
				(powerLine.Attachment1 === endAttachment &&
					powerLine.Attachment0?.FindFirstAncestorOfClass("Model") !== endStructureModel),
		);

		return (
			[...startStructureModelPowerLines, ...endStructureModelPowerLines].find(
				(powerLine) =>
					(powerLine.Attachment0 === startAttachment && powerLine.Attachment1 === endAttachment) ||
					(powerLine.Attachment0 === endAttachment && powerLine.Attachment1 === startAttachment),
			) !== undefined ||
			(startStructureModel !== endStructureModel &&
				(startStructureModelPowerLines.size() ===
					(STRUCTURES[startStructureModel.Name].constants["MaxConnections"] !== undefined
						? (STRUCTURES[startStructureModel.Name].constants["MaxConnections"] as number) /
						  startStructureModel
								.GetDescendants()
								.filter(
									(instance): instance is Attachment =>
										instance.IsA("Attachment") && instance.Name === "PowerAttachment",
								)
								.size()
						: 1) ||
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
							: 1)))
		);
	}

	private getPowerNetworkConsumption(powerNetwork: Set<Attachment>): number {
		return 0;
	}

	private getPowerNetworkProduction(powerNetwork: Set<Attachment>): number {
		return 0;
	}
}
