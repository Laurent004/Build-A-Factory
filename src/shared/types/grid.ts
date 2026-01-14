export interface GridCell {
	readonly position: Vector3;
	readonly worldPosition: Vector3;
	unlocked: boolean;
	structureModel: Model | undefined;
}
