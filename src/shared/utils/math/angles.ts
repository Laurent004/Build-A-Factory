export function lerpAngle(a: number, b: number, alpha: number) {
	const angleDifference = ((b - a + 180) % 360) - 180;
	return a + angleDifference * alpha;
}