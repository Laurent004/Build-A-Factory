import { Controller, OnInit } from "@flamework/core";
import { ToolController } from "./tool-controller";
import { Context } from "client/constants/navigation";
import { EventBus } from "client/event-bus";
import MouseService from "client/services/tools/mouse-service";
import StructureSelectionService from "client/services/tools/selection-service";
import { Events } from "client/network";

@Controller({})
export default class DeleteController extends ToolController implements OnInit {
	protected readonly context: Context = "Delete";
	private readonly mouseService: MouseService = MouseService.getInst();

	private readonly structureSelectionService = new StructureSelectionService(
		this.mouseService,
		Color3.fromRGB(245, 97, 97),
	);

	onInit(): void {
		super.onInit();

		EventBus.InputEvents.Tools.Delete.StartSelection.Connect(() => {
			this.structureSelectionService.startSelection();
		});

		EventBus.InputEvents.Tools.Delete.Select.Connect(() => {
			this.structureSelectionService.select();
		});

		this.structureSelectionService.onSelection.Connect((selectedStructuresModels) => {
			Events.DestroyStructures(selectedStructuresModels);
		});
	}

	protected override exit(): void {
		this.structureSelectionService.stopSelection();
	}
}
