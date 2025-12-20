import { OnStart, Service } from "@flamework/core";
import { Lighting } from "@rbxts/services";

@Service({})
export default class TimeService implements OnStart {
	private readonly startingMinutesAfterMidnight: number = Lighting.GetMinutesAfterMidnight();
	private readonly dayInSecondsLength: number = 720;
	private startTime: number = time();

	onStart(): void {
		task.spawn(() => {
			while (task.wait(0.1)) {
				if (time() - this.startTime > this.dayInSecondsLength) {
					this.startTime = time();
					continue;
				}
				Lighting.SetMinutesAfterMidnight(
					(this.startingMinutesAfterMidnight + ((time() - this.startTime) / this.dayInSecondsLength) * 1440) %
						1440,
				);
			}
		});
	}
}
