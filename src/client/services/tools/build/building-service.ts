export default abstract class BaseStructureBuildingService {
	abstract enter(structureModel: Model): void;
	abstract exit(): void;
	abstract onPlacementStart(): void;
	public onPlacementEnd(): void {}
	public onRotate(): void {}
}
