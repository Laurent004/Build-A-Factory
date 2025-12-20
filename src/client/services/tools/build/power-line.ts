import { Players, Workspace } from "@rbxts/services";
import { STRUCTURES } from "shared/constants/structures";
import { PowerService } from "client/services/plot/power-service";
import BaseBuildingService from "./base";
import MouseService from "../base/mouse-service";

export class PowerLineBuildingService extends BaseBuildingService {
	private readonly powerLine: RopeConstraint = STRUCTURES["Power Line"].model
		.FindFirstChildOfClass("RopeConstraint")!
		.Clone();
	private readonly powerLineEnd: Part = STRUCTURES["Power Line"].model.WaitForChild("Power Line End").Clone() as Part;

	constructor(private readonly powerService: PowerService, private readonly mouseService: MouseService) {
		super();
		this.mouseService.onMove.Connect(() => {
			if (!this.active || this.powerLine.Attachment0 === undefined) return;
			this.powerLineEnd.Position = this.mouseService.getMouse().Hit.Position;
		});

		this.powerLine.Parent = Workspace;
		this.powerLine.Attachment1 = new Instance("Attachment", this.powerLineEnd);
		this.powerLineEnd.Parent = Workspace;
	}

	public exit() {
		super.exit();
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

		const result = this.mouseService.getRayResult();
		if (result === undefined) {
			if (this.powerLine.Attachment0 !== undefined) {
				this.exit();
				this.enter();
			}
			return;
		}

		const model = result.Instance.FindFirstAncestorOfClass("Model");
		if (model === undefined || !(model.Name in STRUCTURES)) {
			if (this.powerLine.Attachment0 !== undefined) {
				this.exit();
				this.enter();
			}
			return;
		}

		let closestAttachment: Attachment | undefined;
		let closestDistance: number = math.huge;
		for (const attachment of model
			.GetDescendants()
			.filter(
				(instance): instance is Attachment => instance.IsA("Attachment") && instance.Name === "PowerAttachment",
			)) {
			const distance = attachment.WorldPosition.sub(result.Position).Magnitude;
			if (distance < closestDistance && distance <= 8) {
				closestAttachment = attachment;
				closestDistance = distance;
			}
		}

		if (closestAttachment === undefined || this.powerLine.Attachment0 === closestAttachment) {
			this.exit();
			this.enter();
			return;
		}

		if (this.powerLine.Attachment0 === undefined) {
			this.powerLine.Attachment0 = closestAttachment;
			this.powerLineEnd.Position = this.mouseService.getMouse().Hit.Position;
		} else {
			this.powerService.attemptConnect(this.powerLine.Attachment0, closestAttachment);
			this.powerLine.Attachment0 = closestAttachment;
		}
	}
}
