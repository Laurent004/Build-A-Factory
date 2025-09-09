import { lerpAngle } from "shared/utils/math";
import MouseService from "../../mouse-service";

export class StructureCFrameService {
	private readonly positionLerpSpeed: number = 22;
	private readonly rotationLerpSpeed: number = 30;

	private currentPosition: Vector3 = Vector3.zero;
	private currentRotation: number = 0;
	private targetPosition: Vector3 = Vector3.zero;
	private targetRotation: number = 0;
	private savedCFrame: CFrame | undefined;

	constructor(private readonly mouseService: MouseService) {
		this.mouseService.onMouseClampedCellChanged.Connect((_, newClampedCellPosition) => {
			this.targetPosition = new Vector3(newClampedCellPosition.X, 2.25, newClampedCellPosition.Z);
		});
	}

	public updateCurrentCFrame(dt: number) {
		this.currentPosition = this.currentPosition.Lerp(this.targetPosition, this.positionLerpSpeed * dt);
		this.currentRotation = lerpAngle(this.currentRotation, this.targetRotation, this.rotationLerpSpeed * dt);
	}

	public updateTargetRotation() {
		this.targetRotation += 90;
	}

	public saveCFrame(currentCF: CFrame) {
		this.savedCFrame = currentCF;
	}

	//#region Getters
	public getCurrentCFrame(): CFrame {
		return new CFrame(this.currentPosition).mul(CFrame.Angles(0, math.rad(this.currentRotation), 0));
	}

	public getTargetRotation(): number {
		return this.targetRotation;
	}

	public getTargetCFrame(): CFrame {
		return new CFrame(this.targetPosition).mul(CFrame.Angles(0, math.rad(this.targetRotation), 0));
	}

	public getSavedCFrame(): CFrame | undefined {
		return this.savedCFrame;
	}
	//#endregion
}
