import { Component } from "@flamework/components";
import { OnStart } from "@flamework/core";
import { Workspace } from "@rbxts/services";
import StructureComponent from "shared/components/structure";
import { PowerService } from "shared/services/plot";

@Component({ tag: "PowerSwitch" })
export default class PowerSwitchComponent extends StructureComponent implements OnStart {
	private readonly powerService = PowerService.getInst();
	private readonly startAttachment: Attachment = this.instance
		.GetDescendants()
		.find((instance): instance is Attachment => instance.IsA("Attachment") && instance.Name === "PowerAttachment")!;
	private readonly endAttachment: Attachment = this.instance
		.GetDescendants()
		.find(
			(instance): instance is Attachment =>
				instance.IsA("Attachment") && instance.Name === "PowerAttachment" && instance !== this.startAttachment,
		)!;

	onStart(): void {
		super.onStart();
		if (this.instance.GetAttribute("On") === true) {
			const powerLine = Workspace.WaitForChild("Plots")
				.GetChildren()
				.find((plot) => plot.GetAttribute("UserId") === this.player.UserId)!
				.WaitForChild("PowerLines")
				.GetChildren()
				.find(
					(instance): instance is RopeConstraint =>
						instance.IsA("RopeConstraint") &&
						instance.Attachment0 === this.startAttachment &&
						instance.Attachment1 === this.endAttachment,
				);
			if (powerLine !== undefined) {
				powerLine.Visible = false;
			} else {
				this.connect();
			}
		}
	}

	protected override initEvents(): void {
		super.initEvents();
		this.janitor.Add(
			this.instance.GetAttributeChangedSignal("On").Connect(() => {
				if (this.instance.GetAttribute("On") === true) {
					this.connect();
				} else {
					this.powerService.disconnect(this.player, this.startAttachment, this.endAttachment);
				}
			}),
		);
	}

	private connect(): void {
		this.powerService.connect(this.player, this.startAttachment, this.endAttachment);
		Workspace.WaitForChild("Plots")
			.GetChildren()
			.find((plot) => plot.GetAttribute("UserId") === this.player.UserId)!
			.WaitForChild("PowerLines")
			.GetChildren()
			.find(
				(instance): instance is RopeConstraint =>
					instance.IsA("RopeConstraint") &&
					instance.Attachment0 === this.startAttachment &&
					instance.Attachment1 === this.endAttachment,
			)!.Visible = false;
	}
}
