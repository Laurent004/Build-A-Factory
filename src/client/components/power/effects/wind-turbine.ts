import { BaseComponent, Component, Components } from "@flamework/components";
import { OnStart, OnTick } from "@flamework/core";
import { ReplicatedStorage } from "@rbxts/services";
import WindTurbineComponent from "shared/components/power/wind-turbine";

@Component({ tag: "WindTurbine" })
export default class WindTurbineEffectsComponent extends BaseComponent<{}, Model> implements OnStart, OnTick {
	private readonly windSpeed: NumberValue = ReplicatedStorage.WaitForChild("WindSpeed") as NumberValue;
	private readonly rotationSpeed: number = math.rad(180);
	private rotor!: BasePart;
	private windTurbineComponent!: WindTurbineComponent;

	constructor(private readonly components:Components){
		super()
	}

	onStart(): void {
		this.rotor = this.instance.WaitForChild("Rotor") as BasePart;
		let windTurbineComponent: WindTurbineComponent | undefined;
		while (windTurbineComponent === undefined) {
			windTurbineComponent = this.components.getComponents<WindTurbineComponent>(this.instance)[0];
			task.wait();
		}
		this.windTurbineComponent = windTurbineComponent;
	}

	onTick(dt: number): void {
		if (!this.windTurbineComponent?.active) return;
		this.rotor?.PivotTo(
			this.rotor.GetPivot().mul(CFrame.Angles(0, this.rotationSpeed * this.windSpeed.Value * dt, 0)),
		);
	}
}
