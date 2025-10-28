import { RunService, TweenService } from "@rbxts/services";
import TransporterComponent from "client/components/transporters/transporter";
import { Events } from "client/network";
import { STRUCTURES } from "shared/constants/structures";

export default class TransportService {
	//#region Singleton
	private static _inst: TransportService;
	public static getInst(): TransportService {
		this._inst = this._inst ?? new TransportService();
		return this._inst;
	}
	//#endregion

	private readonly queuedTransporters = new Set<TransporterComponent>();

	private constructor() {
		this.initEvents();
		this.startUpdating();
	}

	private initEvents(): void {
		Events.OnStructuresMovementStart.connect((_, structuresModels) => {
			for (const queuedTransporter of this.queuedTransporters) {
				if (structuresModels.includes(queuedTransporter.instance)) {
					this.unregisterFromQueue(queuedTransporter);
				}
			}
		});

		Events.OnStructuresDestroying.connect((_, structuresModels) => {
			for (const queuedTransporter of this.queuedTransporters) {
				if (structuresModels.includes(queuedTransporter.instance)) {
					this.unregisterFromQueue(queuedTransporter);
				}
			}
		});

		Events.OnStructuresItemsClear.connect((structuresModels) => {
			for (const queuedTransporter of this.queuedTransporters) {
				if (structuresModels.includes(queuedTransporter.instance)) {
					this.unregisterFromQueue(queuedTransporter);
				}
			}
		});
	}

	private startUpdating(): void {
		RunService.Heartbeat.Connect(() => {
			this.updateQueue();
		});
	}

	public register(from: TransporterComponent, to: TransporterComponent): void {
		const outputItem = from.outputItem();
		if (outputItem === undefined || outputItem.Parent === undefined) return;
		to.addQueuedItem(outputItem);

		const transportDuration = from.getTransportDuration();

		let closestInputNodeWorldCF!: CFrame;
		let closestInputNodeWorldCFDistance: number = math.huge;
		for (const inputNodeWorldCF of STRUCTURES[to.instance.Name].nodes.inputs.map((inputNodeLocalCF) =>
			to.instance.GetPivot().mul(inputNodeLocalCF),
		)) {
			const distance = inputNodeWorldCF.Position.sub(outputItem.PrimaryPart!.CFrame.Position).Magnitude;
			if (distance < closestInputNodeWorldCFDistance) {
				closestInputNodeWorldCF = inputNodeWorldCF;
				closestInputNodeWorldCFDistance = distance;
			}
		}

		TweenService.Create(
			outputItem.PrimaryPart!,
			new TweenInfo(transportDuration, Enum.EasingStyle.Linear, Enum.EasingDirection.In),
			{
				CFrame: closestInputNodeWorldCF ?? to.instance.GetPivot(),
			},
		).Play();
		task.delay(transportDuration, () => {
			this.onTransportComplete(to, outputItem);
		});
	}

	private onTransportComplete(to: TransporterComponent, outputItem: Model): void {
		if (outputItem.Parent === undefined) return;

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
