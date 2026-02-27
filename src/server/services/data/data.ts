import { OnInit, Service } from "@flamework/core";
import ProfileStore from "@rbxts/profile-store";
import { HttpService, Players } from "@rbxts/services";
import { Events, Functions } from "server/network";
import { BlueprintData } from "shared/constants/structures";
import { Data } from "shared/types/data";
import { SaveData } from "./save";

export interface DataTemplate {
	saves: SaveData[];
	blueprints: BlueprintData[];
	settings: Data["settings"];
}

const DATA_TEMPLATE: DataTemplate = {
	saves: [],
	blueprints: [],
	settings: {
		music: 1,
		ambient: 1,
		sfx: 1,
		ui: 1,
		simulateFactories: [0],
		renderItems: [0],
	},
};

@Service()
export class DataService implements OnInit {
	private readonly profileStore = ProfileStore.New("PRE-ALPHA", DATA_TEMPLATE);
	private readonly profiles = new Map<Player, ProfileStore.Profile<DataTemplate, object>>();

	onInit(): void | Promise<void> {
		this.initEvents();
	}

	private initEvents(): void {
		Players.PlayerAdded.Connect((player) => {
			this.initProfile(player);
		});

		Players.PlayerRemoving.Connect((player) => {
			task.delay(0.25, () => {
				this.resetProfile(player);
			});
		});

		Functions.RequestData.setCallback((player) => {
			return new Promise((resolve) => {
				task.spawn(() => {
					while (!this.profiles.has(player)) {
						task.wait();
					}
					const profile = this.profiles.get(player)!;
					resolve({
						saves: profile.Data.saves.map((save) => {
							return {
								id: save.id,
								size: HttpService.JSONEncode([...save.structures, ...save.powerLines]).size(),
							};
						}),
						settings: {
							...profile.Data.settings,
							simulateFactories: profile.Data.settings.simulateFactories.map((userId) =>
								userId === 0 ? player.UserId : userId,
							),
							renderItems: profile.Data.settings.renderItems.map((userId) =>
								userId === 0 ? player.UserId : userId,
							),
						},
					});
				});
			});
		});

		Events.SetSetting.connect((player, settingName, settingValue) => {
			this.get(player, "settings").then((settings) => {
				this.set(player, "settings", {
					...settings,
					[settingName]: settingValue,
				});
			});
		});
	}

	private initProfile(player: Player): void {
		const profile = this.profileStore.StartSessionAsync(`player_${player.UserId}`, {
			Cancel: () => {
				return player.Parent !== Players;
			},
		});
		profile.AddUserId(player.UserId);
		profile.Reconcile();
		profile.OnSessionEnd.Connect(() => {
			player.Kick("Your data has been loaded on another server - please rejoin");
		});
		if (player.Parent !== Players) {
			profile.EndSession();
			return;
		}
		this.profiles.set(player, profile);
	}

	private resetProfile(player: Player): void {
		this.profiles.get(player)?.EndSession();
		this.profiles.delete(player);
	}

	public get<K extends keyof DataTemplate>(player: Player, key: K, timeout: number = 12): Promise<DataTemplate[K]> {
		return new Promise((resolve, reject) => {
			task.spawn(() => {
				while (!this.profiles.has(player)) {
					task.wait();
				}
				resolve(this.profiles.get(player)!.Data[key]);
			});
			task.delay(timeout, () => {
				reject();
			});
		});
	}

	public set<K extends keyof DataTemplate>(player: Player, key: K, value: DataTemplate[K]): void {
		if (!this.profiles.has(player)) return;
		this.profiles.get(player)!.Data[key] = value;
	}
}
