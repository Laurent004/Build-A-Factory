import { Component } from "@flamework/components";
import TransporterComponent from "./transporter";
import { ReplicatedStorage } from "@rbxts/services";
import { Solid } from "shared/constants/items";
import { Object } from "@rbxts/luau-polyfill";

@Component({ tag: "LinkedTransporterInput" })
export default class LinkedTransporterInputComponent extends TransporterComponent {
	public override outputItem(solid: Solid): void;
	public override outputItem(fluid: string, volume: number): void;
	public override outputItem(item: Solid | string, volume?: number): void {
		if (item instanceof Solid) {
			super.outputItem(item);
			if (item.model?.Parent === undefined) return;
			if (this.instance.Name.find("Underground")[0] !== undefined) {
				for (const basePart of item.model
					.GetDescendants()
					.filter((instance): instance is BasePart => instance.IsA("BasePart"))) {
					basePart.Transparency = 1;
				}
			} else {
				if (Object.keys(this.outputTransporters)[0].instance.Name.find("Output")[0] !== undefined) return;
				const newLiftPlatform = ReplicatedStorage.WaitForChild("Structures")
					.WaitForChild("Logistics")
					.WaitForChild("Lift Platform")
					.Clone() as Model;
				newLiftPlatform.PrimaryPart!.PivotOffset = new CFrame(0, item.model.PrimaryPart!.Size.Y / 2, 0);
				newLiftPlatform.PivotTo(new CFrame(item.model!.GetPivot().Position));
				const connection = item.model.PrimaryPart!.GetPropertyChangedSignal("Position").Connect(() => {
					newLiftPlatform.PivotTo(new CFrame(item.model!.GetPivot().Position));
				});
				newLiftPlatform.Destroying.Once(() => {
					connection.Disconnect();
				});
				newLiftPlatform.Parent = item.model.PrimaryPart;
			}
		} else {
			super.outputItem(item, volume!);
		}
	}
}
