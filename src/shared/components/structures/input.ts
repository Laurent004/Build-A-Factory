import { BaseComponent, Component } from "@flamework/components";
import OutputComponent from "./output";
import { StructureName, STRUCTURES } from "shared/constants/structures";

@Component({})
export default class InputComponent extends BaseComponent<{}, Model> {
	private readonly connectedOutputs = new Map<CFrame, OutputComponent>();

	public connect(outputNodeWorldCF: CFrame, outputComponent: OutputComponent) {
		this.connectedOutputs.set(outputNodeWorldCF, outputComponent);
	}

	public disconnect(outputNodeWorldCF: CFrame) {
		this.connectedOutputs.delete(outputNodeWorldCF);
	}

	public getConnectedOutputs(): Map<CFrame, OutputComponent> {
		return this.connectedOutputs;
	}

	public isFullyConnected(): boolean {
		return this.connectedOutputs.size() === STRUCTURES[this.instance.Name as StructureName].nodes.inputs.size();
	}
}
