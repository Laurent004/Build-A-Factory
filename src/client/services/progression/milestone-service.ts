import { Dependency } from "@flamework/core";
import { Components } from "@flamework/components";
import { Players, Workspace } from "@rbxts/services";
import { MilestoneData, MILESTONES } from "shared/constants/milestones";
import { Events } from "client/network";
import DeliveryDockComponent from "client/components/transporters/delivery-dock";
import Signal from "@rbxts/signal";
import { Object } from "@rbxts/luau-polyfill";

export default class MilestoneService {
	//#region Singleton
	private static _inst: MilestoneService;
	public static getInst(): MilestoneService {
		this._inst = this._inst ?? new MilestoneService();
		return this._inst;
	}
	//#endregion

	private readonly components = Dependency<Components>();
	private milestoneData!: MilestoneData;
	public readonly onMilestoneDataUpdate = new Signal<(milestoneData: MilestoneData) => void>();

	private constructor() {
		this.initEvents();
	}

	private initEvents(): void {
		for (const deliveryDockComponent of Workspace.WaitForChild("Plots")
			.GetChildren()
			.find((plot) => plot.GetAttribute("UserId") === Players.LocalPlayer.UserId)!
			.WaitForChild("Structures")
			.GetChildren()
			.mapFiltered((structureModel) => this.components.getComponent<DeliveryDockComponent>(structureModel))) {
			deliveryDockComponent.OnInput.Connect((item) => {
				this.updateMilestoneProgress(item);
			});
		}
		Events.OnMilestoneDataUpdate.connect((newMilestoneData) => {
			this.milestoneData = newMilestoneData;
			this.milestoneData.deliveredItems = newMilestoneData.deliveredItems;
			this.onMilestoneDataUpdate.Fire(newMilestoneData);
		});

		this.components.onComponentAdded<DeliveryDockComponent>((deliveryDockComponent, deliveryDockModel) => {
			if (
				Players.GetPlayerByUserId(deliveryDockModel.Parent!.Parent!.GetAttribute("UserId") as number)! !==
				Players.LocalPlayer
			)
				return;
			deliveryDockComponent.OnInput.Connect((item) => {
				this.updateMilestoneProgress(item);
			});
		});
	}

	private updateMilestoneProgress(item: Model): void {
		const nextMilestone = Object.entries(MILESTONES).find(
			([_, milestone]) => milestone.index === this.milestoneData.milestone + 1,
		);
		if (nextMilestone === undefined) return;
		this.milestoneData!.deliveredItems[item.Name] = (this.milestoneData.deliveredItems[item.Name] ?? 0) + 1;
		this.onMilestoneDataUpdate.Fire(this.milestoneData);
	}
}
