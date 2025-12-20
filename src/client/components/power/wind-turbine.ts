import { Component } from "@flamework/components";
import PowerGeneratorComponent from "./power-generator";
import { OnStart, OnTick } from "@flamework/core";
import { STRUCTURES } from "shared/constants/structures";

@Component({ tag: "WindTurbine" })
export default class WindTurbineComponent extends PowerGeneratorComponent implements OnStart, OnTick {
	private rotor!: BasePart;

	onStart(): void {
		super.onStart();
		this.rotor = this.instance.WaitForChild("Rotor") as BasePart;
	}

	onTick(dt: number): void {
		this.powerProduction =
			(STRUCTURES[this.instance.Name].constants["PowerProduction"] as number) * this.getWindSpeed();
		if (!this.active) return;
		this.rotor?.PivotTo(
			this.rotor
				.GetPivot()
				.mul(
					CFrame.Angles(
						0,
						math.rad(time() % 360) *
							((STRUCTURES[this.instance.Name].constants["MaxRotorRotationSpeed"] as number) *
								this.getWindSpeed() *
								dt),
						0,
					),
				),
		);
	}

	private getWindSpeed(): number {
		const t = time();
		const baseNoise = math.noise(t / 30, 0, 0);
		const gustNoise = math.noise(t / 5, 100, 0);
		const combined = 0.7 * baseNoise + 0.3 * gustNoise;
		const normalized = (combined + 1) / 2;
		return math.clamp(normalized, 0, 1);
	}
}
