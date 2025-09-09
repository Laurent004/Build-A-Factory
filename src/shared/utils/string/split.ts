export function splitString(input: string, separator: string): string {
	return input.gsub("([a-z])([A-Z])", `%1${separator}%2`)[0];
}
