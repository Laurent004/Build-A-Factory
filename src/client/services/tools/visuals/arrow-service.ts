import { ReplicatedStorage, Workspace } from "@rbxts/services";
import { StructureName, STRUCTURES } from "shared/constants/structures";

export default class StructureArrowService {
	//#region Singleton
	private static _inst: StructureArrowService;
	public static getInst(): StructureArrowService {
		this._inst = this._inst ?? new StructureArrowService();
		return this._inst;
	}
	//#endregion
	private readonly arrowModel: Model = ReplicatedStorage.WaitForChild("StructureArrow") as Model;
	private readonly inputArrowColor: Color3 = Color3.fromRGB(167, 115, 88);
	private readonly outputArrowColor: Color3 = Color3.fromRGB(102, 167, 114);
	private readonly arrowOffset = new CFrame(-4, 0, 0);
	private readonly arrowMovementFrequency: number = 2.5;
	private readonly arrowMovementAmplitude: number = 0.3;

	private readonly activeArrows: Map<[Model, CFrame], Model> = new Map();
	private readonly arrowPool: Model[] = [];

	public initArrows(structureModel: Model) {
		this.initInputArrows(structureModel);
		this.initOutputArrows(structureModel);
	}

	public initInputArrows(structureModel: Model) {
		const structuresModels = [structureModel, ...structureModel.GetChildren()].filter(
			(instance): instance is Model => instance.Name in STRUCTURES,
		);
		for (const structureModel of structuresModels) {
			const structureDefinition = STRUCTURES[structureModel.Name as StructureName];
			for (const inputNodeLocalCF of structureDefinition.nodes.inputs) {
				this.activeArrows.set([structureModel, inputNodeLocalCF], this.getArrowModel("Input"));
			}
		}
	}

	public initOutputArrows(structureModel: Model) {
		const structuresModels = [structureModel, ...structureModel.GetChildren()].filter(
			(instance): instance is Model => instance.Name in STRUCTURES,
		);
		for (const structureModel of structuresModels) {
			const structureDefinition = STRUCTURES[structureModel.Name as StructureName];
			for (const outputNodeLocalCF of structureDefinition.nodes.outputs) {
				this.activeArrows.set([structureModel, outputNodeLocalCF], this.getArrowModel("Output"));
			}
		}
	}

	public updateAllStructuresArrows() {
		for (const [[structureModel, nodeLocalCF], arrowModel] of this.activeArrows) {
			const offset = math.sin(time() * this.arrowMovementFrequency) * this.arrowMovementAmplitude;
			let targetCF: CFrame;
			if (arrowModel.PrimaryPart!.Color === this.inputArrowColor) {
				targetCF = structureModel
					.PrimaryPart!.CFrame.mul(nodeLocalCF)
					.mul(this.arrowOffset)
					.mul(new CFrame(offset, 0, 0));
			} else {
				targetCF = structureModel.PrimaryPart!.CFrame.mul(nodeLocalCF).mul(new CFrame(offset, 0, 0));
			}
			arrowModel.PivotTo(targetCF);
		}
	}

	public resetAllArrows() {
		for (const [_, arrowModel] of this.activeArrows) {
			arrowModel.Parent = undefined;
			this.arrowPool.push(arrowModel);
		}
		this.activeArrows.clear();
	}

	private getArrowModel(arrowType: "Input" | "Output"): Model {
		let arrowModel: Model;
		if (this.arrowPool.size() > 0) {
			arrowModel = this.arrowPool.pop()!;
		} else {
			arrowModel = this.arrowModel.Clone();
		}
		arrowModel.PrimaryPart!.Color = arrowType === "Input" ? this.inputArrowColor : this.outputArrowColor;
		arrowModel.Parent = Workspace;
		return arrowModel;
	}
}
