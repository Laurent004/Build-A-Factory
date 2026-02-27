import { ITEMS, Solid } from "shared/constants/items";
import TransporterComponent from "../logistics/transporter";
import PowerGeneratorComponent from "./power-generator";
import { OnTick } from "@flamework/core";
import { STRUCTURES } from "shared/constants/structures";
import { Component } from "@flamework/components";

@Component({ tag: "CoalGenerator" })
export default class CoalGeneratorComponent extends TransporterComponent implements OnTick {
	private powerGeneratorComponent!: PowerGeneratorComponent;
	private time: number = 0;

	onTick(dt: number): void {
		if (!this.active || this.time <= 0 || (this.fluids.get("Water") ?? 0) < 0.75 * dt) {
			this.powerGeneratorComponent?.setPowerProduction(0);
			return;
		}
		this.time -= dt;
		this.fluids.set("Water", this.fluids.get("Water")! - 0.75 * dt);
		if (this.fluids.get("Water")! <= 0) {
			this.fluids.clear();
		}
		this.powerGeneratorComponent.setPowerProduction(
			STRUCTURES[this.instance.Name].constants["PowerProduction"] as number,
		);
	}

	protected override initEvents(): void {
		super.initEvents();
		if (this.active) {
			this.powerGeneratorComponent = this.components.getComponent<PowerGeneratorComponent>(this.instance)!;
		} else {
			this.janitor.push(
				this.OnActiveChanged.Connect(() => {
					if (!this.active) return;
					this.powerGeneratorComponent = this.components.getComponent<PowerGeneratorComponent>(
						this.instance,
					)!;
				}),
			);
		}
	}

	public getTime():number{
		return this.time
	}

	public override inputItem(solid: Solid): void;
	public override inputItem(fluid: string, volume: number): void;
	public override inputItem(item: Solid | string, volume?: number): void {
		if (item instanceof Solid) {
			this.queuedSolids.remove(this.queuedSolids.indexOf(item));
			item.model?.Destroy();
			item.destroyed = true;
			this.time +=
				ITEMS[item.name].energy / (STRUCTURES[this.instance.Name].constants["PowerProduction"] as number);
			this.OnInput.Fire(item, 1);
		} else {
			super.inputItem(item, volume!);
		}
	}

	public override canInputItem(solid: Solid): boolean;
	public override canInputItem(fluid: string): boolean;
	public override canInputItem(item: Solid | string): boolean {
		return (item instanceof Solid && item.name === "Coal") || (item === "Water"&&(this.fluids.get(item) ?? 0) <
						(STRUCTURES[this.instance.Name].constants["FluidCapacity"] as number));
	}

	protected override clearItems(): void {
		super.clearItems();
		this.time = 0;
	}

	public override updateState(): void {
		this.powerGeneratorComponent.updateState();
		this.setState(this.powerGeneratorComponent.state);
	}
}
