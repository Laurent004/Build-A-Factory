import { OnStart, OnTick, Service } from "@flamework/core";
import { RunService } from "@rbxts/services";
import TransporterComponent from "server/components/structures/transporter";
import { Item } from "shared/constants/items/types";

@Service({})
export default class ItemTransportationService implements OnStart {
	private readonly queuedTransporters = new Set<TransporterComponent>();

	onStart(): void {
		this.startUpdating();
	}

	public addTransporter(from: TransporterComponent, to: TransporterComponent) {
		const outputItem = from.outputItem();
		if (outputItem === undefined || outputItem.isDestroyed()) return;

		to.addQueuedItem(outputItem);
		const transportDuration = 1 / from.attributes.transportSpeed!;
		task.delay(transportDuration, () => {
			if (outputItem.isDestroyed()) return;
			this.onTransportCompleted(to, outputItem);
		});
	}

	private onTransportCompleted(to: TransporterComponent, outputItem: Item) {
		to.inputItem(outputItem);
		if (!to.canOutputItem()) {
			this.addTransporterToQueue(to);
			return;
		}
		const outputTransporter = to.getOutputTransporter();
		if (
			outputTransporter === undefined ||
			!outputTransporter.getInputsTransporters().includes(to) ||
			!outputTransporter.canInputItem(to.getItem()!.getName())
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
					outputTransporter.canInputItem(queuedTransporter.getItem()!.getName())
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
