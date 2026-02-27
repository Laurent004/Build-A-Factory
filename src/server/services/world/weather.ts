import { OnStart, Service } from "@flamework/core";
import { Lighting, ReplicatedStorage, Workspace } from "@rbxts/services";

@Service()
export default class WeatherService implements OnStart {
	private readonly clouds: Clouds = Workspace.WaitForChild("Terrain").WaitForChild("Clouds") as Clouds;
	private readonly seed: number = math.random();
	private readonly temperature: NumberValue = ReplicatedStorage.WaitForChild("Temperature") as NumberValue;
	private readonly sunIntensity: NumberValue = ReplicatedStorage.WaitForChild("SunIntensity") as NumberValue;
	private readonly windSpeed: NumberValue = ReplicatedStorage.WaitForChild("WindSpeed") as NumberValue;

	onStart(): void {
		this.startUpdatingWeather();
	}

	private startUpdatingWeather(): void {
		task.spawn(() => {
			while (task.wait(0.1)) {
				this.updateWeather();
			}
		});
	}

	private updateWeather(): void {
		this.temperature.Value = this.getTemperature();
		this.sunIntensity.Value = this.getSunIntensity();
		this.clouds.Cover = this.getCloudiness();
		this.windSpeed.Value = this.getWindSpeed();
	}

	private getTemperature(): number {
		return math.clamp((math.noise(time() * 0.009, this.seed) + 1) / 2, 0, 1);
	}

	public getSunIntensity(): number {
		return math.max(0, math.cos(((Lighting.ClockTime - 12) / 12) * math.pi)) * (1 - this.clouds.Cover * 0.22);
	}

	private getCloudiness(): number {
		return math.clamp((math.noise(time() * 0.005, this.seed + 3) + 1) / 2, 0, 1);
	}

	public getWindSpeed(): number {
		return math.clamp(
			(this.clouds.Cover * 0.33 + (math.noise(time() * 0.007, this.seed + 11) + 1) / 2) *
				(0.7 + (1 - this.sunIntensity.Value) * 0.3),
			0,
			1,
		);
	}
}
