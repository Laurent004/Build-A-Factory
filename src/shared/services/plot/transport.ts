import { Object } from "@rbxts/luau-polyfill";
import { RunService, Workspace } from "@rbxts/services";
import TransporterComponent from "shared/components/logistics/transporter";
import { Solid } from "shared/constants/items";
import { STRUCTURES } from "shared/constants/structures";

export default class TransportService {
	//#region Singleton
	private static _inst: TransportService;
	public static getInst(): TransportService {
		this._inst = this._inst ?? new TransportService();
		return this._inst;
	}
	//#endregion

	private readonly solids: Solid[] = [];
	private readonly baseParts: BasePart[] = new Array(5000);
	private readonly cfs: CFrame[] = new Array(5000);

	private constructor() {
		this.startUpdatingSolids();
	}

	private startUpdatingSolids(): void {
		RunService.Heartbeat.Connect((dt) => {
			let activeCount: number = 0;
			for (let i = 0; i < this.solids.size(); i++) {
				const solid = this.solids[i];
				if (solid.p === -1) {
					this.solids.unorderedRemove(i);
					i--;
					continue;
				}
				if (solid.p < 1) {
					solid.p = math.clamp(solid.p + 50 * dt, 0, 1);
					if (solid.p >= 1) {
						solid.g.inputItem(solid);
						this.attemptTransport(solid.g);
					}
					if (solid.m?.Parent !== undefined) {
						this.baseParts[activeCount] = solid.m.PrimaryPart!;
						this.cfs[activeCount] = new CFrame(solid.sp.Lerp(solid.gp, solid.p));
						activeCount++
					}
				}
			}

			if (activeCount > 0) {
				const activeBaseParts: BasePart[] = table.create(activeCount);
				const activeCfs: CFrame[] = table.create(activeCount);
				for (let i = 0; i < activeCount; i++) {
					activeBaseParts[i] = this.baseParts[i];
					activeCfs[i] = this.cfs[i];
				}
				Workspace.BulkMoveTo(activeBaseParts, activeCfs, Enum.BulkMoveMode.FireCFrameChanged);
			}
		});
	}

	public registerSolid(solid: Solid): void {
		this.solids.push(solid);
	}

	public attemptTransport(transporter: TransporterComponent): void {
		if (!transporter.canOutputItem()) return;
		if (transporter.getSolids().size() > 0) {
			this.attemptTransportSolid(transporter);
		}
	}

	private attemptTransportSolid(transporter: TransporterComponent): void {
		const solid = transporter.getSolids()[0];
		const outputTransporter = transporter
			.getOutputTransporters("Solid")
			.find(
				(outputTransporter) =>
					outputTransporter.getInputTransporters().includes(transporter) &&
					outputTransporter.canInputItem(solid),
			);
		if (outputTransporter === undefined) return;
		transporter.outputItem(solid);
		outputTransporter.addQueuedSolid(solid);
		if (solid.m?.Parent !== undefined) {
			solid.sp = solid.gp;
			solid.gp = Object.keys(STRUCTURES[outputTransporter.instance.Name].nodes.inputs.solids)
				.map((inputNodeLocalCF) => outputTransporter.instance.GetPivot().mul(inputNodeLocalCF))
				.sort(
					(inputNodeWorldCFA, inputNodeWorldCFB) =>
						solid.m!.GetPivot().Position.sub(inputNodeWorldCFA.Position).Magnitude <
						solid.m!.GetPivot().Position.sub(inputNodeWorldCFB.Position).Magnitude,
				)[0].Position;
		}
		solid.p = 0;
		solid.g = outputTransporter;
	}
}
