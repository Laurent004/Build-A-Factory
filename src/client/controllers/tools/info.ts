import { Controller, OnInit } from "@flamework/core";
import { EventBus } from "client/event-bus";
import ToolController from "./tool";
import MouseService from "client/services/tools/mouse";
import BaseStructureSelectionService from "client/services/tools/selection/structure-selection";
import { StandardActionBuilder } from "@rbxts/mechanism";
import GridService from "client/services/plot/grid";
import { Players, Workspace } from "@rbxts/services";
import BaseStructureArrowService from "client/services/tools/placement/structure-arrow";
import BaseStructureBeamService from "client/services/tools/placement/structure-beam";
import SoundService from "client/services/sound";

@Controller({})
export default class InfoController extends ToolController implements OnInit {
	protected readonly context = "Info";
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
