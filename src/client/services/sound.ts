import { Object } from "@rbxts/luau-polyfill";
import { ReplicatedStorage, TweenService, Workspace } from "@rbxts/services";

export default class SoundService {
	//#region Singleton
	private static _inst: SoundService;
	public static getInst(): SoundService {
		this._inst = this._inst ?? new SoundService();
		return this._inst;
	}
	//#endregion

	private constructor() {}

	public playSound(
		id: string,
		position?: Vector3,
		tweenInfo?: TweenInfo,
		properties?: Partial<WritableInstanceProperties<Sound>>,
	): void {
		const sound = ReplicatedStorage.WaitForChild("Sounds")
			.GetChildren()
			.find((folder) => folder.Name.lower() === id.split("/")[0])
			?.GetChildren()
			.find((sound): sound is Sound => sound.Name.lower() === id.split("/")[1])
			?.Clone();
		if (sound === undefined) return;

		if (tweenInfo !== undefined) {
			for (const [key, value] of Object.entries({
				...properties!,
			})) {
				TweenService.Create(sound, tweenInfo, { [key]: value }).Play();
			}
		} else if (properties !== undefined) {
			for (const [key, value] of Object.entries({
				...properties,
			})) {
				(sound as unknown as Record<string, unknown>)[key] = value;
			}
		}
		sound.PlaybackSpeed = properties?.PlaybackSpeed ?? sound.PlaybackSpeed * (math.random() * (1 - 0.85) + 0.85);
		sound.SoundGroup = game
			.GetService("SoundService")
			.GetChildren()
			.find((soundGroup): soundGroup is SoundGroup => soundGroup.Name.lower() === id.split("/")[0]);

		if (position !== undefined) {
			const part = new Instance("Part");
			part.Transparency = 1;
			part.Position = position;
			part.CanCollide = false;
			part.CanQuery = false;
			part.Parent = Workspace;
			sound.Parent = part;
			if (!sound.Looped) {
				sound.Ended.Once(() => {
					part.Destroy();
				});
			}
		} else {
			sound.Parent = game.GetService("SoundService");
			if (!sound.Looped) {
				sound.Ended.Once(() => {
					sound.Destroy();
				});
			}
		}

		sound.Play();
	}

	public stopSound(id: string, tweenInfo?: TweenInfo, properties?: Partial<WritableInstanceProperties<Sound>>): void {
		const sound = game
			.GetService("SoundService")
			.GetDescendants()
			.find(
				(sound): sound is Sound =>
					sound.IsA("Sound") &&
					sound.Name.lower() === id.split("/")[1] &&
					sound.SoundGroup!.Name.lower() === id.split("/")[0],
			);
		if (sound === undefined) return;

		if (tweenInfo !== undefined) {
			for (const [key, value] of Object.entries({
				...properties!,
			})) {
				TweenService.Create(sound, tweenInfo, { [key]: value }).Play();
			}
			task.delay(tweenInfo.Time, () => {
				sound.Stop();
				sound.Destroy();
			});
		} else if (properties !== undefined) {
			for (const [key, value] of Object.entries({
				...properties,
			})) {
				(sound as unknown as Record<string, unknown>)[key] = value;
			}
			sound.Stop();
			sound.Destroy();
		}
	}
}
