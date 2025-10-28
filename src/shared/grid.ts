export interface GridData {
	readonly width: number;
	readonly height: number;
	readonly cellSize: number;
	readonly startX: number;
	readonly startZ: number;
}

export interface GridCell {
	readonly position: Vector3int16;
	structureModel: Model | undefined;
}
