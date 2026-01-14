import { Object } from "@rbxts/luau-polyfill";
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

	private readonly arrows: Map<[Model, CFrame], Part> = new Map();
	private readonly arrowPool: Part[] = [];
	private readonly inputArrowColor: Color3 = Color3.fromRGB(167, 115, 88);
	private readonly outputArrowColor: Color3 = Color3.fromRGB(102, 167, 114);
	private readonly arrowMovementFrequency: number = 2.5;
	private readonly arrowMovementAmplitude: number = 0.3;

	private constructor() {}

	public initStructureArrows(model: Model): void {
		this.initStructureInputArrows(model);
		this.initStructureOutputArrows(model);
	}

	public initStructureInputArrows(model: Model): void {
		for (const structureModel of [model, ...model.GetDescendants()].filter(
			(instance): instance is Model => instance.IsA("Model") && instance.Name in STRUCTURES,
		)) {
			for (const inputNodeLocalCF of Object.entries(
				STRUCTURES[structureModel.Name].nodes.inputs.solids,
			).mapFiltered(([inputNodeLocalCF, visible]) => (visible ? inputNodeLocalCF : undefined))) {
				let arrow = this.arrowPool.find((arrow) => arrow.Name === "SolidArrow");
				if (arrow !== undefined) {
					this.arrowPool.remove(this.arrowPool.indexOf(arrow));
				} else {
					arrow = ReplicatedStorage.WaitForChild("SolidArrow").Clone() as Part;
				}
				arrow.Color = this.inputArrowColor;
				arrow.PivotTo(
					structureModel
						.GetPivot()
						.mul(inputNodeLocalCF.mul(new CFrame(-4, 0, 0)))
						.mul(
							new CFrame(
								math.sin(time() * this.arrowMovementFrequency) * this.arrowMovementAmplitude,
								0,
								0,
							),
						),
				);
				arrow.Parent = Workspace;
				this.arrows.set([structureModel, inputNodeLocalCF.mul(new CFrame(-4, 0, 0))], arrow);
			}

			for (const inputNodeLocalCF of Object.entries(
				STRUCTURES[structureModel.Name].nodes.inputs.fluids,
			).mapFiltered(([inputNodeLocalCF, visible]) => (visible ? inputNodeLocalCF : undefined))) {
				let arrow = this.arrowPool.find((arrow) => arrow.Name === "FluidArrow");
				if (arrow !== undefined) {
					this.arrowPool.remove(this.arrowPool.indexOf(arrow));
				} else {
					arrow = ReplicatedStorage.WaitForChild("FluidArrow").Clone() as Part;
				}
				arrow.Color = this.inputArrowColor;
				arrow.PivotTo(
					structureModel
						.GetPivot()
						.mul(inputNodeLocalCF.mul(new CFrame(-4, 0, 0)))
						.mul(
							new CFrame(
								math.sin(time() * this.arrowMovementFrequency) * this.arrowMovementAmplitude,
								0,
								0,
							),
						),
				);
				arrow.Parent = Workspace;
				this.arrows.set([structureModel, inputNodeLocalCF.mul(new CFrame(-4, 0, 0))], arrow);
			}
		}
	}

	public initStructureOutputArrows(model: Model): void {
		for (const structureModel of [model, ...model.GetDescendants()].filter(
			(instance): instance is Model => instance.IsA("Model") && instance.Name in STRUCTURES,
		)) {
			for (const outputNodeLocalCF of Object.entries(
				STRUCTURES[structureModel.Name].nodes.outputs.solids,
			).mapFiltered(([outputNodeLocalCF, visible]) => (visible ? outputNodeLocalCF : undefined))) {
				let arrow = this.arrowPool.find((arrow) => arrow.Name === "SolidArrow");
				if (arrow !== undefined) {
					this.arrowPool.remove(this.arrowPool.indexOf(arrow));
				} else {
					arrow = ReplicatedStorage.WaitForChild("SolidArrow").Clone() as Part;
				}
				arrow.Color = this.outputArrowColor;
				arrow.PivotTo(
					structureModel
						.GetPivot()
						.mul(outputNodeLocalCF)
						.mul(
							new CFrame(
								math.sin(time() * this.arrowMovementFrequency) * this.arrowMovementAmplitude,
								0,
								0,
							),
						),
				);
				arrow.Parent = Workspace;
				this.arrows.set([structureModel, outputNodeLocalCF], arrow);
			}

			for (const outputNodeLocalCF of Object.entries(
				STRUCTURES[structureModel.Name].nodes.outputs.fluids,
			).mapFiltered(([outputNodeLocalCF, visible]) => (visible ? outputNodeLocalCF : undefined))) {
				let arrow = this.arrowPool.find((arrow) => arrow.Name === "FluidArrow");
				if (arrow !== undefined) {
					this.arrowPool.remove(this.arrowPool.indexOf(arrow));
				} else {
					arrow = ReplicatedStorage.WaitForChild("FluidArrow").Clone() as Part;
				}
				arrow.Color = this.outputArrowColor;
				arrow.PivotTo(
					structureModel
						.GetPivot()
						.mul(outputNodeLocalCF)
						.mul(
							new CFrame(
								math.sin(time() * this.arrowMovementFrequency) * this.arrowMovementAmplitude,
								0,
								0,
							),
						),
				);
				arrow.Parent = Workspace;
				this.arrows.set([structureModel, outputNodeLocalCF], arrow);
			}
		}
	}

	public updateStructureArrows(): void {
		for (const [[structureModel, nodeLocalCF], arrow] of this.arrows) {
			arrow.PivotTo(
				structureModel
					.GetPivot()
					.mul(nodeLocalCF)
					.mul(
						new CFrame(math.sin(time() * this.arrowMovementFrequency) * this.arrowMovementAmplitude, 0, 0),
					),
			);
		}
	}

	public resetStructureArrows(): void {
		for (const [, arrow] of this.arrows) {
			arrow.Parent = undefined;
			this.arrowPool.push(arrow);
		}
		this.arrows.clear();
	}
}
