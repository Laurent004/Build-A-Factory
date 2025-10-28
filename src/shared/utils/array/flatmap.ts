export function flatMap<T, U extends defined>(array: T[], callback: (item: T) => U[]): U[] {
	const result: U[] = [];
	for (const item of array) {
		const subArray = callback(item);
		for (let i = 0; i < subArray.size(); i++) {
			result.push(subArray[i]);
		}
	}
	return result;
}
