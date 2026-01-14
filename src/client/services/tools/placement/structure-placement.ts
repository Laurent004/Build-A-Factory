import { Players, TweenService, Workspace } from "@rbxts/services";
import { EventBus } from "client/event-bus";
import { Events } from "client/network";
import GridService from "client/services/plot/grid";
import TutorialService from "client/services/progression/tutorial";
import SoundService from "client/services/sound";
import { getStructureData, STRUCTURES } from "shared/constants/structures";
import CollisionService from "shared/services/collision";

export default class BaseStructurePlacementService {
	//#region Singleton
	private static _inst: BaseStructurePlacementService;
	public static getInst(): BaseStructurePlacementService {
		return this._inst;
	}
	//#endregion

	private constructor(
		private readonly gridService: GridService,
		private readonly collisionService: CollisionService,
		private readonly tutorialService: TutorialService,
		soundService: SoundService,
	) {
		Events.OnStructuresPlacement.connect((player, structuresModels) => {
			const model = new Instance(
				"Model",
				Workspace.WaitForChild("Plots")
					.GetChildren()
					.find((plot): plot is Model => plot.GetAttribute("UserId") === player.UserId)!
					.WaitForChild("Structures"),
			);
			for (const structureModel of structuresModels.filter(
				(structureModel) => structureModel.Parent === model.Parent,
			)) {
				structureModel.Parent = model;
			}
			const highlight = new Instance("Highlight", model);
			highlight.FillColor = Color3.fromRGB(255, 255, 255);
			highlight.OutlineColor = Color3.fromRGB(255, 255, 255);
			const tween = TweenService.Create(
				highlight,
				new TweenInfo(0.75, Enum.EasingStyle.Cubic, Enum.EasingDirection.InOut),
				{
					FillTransparency: 1,
					OutlineTransparency: 1,
				},
			);
			tween.Play();
			tween.Completed.Once(() => {
				for (const structureModel of model.GetChildren()) {
					structureModel.Parent = model.Parent!;
				}
				model.Destroy();
			});
			soundService.playSound("sfx/placement", structuresModels[0].GetPivot().Position);
		});

		Events.OnStructuresMovement.connect((player, structuresModels) => {
			const model = new Instance(
				"Model",
				Workspace.WaitForChild("Plots")
					.GetChildren()
					.find((plot): plot is Model => plot.GetAttribute("UserId") === player.UserId)!
					.WaitForChild("Structures"),
			);
			for (const structureModel of structuresModels.filter(
				(structureModel) => structureModel.Parent === model.Parent,
			)) {
				structureModel.Parent = model;
			}
			const highlight = new Instance("Highlight", model);
			highlight.FillColor = Color3.fromRGB(255, 255, 255);
			highlight.OutlineColor = Color3.fromRGB(255, 255, 255);
			const tween = TweenService.Create(
				highlight,
				new TweenInfo(0.75, Enum.EasingStyle.Cubic, Enum.EasingDirection.InOut),
				{
					FillTransparency: 1,
					OutlineTransparency: 1,
				},
			);
			tween.Play();
			tween.Completed.Once(() => {
				for (const structureModel of model.GetChildren()) {
					structureModel.Parent = model.Parent!;
				}
				model.Destroy();
			});
			soundService.playSound("sfx/movement", structuresModels[0].GetPivot().Position);
		});
	}

	public static init(
		gridService: GridService,
		collisionService: CollisionService,
		tutorialService: TutorialService,
		soundService: SoundService,
	): void {
		this._inst = new BaseStructurePlacementService(gridService, collisionService, tutorialService, soundService);
	}

	public place(model: Model, targetCF: CFrame): void {
		const structuresModels = model
			.GetDescendants()
			.filter((instance): instance is Model => instance.IsA("Model") && instance.Name in STRUCTURES);
		if (!this.gridService.canPlace(Players.LocalPlayer, structuresModels)) {
			EventBus.OnNotification.Fire(`<font color="rgb(255, 98, 98)">You cannot place here!</font>`, "sfx/error");
			return;
		} else if (!this.collisionService.canPlace(Players.LocalPlayer, structuresModels)) {
			EventBus.OnNotification.Fire(
				`<font color="rgb(255, 98, 98)">Move your character out of the way!</font>`,
				"sfx/error",
			);
			return;
		} else if (!this.tutorialService.canPlace(model)) {
			EventBus.OnNotification.Fire(
				`<font color="rgb(255, 98, 98)">You cannot place this during the tutorial!</font>`,
				"sfx/error",
			);
			return;
		} else if (
			(Players.LocalPlayer.WaitForChild("leaderstats").WaitForChild("Cash") as NumberValue).Value <
			structuresModels.reduce(
				(totalValue, structureModel) => (totalValue += STRUCTURES[structureModel.Name].cost),
				0,
			)
		) {
			EventBus.OnNotification.Fire(
				`<font color="rgb(255, 98, 98)">You need $${
					structuresModels.reduce(
						(totalValue, structureModel) => (totalValue += STRUCTURES[structureModel.Name].cost),
						0,
					) - (Players.LocalPlayer.WaitForChild("leaderstats").WaitForChild("Cash") as NumberValue).Value
				} more to place this!</font>`,
				"sfx/error",
			);
			return;
		}

		model.PivotTo(targetCF);
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

	public canPlace(model: Model): boolean {
		const structuresModels = model
			.GetDescendants()
			.filter((instance): instance is Model => instance.IsA("Model") && instance.Name in STRUCTURES);
		return (
			this.gridService.canPlace(Players.LocalPlayer, structuresModels) &&
			this.collisionService.canPlace(Players.LocalPlayer, structuresModels) &&
			this.tutorialService.canPlace(model) &&
			(Players.LocalPlayer.WaitForChild("leaderstats").WaitForChild("Cash") as NumberValue).Value >=
				structuresModels.reduce(
					(totalValue, structureModel) => (totalValue += STRUCTURES[structureModel.Name].cost),
					0,
				)
		);
	}

	public move(model: Model, targetCF: CFrame): void {
		const structuresModels = model
			.GetDescendants()
			.filter((instance): instance is Model => instance.IsA("Model") && instance.Name in STRUCTURES);
		if (!this.gridService.canPlace(Players.LocalPlayer, structuresModels)) {
			EventBus.OnNotification.Fire(`<font color="rgb(255, 98, 98)">You cannot place here!</font>`, "sfx/error");
			return;
		} else if (!this.collisionService.canPlace(Players.LocalPlayer, structuresModels)) {
			EventBus.OnNotification.Fire(
				`<font color="rgb(255, 98, 98)">Move your character out of the way!</font>`,
				"sfx/error",
			);
			return;
		} else if (!this.tutorialService.canPlace(model)) {
			EventBus.OnNotification.Fire(
				`<font color="rgb(255, 98, 98)">You cannot move this during the tutorial!</font>`,
				"sfx/error",
			);
			return;
		}

		model.PivotTo(targetCF);
		Events.MoveStructures.fire(
			model
				.GetDescendants()
				.filter((instance): instance is Model => instance.IsA("Model") && instance.Name in STRUCTURES)
				.map((model) => {
					return {
						model: model,
						cf: model.GetPivot(),
					};
				}),
		);
	}

	public canMove(model: Model): boolean {
		const structuresModels = model
			.GetDescendants()
			.filter((instance): instance is Model => instance.IsA("Model") && instance.Name in STRUCTURES);
		return (
			this.gridService.canPlace(Players.LocalPlayer, structuresModels) &&
			this.collisionService.canPlace(Players.LocalPlayer, structuresModels) &&
			this.tutorialService.canPlace(model)
		);
	}
}
