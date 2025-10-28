import { Workspace } from "@rbxts/services";

export default class BaseStructureHighlightService {
	//#region Singleton
	private static _inst: BaseStructureHighlightService;
	public static getInst(): BaseStructureHighlightService {
		this._inst = this._inst ?? new BaseStructureHighlightService();
		return this._inst;
	}
	//#endregion

	private readonly highlight = new Instance("Highlight", Workspace);
	private readonly canPlaceHighlightFillColor = Color3.fromRGB(35, 126, 212);
	private readonly cannotPlaceHighlightFillColor = Color3.fromRGB(255, 60, 89);
	private readonly canPlaceHighlightOutlineColor = Color3.fromRGB(70, 141, 255);
	private readonly cannotPlaceHighlightOutlineColor = Color3.fromRGB(255, 101, 104);

	private constructor() {
		this.highlight.FillTransparency = 0.7;
		this.highlight.Enabled = false;
	}

	public initStructureHighlight(structureModel: Model) {
		this.highlight.Adornee = structureModel;
		this.highlight.Enabled = true;
	}

	public updateStructureHighlight(canPlace: boolean) {
		this.highlight.FillColor = canPlace ? this.canPlaceHighlightFillColor : this.cannotPlaceHighlightFillColor;
		this.highlight.OutlineColor = canPlace
			? this.canPlaceHighlightOutlineColor
			: this.cannotPlaceHighlightOutlineColor;
	}

	public resetStructureHighlight() {
		this.highlight.Adornee = undefined;
		this.highlight.Enabled = false;
	}
}
