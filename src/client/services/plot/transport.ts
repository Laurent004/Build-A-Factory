import { Components } from "@flamework/components";
import { Dependency } from "@flamework/core";
import { Object } from "@rbxts/luau-polyfill";
import { TweenService } from "@rbxts/services";
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

	private readonly components=Dependency<Components>()
	private readonly tweenInfos: Record<string, TweenInfo> = Object.entries(STRUCTURES).reduce<
		Record<string, TweenInfo>
	>((tweenInfos, [structureName, structureDefinition]) => {
		if (structureDefinition.constants["ThroughputRate"] !== undefined) {
			tweenInfos[structureName] = new TweenInfo(
				1 / ((structureDefinition.constants["ThroughputRate"] as number) / 60),
				Enum.EasingStyle.Linear,
				Enum.EasingDirection.In,
			);
		}
		return tweenInfos;
	}, {});
	private readonly connections = new Map<TransporterComponent, RBXScriptConnection>();
	private readonly fluidTransporters = new Set<TransporterComponent>();

	private constructor() {
		this.initEvents();
		this.startUpdatingFluidTransporters();
	}

	private initEvents(): void {
		this.components.onComponentAdded<TransporterComponent>((transporterComponent)=>{
			this.connections.set(transporterComponent,transporterComponent.OnActiveChanged.Connect(()=>{
				this.attemptTransport(transporterComponent)
			}))
		})

		this.components.onComponentRemoved<TransporterComponent>((transporterComponent)=>{
			this.connections.get(transporterComponent)?.Disconnect();
			this.connections.delete(transporterComponent)
		})


		Events.OnStructuresMovementStart.connect((_, structuresModels) => {
			for (const [transporter, connection] of this.connections) {
				if (structuresModels.includes(transporter.instance)) {
					connection.Disconnect()
					this.connections.delete(transporter);
				}
			}
			for (const transporter of this.fluidTransporters) {
				if (structuresModels.includes(transporter.instance)) {
					this.fluidTransporters.delete(transporter);
				}
			}
		});

		Events.OnStructuresDestroying.connect((_, structuresModels) => {
			for (const [transporter, connection] of this.connections) {
				if (structuresModels.includes(transporter.instance)) {
					connection.Disconnect();
					this.connections.delete(transporter);
				}
			}
			for (const transporter of this.fluidTransporters) {
				if (structuresModels.includes(transporter.instance)) {
					this.fluidTransporters.delete(transporter);
				}
			}
		});

		Events.OnStructuresItemsClear.connect((_, structuresModels) => {
			for (const [transporter] of this.connections) {
				if (structuresModels.includes(transporter.instance)) {
					for (const inputTransporter of transporter.getInputTransporters()) {
						this.attemptTransport(inputTransporter);
					}
				}
			}
			for (const transporter of this.fluidTransporters) {
				if (structuresModels.includes(transporter.instance)) {
					this.fluidTransporters.delete(transporter);
				}
			}
		});
	}

	private startUpdatingFluidTransporters(): void {
		task.spawn(() => {
			while (task.wait(0.1)) {
				for (const transporter of this.fluidTransporters) {
					if (transporter.getFluids().size() > 0 && transporter.canOutputItem()) {
						this.transportFluid(transporter);
					}
				}
			}
		});
	}

	public attemptTransport(transporter: TransporterComponent): void {
		const solids = transporter.getSolids();
		if (solids.size() > 0) {
			if(!transporter.canOutputItem()) return
			const outputTransporter = transporter
				.getOutputTransporters("Solid")
				.find(
					(outputTransporter) =>
						outputTransporter.getInputTransporters().includes(transporter) &&
						outputTransporter.canInputItem(solids[0]),
				)
			if(outputTransporter!==undefined&&	outputTransporter.getInputTransporters().includes(transporter) &&
				outputTransporter.canInputItem(transporter.getSolids()[0])) {
				this.transportSolid(transporter, outputTransporter);
			};
		}

		if (transporter.getFluids().size() > 0 && transporter.canOutputItem()) {
			this.fluidTransporters.add(transporter);
		}
	}

	private transportSolid(transporter: TransporterComponent, outputTransporter: TransporterComponent): void {
		const solid = transporter.getSolids()[0];
		transporter.outputItem(solid);
		outputTransporter.addQueuedSolid(solid);
		if (solid.model?.Parent !== undefined) {
			TweenService.Create(solid.model.PrimaryPart!, this.tweenInfos[transporter.instance.Name], {
				CFrame:
					Object.keys(STRUCTURES[outputTransporter.instance.Name].nodes.inputs.solids)
						.map((inputNodeLocalCF) => outputTransporter.instance.GetPivot().mul(inputNodeLocalCF))
						.sort(
							(inputNodeWorldCFA, inputNodeWorldCFB) =>
								solid.model!.PrimaryPart!.CFrame.Position.sub(inputNodeWorldCFA.Position).Magnitude <
								solid.model!.PrimaryPart!.CFrame.Position.sub(inputNodeWorldCFB.Position).Magnitude,
						)[0] ?? outputTransporter.instance.GetPivot(),
			}).Play();
		}
		task.delay(1 / ((STRUCTURES[transporter.instance.Name].constants["ThroughputRate"] as number) / 60), () => {
			if (solid.destroyed) return;
			outputTransporter.inputItem(solid);
			this.attemptTransport(outputTransporter);
		});

		for (const inputTransporter of transporter.getInputTransporters()) {
			this.attemptTransport(inputTransporter);
		}
	}

	private transportFluid(transporter: TransporterComponent): void {
		const fluid = Object.entries(transporter.getFluids())[0];
		const outputTransporters = transporter
			.getOutputTransporters("Fluid")
			.filter(
				(outputTransporter) =>
					outputTransporter.getInputTransporters().includes(transporter) &&
					outputTransporter.canInputItem(fluid[0]),
			);
		for (const outputTransporter of outputTransporters) {
			const factor = transporter.getInputTransporters().includes(outputTransporter)
				? STRUCTURES[outputTransporter.instance.Name].constants["FluidCapacity"] !== undefined
					? fluid[1] / (STRUCTURES[transporter.instance.Name].constants["FluidCapacity"] as number) -
					  (outputTransporter.getFluids().get(fluid[0]) ?? 0) /
							(STRUCTURES[outputTransporter.instance.Name].constants["FluidCapacity"] as number)
					: 1
				: 1;
			if (factor <= 0) continue;
			const volume = math.min(
				(factor * ((STRUCTURES[transporter.instance.Name].constants["FlowRate"] as number) / 60)) /
					outputTransporters.size(),
				((STRUCTURES[outputTransporter.instance.Name].constants["FluidCapacity"] ?? math.huge) as number) -
					(outputTransporter.getFluids().get(fluid[0]) ?? 0),
			);
			transporter.outputItem(fluid[0], volume);
			outputTransporter.inputItem(fluid[0], volume);
			this.fluidTransporters.add(outputTransporter);
			if (transporter.getFluids().size() === 0) {
				this.fluidTransporters.delete(transporter);
			}
		}
	}
}
