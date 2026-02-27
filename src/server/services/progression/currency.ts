import { OnInit, Service } from "@flamework/core";
import { Players } from "@rbxts/services";
import { SaveData, SaveService } from "../data/save";

@Service()
export default class CurrencyService implements OnInit {
	private readonly currencies = new Map<Player, Map<string, NumberValue>>();

	constructor(private readonly saveService: SaveService) {
		this.saveService.register("cash", (player) => this.currencies.get(player)!.get("Cash")!.Value);
		this.saveService.register(
			"logisticsData",
			(player) => this.currencies.get(player)!.get("Logistics Data")!.Value,
		);
		this.saveService.register(
			"productionData",
			(player) => this.currencies.get(player)!.get("Production Data")!.Value,
		);
		this.saveService.register("powerData", (player) => this.currencies.get(player)!.get("Power Data")!.Value);
	}

	onInit(): void | Promise<void> {
		this.initEvents();
	}

	private initEvents(): void {
		Players.PlayerAdded.Connect((player) => {
			const leaderstats = new Instance("Folder");
			leaderstats.Name = "leaderstats";
			leaderstats.Parent = player;
			const currencies = new Map<string, NumberValue>();

			const cashNumberValue = new Instance("NumberValue");
			cashNumberValue.Name = "Cash";
			cashNumberValue.Parent = leaderstats;
			currencies.set("Cash", cashNumberValue);
			for (const dataCurrency of ["Logistics Data", "Production Data", "Power Data"]) {
				const dataNumberValue = new Instance("NumberValue");
				dataNumberValue.Name = dataCurrency;
				dataNumberValue.Parent = player;
				currencies.set(dataCurrency, dataNumberValue);
			}
			this.currencies.set(player, currencies);
		});

		this.saveService.OnSaveLoad.Connect((player, saveData) => {
			this.initCurrencies(player, saveData);
		});

		this.saveService.OnSaveUnload.Connect((player) => {
			this.resetCurrencies(player);
			if (player.Parent === undefined) {
				this.currencies.delete(player);
			}
		});
	}

	private initCurrencies(player: Player, saveData: SaveData): void {
		const currencies = this.currencies.get(player)!;
		currencies.get("Cash")!.Value = saveData.cash;
		currencies.get("Logistics Data")!.Value = saveData.logisticsData;
		currencies.get("Production Data")!.Value = saveData.productionData;
		currencies.get("Power Data")!.Value = saveData.powerData;
	}

	private resetCurrencies(player: Player): void {
		for (const numberValue of player
			.GetDescendants()
			.filter((instance): instance is NumberValue => instance.IsA("NumberValue"))) {
			numberValue.Value = 0;
		}
	}

	public addCurrency(player: Player, currency: string, amount: number): void {
		this.currencies.get(player)!.get(currency)!.Value += amount;
	}
}
