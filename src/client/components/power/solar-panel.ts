import { Component } from "@flamework/components";
import PowerGeneratorComponent from "./power-generator";
import { OnTick } from "@flamework/core";
import { STRUCTURES } from "shared/constants/structures";
import { Lighting } from "@rbxts/services";

@Component({ tag: "SolarPanel" })
export default class SolarPanelComponent extends PowerGeneratorComponent implements OnTick {
	onTick(): void {
		this.powerProduction =
			(STRUCTURES[this.instance.Name].constants["PowerProduction"] as number) * this.getSunIntensity();
	}

	private getSunIntensity(): number {
		return math.max(0, math.cos(((Lighting.ClockTime - 12) / 12) * math.pi));
	}
}
