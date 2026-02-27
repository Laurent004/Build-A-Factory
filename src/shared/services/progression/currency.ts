import { Players } from "@rbxts/services";

export default class CurrencyService {
	//#region Singleton
	private static _inst: CurrencyService;
	public static getInst(): CurrencyService {
		this._inst = this._inst ?? new CurrencyService();
		return this._inst;
	}
	//#endregion

	private readonly currencies = new Map<Player, Map<string, NumberValue>>();

	private constructor() {
		this.init();
	}

	private init(): void {
		for (const player of Players.GetPlayers()) {
			this.initPlayer(player);
		}
		Players.PlayerAdded.Connect((player) => this.initPlayer(player));
		Players.PlayerRemoving.Connect((player) => {
			this.currencies.delete(player);
		});
	}

	private initPlayer(player: Player): void {
		const currencies = new Map<string, NumberValue>([
			["Cash", player.WaitForChild("leaderstats").WaitForChild("Cash") as NumberValue],
		]);
		for (const dataCurrency of ["Logistics Data", "Production Data", "Power Data"]) {
			currencies.set(dataCurrency, player.WaitForChild(dataCurrency) as NumberValue);
		}
		this.currencies.set(player, currencies);
	}

	public addCurrency(player: Player, currency: string, amount: number): void {
		this.currencies.get(player)!.get(currency)!.Value += amount;
	}

	public getCurrency(player: Player, currency: string): number {
		return this.currencies.get(player)!.get(currency)!.Value;
	}
}
