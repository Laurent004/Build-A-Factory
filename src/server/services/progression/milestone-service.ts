import { OnInit, OnStart, Service } from "@flamework/core";
import DataService from "../data/data-service";
import DeliveryDockComponent from "server/components/transporters/delivery-dock";
import { Components } from "@flamework/components";
import { Players } from "@rbxts/services";
import { Item } from "shared/constants/items";
import { Events } from "server/network";
import { MILESTONES, MilestoneData } from "shared/constants/milestones";
import { Object } from "@rbxts/luau-polyfill";
import { EventBus } from "server/event-bus";

@Service({})
export default class MilestoneService implements OnInit, OnStart {
	private readonly milestonesData = new Map<Player, MilestoneData>();

	constructor(private readonly components: Components, private readonly dataService: DataService) {}

	onInit(): void | Promise<void> {
		this.initEvents();
	}

	onStart(): void {
		this.startAutoSave();
	}

	private initEvents(): void {
		Players.PlayerAdded.Connect((player) => {
			this.initMilestoneData(player);
		});

		Players.PlayerRemoving.Connect((player) => {
			this.onPlayerRemoving(player);
		});

		this.components.onComponentAdded<DeliveryDockComponent>((deliveryDockComponent, deliveryDockModel) => {
			const player = Players.GetPlayerByUserId(
				deliveryDockModel.Parent!.Parent!.GetAttribute("UserId") as number,
			)!;
			deliveryDockComponent.OnInput.Connect((item) => {
				this.updateMilestoneProgress(player, item);
			});
		});

		Events.UnlockMilestone.connect((player, milestone) => {
			const milestoneData = this.milestonesData.get(player)!;
			if (milestoneData.milestone + 1 !== milestone) return;
			const nextMilestone = Object.entries(MILESTONES).find(
				([_, milestone]) => milestone.index === milestoneData.milestone + 1,
			);
			if (nextMilestone === undefined) return;

			if (
				Object.entries(nextMilestone[1].itemsToDeliver).every(
					([itemName, count]) =>
						milestoneData.deliveredItems[itemName] !== undefined &&
						milestoneData.deliveredItems[itemName] >= count,
				)
			) {
				milestoneData.milestone++;
				milestoneData.deliveredItems = {};
				this.dataService.set(player, "milestoneData", milestoneData);
				Events.OnMilestoneDataUpdate.fire(player, milestoneData);
				EventBus.ProgressionEvents.OnMilestoneUnlock.Fire(player, milestoneData.milestone);
			}
		});
	}

	private initMilestoneData(player: Player) {
		this.dataService.get(player, "milestoneData").then((milestoneData) => {
			this.milestonesData.set(player, milestoneData!);
			Events.OnMilestoneDataUpdate.fire(player, milestoneData!);
		});
	}

	private onPlayerRemoving(player: Player) {
		this.save(player);
		this.milestonesData.delete(player);
	}

	private updateMilestoneProgress(player: Player, item: Item): void {
		const milestoneData = this.milestonesData.get(player)!;
		const nextMilestone = Object.entries(MILESTONES).find(
			([_, milestone]) => milestone.index === milestoneData.milestone + 1,
		);
		if (nextMilestone === undefined) return;
		milestoneData!.deliveredItems[item.name] = (milestoneData.deliveredItems[item.name] ?? 0) + 1;
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
		this.dataService.set(player, "milestoneData", this.milestonesData.get(player)!);
	}

	public getMilestone(player: Player): number | undefined {
		return this.milestonesData.get(player)?.milestone;
	}
}
