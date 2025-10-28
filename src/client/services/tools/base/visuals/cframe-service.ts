export class BaseStructureCFrameService {
	//#region Singleton
	private static _inst: BaseStructureCFrameService;
	public static getInst(): BaseStructureCFrameService {
		this._inst = this._inst ?? new BaseStructureCFrameService();
		return this._inst;
	}
	//#endregion

	private readonly positionLerpSpeed: number = 22;
	private readonly rotationLerpSpeed: number = 30;

	private currentPosition: Vector3 = Vector3.zero;
	private currentRotation: number = 0;
	private targetPosition: Vector3 = Vector3.zero;
	private targetRotation: number = 0;
	private savedCFrame: CFrame | undefined;

	private constructor() {}

	public updateTargetPosition(targetPosition: Vector3) {
		this.targetPosition = targetPosition;
	}

	public updateTargetRotation() {
		this.targetRotation += 90;
	}

	public updateCurrentCFrame(dt: number) {
		this.currentPosition = this.currentPosition.Lerp(this.targetPosition, this.positionLerpSpeed * dt);
		this.currentRotation =
			this.currentRotation +
			(((this.targetRotation - this.currentRotation + 180) % 360) - 180) * this.rotationLerpSpeed * dt;
	}

	public saveCFrame(cf: CFrame) {
		this.savedCFrame = cf;
	}

	//#region Helpers
	public getTargetCFrame() {
		return new CFrame(this.targetPosition).mul(CFrame.Angles(0, math.rad(this.targetRotation), 0));
	}

	public getCurrentCFrame() {
		return new CFrame(this.currentPosition).mul(CFrame.Angles(0, math.rad(this.currentRotation), 0));
	}

	public getSavedCFrame() {
		return this.savedCFrame;
	}
	//#endregion
}
