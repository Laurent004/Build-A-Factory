import { Component } from "@flamework/components";
import PowerGeneratorComponent from "./power-generator";
import { OnStart, OnTick } from "@flamework/core";
import { STRUCTURES } from "shared/constants/structures";

@Component({ tag: "Hand-Crank" })
export default class HandCrankComponent extends PowerGeneratorComponent implements OnStart, OnTick {
	private hingeConstraint!: HingeConstraint;
	private lastAngle: number = 0;

	private crankRoundsPerMinute: number = 0;

	onStart(): void {
		super.onStart();
		this.hingeConstraint = this.instance.WaitForChild("Hinge").FindFirstChildOfClass("HingeConstraint")!;
	}

	onTick(dt: number): void {
		if (this.hingeConstraint === undefined) return;
		this.updateCrankRoundsPerMinute(dt);
	}

	private updateCrankRoundsPerMinute(dt: number): void {
		let delta = this.hingeConstraint.CurrentAngle - this.lastAngle;
		delta = delta > 180 ? delta - 360 : delta < -180 ? (delta += 360) : delta;
		this.crankRoundsPerMinute = math.abs((delta / dt / 360) * 60);
		this.lastAngle = this.hingeConstraint.CurrentAngle;
	}

	public getPowerProduction(): number {
		return (
			math.clamp(
				this.crankRoundsPerMinute / (STRUCTURES["Hand-Crank"].constants["MaxCrankRoundsPerMinute"] as number),
				0,
				1,
			) * (STRUCTURES[this.instance.Name].constants["MaxPowerProduction"] as number)
		);
	}
}
