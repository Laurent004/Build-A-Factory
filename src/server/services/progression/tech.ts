import { OnInit, Service } from "@flamework/core";
import { Events } from "server/network";
import { TECHS } from "shared/constants/tech";
import { HttpService, Players } from "@rbxts/services";
import { Object } from "@rbxts/luau-polyfill";
import CurrencyService from "./currency";
import ValidationService from "shared/services/validation";
import { SaveData, SaveService } from "../data/save";

@Service()
export default class TechService implements OnInit {
	private readonly validationService = ValidationService.getInst();
	private readonly techs = new Map<Player, string[]>();

	constructor(private readonly saveService: SaveService, private readonly currencyService: CurrencyService) {}

	onInit(): void | Promise<void> {
		this.initEvents();
	}

	private initEvents(): void {
		Players.PlayerAdded.Connect((player) => {
			this.techs.set(player, []);
			player.SetAttribute("Techs", HttpService.JSONEncode([]));
		});

		Players.PlayerRemoving.Connect((player) => {
			this.techs.delete(player);
		});

		this.saveService.OnSaveLoad.Connect((player, saveData) => {
			this.initTechs(player, saveData);
		});

		this.saveService.OnSaveUnload.Connect((player) => {
			this.resetTechs(player);
		});

		Events.UnlockTech.connect((player, techName) => {
			if (!this.validationService.canUnlockTech(player, techName).success) return;
			const techDefinition = TECHS[techName];
			for (const [dataCurrency, cost] of Object.entries({
				"Logistics Data": techDefinition.cost.logisticsData,
				"Production Data": techDefinition.cost.productionData,
				"Power Data": techDefinition.cost.powerData,
			})) {
				this.currencyService.addCurrency(player, dataCurrency, -cost);
			}
			this.techs.get(player)!.push(techName);
			this.saveService.set(player, "techs", this.techs.get(player)!);
			player.SetAttribute("Techs", HttpService.JSONEncode(this.techs.get(player)));
			this.unlockTech(player, techName);
		});
	}

	private initTechs(player: Player, saveData: SaveData): void {
		this.techs.set(player, saveData.techs);
		player.SetAttribute("Techs", HttpService.JSONEncode(saveData.techs));
		for (const tech of saveData.techs) {
			this.unlockTech(player, tech);
		}
	}

	private resetTechs(player: Player): void {
		player.SetAttribute("Techs", HttpService.JSONEncode([]));
	}

	private unlockTech(player: Player, techName: string): void {
		const techDefinition = TECHS[techName];
		if (
			techDefinition.type === "Upgrade" &&
			techDefinition.upgradeIndex ===
				this.techs
					.get(player)!
					.mapFiltered((tech) =>
						TECHS[tech].type === "Upgrade" && TECHS[tech].upgradeName === techDefinition.upgradeName
							? TECHS[tech]
							: undefined,
					)
					.sort(
						(techDefinitionA, techDefinitionB) =>
							techDefinitionA.upgradeIndex > techDefinitionB.upgradeIndex,
					)[0].upgradeIndex
		) {
			player.SetAttribute(techDefinition.upgradeName, techDefinition.upgradeValue);
		}
	}
}
