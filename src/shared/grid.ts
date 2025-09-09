export interface GridData {
	readonly grid: GridCell[][][];
	readonly cellSize: number;
	readonly layerHeight: number;
	readonly startX: number;
	readonly startZ: number;
}

export interface GridCell {
	readonly x: number;
	readonly y: number;
	readonly z: number;
	structureModel: Model | undefined;
}
