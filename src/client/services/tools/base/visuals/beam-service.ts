import { ReplicatedStorage, Workspace } from "@rbxts/services";
import { IMAGES } from "shared/assets/images";
import { STRUCTURES } from "shared/constants/structures";

export default class BaseStructureBeamService {
	//#region Singleton
	private static _inst: BaseStructureBeamService;
	public static getInst(): BaseStructureBeamService {
		this._inst = this._inst ?? new BaseStructureBeamService();
		return this._inst;
	}
	//#endregion

	private readonly activeBeams: Beam[] = [];
	private readonly beamPool: Beam[] = [];

	private constructor() {}

	public initStructureBeams(model: Model) {
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
					? IMAGES.textures.ArrowLink
					: IMAGES.textures.Link;
			beam.TextureLength = beam.Attachment0!.WorldPosition.sub(beam.Attachment1!.WorldPosition).Magnitude * 0.65;
			beam.Parent = Workspace;
			this.activeBeams.push(beam);
		}
	}

	public updateStructureBeams() {
		for (const beam of this.activeBeams) {
			beam.TextureLength = beam.Attachment0!.WorldPosition.sub(beam.Attachment1!.WorldPosition).Magnitude * 0.65;
		}
	}

	public resetStructureBeams() {
		for (const beam of this.activeBeams) {
			beam.Parent = undefined;
			this.beamPool.push(beam);
		}
		this.activeBeams.clear();
	}
}
