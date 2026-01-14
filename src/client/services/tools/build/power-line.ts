import { Players, RunService, Workspace } from "@rbxts/services";
import { STRUCTURES } from "shared/constants/structures";
import { PowerService } from "client/services/plot/power";
import BaseBuildingService from "./base";
import MouseService from "../mouse";
import { EventBus } from "client/event-bus";
import SoundService from "client/services/sound";

export class PowerLineBuildingService extends BaseBuildingService {
	private readonly powerLine: RopeConstraint = STRUCTURES["Power Line"].model
		.FindFirstChildOfClass("RopeConstraint")!
		.Clone();
	private readonly powerLineEnd: Part = STRUCTURES["Power Line"].model.WaitForChild("Power Line End").Clone() as Part;
	private connection: RBXScriptConnection | undefined;

	constructor(
		private readonly powerService: PowerService,
		private readonly mouseService: MouseService,
		private readonly soundService: SoundService,
	) {
		super();
		this.mouseService.getMouse().Move.Connect(() => {
			if (this.active && this.powerLine.Attachment0 !== undefined) {
				this.powerLineEnd.Position = this.mouseService.getMouse().Hit.Position;
			}
		});
		this.powerLine.Parent = Workspace;
		this.powerLine.Attachment1 = new Instance("Attachment", this.powerLineEnd);
		this.powerLineEnd.Parent = Workspace;
	}

	public exit(): void {
		super.exit();
		this.stopUpdatingPowerLine();
		this.powerLine.Attachment0 = undefined;
	}

	public onStart(): void {
		const rayParams = new RaycastParams();
		rayParams.FilterType = Enum.RaycastFilterType.Include;
		rayParams.AddToFilter(
			Workspace.WaitForChild("Plots")
				.GetChildren()
				.find((plot) => plot.GetAttribute("UserId") === Players.LocalPlayer.UserId)!
				.WaitForChild("Structures"),
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

		const attachment = model
			.GetDescendants()
			.filter(
				(instance): instance is Attachment => instance.IsA("Attachment") && instance.Name === "PowerAttachment",
			)
			.sort(
				(attachmentA, attachmentB) =>
					attachmentA.WorldPosition.sub(result.Position).Magnitude <
					attachmentB.WorldPosition.sub(result.Position).Magnitude,
			)[0];
		if (
			attachment === undefined ||
			attachment.WorldPosition.sub(result.Position).Magnitude > 8 ||
			this.powerLine.Attachment0 === attachment
		) {
			if (
				attachment !== undefined &&
				attachment.WorldPosition.sub(result.Position).Magnitude <= 8 &&
				this.powerLine.Attachment0 === attachment
			) {
				EventBus.OnNotification.Fire(
					`<font color="rgb(255, 98, 98)">You cannot connect a connection point to itself!</font>`,
				);
			}
			this.exit();
			this.enter();
			return;
		}

		if (this.powerLine.Attachment0 === undefined) {
			this.powerLine.Attachment0 = attachment;
			this.startUpdatingPowerLine();
		} else {
			this.powerService.attemptConnect(this.powerLine.Attachment0, attachment);
			this.powerLine.Attachment0 = attachment;
		}
		this.soundService.playSound("sfx/connect");
	}

	private startUpdatingPowerLine(): void {
		this.connection = RunService.Heartbeat.Connect(() => {
			this.powerLineEnd.Position = this.mouseService.getMouse().Hit.Position;
		});
	}

	private stopUpdatingPowerLine(): void {
		this.connection?.Disconnect();
		this.connection = undefined;
	}
}
