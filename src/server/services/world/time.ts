import { OnStart, Service } from "@flamework/core";
import { Lighting } from "@rbxts/services";

@Service({})
export default class TimeService implements OnStart {
	private readonly dayDuration = 480;
	private readonly moonPhases: string[] = [
		"rbxassetid://7630566792",
		"rbxassetid://7630573723",
		"rbxassetid://7630579204",
		"rbxassetid://7630588061",
		"rbxassetid://7630593462",
		"rbxassetid://7630599091",
		"rbxassetid://7630605486",
		"rbxassetid://7630613307",
	];

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
		const dayTime = Lighting.ClockTime;
		Lighting.SetMinutesAfterMidnight((Lighting.GetMinutesAfterMidnight() + 144 / this.dayDuration) % 1440);
		if (dayTime > Lighting.ClockTime) {
			(Lighting.WaitForChild("Sky") as Sky).MoonTextureId =
				this.moonPhases[
					(this.moonPhases.indexOf((Lighting.WaitForChild("Sky") as Sky).MoonTextureId) + 1) %
						this.moonPhases.size()
				];
		}
	}
}
