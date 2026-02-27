import { Component } from "@flamework/components";
import { OnTick } from "@flamework/core";
import { STRUCTURES } from "shared/constants/structures";
import StructureComponent from "../../../shared/components/structure";
import { PowerProducer } from "shared/services/plot";

@Component({ tag: "HandCrank" })
export default class HandCrankComponent extends StructureComponent implements PowerProducer, OnTick {
	private readonly powerProduction: number = STRUCTURES[this.instance.Name].constants["PowerProduction"] as number;
	private roundsPerMinute: number = 0;
	private lastAngle: number = 0;

	onTick(dt: number): void {
		if (this.roundsPerMinute <= 0) return;
		this.roundsPerMinute = math.max(0, this.roundsPerMinute - 25 * dt);
	}

	protected override initEvents(): void {
		super.initEvents();
		const dragDetector = this.instance.WaitForChild("Handle").WaitForChild("DragDetector") as DragDetector;
		for (const connection of [
			dragDetector.DragStart.Connect(() => {
				this.lastAngle = dragDetector.DragFrame.ToOrientation()[1];
			}),
			dragDetector.DragContinue.Connect(() => {
				const delta = dragDetector.DragFrame.ToOrientation()[1] - this.lastAngle;
				this.roundsPerMinute = math.clamp(
					this.roundsPerMinute + (math.abs(delta) / 360 / (1 / 60)) * 60,
					0,
					100,
				);
				this.lastAngle = dragDetector.DragFrame.ToOrientation()[1];
			}),
		]) {
			this.janitor.Add(connection);
		}
	}

	public getPowerProduction(): number {
		return this.active
			? this.powerProduction * (this.roundsPerMinute / 100)
			: 0;
	}
}
