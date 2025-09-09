import { Players } from "@rbxts/services";
import GridService from "client/services/plot/grid-service";

export default class StructureHighlightService {
	private readonly structureHighlight = new Instance("Highlight");
	private readonly canPlaceColor: Color3 = Color3.fromRGB(27, 137, 206);
	private readonly cannotPlaceColor: Color3 = Color3.fromRGB(235, 79, 79);
	private readonly updateDelay: number = 0.2;
	private lastUpdateTime: number = 0;

	constructor(private readonly gridService: GridService) {}

	public initHighlight(structureModel: Model) {
		this.structureHighlight.Parent = structureModel;
	}

	public resetHighlight() {
		this.structureHighlight.Parent = undefined;
	}

	public updateBuildingHighlight(structuresModels: Model[]) {
		if (os.clock() - this.lastUpdateTime < this.updateDelay) return;
		this.lastUpdateTime = os.clock();
		const canPlace = this.gridService.canPlace(Players.LocalPlayer, structuresModels);
		this.structureHighlight.FillColor = canPlace ? this.canPlaceColor : this.cannotPlaceColor;
	}

	public updateEditingHighlight(structuresModels: Model[]) {
		if (os.clock() - this.lastUpdateTime < this.updateDelay) return;
		this.lastUpdateTime = os.clock();
		const canMoveTo = this.gridService.canMoveTo(Players.LocalPlayer, structuresModels);
		this.structureHighlight.FillColor = canMoveTo ? this.canPlaceColor : this.cannotPlaceColor;
	}
}
