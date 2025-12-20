export class BaseStructureCFrameService {
	private readonly positionLerpSpeed: number = 22;
	private readonly rotationLerpSpeed: number = 30;

	private position: Vector3 = Vector3.zero;
	private rotation: CFrame = CFrame.Angles(0, 0, 0);
	private targetPosition: Vector3 = Vector3.zero;
	private targetRotation: CFrame = CFrame.Angles(0, 0, 0);
	private savedCF: CFrame | undefined;

	constructor() {}

	public updateCurrentCF(dt: number) {
		this.position = this.position.Lerp(this.targetPosition, this.positionLerpSpeed * dt);
		this.rotation = this.rotation.Lerp(this.targetRotation, this.rotationLerpSpeed * dt);
	}

	public saveCF(cf: CFrame) {
		this.savedCF = cf;
	}

	//#region Helpers
	public getTargetCF() {
		return new CFrame(this.targetPosition).mul(this.targetRotation);
	}

	public getCurrentCF() {
		return new CFrame(this.position).mul(this.rotation);
	}

	public getSavedCF() {
		return this.savedCF;
	}

	public setPosition(position: Vector3): void {
		this.position = position;
		this.setTargetPosition(position);
	}

	public setTargetPosition(targetPosition: Vector3) {
		this.targetPosition = targetPosition;
	}

	public setRotation(rotation: CFrame): void {
		this.rotation = rotation;
		this.setTargetRotation(rotation);
	}

	public setTargetRotation(targetRotation: CFrame) {
		this.targetRotation = targetRotation;
	}

	//#endregion
}
