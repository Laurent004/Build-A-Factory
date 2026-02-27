import { Lighting, ReplicatedStorage, RunService, TweenService, Workspace } from "@rbxts/services";
import SoundService from "../sound";
import { Object } from "@rbxts/luau-polyfill";
import { WEATHERS } from "shared/constants/weather/definitions";

export default class WeatherService {
	//#region Singleton
	private static _inst: WeatherService;
	public static getInst(): WeatherService {
		this._inst = this._inst ?? new WeatherService();
		return this._inst;
	}
	//#endregion

	private readonly soundService = SoundService.getInst();
	private readonly clouds: Clouds = Workspace.WaitForChild("Terrain").WaitForChild("Clouds") as Clouds;
	private weather: string | undefined;
	private readonly temperature: NumberValue = ReplicatedStorage.WaitForChild("Temperature") as NumberValue;
	private readonly windSpeed: NumberValue = ReplicatedStorage.WaitForChild("WindSpeed") as NumberValue;
	private readonly weatherSpawnArea: Model = Workspace.WaitForChild("WeatherSpawnArea") as Model;
	private readonly weatherSpawnAreaBottom: Part = this.weatherSpawnArea.WaitForChild("Bottom") as Part;

	private constructor() {
		this.startUpdatingWeather();
	}

	private startUpdatingWeather(): void {
		RunService.Heartbeat.Connect(() => {
			this.updateWeather();
		});
	}

	private updateWeather(): void {
		const weather = this.getWeather();
		if (weather !== this.weather) {
			this.weather = weather;

			for (const [key, instance] of [
				["lightning", Lighting],
				["atmosphere", Lighting.WaitForChild("Atmosphere")],
				["depthOfField", Lighting.WaitForChild("DepthOfField")],
			] as const) {
				for (const [property, value] of Object.entries(WEATHERS[weather][key])) {
					TweenService.Create(instance, new TweenInfo(5, Enum.EasingStyle.Linear, Enum.EasingDirection.In), {
						[property]: value,
					}).Play();
				}
			}

			for (const particleEmitter of this.weatherSpawnArea
				.GetDescendants()
				.filter((instance): instance is ParticleEmitter => instance.IsA("ParticleEmitter"))) {
				TweenService.Create(
					particleEmitter,
					new TweenInfo(2.5, Enum.EasingStyle.Linear, Enum.EasingDirection.In),
					{
						Rate: weather.find(particleEmitter.Name)[0] !== undefined ? 600 : 0,
					},
				).Play();
			}

			for (const weather of Object.keys(WEATHERS)) {
				const sound = `ambient/${ReplicatedStorage.WaitForChild("Sounds")
					.WaitForChild("Ambient")
					.GetDescendants()
					.find((sound): sound is Sound => weather.find(sound.Name)[0] !== undefined)
					?.Name.lower()}`;
				if (weather === this.weather) {
					this.soundService.playSound(
						sound,
						undefined,
						new TweenInfo(4, Enum.EasingStyle.Linear, Enum.EasingDirection.In),
						{ Volume: 1.25 },
					);
				} else {
					this.soundService.stopSound(
						sound,
						new TweenInfo(4, Enum.EasingStyle.Linear, Enum.EasingDirection.In),
						{ Volume: 0 },
					);
				}
			}
		}

		this.weatherSpawnArea.PivotTo(new CFrame(Workspace.CurrentCamera!.CFrame.Position.add(new Vector3(0, 40, 0))));
		this.weatherSpawnAreaBottom.Position = new Vector3(
			this.weatherSpawnArea.GetPivot().Position.X,
			0,
			this.weatherSpawnArea.GetPivot().Position.Z,
		);
	}

	private getWeather(): string {
		if (this.clouds.Cover > 0.2 && this.windSpeed.Value > 0.4) {
			return this.temperature.Value > 0.38 ? "Rainy" : "Snowy";
		}
		return "Clear";
	}
}
