import { OnInit, OnTick, Service } from "@flamework/core";
import TransporterComponent from "server/components/transporters/transporter";
import { Events } from "server/network";
import { Item } from "shared/constants/items";

@Service({})
export default class TransportService implements OnInit, OnTick {
	private readonly queuedTransporters = new Set<TransporterComponent>();

	onInit(): void | Promise<void> {
		this.initEvents();
	}

	onTick(): void {
		this.updateQueue();
	}

	private initEvents(): void {
		Events.StartStructuresMovement.connect((_, structuresModels) => {
			for (const queuedTransporter of this.queuedTransporters) {
				if (structuresModels.includes(queuedTransporter.instance)) {
					this.unregisterFromQueue(queuedTransporter);
				}
			}
		});

		Events.DestroyStructures.connect((_, structuresModels) => {
			for (const queuedTransporter of this.queuedTransporters) {
				if (structuresModels.includes(queuedTransporter.instance)) {
					this.unregisterFromQueue(queuedTransporter);
				}
			}
		});

		Events.ClearStructuresItems.connect((_, structuresModels) => {
			for (const queuedTransporter of this.queuedTransporters) {
				if (structuresModels.includes(queuedTransporter.instance)) {
					this.unregisterFromQueue(queuedTransporter);
				}
			}
		});
	}

	public register(from: TransporterComponent, to: TransporterComponent): void {
		const outputItem = from.outputItem();
		if (outputItem === undefined || outputItem.destroyed) return;
		to.addQueuedItem(outputItem);

		task.delay(from.getTransportDuration(), () => {
			this.onTransportComplete(to, outputItem);
		});
	}

	private onTransportComplete(to: TransporterComponent, outputItem: Item): void {
		if (outputItem.destroyed) return;

		to.inputItem(outputItem);
		if (!to.canOutputItem()) {
			this.registerToQueue(to);
			return;
		}

		const outputTransporter = to.getOutputTransporter();
		if (
			outputTransporter === undefined ||
			!outputTransporter.getInputTransporters().includes(to) ||
			!outputTransporter.canInputItem(to.getItems()[0])
		) {
			this.registerToQueue(to);
			return;
		}

		this.register(to, outputTransporter);
	}

	public registerToQueue(transporter: TransporterComponent): void {
		this.queuedTransporters.add(transporter);
	}

	private updateQueue(): void {
		for (const queuedTransporter of this.queuedTransporters) {
			if (!queuedTransporter.canOutputItem()) continue;

			const outputTransporter = queuedTransporter.getOutputTransporter();
			if (
				outputTransporter !== undefined &&
				outputTransporter.getInputTransporters().includes(queuedTransporter) &&
				outputTransporter.canInputItem(queuedTransporter.getItems()[0])
			) {
				this.register(queuedTransporter, outputTransporter);
				if (queuedTransporter.getItems().size() === 0) {
					this.unregisterFromQueue(queuedTransporter);
				}
			}
		}
	}

	private unregisterFromQueue(queuedTransporter: TransporterComponent): void {
		this.queuedTransporters.delete(queuedTransporter);
	}
}
