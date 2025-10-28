import { Component } from "@flamework/components";
import StructureComponent from "../structure";

@Component({ tag: "PowerGenerator" })
export default class PowerGeneratorComponent extends StructureComponent {
	public getPowerProduction(): number {
		return 0;
	}
}
