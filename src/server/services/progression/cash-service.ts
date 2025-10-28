import { OnInit, OnStart, Service } from "@flamework/core";
import DataService from "../data/data-service";
import { Players } from "@rbxts/services";
import { Components } from "@flamework/components";
import DeliveryDockComponent from "server/components/transporters/delivery-dock";
import { ITEMS } from "shared/constants/items";
import { EventBus } from "server/event-bus";
import { STRUCTURES } from "shared/constants/structures";
import { Events } from "server/network";

@Service({})
export default class CashService implements OnInit, OnStart {
	constructor(private readonly components: Components, private readonly dataService: DataService) {}

	onInit(): void | Promise<void> {
		this.initEvents();
	}

	onStart(): void {
		this.startAutoSave();
	}

	private initEvents() {
		Players.PlayerAdded.Connect((player) => {
			this.initPlayerCash(player);
		});

		Players.PlayerRemoving.Connect((player) => {
			this.onPlayerRemoving(player);
		});

		EventBus.PlotEvents.OnStructuresPlacement.Connect((player, structuresModels) => {
			let totalValue: number = 0;
			for (const structureModel of structuresModels) {
				totalValue += STRUCTURES[structureModel.Name].price;
			}
			(player.WaitForChild("leaderstats").WaitForChild("Cash") as NumberValue).Value -= totalValue;
		});

		Events.DestroyStructures.connect((player, structuresModels) => {
			let totalValue: number = 0;
			for (const structureModel of structuresModels) {
				totalValue += STRUCTURES[structureModel.Name].price;
			}
			(player.WaitForChild("leaderstats").WaitForChild("Cash") as NumberValue).Value += totalValue;
		});

		this.components.onComponentAdded<DeliveryDockComponent>((deliveryDockComponent, deliveryDockModel) => {
			const player = Players.GetPlayerByUserId(
				deliveryDockModel.Parent!.Parent!.GetAttribute("UserId") as number,
			)!;
			deliveryDockComponent.OnInput.Connect((item) => {
				(player.WaitForChild("leaderstats").WaitForChild("Cash") as NumberValue).Value +=
					ITEMS[item.name].value;
			});
		});
	}

	private initPlayerCash(player: Player): void {
		this.dataService.get(player, "cash").then((cash) => {
			const leaderstats = new Instance("Folder");
			leaderstats.Name = "leaderstats";
			const cashNumberValue = new Instance("NumberValue");
			cashNumberValue.Name = "Cash";
			cashNumberValue.Value = cash!;
			cashNumberValue.Parent = leaderstats;
			leaderstats.Parent = player;
		});
	}

	private onPlayerRemoving(player: Player): void {
		this.save(player);
	}

	private startAutoSave(): void {
		task.spawn(() => {
			while (task.wait(60)) {
				for (const player of Players.GetPlayers()) {
					this.save(player);
				}
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

	public canAfford(player: Player, amount: number): boolean {
		return (player.WaitForChild("leaderstats").WaitForChild("Cash") as NumberValue).Value >= amount;
	}
}
