import {  Workspace } from "@rbxts/services";
import BaseStructureHighlightService from "../../base/visuals/highlight-service";
import BaseStructureArrowService from "../../base/visuals/arrow-service";
import { STRUCTURES } from "shared/constants/structures";
import BaseStructureBeamService from "../../base/visuals/beam-service";

export class UndergroundBeltPreviewService {
	private readonly undergroundBeltModelHolder = new Instance("Model", Workspace);

	constructor(
		private readonly baseStructureHighlightService: BaseStructureHighlightService,
		private readonly baseStructureArrowService: BaseStructureArrowService,
		private readonly baseStructureBeamService: BaseStructureBeamService,
	) {}

	public initUndergroundBeltPreview(undergroundBeltInputCF: CFrame, undergroundBeltOutputCF: CFrame) {
		const newUndergroundBeltModel = STRUCTURES["Underground Belt"].model.Clone();
		newUndergroundBeltModel.PivotTo(undergroundBeltInputCF);
		(newUndergroundBeltModel.WaitForChild("Underground Belt Output") as Model).PivotTo(undergroundBeltOutputCF);
		newUndergroundBeltModel.Parent = this.undergroundBeltModelHolder;

		this.baseStructureHighlightService.initStructureHighlight(this.undergroundBeltModelHolder);
		this.baseStructureArrowService.initStructureArrows(this.undergroundBeltModelHolder);
		this.baseStructureBeamService.initStructureBeams(this.undergroundBeltModelHolder);
	}

	public updateUndergroundBeltPreview(canPlace: boolean) {
		this.baseStructureHighlightService.updateStructureHighlight(canPlace);
		this.baseStructureArrowService.updateStructureArrows();
		this.baseStructureBeamService.updateStructureBeams();
	}

	public resetUndergroundBeltPreview() {
		this.baseStructureHighlightService.resetStructureHighlight();
		this.baseStructureArrowService.resetStructureArrows();
		this.baseStructureBeamService.resetStructureBeams();

		for (const undergroundBeltModel of this.undergroundBeltModelHolder.GetChildren()) {
			undergroundBeltModel.Destroy();
		}
	}

	public getUndergroundBeltModelHolder() {
		return this.undergroundBeltModelHolder;
	}
}
