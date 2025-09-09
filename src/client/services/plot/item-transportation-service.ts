import { RunService, TweenService } from "@rbxts/services";
import TransporterComponent from "client/components/transporters/transporter";
import { ItemName } from "shared/constants/items";
import { getStructureItemNodeWorldCF } from "shared/constants/structures";

export default class ItemTransportationService {
	//#region Singleton
	private static _inst: ItemTransportationService;
	public static getInst(): ItemTransportationService {
		this._inst = this._inst ?? new ItemTransportationService();
		return this._inst;
	}
	//#endregion
	private readonly queuedTransporters = new Set<TransporterComponent>();

	constructor() {
		this.startUpdating();
	}

	public addTransporter(from: TransporterComponent, to: TransporterComponent) {
		const outputItem = from.outputItem();
		if (outputItem === undefined || outputItem.Parent === undefined) return;

		to.addQueuedItem(outputItem);
		const transportDuration = 1 / from.attributes.transportSpeed!;
		const transportTI = new TweenInfo(transportDuration, Enum.EasingStyle.Linear, Enum.EasingDirection.In);
		TweenService.Create(outputItem.PrimaryPart!, transportTI, {
			CFrame: getStructureItemNodeWorldCF(to.instance),
		}).Play();
		task.delay(transportDuration, () => {
			if (outputItem.Parent === undefined) return;
			this.onTransportCompleted(to, outputItem);
		});
	}

	private onTransportCompleted(to: TransporterComponent, outputItem: Model) {
		to.inputItem(outputItem);
		if (!to.canOutputItem()) {
			this.addTransporterToQueue(to);
			return;
		}
		const outputTransporter = to.getOutputTransporter();
		if (
			outputTransporter === undefined ||
			!outputTransporter.getInputsTransporters().includes(to) ||
			!outputTransporter.canInputItem(to.getItem()!.Name as ItemName)
		) {
			this.addTransporterToQueue(to);
			return;
		}
		this.addTransporter(to, outputTransporter);
	}

	private startUpdating() {
		RunService.Heartbeat.Connect(() => {
			this.updateQueuedTransporters();
		});
	}

	private addTransporterToQueue(transporter: TransporterComponent) {
		this.queuedTransporters.add(transporter);
		const connection = transporter.instance.Destroying.Connect(() => {
			this.removeTransporterFromQueue(transporter);
			connection.Disconnect();
		});
	}

	private updateQueuedTransporters() {
		const queuedTransportersToAdd = new Map<TransporterComponent, TransporterComponent>();
		for (const queuedTransporter of this.queuedTransporters) {
			if (queuedTransporter.getItem() === undefined) {
				this.removeTransporterFromQueue(queuedTransporter);
				continue;
			}

			if (queuedTransporter.canOutputItem()) {
				const outputTransporter = queuedTransporter.getOutputTransporter();
				if (
					outputTransporter !== undefined &&
					outputTransporter.getInputsTransporters().includes(queuedTransporter) &&
					outputTransporter.canInputItem(queuedTransporter.getItem()!.Name as ItemName)
				) {
					queuedTransportersToAdd.set(queuedTransporter, outputTransporter);
				}
			}
		}

		for (const [queuedTransporter, outputTransporter] of queuedTransportersToAdd) {
			this.removeTransporterFromQueue(queuedTransporter);
			this.addTransporter(queuedTransporter, outputTransporter);
		}
	}

	private removeTransporterFromQueue(transporter: TransporterComponent) {
		this.queuedTransporters.delete(transporter);
	}
}
