import { Players, ReplicatedStorage, RunService, Workspace } from "@rbxts/services";
import { STRUCTURES } from "shared/constants/structures";
import MouseService from "./mouse-service";
import BaseStructureArrowService from "./visuals/arrow-service";
import BaseStructureBeamService from "./visuals/beam-service";
import { EventBus } from "client/event-bus";

export default class BaseStructureSelectionService {
	private readonly hoverSelectionHighlight = new Instance("Highlight", Workspace);
	private readonly selectionBox: Part = ReplicatedStorage.WaitForChild("SelectionBox").Clone() as Part;
	private readonly selectionModel = new Instance("Model", Workspace);
	private readonly selectionHighlight = new Instance("Highlight", Workspace);

	private startPosition: Vector3 | undefined;
	private currentPosition: Vector3 | undefined;
	private connection: RBXScriptConnection | undefined;
	constructor(
		private readonly mouseService: MouseService,
		private readonly baseStructureArrowService: BaseStructureArrowService,
		private readonly baseStructureBeamService: BaseStructureBeamService,
		selectionHighlightFillColor: Color3,
		selectionHighlightOutlineColor: Color3,
	) {
		this.mouseService.onStructureModelChanged.Connect((newStructureModel) => {
			if (this.startPosition !== undefined || !this.connection?.Connected) return;
			this.hoverSelectionHighlight.Adornee = newStructureModel;
			this.hoverSelectionHighlight.Enabled = newStructureModel !== undefined;
			baseStructureArrowService.resetStructureArrows();
			baseStructureBeamService.resetStructureBeams();
			if (newStructureModel === undefined) return;
			baseStructureArrowService.initStructureArrows(newStructureModel);
			baseStructureBeamService.initStructureBeams(newStructureModel);
		});

		this.mouseService.onClampedCellVertexPositionChanged.Connect((newClampedCellVertexPosition) => {
			if (this.startPosition === undefined) return;
			this.currentPosition = new Vector3(newClampedCellVertexPosition.X, 0.5, newClampedCellVertexPosition.Z);
			this.updateSelection();
		});

		this.hoverSelectionHighlight.FillColor = selectionHighlightFillColor;
		this.hoverSelectionHighlight.FillTransparency = 0.7;
		this.hoverSelectionHighlight.OutlineColor = selectionHighlightOutlineColor;
		this.hoverSelectionHighlight.Enabled = false;

		const selectionBoxHighlight = this.hoverSelectionHighlight.Clone();
		selectionBoxHighlight.Adornee = this.selectionBox;
		selectionBoxHighlight.Enabled = true;
		selectionBoxHighlight.Parent = this.selectionBox;

		this.selectionHighlight.FillColor = selectionHighlightFillColor;
		this.selectionHighlight.FillTransparency = 0.7;
		this.selectionHighlight.OutlineColor = selectionHighlightOutlineColor;
		this.selectionHighlight.Enabled = false;
	}

	public startUpdating() {
		const structureModel = this.mouseService.getStructureModel();
		if (structureModel !== undefined) {
			this.hoverSelectionHighlight.Adornee = structureModel;
			this.hoverSelectionHighlight.Enabled = true;
			this.baseStructureArrowService.initStructureArrows(structureModel);
			this.baseStructureBeamService.initStructureBeams(structureModel);
		}

		this.connection = RunService.Heartbeat.Connect(() => {
			this.baseStructureArrowService.updateStructureArrows();
		});
	}

	public stopUpdating() {
		this.connection?.Disconnect();
		this.connection = undefined;
		this.hoverSelectionHighlight.Adornee = undefined;
		this.hoverSelectionHighlight.Enabled = false;
		this.baseStructureArrowService.resetStructureArrows();
		this.baseStructureBeamService.resetStructureBeams();
	}

	public startSelection() {
		const rayParams = new RaycastParams();
		rayParams.FilterType = Enum.RaycastFilterType.Exclude;
		rayParams.AddToFilter([
			Workspace.WaitForChild("Plots")
				.GetChildren()
				.find((plot) => plot.GetAttribute("UserId") === Players.LocalPlayer.UserId)!
				.WaitForChild("Structures"),
		]);
		this.mouseService.setRaycastParams(rayParams);
		const mouseClampedCellVertexPosition = this.mouseService.getClampedCellVertexPosition();
		if (mouseClampedCellVertexPosition === undefined) return;

		this.hoverSelectionHighlight.Adornee = undefined;
		this.hoverSelectionHighlight.Enabled = false;
		this.baseStructureArrowService.resetStructureArrows();
		this.baseStructureBeamService.resetStructureBeams();

		this.startPosition = new Vector3(mouseClampedCellVertexPosition.X, 0.5, mouseClampedCellVertexPosition.Z);
		this.currentPosition = this.startPosition;
		this.selectionBox.Parent = Workspace;
	}

	private updateSelection() {
		this.selectionBox.PivotTo(new CFrame(this.startPosition!.add(this.currentPosition!).div(2)));
		this.selectionBox.Size = new Vector3(
			math.abs(this.currentPosition!.X - this.startPosition!.X),
			0.001,
			math.abs(this.currentPosition!.Z - this.startPosition!.Z),
		);
	}

	public select() {
		const structuresFolder = Workspace.WaitForChild("Plots")
			.GetChildren()
			.find((plot): plot is Model => plot.GetAttribute("UserId") === Players.LocalPlayer.UserId)
			?.WaitForChild("Structures");
		for (const structureModel of this.selectionModel.GetChildren()) {
			structureModel.Parent = structuresFolder;
		}

		if (this.startPosition !== undefined && this.currentPosition !== this.startPosition) {
			this.boxSelect();
		} else {
			this.singleSelect();
		}

		this.startPosition = undefined;
		this.currentPosition = undefined;
		this.selectionBox.Size = Vector3.zero;
		this.selectionBox.Parent = undefined;
	}

	private singleSelect() {
		const rayParams = new RaycastParams();
		rayParams.FilterType = Enum.RaycastFilterType.Include;
		rayParams.AddToFilter(
			Workspace.WaitForChild("Plots")
				.GetChildren()
				.find((plot) => plot.GetAttribute("UserId") === Players.LocalPlayer.UserId)!
				.WaitForChild("Structures"),
		);
		this.mouseService.setRaycastParams(rayParams);
		const structureModel = this.mouseService.getStructureModel();
		if (structureModel !== undefined) {
			structureModel.Parent = this.selectionModel;
			this.selectionHighlight.Adornee = this.selectionModel;
			this.selectionHighlight.Enabled = true;
			EventBus.ToolEvents.OnSelection.Fire([structureModel]);
		} else {
			EventBus.ToolEvents.OnSelection.Fire([]);
		}
	}

	private boxSelect() {
		if (math.floor(this.selectionBox.Size.X) === 0 || math.floor(this.selectionBox.Size.Z) === 0) {
			EventBus.ToolEvents.OnSelection.Fire([]);
			return;
		}

		const structuresFolder = Workspace.WaitForChild("Plots")
			.GetChildren()
			.find((plot) => plot.GetAttribute("UserId") === Players.LocalPlayer.UserId)!
			.WaitForChild("Structures");
		const selectionBoxStructuresModels = new Set<Model>(
			Workspace.GetPartBoundsInBox(
				this.selectionBox.GetPivot(),
				new Vector3(this.selectionBox.Size.X - 0.01, 50, this.selectionBox.Size.Z - 0.01),
			)
				.filter((part) => part.FindFirstAncestorOfClass("Model") !== undefined)
				.mapFiltered((part) =>
					structuresFolder
						.GetChildren()
						.find(
							(instance): instance is Model =>
								instance.IsA("Model") && instance.Name in STRUCTURES && instance.IsAncestorOf(part),
						),
				),
		);

		if (selectionBoxStructuresModels.size() > 0) {
			for (const structureModel of selectionBoxStructuresModels) {
				structureModel.Parent = this.selectionModel;
			}
			this.selectionHighlight.Adornee = this.selectionModel;
			this.selectionHighlight.Enabled = true;
			EventBus.ToolEvents.OnSelection.Fire([...selectionBoxStructuresModels]);
		} else {
			EventBus.ToolEvents.OnSelection.Fire([]);
		}
	}

	public stopSelection() {
		this.startPosition = undefined;
		this.currentPosition = undefined;
		this.selectionBox.Size = Vector3.zero;
		this.selectionBox.Parent = undefined;
		this.selectionHighlight.Adornee = undefined;
		this.selectionHighlight.Enabled = false;

		const structuresFolder = Workspace.WaitForChild("Plots")
			.GetChildren()
			.find((plot): plot is Model => plot.GetAttribute("UserId") === Players.LocalPlayer.UserId)
			?.WaitForChild("Structures");
		for (const structureModel of this.selectionModel.GetChildren()) {
			structureModel.Parent = structuresFolder;
		}
	}
}
