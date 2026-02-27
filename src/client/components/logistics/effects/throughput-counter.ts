import { BaseComponent, Component, Components } from "@flamework/components";
import { OnStart } from "@flamework/core";
import { Janitor } from "@rbxts/janitor";
import TrackedTransporterComponent from "shared/components/logistics/tracked-transporter";

@Component({ tag: "ThroughputCounter" })
export default class ThroughputCounterEffectsComponent extends BaseComponent<{}, Model> implements OnStart {
	private throughputCounter!: TextLabel;
	private trackedTransporterComponent!: TrackedTransporterComponent;
	private readonly janitor = new Janitor();

	constructor(private readonly components: Components) {
		super();
	}

	onStart(): void {
		this.throughputCounter = this.instance
			.WaitForChild("Part")
			.WaitForChild("BillboardGui")
			.WaitForChild("TextLabel") as TextLabel;
		let trackedTransporterComponent: TrackedTransporterComponent | undefined;
		while (trackedTransporterComponent === undefined) {
			trackedTransporterComponent = this.components.getComponents<TrackedTransporterComponent>(this.instance)[0];
			task.wait();
		}
		this.trackedTransporterComponent = trackedTransporterComponent;
		this.janitor.LinkToInstance(this.instance, false);
		this.initEvents();
	}

	private initEvents(): void {
		this.janitor.Add(
			this.trackedTransporterComponent.OnInput.Connect(() => {
				this.throughputCounter.Text = `${this.trackedTransporterComponent.getInputRate("Solid")}/min`;
			}),
		);
	}
}
