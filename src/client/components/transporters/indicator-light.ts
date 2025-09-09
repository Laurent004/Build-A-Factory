import { BaseComponent, Component, Components } from "@flamework/components";
import { Dependency, OnStart } from "@flamework/core";
import { StructureState } from "shared/constants/structures";
import StructureStateComponent from "./state";

@Component({})
export default class IndicatorLightComponent extends BaseComponent<{}, Part> implements OnStart {
	private readonly components = Dependency<Components>();
	private readonly red = Color3.fromRGB(176, 64, 64);
	private readonly yellow = Color3.fromRGB(190, 190, 6);
	private readonly green = Color3.fromRGB(20, 182, 74);
	private readonly black = Color3.fromRGB(59, 59, 59);
	private connection: RBXScriptConnection | undefined;

	onStart(): void {
		this.initEvents();
		this.initIndicatorLight();
	}

	private initEvents() {
		this.instance.Destroying.Once(() => {
			this.connection?.Disconnect();
		});
	}

	private initIndicatorLight() {
		const structureStateComponent = this.components.getComponent<StructureStateComponent>(this.instance.Parent!)!;
		this.connection = structureStateComponent.onStateChanged.Connect((newStructureState: StructureState) => {
			switch (newStructureState) {
				case "Working":
					this.setIndicatorLightColor(this.green);
					break;
				case "Standby":
					this.setIndicatorLightColor(this.yellow);
					break;
				case "Disconnected":
					this.setIndicatorLightColor(this.red);
					break;
				case "No Configured Recipe":
					this.setIndicatorLightColor(this.black);
					break;
			}
		});
	}

	private setIndicatorLightColor(color: Color3) {
		this.instance.Color = color;
	}
}
