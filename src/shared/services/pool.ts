import { ReplicatedStorage, Workspace } from "@rbxts/services";

export default class PoolService {
	//#region Singleton
	private static _inst: PoolService;
	public static getInst(): PoolService {
		this._inst = this._inst ?? new PoolService();
		return this._inst;
	}
	//#endregion

	private readonly pools = new Map<string, Model[]>();
	private readonly templates = new Map<string, Model>();

	private constructor() {}

	public add(model: Model): void {
		model.Parent = undefined;
		const pool = this.pools.get(model.Name);
		if (pool !== undefined) {
			pool.push(model);
		} else {
			this.pools.set(model.Name, [model]);
		}
	}

	public get(name: string): Model {
		const pool = this.pools.get(name);
		if (pool !== undefined && pool.size() > 0) {
			const model = pool.pop()!;
			model.Parent = Workspace;
			return model;
		}
		const template = this.templates.get(name);
		if (template !== undefined) {
			const newModel = template.Clone();
			newModel.Parent = Workspace;
			return newModel;
		}
		this.templates.set(
			name,
			ReplicatedStorage.GetDescendants().find(
				(instance): instance is Model => instance.IsA("Model") && instance.Name === name,
			)!,
		);
		return this.get(name);
	}
}
