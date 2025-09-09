import { Players, ReplicatedStorage, Workspace } from "@rbxts/services";
import { STRUCTURES } from "shared/constants/structures";
import MouseService from "./mouse-service";
import Signal from "@rbxts/signal";

export default class StructureSelectionService {
	private readonly player = Players.LocalPlayer;
	private readonly playerGui = this.player.WaitForChild("PlayerGui") as PlayerGui;
	private readonly mouse = this.player.GetMouse();

	private readonly selectionModel = new Instance("Model", Workspace);
	private readonly selectionBox = ReplicatedStorage.WaitForChild("SelectionBox").Clone() as Part;
	private readonly selectionModelHighlight = new Instance("Highlight");
	private readonly rayParams = new RaycastParams();

	public readonly onSelection = new Signal<(selectedStructureModels: Model[]) => void>();

	private startPosition: Vector3 | undefined;
	private currentPosition: Vector3 | undefined;

	constructor(private readonly mouseService: MouseService, selectionHighlightColor: Color3) {
		this.mouseService.onMouseClampedCellChanged.Connect((_, newClampedCellPosition) => {
			this.updateSelection(newClampedCellPosition);
		});
		this.selectionBox.GetChildren().find((instance) => instance.IsA("Highlight"))!.FillColor =
			selectionHighlightColor;
		this.selectionModelHighlight.FillColor = selectionHighlightColor;
		this.rayParams.FilterType = Enum.RaycastFilterType.Exclude;
	}

	public startSelection() {
		const mouseCellPosition = this.mouseService.getMouseCellPosition();
		if (mouseCellPosition === undefined) return;
		this.startPosition = new Vector3(mouseCellPosition.X, 0.5, mouseCellPosition.Z);
		this.currentPosition = this.startPosition;
		this.selectionBox.Parent = this.selectionModel;

		const plot = Workspace.WaitForChild("Plots")
			.GetChildren()
			.find((plot) => plot.GetAttribute("UserId") === this.player.UserId)!;
		this.rayParams.FilterDescendantsInstances = [plot];
		this.mouseService.setRaycastParams(this.rayParams);
	}

	private updateSelection(newCellPosition: Vector3) {
		if (this.startPosition === undefined) return;
		this.currentPosition = new Vector3(newCellPosition.X, 0.5, newCellPosition.Z);

		const position = this.startPosition.add(this.currentPosition).div(2);
		const size = new Vector3(
			math.abs(this.currentPosition.X - this.startPosition.X) + 4,
			0.001,
			math.abs(this.currentPosition.Z - this.startPosition.Z) + 4,
		);

		this.selectionBox.PivotTo(new CFrame(position));
		this.selectionBox.Size = size;

		this.resetSelection();
		const structuresModels = Workspace.GetPartsInPart(this.selectionBox)
			.map((instance) => instance.FindFirstAncestorOfClass("Model"))
			.filterUndefined()
			.filter((model) => model.Name in STRUCTURES);
		for (const structureModel of structuresModels) {
			structureModel.Parent = this.selectionModel;
		}
		this.updateHighlights();
	}

	private resetSelection() {
		const plotStructuresFolder = Workspace.WaitForChild("Plots")
			.GetChildren()
			.find((plot) => plot.GetAttribute("UserId") === this.player.UserId)
			?.WaitForChild("Structures");
		for (const selectedModel of this.selectionModel.GetChildren()) {
			selectedModel.Parent = plotStructuresFolder;
		}
	}

	public stopSelection() {
		this.resetSelection();
		this.startPosition = undefined;
		this.currentPosition = undefined;
		this.selectionBox.Size = Vector3.zero;
		this.selectionBox.Parent = undefined;
	}

	public select() {
		const selectedStructuresModels = this.selectionModel
			.GetChildren()
			.filter((instance): instance is Model => instance.IsA("Model") && instance.Name in STRUCTURES);

		this.resetSelection();
		if (this.startPosition !== undefined && this.currentPosition !== this.startPosition) {
			this.boxSelection(selectedStructuresModels);
		} else {
			this.singleSelection();
		}

		this.startPosition = undefined;
		this.currentPosition = undefined;
		this.selectionBox.Size = Vector3.zero;
		this.selectionBox.Parent = undefined;
	}

	private singleSelection() {
		const guiObjects = this.playerGui.GetGuiObjectsAtPosition(this.mouse.X, this.mouse.Y);
		if (guiObjects.size() > 0) return;

		const structureModel = this.mouse.Target?.FindFirstAncestorOfClass("Model");
		if (structureModel !== undefined && structureModel.Name in STRUCTURES) {
			structureModel.Parent = this.selectionModel;
			this.updateHighlights();

			const selectedStructuresModels = this.selectionModel
				.GetChildren()
				.filter((instance): instance is Model => instance.IsA("Model") && instance.Name in STRUCTURES);
			this.onSelection.Fire(selectedStructuresModels);
		} else {
			this.onSelection.Fire([]);
		}
	}

	private boxSelection(selectedStructuresModels: Model[]) {
		if (selectedStructuresModels.size() > 0) {
			this.onSelection.Fire(selectedStructuresModels);
		}
	}

	private updateHighlights() {
		this.selectionModelHighlight.Enabled = true;
		this.selectionModelHighlight.Adornee = this.selectionModel;
		this.selectionModelHighlight.Parent = undefined;
		this.selectionModelHighlight.Parent = Workspace;
	}
}
