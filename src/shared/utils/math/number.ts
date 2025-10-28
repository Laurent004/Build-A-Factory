export function round(number: number, decimalPlaces: number) {
	const factor = math.pow(10, decimalPlaces);
	return math.round(number * factor) / factor;
}
