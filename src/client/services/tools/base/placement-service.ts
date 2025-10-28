import { Players } from "@rbxts/services";
import GridService from "client/services/plot/grid-service";
import TutorialService from "client/services/progression/tutorial-service";
import { STRUCTURES } from "shared/constants/structures";

export default class BaseStructurePlacementService {
	//#region Singleton
	private static _inst: BaseStructurePlacementService;
	public static getInst(): BaseStructurePlacementService {
		return this._inst;
	}
	//#endregion

	private constructor(private readonly gridService: GridService, private readonly tutorialService: TutorialService) {}

	public static init(gridService: GridService, tutorialService: TutorialService) {
		this._inst = new BaseStructurePlacementService(gridService, tutorialService);
	}

	public place(structureModel: Model): void {
		if (!this.canPlace(structureModel)) return;
		const targetCellPosition = this.gridService.getCellWorldPosition(
			Players.LocalPlayer,
			this.gridService.getCellAtWorldPosition(Players.LocalPlayer, structureModel.GetPivot().Position)!,
		);
		const targetCFOrientation = structureModel.GetPivot().ToOrientation();
		structureModel.PivotTo(
			new CFrame(targetCellPosition.X, 2.25, targetCellPosition.Z).mul(
				CFrame.fromOrientation(
					math.rad(math.round(math.deg(targetCFOrientation[0]) / 90) * 90),
					math.rad(math.round(math.deg(targetCFOrientation[1]) / 90) * 90),
					math.rad(math.round(math.deg(targetCFOrientation[2]) / 90) * 90),
				),
			),
		);
		this.gridService.place(Players.LocalPlayer, structureModel);
	}

	public canPlace(structureModel: Model): boolean {
		let totalValue: number = 0;
		for (const model of structureModel
			.GetChildren()
			.filter((instance): instance is Model => instance.IsA("Model") && instance.Name in STRUCTURES)) {
			totalValue += STRUCTURES[model.Name].price;
		}
		if (totalValue > (Players.LocalPlayer.WaitForChild("leaderstats").WaitForChild("Cash") as NumberValue).Value)
			return false;
		return (
			this.tutorialService.canPlace(structureModel) &&
			this.gridService.canPlace(Players.LocalPlayer, structureModel)
		);
	}

	public move(structureModel: Model): void {
		if (!this.canMove(structureModel)) return;
		const targetCellPosition = this.gridService.getCellWorldPosition(
			Players.LocalPlayer,
			this.gridService.getCellAtWorldPosition(Players.LocalPlayer, structureModel.GetPivot().Position)!,
		);
		const targetCFOrientation = structureModel.GetPivot().ToOrientation();
		structureModel.PivotTo(
			new CFrame(targetCellPosition.X, 2.25, targetCellPosition.Z).mul(
				CFrame.fromOrientation(
					math.rad(math.round(math.deg(targetCFOrientation[0]) / 90) * 90),
					math.rad(math.round(math.deg(targetCFOrientation[1]) / 90) * 90),
					math.rad(math.round(math.deg(targetCFOrientation[2]) / 90) * 90),
				),
			),
		);
		this.gridService.move(Players.LocalPlayer, structureModel);
	}

	public canMove(structureModel: Model): boolean {
		return (
			this.tutorialService.canPlace(structureModel) &&
			this.gridService.canPlace(Players.LocalPlayer, structureModel)
		);
	}
}
