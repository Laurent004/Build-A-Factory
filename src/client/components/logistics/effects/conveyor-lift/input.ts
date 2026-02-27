import { BaseComponent, Component, Components } from "@flamework/components";
import { OnStart } from "@flamework/core";
import { ReplicatedStorage } from "@rbxts/services";
import { Janitor } from "@rbxts/janitor";
import TransporterComponent from "shared/components/logistics/transporter";

@Component({ tag: "ConveyorLiftInput" })
export default class ConveyorLiftInputEffectsComponent extends BaseComponent<{}, Model> implements OnStart {
	private transporterComponent!: TransporterComponent;
	private readonly janitor = new Janitor();

	constructor(private readonly components: Components) {
		super();
	}

	onStart(): void {
		let transporterComponent: TransporterComponent | undefined;
		while (transporterComponent === undefined) {
			transporterComponent = this.components.getComponents<TransporterComponent>(this.instance)[0];
			task.wait();
		}
		this.transporterComponent = transporterComponent;
		this.janitor.LinkToInstance(this.instance, false);
		this.initEvents();
	}

	private initEvents(): void {
		this.janitor.Add(
			this.transporterComponent.OnOutput.Connect((item) => {
				if (!typeIs(item, "table") || item.m?.Parent === undefined) return;
				const newLiftPlatform = ReplicatedStorage.WaitForChild("Structures")
					.WaitForChild("Logistics")
					.WaitForChild("Lift Platform")
					.Clone() as Model;
				newLiftPlatform.PrimaryPart!.PivotOffset = new CFrame(0, item.m.PrimaryPart!.Size.Y / 2, 0);
				newLiftPlatform.PivotTo(new CFrame(item.m!.GetPivot().Position));
				const connection = item.m.PrimaryPart!.GetPropertyChangedSignal("CFrame").Connect(() => {
					newLiftPlatform.PivotTo(new CFrame(item.m!.GetPivot().Position));
				});
				newLiftPlatform.Destroying.Once(() => {
					connection.Disconnect();
				});
				newLiftPlatform.Parent = item.m.PrimaryPart;
			}),
		);
	}
}
