export function snapVectorToCardinal(vector: Vector3): Vector3 {
	const dx = vector.X;
	const dy = vector.Y;
	const dz = vector.Z;

	if (math.abs(dx) > math.abs(dy) && math.abs(dx) > math.abs(dz)) {
		return new Vector3(math.sign(dx), 0, 0);
	} else if (math.abs(dy) > math.abs(dx) && math.abs(dy) > math.abs(dz)) {
		return new Vector3(0, math.sign(dy), 0);
	} else {
		return new Vector3(0, 0, math.sign(dz));
	}
}

/* export function quadBezier(p0: Vector3, p1: Vector3, p2: Vector3, t: number): Vector3 {
	const a = p0.Lerp(p1, t);
	const b = p1.Lerp(p2, t);
	return a.Lerp(b, t);
}

export function quadBezierDerivative(p0: Vector3, p1: Vector3, p2: Vector3, t: number): Vector3 {
	return p1
		.sub(p0)
		.mul(2 * (1 - t))
		.add(p2.sub(p1).mul(2 * t));
}

export function getQuadBezierLength(p0: Vector3, p1: Vector3, p2: Vector3, segments: number = 250): number {
	let length: number = 0;
	let previousPoint: Vector3 = p0;
	for (let i = 1; i <= segments; i++) {
		const t = i / segments;
		const point = quadBezier(previousPoint, p1, p2, t);
		const distance = point.sub(previousPoint).Magnitude;

		length += distance;
		previousPoint = point;
	}
	return length;
}
 */