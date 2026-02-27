import { BaseComponent, Component, Components } from "@flamework/components";
import { OnStart } from "@flamework/core";
import TransporterComponent from "./transporter";
import { Janitor } from "@rbxts/janitor";

@Component({ tag: "ThroughputCounter" })
export default class ThroughputCounterComponent extends BaseComponent<{}, Model> implements OnStart {
	private throughputCounter!: TextLabel;
	private transporterComponent!: TransporterComponent;
	private timestamps: number[] = [];
	private thread: thread | undefined;
	private readonly janitor=new Janitor()

	constructor(private readonly components: Components) {
		super();
	}

	onStart(): void {
		this.throughputCounter = this.instance
			.GetDescendants()
			.find((instance): instance is TextLabel => instance.IsA("TextLabel"))!;
		this.transporterComponent = this.components.getComponents<TransporterComponent>(this.instance)[0];
		this.janitor.LinkToInstance(this.instance,false);
		this.initEvents();
	}

	private initEvents(): void {
		this.janitor.Add(this.transporterComponent.OnInput.Connect(() => {
			this.timestamps=[...this.timestamps.filter((timestamp)=>time()-timestamp<=5),time()];
			this.throughputCounter.Text = `${this.timestamps.size()/5*60}/min`;
			if (this.thread !== undefined) {
				task.cancel(this.thread);
			}
			this.thread = task.delay(5, () => {
				this.throughputCounter.Text = "0/min";
				this.timestamps.clear()
				this.thread = undefined;
			});
		}))
		this.janitor.Add(()=>{
			if (this.thread !== undefined) {
				task.cancel(this.thread);
				this.thread = undefined;
			}
		})
	}
}
