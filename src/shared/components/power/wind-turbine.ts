import { Component } from "@flamework/components";
import { OnStart } from "@flamework/core";
import { STRUCTURES } from "shared/constants/structures";
import StructureComponent from "../../../shared/components/structure";
import { PowerProducer } from "shared/services/plot";
import { ReplicatedStorage } from "@rbxts/services";

@Component({ tag: "WindTurbine" })
export default class WindTurbineComponent extends StructureComponent implements PowerProducer, OnStart {
	private readonly windSpeed: NumberValue = ReplicatedStorage.WaitForChild("WindSpeed") as NumberValue;
	private readonly powerProduction: number = STRUCTURES[this.instance.Name].constants["PowerProduction"] as number;

	public getPowerProduction(): number {
		return this.active ? this.powerProduction * this.windSpeed.Value : 0;
	}
}
