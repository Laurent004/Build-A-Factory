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

	public saveCF(): void {
		this.savedCF = new CFrame(this.position).mul(this.rotation);
	}

	//#region Helpers
	public getTargetCF(): CFrame {
		return new CFrame(this.targetPosition).mul(this.targetRotation);
	}

	public getCurrentCF(): CFrame {
		return new CFrame(this.position).mul(this.rotation);
	}

	public getSavedCF(): CFrame | undefined {
		return this.savedCF;
	}

	public setPosition(position: Vector3): void {
		this.position = position;
		this.setTargetPosition(position);
	}

	public setTargetPosition(targetPosition: Vector3): void {
		this.targetPosition = targetPosition;
	}

	public setRotation(rotation: CFrame): void {
		this.rotation = rotation;
		this.setTargetRotation(rotation);
	}

	public setTargetRotation(targetRotation: CFrame): void {
		this.targetRotation = targetRotation;
	}
	//#endregion
}
