export function round(number: number, decimalPlaces: number) {
	return math.round(number * math.pow(10, decimalPlaces)) / math.pow(10, decimalPlaces);
}
