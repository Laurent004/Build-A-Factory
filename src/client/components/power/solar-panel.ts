import { Component } from "@flamework/components";
import PowerGeneratorComponent from "./power-generator";
import { OnTick } from "@flamework/core";
import { STRUCTURES } from "shared/constants/structures";
import WeatherService from "client/services/world/weather";

@Component({ tag: "SolarPanel" })
export default class SolarPanelComponent extends PowerGeneratorComponent implements OnTick {
	private readonly weatherService = WeatherService.getInst();

	onTick(): void {
		this.powerProduction =
			(STRUCTURES[this.instance.Name].constants["PowerProduction"] as number) *
			this.weatherService.getSunIntensity();
	}
}
