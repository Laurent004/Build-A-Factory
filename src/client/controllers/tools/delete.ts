import { Controller } from "@flamework/core";
import ToolController from "./tool";
import MouseService from "client/services/tools/mouse";
import BaseStructureSelectionService from "client/services/tools/selection/structure-selection";
import { Events } from "client/network";
import { StandardActionBuilder } from "@rbxts/mechanism";
import BaseStructureArrowService from "client/services/tools/placement/structure-arrow";
import BaseStructureBeamService from "client/services/tools/placement/structure-beam";
import { Players, Workspace } from "@rbxts/services";
import { EventBus } from "client/event-bus";
import { STRUCTURES } from "shared/constants/structures";
import SoundService from "client/services/sound";
import ValidationService from "shared/services/validation";
import { GridService } from "shared/services/plot";
import { store } from "client/hooks/store";

@Controller()
export default class DeleteController extends ToolController {
	protected readonly context = "Delete";
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
	private readonly validationService = ValidationService.getInst();
	private readonly soundService = SoundService.getInst();

	private readonly baseStructureSelectionService = new BaseStructureSelectionService(
		this.mouseService,
		BaseStructureArrowService.getInst(),
		BaseStructureBeamService.getInst(),
		this.soundService,
		{ FillColor: Color3.fromRGB(255, 60, 89), FillTransparency: 0.7, OutlineColor: Color3.fromRGB(255, 101, 104) },
	);

	protected override initEvents(): void {
		super.initEvents();
		this.baseStructureSelectionService.OnSelection.Connect((selectedStructuresModels) => {
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
				if (this.validationService.canDelete(Players.LocalPlayer, selectedStructuresModels)) {
					if (selectedStructuresModels.size() === 1) {
						this.soundService.playSound("sfx/destroy", selectedStructuresModels[0].GetPivot().Position);
						Events.DestroyStructures(
							[selectedStructuresModels[0], ...selectedStructuresModels[0].GetDescendants()].filter(
								(instance): instance is Model => instance.IsA("Model") && instance.Name in STRUCTURES,
							),
						);
					}
				} else {
					EventBus.OnNotification.Fire(
						`<font color="rgb(255, 98, 98)">You cannot delete this during the tutorial!</font>`,
						"sfx/error",
					);
				}
			}
			store.setContextStructuresModels(
				selectedStructuresModels.size() > 1 &&
					this.validationService.canDelete(Players.LocalPlayer, selectedStructuresModels)
					? selectedStructuresModels
					: [],
			);
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
