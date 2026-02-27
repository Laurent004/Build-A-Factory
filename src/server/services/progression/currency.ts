import { OnInit, Service } from "@flamework/core";
import DataService from "../data/data";
import { EventBus } from "server/event-bus";
import { Players } from "@rbxts/services";
import { STRUCTURE_CATEGORIES } from "shared/constants/structures";

@Service({})
export default class CurrencyService implements OnInit {
	constructor(private readonly dataService: DataService) {}

	onInit(): void | Promise<void> {
		this.initEvents();
	}

	private initEvents() {
		Players.PlayerAdded.Connect((player) => {
			const leaderstats = new Instance("Folder");
			leaderstats.Name = "leaderstats";
			for (const currency of [
				"Cash",
				...STRUCTURE_CATEGORIES.map((structureCategory) => `${structureCategory} Data`),
			]) {
				const numberValue = new Instance("NumberValue");
				numberValue.Name = currency;
				numberValue.Parent = leaderstats;
			}
			leaderstats.Parent = player;
		});
		EventBus.OnGameLoad.Connect((player) => {
			this.initCurrencies(player);
			this.startAutoSaving(player);
		});
		EventBus.OnGameUnload.Connect((player) => {
			this.resetCash(player);
			(player.WaitForChild("leaderstats").WaitForChild("Cash") as NumberValue).Value = 0;
		});
	}

	private initCurrencies(player: Player): void {
		const leaderstats = player.WaitForChild("leaderstats");
		this.dataService.get(player, "cash").then((cash) => {
			(leaderstats.WaitForChild("Cash") as NumberValue).Value = cash;
		});
		this.dataService.get(player, "logisticsData").then((logisticsData) => {
			(leaderstats.WaitForChild("Logistics Data") as NumberValue).Value = logisticsData;
		});
		this.dataService.get(player, "cash").then((productionData) => {
			(leaderstats.WaitForChild("Logistics Data") as NumberValue).Value = productionData;
		});
		this.dataService.get(player, "cash").then((powerData) => {
			(leaderstats.WaitForChild("Logistics Data") as NumberValue).Value = powerData;
		});
	}

	private resetCash(player: Player): void {
		this.save(player);
	}

	private startAutoSaving(player: Player): void {
		task.spawn(() => {
			while (task.wait(120)) {
				this.save(player);
			}
		});
	}

	private save(player: Player): void {
		const leaderstats = player.WaitForChild("leaderstats");
		this.dataService.set(player, "cash", (leaderstats.WaitForChild("Cash") as NumberValue).Value);
		this.dataService.set(
			player,
			"logisticsData",
			(leaderstats.WaitForChild("Logistics Data") as NumberValue).Value,
		);
		this.dataService.set(
			player,
			"productionData",
			(leaderstats.WaitForChild("Production Data") as NumberValue).Value,
		);
		this.dataService.set(player, "powerData", (leaderstats.WaitForChild("Power Data") as NumberValue).Value);
	}

	public addCurrency(player: Player, currency: string, amount: number): void {
		(player.WaitForChild("leaderstats").WaitForChild(currency) as NumberValue).Value += amount;
	}

	public getCurrency(player: Player, currency: string): number {
		return (player.WaitForChild("leaderstats").WaitForChild(currency) as NumberValue).Value;
	}
}
