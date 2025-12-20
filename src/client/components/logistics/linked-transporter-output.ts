import { Component } from "@flamework/components";
import TransporterComponent from "./transporter";
import { OnStart } from "@flamework/core";
import { Solid } from "shared/constants/items";

@Component({ tag: "LinkedTransporterOutput" })
export default class LinkedTransporterOutputComponent extends TransporterComponent implements OnStart {
	public override inputItem(solid: Solid): void;
	public override inputItem(fluid: string, volume: number): void;
	public override inputItem(item: Solid | string, volume?: number): void {
		if (item instanceof Solid) {
			super.inputItem(item);
			if (item.model?.Parent === undefined) return;
			if (this.instance.Name.find("Underground")[0] !== undefined) {
				for (const basePart of item.model
					.GetDescendants()
					.filter((instance): instance is BasePart => instance.IsA("BasePart"))) {
					basePart.Transparency = 0;
				}
			} else {
				item.model.PrimaryPart!.FindFirstChild("Lift Platform")?.Destroy();
			}
		} else {
			super.inputItem(item, volume!);
		}
	}
}
