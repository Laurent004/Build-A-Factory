import { Controller, OnInit } from "@flamework/core";
import { EventBus } from "client/event-bus";
import { ToolController } from "./tool-controller";
import { Context } from "client/constants/navigation";
import MouseService from "client/services/tools/mouse-service";
import StructureSelectionService from "client/services/tools/selection-service";
import { store } from "client/store";
import { Object } from "@rbxts/luau-polyfill";
import { selectPanelsStructureAttributes } from "client/store/panels";

@Controller({})
export default class InfoController extends ToolController implements OnInit {
	protected readonly context: Context = "Info";
	private readonly mouseService: MouseService = MouseService.getInst();

	private readonly structureSelectionService = new StructureSelectionService(
		this.mouseService,
		Color3.fromRGB(27, 137, 206),
	);

	onInit(): void {
		super.onInit();
		EventBus.InputEvents.Tools.Info.Select.Connect(() => {
			this.structureSelectionService.select();
		});
		this.structureSelectionService.onSelection.Connect((selectedStructuresModels) => {
			EventBus.ToolEvents.Info.OnSelection.Fire(selectedStructuresModels);
		});
		store.subscribe(selectPanelsStructureAttributes, (panelsStructureAttributes) => {
			if (panelsStructureAttributes === undefined) return;
			const structureModel = store.getState().panels.structureModel!;
			const structureAttributes = Object.entries(panelsStructureAttributes);
			for (const [structureAttributeName, structureAttributeValue] of structureAttributes) {
				if (structureAttributeValue === "") {
					structureModel.SetAttribute(structureAttributeName, undefined);
				} else {
					structureModel.SetAttribute(structureAttributeName, structureAttributeValue);
				}
			}
		});
	}

	protected override exit(): void {
		this.structureSelectionService.stopSelection();
	}
}
