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
