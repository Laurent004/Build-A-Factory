import { OnInit, OnStart, Service } from "@flamework/core";
import { HttpService, Players } from "@rbxts/services";
import { Events } from "server/network";
import { DataService } from "./data";
import { Object } from "@rbxts/luau-polyfill";
import { TECHS } from "shared/constants/tech";
import Signal from "@rbxts/signal";
import { PowerLineData, StructureData } from "shared/constants/structures";

export interface SaveData {
	id: string;
	tutorialStep: number;
	cash: number;
	logisticsData: number;
	productionData: number;
	powerData: number;
	techs: string[];
	expansions: [number, number, number][];
	structures: StructureData[];
	powerLines: PowerLineData[];
}

const SAVE_TEMPLATE: SaveData = {
	id: "",
	tutorialStep: 14,
	cash: 2500,
	logisticsData: 0,
	productionData: 0,
	powerData: 0,
	techs: Object.entries(TECHS)
		.filter(
			([, techDefinition]) =>
				techDefinition.requirements.size() === 0 &&
				[
					techDefinition.cost.logisticsData,
					techDefinition.cost.productionData,
					techDefinition.cost.powerData,
				].every((cost) => cost === 0),
		)
		.map(([techName]) => techName),
	expansions: [
		[-30, 0, -90],
		[30, 0, -90],
	],
	structures: [
		{
			name: "Miner",
			cf: [-6.0, 2.25, -110.0, 0.0, 0.0, 1.0, 0.0, 1.0, 0.0, -1.0, 0.0, 0.0],
			attributes: new Map<string, AttributeValue>(),
			children: [],
		},
		{
			name: "Conveyor",
			cf: [-6.0, 2.25, -78.0, 0.0, 0.0, -1.0, 0.0, 1.0, 0.0, 1.0, 0.0, 0.0],
			attributes: new Map<string, AttributeValue>(),
			children: [],
		},
		{
			name: "Conveyor",
			cf: [-2.0, 2.25, -78.0, 0.0, 0.0, -1.0, 0.0, 1.0, 0.0, 1.0, 0.0, 0.0],
			attributes: new Map<string, AttributeValue>(),
			children: [],
		},
		{
			name: "Conveyor",
			cf: [2.0, 2.25, -78.0, 0.0, 0.0, -1.0, 0.0, 1.0, 0.0, 1.0, 0.0, 0.0],
			attributes: new Map<string, AttributeValue>(),
			children: [],
		},
		{
			name: "Conveyor",
			cf: [6.0, 2.25, -78.0, 0.0, 0.0, -1.0, 0.0, 1.0, 0.0, 1.0, 0.0, 0.0],
			attributes: new Map<string, AttributeValue>(),
			children: [],
		},
		{
			name: "Conveyor",
			cf: [10.0, 2.25, -78.0, 0.0, 0.0, -1.0, 0.0, 1.0, 0.0, 1.0, 0.0, 0.0],
			attributes: new Map<string, AttributeValue>(),
			children: [],
		},
		{
			name: "Conveyor",
			cf: [14.0, 2.25, -78.0, 0.0, 0.0, -1.0, 0.0, 1.0, 0.0, 1.0, 0.0, 0.0],
			attributes: new Map<string, AttributeValue>(),
			children: [],
		},

		{
			name: "Delivery Dock",
			cf: [18.0, 5.25, -78.0, 0.0, 0.0, -1.0, 0.0, 1.0, 0.0, 1.0, 0.0, 0.0],
			attributes: new Map<string, AttributeValue>(),
			children: [],
		},
	],
	powerLines: [],
};

@Service()
export class SaveService implements OnInit, OnStart {
	private readonly registry = new Map<keyof SaveData, (player: Player) => unknown>();
	private readonly saves = new Map<Player, SaveData>();
	private readonly autosaveInterval = 120;
	public readonly OnSaveLoad = new Signal<(player: Player, saveData: SaveData) => void>();
	public readonly OnSaveUnload = new Signal<(player: Player) => void>();

	constructor(private readonly dataService: DataService) {}

	onInit(): void | Promise<void> {
		this.initEvents();
	}

	onStart(): void {
		this.startAutosaving();
	}

	private initEvents(): void {
		Players.PlayerRemoving.Connect((player) => {
			const saveData = this.saves.get(player);
			if (saveData === undefined) return;
			this.save(player);
			this.OnSaveUnload.Fire(player);
			this.saves.delete(player);
		});

		Events.CreateSave.connect((player) => {
			if (this.saves.has(player)) return;
			this.dataService.get(player, "saves").then((saves) => {
				const newSaveData = { ...SAVE_TEMPLATE, id: HttpService.GenerateGUID() };
				this.saves.set(player, newSaveData);
				const newSavesData = [...saves, newSaveData];
				this.dataService.set(player, "saves", newSavesData);
				Events.OnSavesUpdate.fire(
					player,
					newSavesData.map((saveData) => {
						return {
							id: saveData.id,
							size: HttpService.JSONEncode([...saveData.structures, ...saveData.powerLines]).size(),
						};
					}),
				);
				this.OnSaveLoad.Fire(player, newSaveData);
			});
		});

		Events.LoadSave.connect((player, saveId) => {
			if (this.saves.has(player)) return;
			this.dataService.get(player, "saves").then((saves) => {
				const saveData = saves.find((save) => save.id === saveId)!;
				this.saves.set(player, saveData);
				this.OnSaveLoad.Fire(player, saveData);
			});
		});

		Events.UnloadSave.connect((player) => {
			if (!this.saves.has(player)) return;
			this.dataService.get(player, "saves").then((saves) => {
				this.save(player);
				Events.OnSavesUpdate.fire(
					player,
					saves.map((saveData) => {
						return {
							id: saveData.id,
							size: HttpService.JSONEncode([...saveData.structures, ...saveData.powerLines]).size(),
						};
					}),
				);
				this.OnSaveUnload.Fire(player);
				this.saves.delete(player);
			});
		});

		Events.DeleteSave.connect((player) => {
			const saveData = this.saves.get(player);
			if (saveData === undefined) return;
			this.dataService.get(player, "saves").then((saves) => {
				const newSavesData = [...saves];
				newSavesData.remove(saves.indexOf(saveData));
				this.dataService.set(player, "saves", newSavesData);
				Events.OnSavesUpdate.fire(
					player,
					newSavesData.map((saveData) => {
						return {
							id: saveData.id,
							size: HttpService.JSONEncode([...saveData.structures, ...saveData.powerLines]).size(),
						};
					}),
				);
				this.OnSaveUnload.Fire(player);
				this.saves.delete(player);
			});
		});
	}

	public register<K extends keyof SaveData>(key: K, provider: (player: Player) => SaveData[K]): void {
		this.registry.set(key, provider);
	}

	private startAutosaving(): void {
		task.spawn(() => {
			while (task.wait(this.autosaveInterval)) {
				for (const [player] of this.saves) {
					this.save(player);
					Events.OnNotification.fire(player, `<font color="rgb(255, 255, 255)">Autosaving...</font>`);
					task.delay(6, () => {
						Events.OnNotification.fire(
							player,
							`<font color="rgb(255, 255, 255)">Successfully saved!</font>`,
							"sfx/success",
						);
					});
				}
			}
		});
	}

	private save(player: Player): void {
		const saveData = this.saves.get(player)!;
		for (const [key, provider] of this.registry) {
			(saveData as unknown as Record<string, unknown>)[key] = provider(player);
		}
		this.dataService.get(player, "saves").then((saves) => {
			const index = saves.findIndex((save) => save.id === saveData.id);
			const newSavesData = [...saves];
			newSavesData[index] = saveData;
			this.dataService.set(player, "saves", newSavesData);
		});
	}

	public get<K extends keyof SaveData>(player: Player, key: K, timeout: number = 12): Promise<SaveData[K]> {
		return new Promise((resolve, reject) => {
			task.spawn(() => {
				while (!this.saves.has(player)) {
					task.wait();
				}
				resolve(this.saves.get(player)![key]);
			});
			task.delay(timeout, () => {
				reject();
			});
		});
	}

	public set<K extends keyof SaveData>(player: Player, key: K, value: SaveData[K]): void {
		const saveData = this.saves.get(player);
		if (saveData === undefined) return;
		saveData[key] = value;
		this.save(player);
	}
}
