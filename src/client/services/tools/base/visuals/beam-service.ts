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

	private readonly activeBeams: Beam[] = [];
	private readonly beamPool: Beam[] = [];

	private constructor() {}

	public initStructureBeams(structureModel: Model) {
		for (const model of [structureModel, ...structureModel.GetChildren()].filter(
			(instance): instance is Model =>
				instance.IsA("Model") &&
				instance.Name in STRUCTURES &&
				instance
					.GetDescendants()
					.filter(
						(instance): instance is Attachment =>
							instance.IsA("Attachment") && (instance.Name === "Start" || instance.Name === "End"),
					)
					.size() === 2,
		)) {
			const beam = this.beamPool.pop() ?? (ReplicatedStorage.WaitForChild("StructureBeam").Clone() as Beam);
			beam.Attachment0 = model
				.GetDescendants()
				.find((instance): instance is Attachment => instance.IsA("Attachment") && instance.Name === "Start");
			beam.Attachment1 = model
				.GetDescendants()
				.find((instance): instance is Attachment => instance.IsA("Attachment") && instance.Name === "End");
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
