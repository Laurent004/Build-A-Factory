import { ReplicatedStorage, Workspace } from "@rbxts/services";
import { STRUCTURES } from "shared/constants/structures";

export default class BaseStructureArrowService {
	//#region Singleton
	private static _inst: BaseStructureArrowService;
	public static getInst(): BaseStructureArrowService {
		this._inst = this._inst ?? new BaseStructureArrowService();
		return this._inst;
	}
	//#endregion

	private readonly activeArrows: Map<[Model, CFrame], Part> = new Map();
	private readonly arrowPool: Part[] = [];

	private readonly inputArrowColor: Color3 = Color3.fromRGB(167, 115, 88);
	private readonly outputArrowColor: Color3 = Color3.fromRGB(102, 167, 114);
	private readonly arrowMovementFrequency: number = 2.5;
	private readonly arrowMovementAmplitude: number = 0.3;

	private constructor() {}

	public initStructureArrows(structureModel: Model) {
		this.initStructureInputArrows(structureModel);
		this.initStructureOutputArrows(structureModel);
	}

	public initStructureInputArrows(structureModel: Model) {
		for (const model of [structureModel, ...structureModel.GetDescendants()].filter(
			(instance): instance is Model => instance.IsA("Model") && instance.Name in STRUCTURES,
		)) {
			for (const inputNodeLocalCF of STRUCTURES[model.Name].nodes.inputs) {
				const arrowModel =
					this.arrowPool.pop() ?? (ReplicatedStorage.WaitForChild("StructureArrow").Clone() as Part);
				arrowModel.Color = this.inputArrowColor;
				arrowModel.Parent = Workspace;

				this.activeArrows.set([model, inputNodeLocalCF.mul(new CFrame(-4, 0, 0))], arrowModel);
			}
		}
	}

	public initStructureOutputArrows(structureModel: Model) {
		for (const model of [structureModel, ...structureModel.GetDescendants()].filter(
			(instance): instance is Model => instance.IsA("Model") && instance.Name in STRUCTURES,
		)) {
			for (const outputNodeLocalCF of STRUCTURES[model.Name].nodes.outputs) {
				const arrowModel =
					this.arrowPool.pop() ?? (ReplicatedStorage.WaitForChild("StructureArrow").Clone() as Part);
				arrowModel.Color = this.outputArrowColor;
				arrowModel.Parent = Workspace;

				this.activeArrows.set([model, outputNodeLocalCF], arrowModel);
			}
		}
	}

	public updateStructureArrows() {
		for (const [[structureModel, nodeLocalCF], arrowModel] of this.activeArrows) {
			arrowModel.PivotTo(
				structureModel
					.GetPivot()
					.mul(nodeLocalCF)
					.mul(
						new CFrame(math.sin(time() * this.arrowMovementFrequency) * this.arrowMovementAmplitude, 0, 0),
					),
			);
		}
	}

	public resetStructureArrows() {
		for (const [, arrowModel] of this.activeArrows) {
			arrowModel.Parent = undefined;
			this.arrowPool.push(arrowModel);
		}
		this.activeArrows.clear();
	}
}
