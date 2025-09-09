import { BaseComponent, Component } from "@flamework/components";
import InputComponent from "./input";
import { StructureName, STRUCTURES } from "shared/constants/structures";

@Component({})
export default class OutputComponent extends BaseComponent<{}, Model> {
	private readonly connectedInputs = new Map<CFrame, InputComponent>();

	public connect(inputNodeWorldCF: CFrame, inputComponent: InputComponent) {
		this.connectedInputs.set(inputNodeWorldCF, inputComponent);
	}

	public disconnect(inputNodeWorldCF: CFrame) {
		this.connectedInputs.delete(inputNodeWorldCF);
	}

	public getConnectedInputs(): Map<CFrame, InputComponent> {
		return this.connectedInputs;
	}

	public isFullyConnected(): boolean {
		return this.connectedInputs.size() === STRUCTURES[this.instance.Name as StructureName].nodes.outputs.size();
	}
}
