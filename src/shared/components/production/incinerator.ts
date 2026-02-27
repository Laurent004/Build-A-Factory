import { Component } from "@flamework/components";
import { Solid } from "shared/constants/items";
import Signal from "@rbxts/signal";
import { STRUCTURES } from "shared/constants/structures";
import TrackedTransporterComponent from "../logistics/tracked-transporter";
import { PowerConsumer } from "shared/services/plot";

@Component({ tag: "Incinerator" })
export default class IncineratorComponent extends TrackedTransporterComponent implements PowerConsumer {
	private readonly powerConsumption: number = STRUCTURES[this.instance.Name].constants["PowerConsumption"] as number;
	private readonly buffer: number = 12;
	private readonly incinerationTime: number = 0.5;
	private incineratingThread: thread | undefined;
	public state: string = "No Connection";
	public readonly OnStateChanged = new Signal<(state: string) => void>();

	protected override initEvents(): void {
		super.initEvents();
		for (const object of [
			this.OnStateChanged.Connect(() => {
				if (this.canStartIncinerating()) {
					this.startIncinerating();
				}
			}),
			this.OnStateChanged,
		]) {
			this.janitor.Add(object);
		}
	}

	protected override onActiveChanged(active: boolean): void {
		super.onActiveChanged(active);
		if (this.canStartIncinerating()) {
			this.startIncinerating();
		}
	}

	private startIncinerating(): void {
		this.incineratingThread = task.spawn(() => {
			while (this.canIncinerate()) {
				const solid = this.solids.shift()!;
				if (solid.m?.Parent !== undefined) {
					this.poolService.add(solid.m);
				}
				solid.p = -1;
				for (const inputTransporter of this.inputTransporters) {
					this.transportService.attemptTransport(inputTransporter);
				}
				task.wait(this.incinerationTime);
			}
			this.incineratingThread = undefined;
		});
	}

	private canStartIncinerating(): boolean {
		return (
			this.active &&
			this.state !== "No Connection" &&
			this.state !== "No Power" &&
			this.incineratingThread === undefined &&
			this.solids.size() > 0
		);
	}

	private canIncinerate(): boolean {
		return this.active && this.state !== "No Connection" && this.state !== "No Power" && this.solids.size() > 0;
	}

	public override inputItem(solid: Solid): void;
	public override inputItem(fluid: string, volume: number): void;
	public override inputItem(item: Solid | string, volume?: number): void {
		if (!typeIs(item, "table")) return;
		super.inputItem(item);
		if (this.canStartIncinerating()) {
			this.startIncinerating();
		}
	}

	public override canInputItem(solid: Solid): boolean;
	public override canInputItem(fluid: string): boolean;
	public override canInputItem(item: Solid | string): boolean {
		return typeIs(item, "table") && this.queuedSolids.size() + this.solids.size() < this.buffer;
	}

	protected override clearItems(): void {
		super.clearItems();
		if (this.incineratingThread !== undefined) {
			task.cancel(this.incineratingThread);
			this.incineratingThread = undefined;
		}
	}

	public getPowerConsumption(): number {
		return this.state === "No Power" || this.state === "Working" ? this.powerConsumption : 0;
	}

	public getEfficiency(): number {
		return math.clamp(this.getInputRate("Solid") / (60 / this.incinerationTime), 0, 1);
	}

	public setState(state: string): void {
		if (this.state !== state) {
			this.state = state;
			this.OnStateChanged.Fire(state);
		}
	}

	public updateState(): void {
		this.setState(this.incineratingThread === undefined ? "Standby" : "Working");
	}
}
