import { BaseComponent, Component, Components } from "@flamework/components";
import { Dependency, OnStart } from "@flamework/core";
import { StructureAttributes, StructureState } from "shared/constants/structures";
import OutputComponent from "../../../shared/components/structures/output";
import { RunService } from "@rbxts/services";
import Signal from "@rbxts/lemon-signal";
import TransporterComponent from "./transporter";

@Component()
export default class StructureStateComponent
	extends BaseComponent<Partial<StructureAttributes>, Model>
	implements OnStart
{
	private readonly components = Dependency<Components>();
	private readonly updateInterval: number = 0.5;
	public readonly onStateChanged = new Signal<StructureState>();

	private outputComponent!: OutputComponent;
	private transporterComponent!: TransporterComponent;
	private lastUpdateTime: number = 0;
	private connection: RBXScriptConnection | undefined;

	private state: StructureState | undefined = undefined;

	onStart(): void {
		task.delay(1, () => {
			this.initComponents();
			this.initEvents();
			this.startUpdating();
		});
	}

	private initComponents() {
		this.outputComponent = this.components.getComponent<OutputComponent>(this.instance)!;
		this.transporterComponent = this.components.getComponents<TransporterComponent>(this.instance)[0];
	}

	private initEvents() {
		this.instance.Destroying.Connect(() => {
			this.stopUpdating();
		});
	}

	private startUpdating() {
		this.connection = RunService.Heartbeat.Connect(() => {
			this.update();
		});
	}

	private update() {
		if (time() - this.lastUpdateTime < this.updateInterval) return;
		this.lastUpdateTime = time();

		let newState: StructureState | undefined;
		const selectedItem = this.attributes.selectedItem;
		const isFullyConnected = this.outputComponent.isFullyConnected();
		const outputTransporter = this.transporterComponent.getOutputTransporter();

		if (selectedItem === undefined) {
			newState = "No Configured Recipe";
		} else if (!isFullyConnected) {
			newState = "Disconnected";
		} else if (outputTransporter !== undefined && outputTransporter.getItem() !== undefined) {
			newState = "Standby";
		} else {
			newState = "Working";
		}

		if (newState !== undefined && this.state !== newState) {
			this.state = newState;
			this.onStateChanged.Fire(newState);
		}
	}

	private stopUpdating() {
		this.connection?.Disconnect();
		this.connection = undefined;
	}
}
