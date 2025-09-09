export enum MergerInputDirection {
	Backward = "BackwardInput",
	Left = "LeftInput",
	Right = "RightInput",
}

export const mergerInputDirections = [
	MergerInputDirection.Left,
	MergerInputDirection.Backward,
	MergerInputDirection.Right,
] as const;
