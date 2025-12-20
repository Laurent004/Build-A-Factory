import { Players, TweenService, Workspace } from "@rbxts/services";
import { EventBus } from "client/event-bus";
import { Events } from "client/network";
import GridService from "client/services/plot/grid-service";
import TutorialService from "client/services/progression/tutorial-service";
import { getStructureData, STRUCTURES } from "shared/constants/structures";

export default class BaseStructurePlacementService {
	//#region Singleton
	private static _inst: BaseStructurePlacementService;
	public static getInst(): BaseStructurePlacementService {
		return this._inst;
	}
	//#endregion

	private constructor(private readonly gridService: GridService, private readonly tutorialService: TutorialService) {
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
		});
	}

	public static init(gridService: GridService, tutorialService: TutorialService) {
		this._inst = new BaseStructurePlacementService(gridService, tutorialService);
	}

	public place(model: Model, targetCF: CFrame): void {
		const structuresModels = model
			.GetDescendants()
			.filter((instance): instance is Model => instance.IsA("Model") && instance.Name in STRUCTURES);
		const overlapParams = new OverlapParams();
		overlapParams.FilterType = Enum.RaycastFilterType.Include;
		overlapParams.AddToFilter(Players.LocalPlayer.Character!);
		if (
			structuresModels.some((structureModel) => {
				const cells = STRUCTURES[structureModel.Name].nodes.cells.mapFiltered((cellNodeLocalPosition) =>
					this.gridService.getCellAtWorldPosition(
						Players.LocalPlayer,
						structureModel.GetPivot().PointToWorldSpace(cellNodeLocalPosition),
					),
				);
				return (
					cells.size() !== STRUCTURES[structureModel.Name].nodes.cells.size() ||
					cells.some((cell) => cell.structureModel !== undefined)
				);
			})
		) {
			EventBus.OnNotification.Fire(`<font color="rgb(255, 98, 98)">You cannot place here!</font>`);
			return;
		} else if (
			structuresModels.some((structureModel) => {
				return (
					STRUCTURES[structureModel.Name].nodes.cells.size() !== 0 &&
					Workspace.GetPartsInPart(structureModel.PrimaryPart!, overlapParams).size() > 0
				);
			})
		) {
			EventBus.OnNotification.Fire(`<font color="rgb(255, 98, 98)">Move your character out of the way!</font>`);
			return;
		} else if (
			structuresModels.reduce(
				(totalValue, structureModel) => (totalValue += STRUCTURES[structureModel.Name].cost),
				0,
			) > (Players.LocalPlayer.WaitForChild("leaderstats").WaitForChild("Cash") as NumberValue).Value
		) {
			EventBus.OnNotification.Fire(
				`<font color="rgb(255, 98, 98)">You need $${
					structuresModels.reduce(
						(totalValue, structureModel) => (totalValue += STRUCTURES[structureModel.Name].cost),
						0,
					) - (Players.LocalPlayer.WaitForChild("leaderstats").WaitForChild("Cash") as NumberValue).Value
				} more to place this!</font>`,
			);
			return;
		} else if (!this.tutorialService.canPlace(model)) {
			EventBus.OnNotification.Fire(
				`<font color="rgb(255, 98, 98)">You cannot place this during the tutorial!</font>`,
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
		const overlapParams = new OverlapParams();
		overlapParams.FilterType = Enum.RaycastFilterType.Include;
		overlapParams.AddToFilter(Players.LocalPlayer.Character!);
		return (
			structuresModels.every((structureModel) => {
				const cells = STRUCTURES[structureModel.Name].nodes.cells.mapFiltered((cellNodeLocalPosition) =>
					this.gridService.getCellAtWorldPosition(
						Players.LocalPlayer,
						structureModel.GetPivot().PointToWorldSpace(cellNodeLocalPosition),
					),
				);
				return (
					cells.size() === STRUCTURES[structureModel.Name].nodes.cells.size() &&
					cells.every((cell) => cell.structureModel === undefined)
				);
			}) &&
			structuresModels.every((structureModel) => {
				return (
					STRUCTURES[structureModel.Name].nodes.cells.size() === 0 ||
					Workspace.GetPartsInPart(structureModel.PrimaryPart!, overlapParams).size() === 0
				);
			}) &&
			structuresModels.reduce(
				(totalValue, structureModel) => (totalValue += STRUCTURES[structureModel.Name].cost),
				0,
			) <= (Players.LocalPlayer.WaitForChild("leaderstats").WaitForChild("Cash") as NumberValue).Value &&
			this.tutorialService.canPlace(model)
		);
	}

	public move(model: Model, targetCF: CFrame): void {
		const structuresModels = model
			.GetDescendants()
			.filter((instance): instance is Model => instance.IsA("Model") && instance.Name in STRUCTURES);
		const overlapParams = new OverlapParams();
		overlapParams.FilterType = Enum.RaycastFilterType.Include;
		overlapParams.AddToFilter(Players.LocalPlayer.Character!);
		if (
			structuresModels.some((structureModel) => {
				const cells = STRUCTURES[structureModel.Name].nodes.cells.mapFiltered((cellNodeLocalPosition) =>
					this.gridService.getCellAtWorldPosition(
						Players.LocalPlayer,
						structureModel.GetPivot().PointToWorldSpace(cellNodeLocalPosition),
					),
				);
				return (
					cells.size() !== STRUCTURES[structureModel.Name].nodes.cells.size() ||
					cells.some((cell) => cell.structureModel !== undefined)
				);
			})
		) {
			EventBus.OnNotification.Fire(`<font color="rgb(255, 98, 98)">You cannot place here!</font>`);
			return;
		} else if (
			structuresModels.some((structureModel) => {
				return (
					STRUCTURES[structureModel.Name].nodes.cells.size() !== 0 &&
					Workspace.GetPartsInPart(structureModel.PrimaryPart!, overlapParams).size() > 0
				);
			})
		) {
			EventBus.OnNotification.Fire(`<font color="rgb(255, 98, 98)">Move your character out of the way!</font>`);
			return;
		} else if (!this.tutorialService.canPlace(model)) {
			EventBus.OnNotification.Fire(
				`<font color="rgb(255, 98, 98)">You cannot move this during the tutorial!</font>`,
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
		const overlapParams = new OverlapParams();
		overlapParams.FilterType = Enum.RaycastFilterType.Include;
		overlapParams.AddToFilter(Players.LocalPlayer.Character!);
		return (
			structuresModels.every((structureModel) => {
				const cells = STRUCTURES[structureModel.Name].nodes.cells.mapFiltered((cellNodeLocalPosition) =>
					this.gridService.getCellAtWorldPosition(
						Players.LocalPlayer,
						structureModel.GetPivot().PointToWorldSpace(cellNodeLocalPosition),
					),
				);
				return (
					cells.size() === STRUCTURES[structureModel.Name].nodes.cells.size() &&
					cells.every((cell) => cell.structureModel === undefined)
				);
			}) &&
			structuresModels.every((structureModel) => {
				if (STRUCTURES[structureModel.Name].nodes.cells.size() === 0) return true;
				return Workspace.GetPartsInPart(structureModel.PrimaryPart!, overlapParams).size() === 0;
			}) &&
			this.tutorialService.canPlace(model)
		);
	}
}
