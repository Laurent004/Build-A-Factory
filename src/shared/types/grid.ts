export interface GridCell {
	readonly position: Vector3;
	readonly worldPosition: Vector3;
	isUnlocked: boolean;
	structureModel: Model | undefined;
}
