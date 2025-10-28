import { Controller, OnInit } from "@flamework/core";
import { EventBus } from "client/event-bus";
import ToolController from "./tool-controller";
import { Context } from "client/constants/navigation";
import MouseService from "client/services/tools/base/mouse-service";
import BaseStructureSelectionService from "client/services/tools/base/selection-service";

import { StandardActionBuilder } from "@rbxts/mechanism";
import GridService from "client/services/plot/grid-service";
import { Players, Workspace } from "@rbxts/services";
import BaseStructureArrowService from "client/services/tools/base/visuals/arrow-service";
import BaseStructureBeamService from "client/services/tools/base/visuals/beam-service";

@Controller({})
export default class InfoController extends ToolController implements OnInit {
	protected readonly context: Context = "Info";
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

	private readonly baseStructureSelectionService: BaseStructureSelectionService;
	private readonly baseStructureArrowService = BaseStructureArrowService.getInst();
	private readonly baseStructureBeamService = BaseStructureBeamService.getInst();

	constructor() {
		super();
		this.baseStructureSelectionService = new BaseStructureSelectionService(
			this.mouseService,
			this.baseStructureArrowService,
			this.baseStructureBeamService,
			Color3.fromRGB(35, 126, 212),
			Color3.fromRGB(70, 141, 255),
		);
	}

	public override onInit(): void | Promise<void> {
		super.onInit();
		this.baseStructureSelectionService.onSelection.Connect((selection) => {
			const rayParams = new RaycastParams();
			rayParams.FilterType = Enum.RaycastFilterType.Include;
			rayParams.AddToFilter(
				[
					Workspace.WaitForChild("Plots")
						.GetChildren()
						.find((plot) => plot.GetAttribute("UserId") === Players.LocalPlayer.UserId)!
						.WaitForChild("Structures"),
					selection,
				].filterUndefined(),
			);
			this.mouseService.setRaycastParams(rayParams);

			EventBus.ToolEvents.Info.OnSelection.Fire(selection);
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
