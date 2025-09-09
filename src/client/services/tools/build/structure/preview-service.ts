import { Players, Workspace } from "@rbxts/services";
import GridService from "client/services/plot/grid-service";
import StructureArrowService from "../../visuals/arrow-service";
import StructureHighlightService from "../../visuals/highlight-service";

export class StructurePreviewService {
	private readonly structureHighlightService: StructureHighlightService;
	private readonly structureArrowService: StructureArrowService = StructureArrowService.getInst();

	private readonly structuresModelsHolder: Model = new Instance("Model", Workspace);
	private readonly snappedStructuresModelsHolder: Model = new Instance("Model", Workspace);

	constructor(gridService: GridService) {
		this.structureHighlightService = new StructureHighlightService(gridService);
	}

	public initBuildingPreview(structuresModels: Model[]) {
		for (const structureModel of structuresModels) {
			const newStructureModel = structureModel.Clone();
			for (const tag of newStructureModel.GetTags()) {
				newStructureModel.RemoveTag(tag);
			}
			newStructureModel.Parent = this.structuresModelsHolder;
			this.structuresModelsHolder.PrimaryPart = newStructureModel.PrimaryPart;

			const newSnappedStructureModel = newStructureModel.Clone();
			newSnappedStructureModel.Parent = this.snappedStructuresModelsHolder;
			this.snappedStructuresModelsHolder.PrimaryPart = newSnappedStructureModel.PrimaryPart;
		}
		for (const instance of this.snappedStructuresModelsHolder.GetDescendants()) {
			if (instance.IsA("BasePart")) instance.Transparency = 1;
		}
		this.structureHighlightService.initHighlight(this.structuresModelsHolder);
		this.structureArrowService.initArrows(this.structuresModelsHolder);
	}

	public initEditingPreview(structuresModels: Model[]) {
		for (const structureModel of structuresModels) {
			const newStructureModel = structureModel.Clone();
			for (const tag of newStructureModel.GetTags()) {
				newStructureModel.RemoveTag(tag);
			}
			newStructureModel.Parent = this.structuresModelsHolder;
			this.structuresModelsHolder.PrimaryPart = newStructureModel.PrimaryPart;

			structureModel.Parent = this.snappedStructuresModelsHolder;
			this.snappedStructuresModelsHolder.PrimaryPart = structureModel.PrimaryPart;
		}

		for (const instance of this.snappedStructuresModelsHolder.GetDescendants()) {
			if (instance.IsA("BasePart")) instance.Transparency = 1;
		}
		this.structureHighlightService.initHighlight(this.structuresModelsHolder);
		this.structureArrowService.initArrows(this.structuresModelsHolder);
	}

	public updateBuildingPreview(currentCF: CFrame, targetCF: CFrame) {
		this.structuresModelsHolder.PivotTo(currentCF);
		this.snappedStructuresModelsHolder.PivotTo(targetCF);
		this.structureHighlightService.updateBuildingHighlight(this.getStructuresModels());
		this.structureArrowService.updateAllStructuresArrows();
	}

	public updateEditingPreview(currentCF: CFrame, targetCF: CFrame) {
		this.structuresModelsHolder.PivotTo(currentCF);
		this.snappedStructuresModelsHolder.PivotTo(targetCF);
		this.structureHighlightService.updateEditingHighlight(this.getStructuresModels());
		this.structureArrowService.updateAllStructuresArrows();
	}

	public resetBuildingPreview() {
		this.structureHighlightService.resetHighlight();
		this.structureArrowService.resetAllArrows();
		for (const structureModel of this.structuresModelsHolder.GetChildren()) {
			structureModel.Destroy();
		}
		for (const snappedStructureModel of this.getStructuresModels()) {
			snappedStructureModel.Destroy();
		}
	}

	public resetEditingPreview() {
		this.structureHighlightService.resetHighlight();
		this.structureArrowService.resetAllArrows();
		for (const structureModel of this.structuresModelsHolder.GetChildren()) {
			structureModel.Destroy();
		}
		for (const instance of this.snappedStructuresModelsHolder.GetDescendants()) {
			if (instance.IsA("BasePart") && instance.Name !== "GridPart") instance.Transparency = 0;
		}

		const plot = Workspace.WaitForChild("Plots")
			.GetChildren()
			.find((plot) => plot.GetAttribute("UserId") === Players.LocalPlayer.UserId);
		for (const structureModel of this.getStructuresModels()) {
			structureModel.Parent = plot;
		}
	}

	public getStructuresModels(): Model[] {
		return this.snappedStructuresModelsHolder.GetChildren() as Model[];
	}
}
