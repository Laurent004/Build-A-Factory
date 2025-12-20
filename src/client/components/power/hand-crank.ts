import { Component } from "@flamework/components";
import PowerGeneratorComponent from "./power-generator";
import { OnStart, OnTick } from "@flamework/core";
import { STRUCTURES } from "shared/constants/structures";

@Component({ tag: "HandCrank" })
export default class HandCrankComponent extends PowerGeneratorComponent implements OnStart, OnTick {
	private hingeConstraint!: HingeConstraint;
	private lastHingeConstraintAngle: number = 0;

	onStart(): void {
		super.onStart();
		this.hingeConstraint = this.instance
			.GetDescendants()
			.find((instance): instance is HingeConstraint => instance.IsA("HingeConstraint"))!;
	}

	onTick(dt: number): void {
		if (this.hingeConstraint === undefined) return;
		this.powerProduction =
			math.clamp(
				this.getCrankHandleRotationSpeed(dt) /
					(STRUCTURES[this.instance.Name].constants["MaxCrankHandleRotationSpeed"] as number),
				0,
				1,
			) * (STRUCTURES[this.instance.Name].constants["PowerProduction"] as number);
	}

	private getCrankHandleRotationSpeed(dt: number): number {
		let delta = this.hingeConstraint.CurrentAngle - this.lastHingeConstraintAngle;
		delta = delta > 180 ? delta - 360 : delta < -180 ? (delta += 360) : delta;
		this.lastHingeConstraintAngle = this.hingeConstraint.CurrentAngle;
		return math.abs(delta / dt / 360);
	}
}
