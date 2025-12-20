import { Controller, OnInit } from "@flamework/core";
import ToolController from "./tool";
import { Context } from "client/constants/navigation";
import MouseService from "client/services/tools/base/mouse-service";
import BaseStructureSelectionService from "client/services/tools/base/selection-service";
import { Events } from "client/network";
import { StandardActionBuilder } from "@rbxts/mechanism";
import GridService from "client/services/plot/grid-service";
import BaseStructureArrowService from "client/services/tools/base/visuals/arrow-service";
import BaseStructureBeamService from "client/services/tools/base/visuals/beam-service";
import { Players, Workspace } from "@rbxts/services";
import { EventBus } from "client/event-bus";
import { Array } from "@rbxts/luau-polyfill";
import { STRUCTURES } from "shared/constants/structures";

@Controller({})
export default class DeleteController extends ToolController implements OnInit {
	protected readonly context: Context = "Delete";
	protected readonly inputActions = [
		{
			action: new StandardActionBuilder("MouseButton1"),
			activated: () => {
				this.baseStructureSelectionService.startSelection();
			},
			deactivated: () => {
				this.baseStructureSelectionService.select();
			},
		},
	];

	private readonly gridService: GridService = GridService.getInst();
	private readonly mouseService: MouseService = new MouseService(this.gridService);

	private readonly baseStructureSelectionService = new BaseStructureSelectionService(
		this.mouseService,
		BaseStructureArrowService.getInst(),
		BaseStructureBeamService.getInst(),
		Color3.fromRGB(255, 60, 89),
		Color3.fromRGB(255, 101, 104),
	);

	public override onInit(): void | Promise<void> {
		super.onInit();
		EventBus.ToolEvents.OnSelection.Connect((selectedStructuresModels) => {
			if (!this.active) return;
			const rayParams = new RaycastParams();
			rayParams.FilterType = Enum.RaycastFilterType.Include;
			rayParams.AddToFilter(
				Workspace.WaitForChild("Plots")
					.GetChildren()
					.find((plot) => plot.GetAttribute("UserId") === Players.LocalPlayer.UserId)!
					.WaitForChild("Structures"),
			);
			this.mouseService.setRaycastParams(rayParams);
			if (selectedStructuresModels.size() === 1) {
				Events.DestroyStructures([
					...selectedStructuresModels,
					...Array.flatMap(selectedStructuresModels, (structureModel) =>
						structureModel
							.GetDescendants()
							.filter(
								(instance): instance is Model => instance.IsA("Model") && instance.Name in STRUCTURES,
							),
					),
				]);
			}
		});
	}

	protected override enter(): void {
		super.enter();
		const rayParams = new RaycastParams();
		rayParams.FilterType = Enum.RaycastFilterType.Include;
		rayParams.AddToFilter(
			Workspace.WaitForChild("Plots")
				.GetChildren()
				.find((plot) => plot.GetAttribute("UserId") === Players.LocalPlayer.UserId)!
				.WaitForChild("Structures"),
		);
		this.mouseService.setRaycastParams(rayParams);
		this.mouseService.startUpdating();
		this.baseStructureSelectionService.startUpdating();
	}

	protected override exit(): void {
		super.exit();
		this.baseStructureSelectionService.stopUpdating();
		this.baseStructureSelectionService.stopSelection();
		this.mouseService.stopUpdating();
	}
}
