import { Component } from "@flamework/components";
import { OnStart } from "@flamework/core";
import StructureComponent from "../structure";
import GridService from "server/services/plot/grid-service";
import PowerService from "server/services/plot/power-service";
import { STRUCTURES } from "shared/constants/structures";
import { Events } from "server/network";

@Component({ tag: "PowerSwitch" })
export default class PowerSwitchComponent extends StructureComponent implements OnStart {
	private powerAttachmentA!: Attachment;
	private powerAttachmentB!: Attachment;

	constructor(gridService: GridService, private readonly powerService: PowerService) {
		super(gridService);
	}

	onStart(): void {
		super.onStart();
		this.powerAttachmentA = this.instance
			.GetDescendants()
			.find(
				(instance): instance is Attachment =>
					instance.IsA("Attachment") &&
					instance.Name === "PowerAttachment" &&
					instance.GetAttribute("Id") === "A",
			)!;
		this.powerAttachmentB = this.instance
			.GetDescendants()
			.find(
				(instance): instance is Attachment =>
					instance.IsA("Attachment") &&
					instance.Name === "PowerAttachment" &&
					instance.GetAttribute("Id") === "B",
			)!;
		this.initSwitch();
	}

	private initSwitch(): void {
		this.instance.GetAttributeChangedSignal("on").Connect(() => {
			const on = this.instance.GetAttribute("on");
			if (on === true) {
				const newPowerLine = STRUCTURES["Power Line"].model.FindFirstChildOfClass("RopeConstraint")!.Clone();
				newPowerLine.Attachment0 = this.powerAttachmentA;
				newPowerLine.Attachment1 = this.powerAttachmentB;
				newPowerLine.Parent = this.instance.Parent!.Parent!.WaitForChild("PowerLines");
				this.powerService.connect(this.powerAttachmentA, this.powerAttachmentB);
				Events.OnPowerLineCreation.broadcast(this.powerAttachmentA, this.powerAttachmentB);
			} else if (on === false) {
				this.powerService.disconnect(this.powerAttachmentA, this.powerAttachmentB);
				Events.OnPowerLineDestroying.broadcast(this.powerAttachmentA, this.powerAttachmentB);
				(this.instance.Parent!.Parent!.WaitForChild("PowerLines").GetChildren() as RopeConstraint[])
					.find(
						(powerLine) =>
							(powerLine.Attachment0 === this.powerAttachmentA &&
								powerLine.Attachment1 === this.powerAttachmentB) ||
							(powerLine.Attachment1 === this.powerAttachmentB &&
								powerLine.Attachment0 === this.powerAttachmentB),
					)!
					.Destroy();
			}
		});
	}
}
