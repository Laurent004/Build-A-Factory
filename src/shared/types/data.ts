export interface Data {
	games: {
		id: string;
		name: string;
		lastPlaytime: number;
		cash: number;
		size: number;
	}[];
	settings: {
		music: number;
		ambient: number;
		soundEffects: number;
		ui: number;
		simulateFactories: number[];
		renderItems: number[];
	};
}
