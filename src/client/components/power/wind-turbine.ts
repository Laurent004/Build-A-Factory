import { Component } from "@flamework/components";
import PowerGeneratorComponent from "./power-generator";
import { OnStart, OnTick } from "@flamework/core";
import { STRUCTURES } from "shared/constants/structures";

@Component({ tag: "WindTurbine" })
export default class WindTurbineComponent extends PowerGeneratorComponent implements OnStart, OnTick {
	private rotor!: MeshPart;

	onStart(): void {
		super.onStart();
		this.rotor = this.instance.WaitForChild("Rotor") as MeshPart;
	}

	onTick(dt: number): void {
		if (this.rotor === undefined) return;
		this.rotor.PivotTo(
			this.rotor
				.GetPivot()
				.mul(
					CFrame.Angles(
						0,
						math.rad(time() % 360) *
							(dt *
								this.getWindSpeed() *
								(STRUCTURES["Wind Turbine"].constants["MaxRotorSpeed"] as number)),
						0,
					),
				),
		);
	}

	private getWindSpeed(): number {
		const t = time();

		// Perlin noise returns [-1, 1], we scale + normalize it
		const baseNoise = math.noise(t / 30, 0, 0); // smooth, slow variation
		const gustNoise = math.noise(t / 5, 100, 0); // faster gusts

		// Combine noises
		const combined = 0.7 * baseNoise + 0.3 * gustNoise;

		// Normalize to 0–1
		const normalized = (combined + 1) / 2;
		return math.clamp(normalized, 0, 1);
	}

	public getPowerProduction(): number {
		return this.getWindSpeed() * (STRUCTURES[this.instance.Name].constants["MaxPowerProduction"] as number);
	}
}
