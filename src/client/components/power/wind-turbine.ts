import { Component } from "@flamework/components";
import PowerGeneratorComponent from "./power-generator";
import { OnStart, OnTick } from "@flamework/core";
import { STRUCTURES } from "shared/constants/structures";
import WeatherService from "client/services/world/weather";

@Component({ tag: "WindTurbine" })
export default class WindTurbineComponent extends PowerGeneratorComponent implements OnStart, OnTick {
	private readonly weatherService = WeatherService.getInst();
	private rotor!: BasePart;

	onStart(): void {
		super.onStart();
		this.rotor = this.instance.WaitForChild("Rotor") as BasePart;
	}

	onTick(dt: number): void {
		this.powerProduction =
			(STRUCTURES[this.instance.Name].constants["PowerProduction"] as number) *
			this.weatherService.getWindSpeed();
		if (!this.active) return;
		this.rotor?.PivotTo(
			this.rotor
				.GetPivot()
				.mul(
					CFrame.Angles(
						0,
						math.rad(time() % 360) *
							((STRUCTURES[this.instance.Name].constants["MaxRotorRotationSpeed"] as number) *
								this.weatherService.getWindSpeed() *
								dt),
						0,
					),
				),
		);
	}
}
