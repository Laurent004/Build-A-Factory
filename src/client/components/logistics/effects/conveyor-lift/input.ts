import { BaseComponent, Component, Components } from "@flamework/components";
import { Solid } from "shared/constants/items";
import { OnStart } from "@flamework/core";
import TransporterComponent from "../../transporter";
import { ReplicatedStorage } from "@rbxts/services";
import { Janitor } from "@rbxts/janitor";

@Component({ tag: "ConveyorLiftInput" })
export default class ConveyorLiftInputEffectsComponent extends BaseComponent<{}, Model> implements OnStart {
	private transporterComponent!: TransporterComponent;
	private readonly janitor = new Janitor();

	constructor(private readonly components: Components) {
		super();
	}

	onStart(): void {
		this.transporterComponent = this.components.getComponents<TransporterComponent>(this.instance)[0];
		this.janitor.LinkToInstance(this.instance, false);
		this.initEvents();
	}

	private initEvents(): void {
		this.janitor.Add(
			this.transporterComponent.OnOutput.Connect((item) => {
				if (!(item instanceof Solid) || item.model?.Parent === undefined) return;
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
			}),
		);
	}
}
