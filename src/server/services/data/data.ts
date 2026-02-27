import { OnInit, Service } from "@flamework/core";
import ProfileStore from "@rbxts/profile-store";
import { HttpService, Players } from "@rbxts/services";
import { Events } from "server/network";
import { EventBus } from "server/event-bus";
import { DATA_TEMPLATE, DataTemplate } from "./template";

@Service()
export default class DataService implements OnInit {
	private readonly profileStore = ProfileStore.New("PRE-ALPHA", DATA_TEMPLATE);
	private readonly profiles = new Map<Player, ProfileStore.Profile<DataTemplate, object>>();
	private readonly games = new Map<Player, string>();

	onInit(): void | Promise<void> {
		this.initEvents();
	}

	private initEvents() {
		Players.PlayerAdded.Connect((player) => {
			this.initProfile(player);
		});
		Players.PlayerRemoving.Connect((player) => {
			if (this.games.has(player)) {
				EventBus.OnGameUnload.Fire(player);
			}
			task.delay(0.25, () => {
				this.resetProfile(player);
				this.games.delete(player);
			});
		});
		Events.CreateGame.connect((player) => {
			if (this.games.has(player)) return;
			const id = HttpService.GenerateGUID();
			this.profiles.get(player)!.Data.games.push({
				id: id,
				tutorialStep: 0,
				cash: 2500,
				logisticsData: 0,
				productionData: 0,
				powerData: 0,
				expansions: [
					[-30, 0, -90],
					[30, 0, -90],
				],
				structures: [
					{
						name: "Conveyor",
						cf: [-2, 2.25, -78, 0, 0, -1, 0, 1, 0, 1, 0, 0],
						attributes: new Map<string, AttributeValue>(),
						children: [],
					},

					{
						name: "Conveyor",
						cf: [10, 2.25, -78, 0, 0, -1, 0, 1, 0, 1, 0, 0],
						attributes: new Map<string, AttributeValue>(),
						children: [],
					},
					{
						name: "Conveyor",
						cf: [14, 2.25, -78, 0, 0, -1, 0, 1, 0, 1, 0, 0],
						attributes: new Map<string, AttributeValue>(),
						children: [],
					},
					{
						name: "Conveyor",
						cf: [2, 2.25, -78, 0, 0, -1, 0, 1, 0, 1, 0, 0],
						attributes: new Map<string, AttributeValue>(),
						children: [],
					},

					{
						name: "Conveyor",
						cf: [-22, 2.25, -98, -1, 0, 0, 0, 1, 0, 0, 0, -1],
						attributes: new Map<string, AttributeValue>(),
						children: [],
					},
					{
						name: "Conveyor",
						cf: [6, 2.25, -78, 0, 0, -1, 0, 1, 0, 1, 0, 0],
						attributes: new Map<string, AttributeValue>(),
						children: [],
					},
					{
						name: "Conveyor",
						cf: [-22, 2.25, -102, -1, 0, 0, 0, 1, 0, 0, 0, -1],
						attributes: new Map<string, AttributeValue>(),
						children: [],
					},
					{
						name: "Conveyor",
						cf: [-10, 2.25, -78, 0, 0, -1, 0, 1, 0, 1, 0, 0],
						attributes: new Map<string, AttributeValue>(),
						children: [],
					},
					{
						name: "Conveyor",
						cf: [-6, 2.25, -78, 0, 0, -1, 0, 1, 0, 1, 0, 0],
						attributes: new Map<string, AttributeValue>(),
						children: [],
					},

					{
						name: "Delivery Dock",
						cf: [24, 5.25, -80, 0, 0, 1, 0, 1, 0, -1, 0, 0],
						attributes: new Map<string, AttributeValue>(),
						children: [],
					},
				],
				powerLines: [],
			});
			this.games.set(player, id);
			Events.OnGamesUpdate.fire(
				player,
				this.profiles.get(player)!.Data.games.map((game_) => {
					return {
						id: game_.id,
						size: HttpService.JSONEncode([...game_.structures, ...game_.powerLines]).size(),
					};
				}),
			);
			EventBus.OnGameLoad.Fire(player);
		});
		Events.LoadGame.connect((player, id) => {
			if (this.games.has(player)) return;
			this.games.set(player, id);
			EventBus.OnGameLoad.Fire(player);
		});
		Events.UnloadGame.connect((player) => {
			if (!this.games.has(player)) return;
			EventBus.OnGameUnload.Fire(player);
			task.delay(0.25, () => {
				this.games.delete(player);
			});
		});
		Events.DeleteGame.connect((player) => {
			const id = this.games.get(player);
			if (id === undefined) return;
			this.profiles
				.get(player)!
				.Data.games.remove(this.profiles.get(player)!.Data.games.findIndex((game_) => game_.id === id));
			this.games.delete(player);
			EventBus.OnGameUnload.Fire(player);
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
		if (player.Parent !== Players) {
			profile.EndSession();
			return;
		}
		this.profiles.set(player, profile);
		task.delay(1.25, () => {
			Events.OnDataInitialization.fire(player, {
				games: profile.Data.games.map((game_) => {
					return {
						id: game_.id,
						size: HttpService.JSONEncode([...game_.structures, ...game_.powerLines]).size(),
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
	}

	private resetProfile(player: Player) {
		this.profiles.get(player)?.EndSession();
		this.profiles.delete(player);
	}

	public get<K extends Exclude<keyof DataTemplate, "games">>(player: Player, key: K): Promise<DataTemplate[K]>;
	public get<K extends keyof DataTemplate["games"][number]>(
		player: Player,
		key: K,
	): Promise<DataTemplate["games"][number][K]>;
	public get(player: Player, key: string): Promise<unknown> {
		return new Promise((resolve) => {
			task.spawn(() => {
				while (!this.profiles.has(player)) task.wait();
				if (key in this.profiles.get(player)!.Data) {
					resolve((this.profiles.get(player)!.Data as unknown as Record<string, unknown>)[key]);
				} else if (this.games.has(player)) {
					resolve(
						(
							this.profiles
								.get(player)!
								.Data.games.find((game_) => game_.id === this.games.get(player))! as Record<
								string,
								unknown
							>
						)[key],
					);
				}
			});
			task.delay(12, () => {
				resolve(undefined);
			});
		});
	}

	public set(player: Player, key: string, value: unknown): void {
		if (!this.profiles.has(player)) return;
		if (key in this.profiles.get(player)!.Data) {
			(this.profiles.get(player)!.Data as unknown as Record<string, unknown>)[key] = value;
		} else if (this.games.has(player)) {
			(
				this.profiles.get(player)!.Data.games.find((game_) => game_.id === this.games.get(player)) as Record<
					string,
					unknown
				>
			)[key] = value;
		}
	}
}
