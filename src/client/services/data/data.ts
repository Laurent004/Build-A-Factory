import Signal from "@rbxts/signal";
import { Functions } from "client/network";
import { Data } from "shared/types/data";

export default class DataService {
	//#region Singleton
	private static _inst: DataService;
	public static getInst(): DataService {
		this._inst = this._inst ?? new DataService();
		return this._inst;
	}
	//#endregion

	private data: Data | undefined;
	public readonly OnDataInitialization = new Signal<(data: Data) => void>();

	private constructor() {
		this.init();
	}

	private init(): void {
		Functions.RequestData.invoke().then((data) => {
			this.data = data;
			this.OnDataInitialization.Fire(data);
		});
	}

	public getData(): Data | undefined {
		return this.data;
	}
}
