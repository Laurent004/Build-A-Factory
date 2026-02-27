import { Component } from "@flamework/components";
import { STRUCTURES } from "shared/constants/structures";
import StructureComponent from "../../../shared/components/structure";
import { PowerProducer } from "shared/services/plot";
import { ReplicatedStorage } from "@rbxts/services";

@Component({ tag: "SolarPanel" })
export default class SolarPanelComponent extends StructureComponent implements PowerProducer {
	private readonly sunIntensity: NumberValue = ReplicatedStorage.WaitForChild("SunIntensity") as NumberValue;
	private readonly powerProduction: number = STRUCTURES[this.instance.Name].constants["PowerProduction"] as number;

	public getPowerProduction(): number {
		return this.active ? this.powerProduction * this.sunIntensity.Value : 0;
	}
}
