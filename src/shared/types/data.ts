export interface Data {
	saves: {
		id: string;
		size: number;
	}[];
	settings: {
		music: number;
		ambient: number;
		sfx: number;
		ui: number;
		simulateFactories: number[];
		renderItems: number[];
	};
}
