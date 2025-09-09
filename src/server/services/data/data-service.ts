import { OnInit, Service } from "@flamework/core";
import { DataTemplate } from "./types";
import ProfileStore from "@rbxts/profile-store";
import { DATA_TEMPLATE } from "./data-template";
import { Players } from "@rbxts/services";

@Service()
export default class DataService implements OnInit {
	private readonly profileStore = ProfileStore.New("GameTest", DATA_TEMPLATE);
	private readonly profiles = new Map<Player, ProfileStore.Profile<DataTemplate, object>>();

	onInit(): void | Promise<void> {
		Players.PlayerAdded.Connect((player) => {
			this.onPlayerAdded(player);
		});
		Players.PlayerRemoving.Connect((player) => {
			this.onPlayerRemoving(player);
		});
	}

	private onPlayerAdded(player: Player) {
		const profile = this.profileStore.StartSessionAsync(`player_${player.UserId}`, {
			Cancel: () => {
				return player.Parent !== Players;
			},
		});

		if (profile !== undefined) {
			profile.AddUserId(player.UserId);
			profile.Reconcile();

			profile.OnSessionEnd.Connect(() => {
				player.Kick("Data error occured, please rejoin.");
			});

			if (player.Parent === Players) {
				this.addProfile(player, profile);
			} else {
				profile.EndSession();
			}
		}
	}

	private onPlayerRemoving(player: Player) {
		this.removeProfile(player);
	}

	public addProfile(player: Player, profile: ProfileStore.Profile<DataTemplate, object>) {
		this.profiles.set(player, profile);
	}

	public removeProfile(player: Player) {
		const profile = this.profiles.get(player);
		if (profile === undefined) return;

		profile.EndSession();
		this.profiles.delete(player);
	}

	public get<K extends keyof DataTemplate>(player: Player, key: K): Promise<DataTemplate[K] | undefined> {
		return new Promise<DataTemplate[K] | undefined>((resolve, reject) => {
			task.delay(3, () => {
				const profile = this.profiles.get(player);
				if (profile === undefined) {
					resolve(undefined);
					return;
				}
				resolve(profile.Data[key]);
			});
		});
	}

	public set<K extends keyof DataTemplate>(player: Player, key: K, value: DataTemplate[K]) {
		const profile = this.profiles.get(player);
		if (!profile) return;

		profile.Data[key] = value;
		profile.Save();
	}
}
