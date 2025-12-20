import { OnInit, Service } from "@flamework/core";
import DataService from "../data/data-service";
import { EventBus } from "server/event-bus";
import { Players } from "@rbxts/services";

@Service({})
export default class CashService implements OnInit {
	constructor(private readonly dataService: DataService) {}

	onInit(): void | Promise<void> {
		this.initEvents();
	}

	private initEvents() {
		EventBus.GameEvents.OnGameLoad.Connect((player) => {
			this.initCash(player);
			this.startAutoSaving(player);
		});
		EventBus.GameEvents.OnGameUnload.Connect((player) => {
			this.resetCash(player);
			if (player.Parent === Players)
				(player.WaitForChild("leaderstats").WaitForChild("Cash") as NumberValue).Value = 0;
		});
	}

	private initCash(player: Player): void {
		this.dataService.get(player, "cash").then((cash) => {
			const leaderstats = player.FindFirstChild("leaderstats") ?? new Instance("Folder");
			leaderstats.Name = "leaderstats";
			const numberValue =
				(leaderstats.FindFirstChild("Cash") as NumberValue | undefined) ?? new Instance("NumberValue");
			numberValue.Name = "Cash";
			numberValue.Value = cash!;
			numberValue.Parent = leaderstats;
			leaderstats.Parent = player;
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
		this.dataService.set(
			player,
			"cash",
			(player.WaitForChild("leaderstats").WaitForChild("Cash") as NumberValue).Value,
		);
	}

	public addCash(player: Player, amount: number): void {
		(player.WaitForChild("leaderstats").WaitForChild("Cash") as NumberValue).Value += amount;
	}

	public getCash(player: Player): number {
		return (player.WaitForChild("leaderstats").WaitForChild("Cash") as NumberValue).Value;
	}
}
