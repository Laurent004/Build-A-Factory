import { Component } from "@flamework/components";
import StructureComponent from "../structure";

@Component({ tag: "PowerGenerator" })
export default class PowerGeneratorComponent extends StructureComponent {
	protected powerProduction: number = 0;

	public getPowerProduction(): number {
		return this.active ? this.powerProduction : 0;
	}

	public setPowerProduction(value: number): void {
		this.powerProduction = value;
	}

	public override updateState(): void {
		this.setState(!this.active || this.powerProduction <= 0 ? "No Power" : "Working");
	}
}
