import { OnInit, Service } from "@flamework/core";
import ProfileStore from "@rbxts/profile-store";
import { DATA_TEMPLATE, DataTemplate } from "./data-template";
import { Players } from "@rbxts/services";

@Service()
export default class DataService implements OnInit {
	private readonly profileStore = ProfileStore.New("PRE-ALPHA", DATA_TEMPLATE);
	private readonly profiles = new Map<Player, ProfileStore.Profile<DataTemplate, object>>();

	onInit(): void | Promise<void> {
		this.initEvents();
	}

	private initEvents() {
		Players.PlayerAdded.Connect((player) => {
			this.initProfile(player);
		});
		Players.PlayerRemoving.Connect((player) => {
			this.resetProfile(player);
		});
	}

	private initProfile(player: Player) {
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

		if (player.Parent === Players) {
			this.profiles.set(player, profile);
		} else {
			profile.EndSession();
		}
	}

	private resetProfile(player: Player) {
		this.set(player, "structuresData", [
			{
				name: "Straight Conveyor",
				cfsComponents: new Map([["Straight Conveyor", [74, 2, -70, -1, 0, 0, 0, 1, 0, 0, 0, -1]]]),
				attributes: new Map(),
			},
			{
				name: "Straight Conveyor",
				cfsComponents: new Map([["Straight Conveyor", [74, 2, -66, -1, 0, 0, 0, 1, 0, 0, 0, -1]]]),
				attributes: new Map(),
			},
			{
				name: "Straight Conveyor",
				cfsComponents: new Map([["Straight Conveyor", [58, 2, -46, 0, 0, 1, 0, 1, 0, -1, 0, 0]]]),
				attributes: new Map(),
			},

			{
				name: "Straight Conveyor",
				cfsComponents: new Map([["Straight Conveyor", [62, 2, -46, 0, 0, 1, 0, 1, 0, -1, 0, 0]]]),
				attributes: new Map(),
			},

			{
				name: "Delivery Dock",
				cfsComponents: new Map([["Delivery Dock", [46, 2, -46, -1, 0, 0, 0, 1, 0, 0, 0, -1]]]),
				attributes: new Map(),
			},
		]);
		this.set(player, "powerLinesData", []);
		this.set(player, "tutorialStep", 0);
		this.set(player, "milestoneData", { milestone: 0, deliveredItems: {} });
		this.set(player, "cash", 2500);
		this.profiles.get(player)?.EndSession();
		this.profiles.delete(player);
	}

	public get<K extends keyof DataTemplate>(player: Player, key: K): Promise<DataTemplate[K] | undefined> {
		return new Promise<DataTemplate[K] | undefined>((resolve) => {
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
		if (profile === undefined) return;

		profile.Data[key] = value;
		profile.Save();
	}
}
