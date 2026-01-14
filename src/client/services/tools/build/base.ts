export default abstract class BaseBuildingService {
	protected active: boolean = false;
	public enter(...structuresModels: Model[]): void {
		this.active = true;
	}
	public exit(): void {
		this.active = false;
	}
	abstract onStart(): void;
	public onEnd(): void {}
	public onRotate(): void {}
	public onScroll(position: Vector3): void {}
}
