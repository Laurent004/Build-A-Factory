import { BaseComponent, Component, Components } from "@flamework/components";
import { OnStart } from "@flamework/core";
import { Janitor } from "@rbxts/janitor";
import TransporterComponent from "shared/components/logistics/transporter";

@Component({ tag: "UndergroundConveyorInput" })
export default class UndergroundConveyorInputEffectsComponent extends BaseComponent<{}, Model> implements OnStart {
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
				for (const basePart of item
					.m!.GetDescendants()
					.filter((instance): instance is BasePart => instance.IsA("BasePart"))) {
					basePart.Transparency = 1;
				}
			}),
		);
	}
}
