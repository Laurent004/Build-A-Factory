import TransporterComponent from "shared/components/logistics/transporter";

export interface ItemDefintion {
	index: number;
	image: string;
	description: string;
	energy: number;
	value?: {
		cash: number;
		logisticsData: number;
		productionData: number;
		powerData: number;
	};
}

export interface ItemRecipe {
	index: number;
	structureName: string;
	inputItems: Record<string, number>;
	outputItems: Record<string, number>;
	time: number;
}

export interface Solid {
	readonly name: string;
	m?: Model;
	sp: Vector3;
	gp: Vector3;
	p: number;
	g: TransporterComponent;
}
