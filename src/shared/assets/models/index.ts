import { ReplicatedStorage } from "@rbxts/services";

export const MODELS = {
	structures: {
		StraightConveyor: ReplicatedStorage.WaitForChild("Straight Conveyor") as Model,
		LeftTurnConveyor: ReplicatedStorage.WaitForChild("Left Turn Conveyor") as Model,
		RightTurnConveyor: ReplicatedStorage.WaitForChild("Right Turn Conveyor") as Model,
		Merger: ReplicatedStorage.WaitForChild("Merger") as Model,
		Splitter: ReplicatedStorage.WaitForChild("Splitter") as Model,
		StorageContainer: ReplicatedStorage.WaitForChild("Storage Container") as Model,
		Extractor: ReplicatedStorage.WaitForChild("Extractor") as Model,
		Smelter: ReplicatedStorage.WaitForChild("Smelter") as Model,
		Assembler: ReplicatedStorage.WaitForChild("Assembler") as Model,
	},
	items: {
		IronOre: ReplicatedStorage.WaitForChild("Iron Ore") as Model,
		CopperOre: ReplicatedStorage.WaitForChild("Copper Ore") as Model,
		IronIngot: ReplicatedStorage.WaitForChild("Iron Ingot") as Model,
		CopperIngot: ReplicatedStorage.WaitForChild("Copper Ingot") as Model,
		IronPlate: ReplicatedStorage.WaitForChild("Iron Plate") as Model,
	},
} as const;
