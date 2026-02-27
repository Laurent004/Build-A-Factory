import { OnStart, Service } from "@flamework/core";
import { Lighting } from "@rbxts/services";

@Service()
export default class TimeService implements OnStart {
	private readonly dayDuration = 480;

	onStart(): void {
		this.startUpdatingTime();
	}

	private startUpdatingTime(): void {
		task.spawn(() => {
			while (task.wait(0.1)) {
				this.updateTime();
			}
		});
	}

	private updateTime(): void {
		Lighting.SetMinutesAfterMidnight((Lighting.GetMinutesAfterMidnight() + 144 / this.dayDuration) % 1440);
	}
}
