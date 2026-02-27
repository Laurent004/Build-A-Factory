import { Janitor } from "@rbxts/janitor";
import { HttpService, Players } from "@rbxts/services";

export default class TechService {
	//#region Singleton
	private static _inst: TechService;
	public static getInst(): TechService {
		this._inst = this._inst ?? new TechService();
		return this._inst;
	}
	//#endregion

	private readonly techs = new Map<Player, Set<string>>();
	private readonly janitors = new Map<Player, Janitor>();

	private constructor() {
		this.init();
	}

	private init(): void {
		for (const player of Players.GetPlayers()) {
			this.initPlayer(player);
		}
		Players.PlayerAdded.Connect((player) => {
			this.initPlayer(player);
		});
		Players.PlayerRemoving.Connect((player) => {
			this.techs.delete(player);
			this.janitors.get(player)!.Destroy();
			this.janitors.delete(player);
		});
	}

	private initPlayer(player: Player) {
		const janitor = new Janitor();
		this.techs.set(
			player,
			new Set<string>(HttpService.JSONDecode(player.GetAttribute("Techs") as string) as string[]),
		);
		janitor.Add(
			player.GetAttributeChangedSignal("Techs").Connect(() => {
				this.techs.set(
					player,
					new Set<string>(HttpService.JSONDecode(player.GetAttribute("Techs") as string) as string[]),
				);
			}),
		);
		this.janitors.set(player, janitor);
	}

	public getTechs(player: Player): Set<string> {
		return this.techs.get(player)!;
	}
}
