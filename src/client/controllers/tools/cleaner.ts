import { Controller, OnInit } from "@flamework/core";
import ToolController from "./tool";
import BaseStructureSelectionService from "client/services/tools/selection/structure-selection";
import { Events } from "client/network";
import { StandardActionBuilder } from "@rbxts/mechanism";
import MouseService from "client/services/tools/mouse";
import { STRUCTURES } from "shared/constants/structures";
import GridService from "client/services/plot/grid";
import BaseStructureArrowService from "client/services/tools/placement/structure-arrow";
import BaseStructureBeamService from "client/services/tools/placement/structure-beam";
import { Players, Workspace } from "@rbxts/services";
import { EventBus } from "client/event-bus";
import { Array } from "@rbxts/luau-polyfill";
import SoundService from "client/services/sound";

@Controller({})
export default class CleanerController extends ToolController implements OnInit {
	protected readonly context = "Cleaner";
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

	private readonly gridService = GridService.getInst();
	private readonly mouseService = new MouseService(this.gridService);
	private readonly soundService = SoundService.getInst();

	private readonly baseStructureArrowService = BaseStructureArrowService.getInst();
	private readonly baseStructureBeamService = BaseStructureBeamService.getInst();
	private readonly baseStructureSelectionService = new BaseStructureSelectionService(
		this.mouseService,
		this.baseStructureArrowService,
		this.baseStructureBeamService,
		this.soundService,
		{ FillColor: Color3.fromRGB(35, 126, 212), FillTransparency: 0.7, OutlineColor: Color3.fromRGB(70, 141, 255) },
	);

	public override onInit(): void | Promise<void> {
		super.onInit();
		EventBus.OnSelection.Connect((selectedStructuresModels) => {
			if (!this.active) return;
			const rayParams = new RaycastParams();
			rayParams.FilterType = Enum.RaycastFilterType.Include;
			rayParams.AddToFilter([
				Workspace.WaitForChild("Plots")
					.GetChildren()
					.find((plot) => plot.GetAttribute("UserId") === Players.LocalPlayer.UserId)!
					.WaitForChild("Structures"),
				...selectedStructuresModels,
			]);
			this.mouseService.setRaycastParams(rayParams);
			if (selectedStructuresModels.size() > 0) {
				Events.ClearStructuresItems.fire(
					Array.flatMap(selectedStructuresModels, (structureModel) =>
						[structureModel, ...structureModel.GetDescendants()].filter(
							(instance): instance is Model => instance.IsA("Model") && instance.Name in STRUCTURES,
						),
					),
				);
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
		this.mouseService.stopUpdating();
		this.baseStructureSelectionService.stopUpdating();
		this.baseStructureSelectionService.stopSelection();
	}
}
