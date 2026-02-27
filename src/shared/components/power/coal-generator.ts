import { ITEMS, Solid } from "shared/constants/items";
import { OnTick } from "@flamework/core";
import { STRUCTURES } from "shared/constants/structures";
import { Component } from "@flamework/components";
import Signal from "@rbxts/signal";
import TrackedTransporterComponent from "../logistics/tracked-transporter";
import { PowerProducer } from "shared/services/plot";

@Component({ tag: "CoalGenerator" })
export default class CoalGeneratorComponent extends TrackedTransporterComponent implements PowerProducer, OnTick {
	private readonly powerProduction: number = STRUCTURES[this.instance.Name].constants["PowerProduction"] as number;
	private readonly waterConsumptionRate: number = 45;
	private time: number = 0;
	public state: string = "No Connection";
	public readonly OnStateChanged = new Signal<(state: string) => void>();

	onTick(dt: number): void {
		this.burnCoal(dt);
	}

	private burnCoal(dt: number): void {
		if (!this.active || this.time <= 0 || (this.fluids.get("Water") ?? 0) < (this.waterConsumptionRate / 60) * dt)
			return;
		this.time -= dt;
		this.fluids.set("Water", this.fluids.get("Water")! - (this.waterConsumptionRate / 60) * dt);
		if (this.fluids.get("Water")! <= 0) {
			this.fluids.delete("Water");
		}
	}

	public getTime(): number {
		return this.time;
	}

	public override inputItem(solid: Solid): void;
	public override inputItem(fluid: string, volume: number): void;
	public override inputItem(item: Solid | string, volume?: number): void {
		if (typeIs(item, "table")) {
			super.inputItem(item);
			item.m?.Destroy();
			item.p = -1;
			this.time += ITEMS[item.name].energy / this.powerProduction;
		} else {
			super.inputItem(item, volume!);
		}
	}

	public override canInputItem(solid: Solid): boolean;
	public override canInputItem(fluid: string): boolean;
	public override canInputItem(item: Solid | string): boolean {
		return (
			(typeIs(item, "table") && ITEMS[item.name].energy > 0) ||
			(item === "Water" && (this.fluids.get(item) ?? 0) < this.fluidCapacity)
		);
	}

	protected override clearItems(): void {
		super.clearItems();
		this.time = 0;
	}

	public getPowerProduction(): number {
		return this.active && this.time > 0 && this.fluids.size() > 0 ? this.powerProduction : 0;
	}

	public getEfficiency(): number {
		return math.clamp(
			(this.solidInputs.reduce((energy, [solid]) => (energy += ITEMS[solid.name].energy), 0) /
				this.trackingWindow /
				this.powerProduction +
				this.getInputRate("Fluid") / this.waterConsumptionRate) /
				2,
			0,
			1,
		);
	}

	public setState(state: string): void {
		if (this.state !== state) {
			this.state = state;
			this.OnStateChanged.Fire(state);
		}
	}

	public updateState(): void {
		this.setState(!this.active || this.time <= 0 || this.fluids.size() === 0 ? "No Power" : "Working");
	}
}
