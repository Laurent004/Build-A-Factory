import { Controller, OnStart } from "@flamework/core";
import ToolController from "./tool";
import MouseService from "client/services/tools/mouse";
import BaseStructureSelectionService from "client/services/tools/selection/structure-selection";
import { StandardActionBuilder } from "@rbxts/mechanism";
import { Lighting, Players, Workspace } from "@rbxts/services";
import BaseStructureArrowService from "client/services/tools/placement/structure-arrow";
import BaseStructureBeamService from "client/services/tools/placement/structure-beam";
import SoundService from "client/services/sound";
import { Components } from "@flamework/components";
import StructureComponent from "shared/components/structure";
import { GridService, isPowerConsumer, PowerConsumer } from "shared/services/plot";
import { selectContextStructureModels } from "client/hooks/store/context";
import { store } from "client/hooks/store";

@Controller()
export default class InfoController extends ToolController implements OnStart {
	protected readonly context = "Info";
	protected readonly inputActions = [
		{
			action: new StandardActionBuilder("MouseButton1"),
			activated: () => {
				this.baseStructureSelectionService.startSelection();
			},
			deactivated: () => {
				this.baseStructureSelectionService.select();
			},
		},
		{
			action: new StandardActionBuilder("H"),
			activated: () => {
				this.toggleEfficiencyView();
			},
		},
	];

	private readonly gridService = GridService.getInst();
	private readonly mouseService = new MouseService(this.gridService);
	private readonly soundService = SoundService.getInst();

	private readonly baseStructureArrowService = BaseStructureArrowService.getInst();
	private readonly baseStructureBeamService = BaseStructureBeamService.getInst();
	private readonly baseStructureSelectionService = new BaseStructureSelectionService(
		this.mouseService,
		this.baseStructureArrowService,
		this.baseStructureBeamService,
		this.soundService,
		{ FillColor: Color3.fromRGB(35, 126, 212), FillTransparency: 0.7, OutlineColor: Color3.fromRGB(70, 141, 255) },
	);

	private readonly highlights = new Map<Highlight, StructureComponent>();
	private inEfficiencyView: boolean = false;
	private connection: RBXScriptConnection | undefined;

	constructor(private readonly components: Components) {
		super();
	}

	onStart(): void {
		this.startUpdatingEfficiencyView();
	}

	protected override initEvents(): void {
		super.initEvents();
		this.baseStructureSelectionService.OnSelection.Connect((selectedStructuresModels) => {
			if (!this.active) return;
			const rayParams = new RaycastParams();
			rayParams.FilterType = Enum.RaycastFilterType.Include;
			rayParams.AddToFilter([
				Workspace.WaitForChild("Plots")
					.GetChildren()
					.find((plot) => plot.GetAttribute("UserId") === Players.LocalPlayer.UserId)!
					.WaitForChild("Structures"),
				...selectedStructuresModels,
			]);
			this.mouseService.setRaycastParams(rayParams);
			store.setContextStructuresModels(selectedStructuresModels);
		});

		store.subscribe(selectContextStructureModels, (structuresModels) => {
			this.connection?.Disconnect();
			this.connection = structuresModels[0]?.AttributeChanged.Connect((attributeName) => {
				store.setContextStructuresModelsAttribute(
					attributeName,
					structuresModels[0].GetAttribute(attributeName),
				);
			});
		});
	}

	protected override enter(): void {
		super.enter();
		const rayParams = new RaycastParams();
		rayParams.FilterType = Enum.RaycastFilterType.Include;
		rayParams.AddToFilter(
			Workspace.WaitForChild("Plots")
				.GetChildren()
				.find((plot) => plot.GetAttribute("UserId") === Players.LocalPlayer.UserId)!
				.WaitForChild("Structures"),
		);
		this.mouseService.setRaycastParams(rayParams);
		this.mouseService.startUpdating();
		this.baseStructureSelectionService.startUpdating();
	}

	protected override exit(): void {
		super.exit();
		this.mouseService.stopUpdating();
		this.baseStructureSelectionService.stopUpdating();
		this.baseStructureSelectionService.stopSelection();
		if (this.inEfficiencyView) {
			this.toggleEfficiencyView();
		}
	}

	private startUpdatingEfficiencyView(): void {
		task.spawn(() => {
			while (task.wait(0.1)) {
				if (!this.inEfficiencyView) continue;
				for (const [highlight, structureComponent] of this.highlights) {
					if (!isPowerConsumer(structureComponent)) continue;
					highlight.FillColor = Color3.fromHSV(0, 1, 1).Lerp(
						new Color3(0.333, 1, 0),
						structureComponent.getEfficiency(),
					);
				}
			}
		});
	}

	private toggleEfficiencyView(): void {
		this.inEfficiencyView = !this.inEfficiencyView;

		const colorCorrectionEffect = Lighting.FindFirstChildOfClass("ColorCorrectionEffect")!;
		if (this.inEfficiencyView) {
			for (const structureComponent of this.components
				.getAllComponents<StructureComponent>()
				.filter(
					(structureComponent): structureComponent is StructureComponent & PowerConsumer =>
						structureComponent.player === Players.LocalPlayer && isPowerConsumer(structureComponent),
				)) {
				const newHighlight = new Instance("Highlight");
				newHighlight.FillColor = Color3.fromRGB(255, 0, 0).Lerp(
					Color3.fromRGB(0, 255, 0),
					structureComponent.getEfficiency(),
				);
				newHighlight.FillTransparency = 0.6;
				newHighlight.OutlineTransparency = 1;
				newHighlight.Adornee = structureComponent.instance;
				newHighlight.Parent = Workspace;
				this.highlights.set(newHighlight, structureComponent);
			}
			colorCorrectionEffect.Saturation = -1;
			colorCorrectionEffect.TintColor = Color3.fromRGB(150, 150, 150);
		} else {
			for (const [highlight] of this.highlights) {
				highlight.Destroy();
			}
			this.highlights.clear();
			colorCorrectionEffect.Saturation = 0;
			colorCorrectionEffect.TintColor = Color3.fromRGB(232, 232, 232);
		}
	}
}
