import { ReplicatedStorage, Workspace } from "@rbxts/services";
import { STRUCTURES } from "shared/constants/structures";

export default class BaseStructureBeamService {
	//#region Singleton
	private static _inst: BaseStructureBeamService;
	public static getInst(): BaseStructureBeamService {
		this._inst = this._inst ?? new BaseStructureBeamService();
		return this._inst;
	}
	//#endregion

	private readonly beams: Beam[] = [];
	private readonly beamPool: Beam[] = [];

	private constructor() {}

	public initStructureBeams(model: Model): void {
		for (const structureModel of [model, ...model.GetDescendants()].filter(
			(instance): instance is Model =>
				instance.IsA("Model") &&
				instance.Name in STRUCTURES &&
				instance
					.GetChildren()
					.filter(
						(instance) =>
							instance.IsA("Model") &&
							instance.Name in STRUCTURES &&
							(instance.Name.find("Input")[0] !== undefined ||
								instance.Name.find("Output")[0] !== undefined),
					)
					.size() === 2,
		)) {
			const beam = this.beamPool.pop() ?? (ReplicatedStorage.WaitForChild("Beam").Clone() as Beam);
			beam.Attachment0 = structureModel
				.GetDescendants()
				.find(
					(instance): instance is Attachment =>
						instance.IsA("Attachment") &&
						instance.FindFirstAncestorOfClass("Model")!.Name.find("Input")[0] !== undefined,
				)!;
			beam.Attachment1 = structureModel
				.GetDescendants()
				.find(
					(instance): instance is Attachment =>
						instance.IsA("Attachment") &&
						instance.FindFirstAncestorOfClass("Model")?.Name.find("Output")[0] !== undefined,
				)!;
			beam.Texture =
				[
					...STRUCTURES[beam.Attachment0.FindFirstAncestorOfClass("Model")!.Name].nodes.inputs.solids,
					...STRUCTURES[beam.Attachment0.FindFirstAncestorOfClass("Model")!.Name].nodes.inputs.fluids,
					...STRUCTURES[beam.Attachment0.FindFirstAncestorOfClass("Model")!.Name].nodes.outputs.solids,
					...STRUCTURES[beam.Attachment0.FindFirstAncestorOfClass("Model")!.Name].nodes.outputs.fluids,
				].size() > 0
					? "rbxassetid://73632224375330"
					: "rbxassetid://96577915830628";
			beam.TextureLength = beam.Attachment0!.WorldPosition.sub(beam.Attachment1!.WorldPosition).Magnitude * 0.65;
			beam.Parent = Workspace;
			this.beams.push(beam);
		}
	}

	public updateStructureBeams(): void {
		for (const beam of this.beams) {
			beam.TextureLength = beam.Attachment0!.WorldPosition.sub(beam.Attachment1!.WorldPosition).Magnitude * 0.65;
		}
	}

	public resetStructureBeams(): void {
		for (const beam of this.beams) {
			beam.Parent = undefined;
			this.beamPool.push(beam);
		}
		this.beams.clear();
	}
}
