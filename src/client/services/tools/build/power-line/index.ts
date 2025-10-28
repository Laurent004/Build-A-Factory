import { Players, RunService, Workspace } from "@rbxts/services";
import BaseStructureBuildingService from "../building-service";
import { STRUCTURES } from "shared/constants/structures";
import { PowerService } from "client/services/plot/power-service";
import MouseService from "../../base/mouse-service";

export class PowerLineBuildingService extends BaseStructureBuildingService {
	private readonly player = Players.LocalPlayer;
	private readonly mouse = this.player.GetMouse();

	private readonly powerLine: RopeConstraint = STRUCTURES["Power Line"].model
		.FindFirstChildOfClass("RopeConstraint")!
		.Clone();
	private readonly powerLineEnd: Part = STRUCTURES["Power Line"].model.WaitForChild("Power Line End").Clone() as Part;

	private connection: RBXScriptConnection | undefined;

	constructor(private readonly powerService: PowerService, private readonly mouseService: MouseService) {
		super();
		this.powerLine.Parent = Workspace;
		this.powerLine.Attachment1 = new Instance("Attachment", this.powerLineEnd);
		this.powerLineEnd.Parent = Workspace;
	}

	public enter() {}

	public exit() {
		this.stopUpdating();
		this.mouseService.stopUpdating();
		this.powerLine.Attachment0 = undefined;
	}

	public onPlacementStart() {
		const rayParams = new RaycastParams();
		rayParams.FilterType = Enum.RaycastFilterType.Include;
		rayParams.AddToFilter(
			Workspace.WaitForChild("Plots")
				.GetChildren()
				.find((plot) => plot.GetAttribute("UserId") === Players.LocalPlayer.UserId)!,
		);
		this.mouseService.setRaycastParams(rayParams);

		const result = this.mouseService.getMouseRayResult();
		if (result === undefined) {
			if (this.powerLine.Attachment0 !== undefined) {
				this.exit();
			}
			return;
		}

		const model = result.Instance.FindFirstAncestorOfClass("Model");
		if (model === undefined || !(model.Name in STRUCTURES)) {
			if (this.powerLine.Attachment0 !== undefined) {
				this.exit();
			}
			return;
		}

		let closestPowerAttachment: Attachment | undefined;
		let closestDistance: number = math.huge;
		for (const powerAttachment of model
			.GetDescendants()
			.filter(
				(instance): instance is Attachment => instance.IsA("Attachment") && instance.Name === "PowerAttachment",
			)) {
			const distance = powerAttachment.WorldPosition.sub(result.Position).Magnitude;
			if (distance < closestDistance && distance <= 8) {
				closestPowerAttachment = powerAttachment;
				closestDistance = distance;
			}
		}

		if (closestPowerAttachment === undefined || this.powerLine.Attachment0 === closestPowerAttachment) {
			this.exit();
			return;
		}

		if (this.powerLine.Attachment0 === undefined) {
			this.powerLine.Attachment0 = closestPowerAttachment;
			this.startUpdating();
		} else {
			this.powerService.attemptConnect(this.powerLine.Attachment0, closestPowerAttachment);
			this.powerLine.Attachment0 = closestPowerAttachment;
		}
	}

	private startUpdating() {
		this.connection = RunService.Heartbeat.Connect(() => {
			this.powerLineEnd.Position = this.mouse.Hit.Position;
		});
	}

	private stopUpdating() {
		this.connection?.Disconnect();
		this.connection = undefined;
	}
}
