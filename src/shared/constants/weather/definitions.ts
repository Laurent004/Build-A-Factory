import { WeatherDefinition } from "./types";

export const WEATHERS: Record<string, WeatherDefinition> = {
	Clear: {
		lightning: {
			Brightness: 3,
			ExposureCompensation: 0,
		},
		atmosphere: {
			Density: 0.285,
			Color: Color3.fromRGB(67, 215, 255),
			Glare: 0.18,
			Haze: 1.85,
		},
		depthOfField: {
			FarIntensity: 0.1,
			FocusDistance: 0.05,
			InFocusRadius: 30,
			NearIntensity: 0.75,
		},
	},
	Rainy: {
		lightning: {
			Brightness: 0.1,
			ExposureCompensation: -0.7,
		},
		atmosphere: {
			Density: 0.36,
			Color: Color3.fromRGB(46, 127, 176),
			Glare: 5,
			Haze: 2.92,
		},
		depthOfField: {
			FarIntensity: 0,
			FocusDistance: 55,
			InFocusRadius: 50,
			NearIntensity: 1,
		},
	},
	Snowy: {
		lightning: {
			Brightness: 0.25,
			ExposureCompensation: -0.45,
		},
		atmosphere: {
			Density: 0.42,
			Color: Color3.fromRGB(94, 110, 131),
			Glare: 2,
			Haze: 2.4,
		},
		depthOfField: {
			FarIntensity: 0.1,
			FocusDistance: 45,
			InFocusRadius: 38,
			NearIntensity: 0.75,
		},
	},
};
