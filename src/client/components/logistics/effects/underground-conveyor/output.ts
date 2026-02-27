import { BaseComponent, Component, Components } from "@flamework/components";
import { Solid } from "shared/constants/items";
import { OnStart } from "@flamework/core";
import TransporterComponent from "../../transporter";
import { Janitor } from "@rbxts/janitor";

@Component({ tag: "UndergroundConveyorOutput" })
export default class UndergroundConveyorOutputEffectsComponent extends BaseComponent<{}, Model> implements OnStart {
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
				for (const basePart of item
					.model!.GetDescendants()
					.filter((instance): instance is BasePart => instance.IsA("BasePart"))) {
					basePart.Transparency = 0;
				}
			}),
		);
	}
}
