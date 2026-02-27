export interface WeatherDefinition {
	lightning: Partial<ExtractMembers<Lighting, Tweenable>>;
	atmosphere: Partial<ExtractMembers<Atmosphere, Tweenable>>;
	depthOfField: Partial<ExtractMembers<DepthOfFieldEffect, Tweenable>>;
}
