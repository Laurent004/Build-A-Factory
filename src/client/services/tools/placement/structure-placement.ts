import { Players } from "@rbxts/services";
import { EventBus } from "client/event-bus";
import { Events } from "client/network";
import SoundService from "client/services/sound";
import { getStructureData, STRUCTURES } from "shared/constants/structures";
import ValidationService from "shared/services/validation";

export default class BaseStructurePlacementService {
	//#region Singleton
	private static _inst: BaseStructurePlacementService;
	public static getInst(): BaseStructurePlacementService {
		return this._inst;
	}
	//#endregion

	private constructor(
		private readonly validationService: ValidationService,
		private readonly soundService: SoundService,
	) {}

	public static init(validationService: ValidationService, soundService: SoundService): void {
		this._inst = new BaseStructurePlacementService(validationService, soundService);
	}

	public place(model: Model, targetCF: CFrame): void {
		const result = this.canPlace(model);
		if (!result.success) {
			EventBus.OnNotification.Fire(result.error!, "sfx/error");
			return;
		}
		model.PivotTo(targetCF);
		this.soundService.playSound("sfx/placement", model.GetPivot().Position);
		Events.PlaceStructures.fire(
			model
				.GetChildren()
				.filter((instance): instance is Model => instance.IsA("Model") && instance.Name in STRUCTURES)
				.map((structureModel) => getStructureData(structureModel)),
			model
				.GetChildren()
				.filter((instance): instance is RopeConstraint => instance.IsA("RopeConstraint"))
				.map((powerLine) => {
					return {
						startAttachmentCF: powerLine.Attachment0!.WorldCFrame.GetComponents(),
						endAttachmentCF: powerLine.Attachment1!.WorldCFrame.GetComponents(),
					};
				}),
		);
	}

	public canPlace(model: Model): { success: boolean; error?: string } {
		return this.validationService.canBuild(
			Players.LocalPlayer,
			model
				.GetDescendants()
				.filter((instance): instance is Model => instance.IsA("Model") && instance.Name in STRUCTURES),
		);
	}

	public edit(model: Model, targetCF: CFrame): void {
		const result = this.canEdit(model);
		if (!result.success) {
			EventBus.OnNotification.Fire(result.error!, "sfx/error");
			return;
		}
		model.PivotTo(targetCF);
		this.soundService.playSound("sfx/movement", model.GetPivot().Position);
		Events.EditStructures.fire(
			model
				.GetDescendants()
				.filter((instance): instance is Model => instance.IsA("Model") && instance.Name in STRUCTURES)
				.map((structureModel) => {
					return {
						model: structureModel,
						cf: structureModel.GetPivot(),
					};
				}),
		);
	}

	public canEdit(model: Model): { success: boolean; error?: string } {
		return this.validationService.canEdit(
			Players.LocalPlayer,
			model
				.GetDescendants()
				.filter((instance): instance is Model => instance.IsA("Model") && instance.Name in STRUCTURES),
		);
	}
}
