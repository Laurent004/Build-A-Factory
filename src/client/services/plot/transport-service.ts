import { Object } from "@rbxts/luau-polyfill";
import { RunService, TweenService } from "@rbxts/services";
import TransporterComponent from "client/components/logistics/transporter";
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

	private readonly queue = new Set<TransporterComponent>();

	private constructor() {
		this.initEvents();
		this.startUpdating();
	}

	private initEvents(): void {
		Events.OnStructuresMovementStart.connect((_, structuresModels) => {
			for (const queuedTransporter of this.queue) {
				if (structuresModels.includes(queuedTransporter.instance)) this.unregisterFromQueue(queuedTransporter);
			}
		});

		Events.OnStructuresDestroying.connect((_, structuresModels) => {
			for (const queuedTransporter of this.queue) {
				if (structuresModels.includes(queuedTransporter.instance)) this.unregisterFromQueue(queuedTransporter);
			}
		});
	}

	private startUpdating(): void {
		RunService.Heartbeat.Connect((dt) => {
			this.updateSolids();
			this.updateFluids(dt);
		});
	}

	public transport(transporter: TransporterComponent, outputTransporter: TransporterComponent): void {
		const solids = transporter.getSolids();
		if (solids.size() === 0) return;

		const outputSolid = solids[0];
		transporter.outputItem(outputSolid);
		outputTransporter.addQueuedSolid(outputSolid);

		if (outputSolid.model?.Parent !== undefined) {
			TweenService.Create(
				outputSolid.model.PrimaryPart!,
				new TweenInfo(
					1 / ((STRUCTURES[transporter.instance.Name].constants["ThroughputRate"] as number) / 60),
					Enum.EasingStyle.Linear,
					Enum.EasingDirection.In,
				),
				{
					CFrame:
						Object.keys(STRUCTURES[outputTransporter.instance.Name].nodes.inputs.solids)
							.map((inputNodeLocalCF) => outputTransporter.instance.GetPivot().mul(inputNodeLocalCF))
							.sort(
								(inputNodeWorldCFA, inputNodeWorldCFB) =>
									outputSolid.model!.PrimaryPart!.CFrame.Position.sub(inputNodeWorldCFA.Position)
										.Magnitude <
									outputSolid.model!.PrimaryPart!.CFrame.Position.sub(inputNodeWorldCFB.Position)
										.Magnitude,
							)[0] ?? outputTransporter.instance.GetPivot(),
				},
			).Play();
		}
		task.delay(1 / ((STRUCTURES[transporter.instance.Name].constants["ThroughputRate"] as number) / 60), () => {
			if (outputSolid.destroyed) return;
			outputTransporter.inputItem(outputSolid);
			if (!outputTransporter.canOutputItem()) {
				this.registerToQueue(outputTransporter);
				return;
			}

			const newOutputTransporter = outputTransporter
				.getOutputTransporters("Solid")
				.find(
					(outputTransporter) =>
						outputTransporter.getInputTransporters().includes(outputTransporter) &&
						outputTransporter.canInputItem(outputSolid),
				);
			if (newOutputTransporter === undefined) {
				this.registerToQueue(outputTransporter);
				return;
			}
			this.transport(outputTransporter, newOutputTransporter);
		});
	}

	public registerToQueue(transporter: TransporterComponent): void {
		this.queue.add(transporter);
	}

	private updateSolids(): void {
		for (const queuedTransporter of this.queue) {
			if (!queuedTransporter.canOutputItem()) continue;
			const outputTransporter = queuedTransporter
				.getOutputTransporters("Solid")
				.find(
					(outputTransporter) =>
						outputTransporter.getInputTransporters().includes(queuedTransporter) &&
						outputTransporter.canInputItem(queuedTransporter.getSolids()[0]),
				);
			if (outputTransporter === undefined) continue;
			this.transport(queuedTransporter, outputTransporter);
			if (queuedTransporter.getSolids().size() === 0 && queuedTransporter.getFluids().size() === 0)
				this.unregisterFromQueue(queuedTransporter);
		}
	}

	private updateFluids(dt: number): void {
		for (const queuedTransporter of this.queue) {
			if (!queuedTransporter.canOutputItem() || queuedTransporter.getFluids().size() === 0) continue;
			const fluid = Object.entries(queuedTransporter.getFluids())[0];
			const outputTransporters = queuedTransporter
				.getOutputTransporters("Fluid")
				.filter(
					(outputTransporter) =>
						outputTransporter.getInputTransporters().includes(queuedTransporter) &&
						outputTransporter.canInputItem(fluid[0]),
				);
			for (const outputTransporter of outputTransporters) {
				const factor = queuedTransporter.getInputTransporters().includes(outputTransporter)
					? STRUCTURES[outputTransporter.instance.Name].constants["FluidCapacity"] !== undefined
						? fluid[1] /
								(STRUCTURES[queuedTransporter.instance.Name].constants["FluidCapacity"] as number) -
						  (outputTransporter.getFluids().get(fluid[0]) ?? 0) /
								(STRUCTURES[outputTransporter.instance.Name].constants["FluidCapacity"] as number)
						: 1
					: 1;
				if (factor <= 0) continue;
				const volume = math.min(
					(factor *
						((STRUCTURES[queuedTransporter.instance.Name].constants["FlowRate"] as number) / 60) *
						dt) /
						outputTransporters.size(),
					((STRUCTURES[outputTransporter.instance.Name].constants["FluidCapacity"] ?? math.huge) as number) -
						(outputTransporter.getFluids().get(fluid[0]) ?? 0),
				);
				queuedTransporter.outputItem(fluid[0], volume);
				outputTransporter.inputItem(fluid[0], volume);
				this.registerToQueue(outputTransporter);
			}
			if (queuedTransporter.getSolids().size() === 0 && queuedTransporter.getFluids().size() === 0)
				this.unregisterFromQueue(queuedTransporter);
		}
	}

	private unregisterFromQueue(queuedTransporter: TransporterComponent): void {
		this.queue.delete(queuedTransporter);
	}
}
