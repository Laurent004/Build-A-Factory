import { Players, ReplicatedStorage, RunService, Workspace } from "@rbxts/services";
import { STRUCTURES } from "shared/constants/structures";
import MouseService from "../mouse";
import BaseStructureArrowService from "../placement/structure-arrow";
import BaseStructureBeamService from "../placement/structure-beam";
import { Object } from "@rbxts/luau-polyfill";
import SoundService from "client/services/sound";
import Signal from "@rbxts/signal";

export default class BaseStructureSelectionService {
	private readonly hoverSelectionHighlight = new Instance("Highlight", Workspace);
	private readonly selectionBox: Part = ReplicatedStorage.WaitForChild("SelectionBox").Clone() as Part;
	private readonly selectionModel = new Instance("Model", Workspace);
	private readonly selectionHighlight = new Instance("Highlight", Workspace);
	public readonly OnSelection = new Signal<(selectedStructuresModels: Model[]) => void>();

	private startPosition: Vector3 | undefined;
	private currentPosition: Vector3 | undefined;
	private connection: RBXScriptConnection | undefined;
	constructor(
		private readonly mouseService: MouseService,
		private readonly baseStructureArrowService: BaseStructureArrowService,
		private readonly baseStructureBeamService: BaseStructureBeamService,
		private readonly soundService: SoundService,
		highlightProperties?: Partial<WritableInstanceProperties<Highlight>>,
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
			this.currentPosition = new Vector3(newClampedCellVertexPosition.X, 0.251, newClampedCellVertexPosition.Z);
			this.updateSelection();
		});

		for (const [key, value] of Object.entries({ ...(highlightProperties ?? {}), Enabled: false })) {
			(this.hoverSelectionHighlight as unknown as Record<string, unknown>)[key] = value;
			(this.selectionHighlight as unknown as Record<string, unknown>)[key] = value;
		}

		const selectionBoxHighlight = this.hoverSelectionHighlight.Clone();
		selectionBoxHighlight.Adornee = this.selectionBox;
		selectionBoxHighlight.Enabled = true;
		selectionBoxHighlight.Parent = this.selectionBox;
	}

	public startUpdating(): void {
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

	public stopUpdating(): void {
		this.connection?.Disconnect();
		this.connection = undefined;
		this.hoverSelectionHighlight.Adornee = undefined;
		this.hoverSelectionHighlight.Enabled = false;
		this.baseStructureArrowService.resetStructureArrows();
		this.baseStructureBeamService.resetStructureBeams();
	}

	public startSelection(): void {
		const rayParams = new RaycastParams();
		rayParams.FilterType = Enum.RaycastFilterType.Exclude;
		rayParams.AddToFilter([
			Workspace.WaitForChild("Plots")
				.GetChildren()
				.find((plot) => plot.GetAttribute("UserId") === Players.LocalPlayer.UserId)!
				.WaitForChild("Structures"),
		]);
		this.mouseService.setRaycastParams(rayParams);
		const clampedCellVertexPosition = this.mouseService.getClampedCellVertexPosition();
		if (clampedCellVertexPosition === undefined) return;
		this.hoverSelectionHighlight.Adornee = undefined;
		this.hoverSelectionHighlight.Enabled = false;
		this.baseStructureArrowService.resetStructureArrows();
		this.baseStructureBeamService.resetStructureBeams();
		this.startPosition = new Vector3(clampedCellVertexPosition.X, 0.251, clampedCellVertexPosition.Z);
		this.currentPosition = this.startPosition;
		this.selectionBox.Parent = Workspace;
	}

	private updateSelection(): void {
		this.selectionBox.PivotTo(new CFrame(this.startPosition!.add(this.currentPosition!).div(2)));
		this.selectionBox.Size = new Vector3(
			math.abs(this.currentPosition!.X - this.startPosition!.X),
			0.001,
			math.abs(this.currentPosition!.Z - this.startPosition!.Z),
		);
	}

	public select(): void {
		const structures = Workspace.WaitForChild("Plots")
			.GetChildren()
			.find((plot): plot is Model => plot.GetAttribute("UserId") === Players.LocalPlayer.UserId)
			?.WaitForChild("Structures");
		for (const structureModel of this.selectionModel.GetChildren()) {
			structureModel.Parent = structures;
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

	private singleSelect(): void {
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
			this.soundService.playSound("sfx/select");
			this.OnSelection.Fire([structureModel]);
		} else {
			this.OnSelection.Fire([]);
		}
	}

	private boxSelect(): void {
		if (math.floor(this.selectionBox.Size.X) === 0 || math.floor(this.selectionBox.Size.Z) === 0) {
			this.OnSelection.Fire([]);
			return;
		}

		const structures = Workspace.WaitForChild("Plots")
			.GetChildren()
			.find((plot) => plot.GetAttribute("UserId") === Players.LocalPlayer.UserId)!
			.WaitForChild("Structures");
		const selectedStructuresModels = new Set<Model>(
			Workspace.GetPartBoundsInBox(
				this.selectionBox.GetPivot(),
				new Vector3(this.selectionBox.Size.X - 0.01, 50, this.selectionBox.Size.Z - 0.01),
			)
				.filter((part) => part.FindFirstAncestorOfClass("Model") !== undefined)
				.mapFiltered((part) =>
					structures
						.GetChildren()
						.find(
							(structureModel): structureModel is Model =>
								structureModel.IsA("Model") &&
								structureModel.Name in STRUCTURES &&
								structureModel.IsAncestorOf(part),
						),
				),
		);

		if (selectedStructuresModels.size() > 0) {
			for (const structureModel of selectedStructuresModels) {
				structureModel.Parent = this.selectionModel;
			}
			this.selectionHighlight.Adornee = this.selectionModel;
			this.selectionHighlight.Enabled = true;
			this.soundService.playSound("sfx/select");
		}
		this.OnSelection.Fire([...selectedStructuresModels]);
	}

	public stopSelection(): void {
		const structures = Workspace.WaitForChild("Plots")
			.GetChildren()
			.find((plot): plot is Model => plot.GetAttribute("UserId") === Players.LocalPlayer.UserId)
			?.WaitForChild("Structures");
		for (const structureModel of this.selectionModel.GetChildren()) {
			structureModel.Parent = structures;
		}

		this.startPosition = undefined;
		this.currentPosition = undefined;
		this.selectionBox.Size = Vector3.zero;
		this.selectionBox.Parent = undefined;
		this.selectionHighlight.Adornee = undefined;
		this.selectionHighlight.Enabled = false;
	}
}
