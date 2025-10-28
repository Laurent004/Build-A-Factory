import { ReplicatedStorage } from "@rbxts/services";

export const MODELS: Record<string, Model> = {
	//#region Transportation
	"Straight Conveyor": ReplicatedStorage.WaitForChild("Structures").WaitForChild("Straight Conveyor") as Model,
	"Left Turn Conveyor": ReplicatedStorage.WaitForChild("Structures").WaitForChild("Left Turn Conveyor") as Model,
	"Right Turn Conveyor": ReplicatedStorage.WaitForChild("Structures").WaitForChild("Right Turn Conveyor") as Model,
	"Underground Belt": ReplicatedStorage.WaitForChild("Structures").WaitForChild("Underground Belt") as Model,
	"Underground Belt Input": ReplicatedStorage.WaitForChild("Structures")
		.WaitForChild("Underground Belt")
		.WaitForChild("Underground Belt Input") as Model,
	"Underground Belt Output": ReplicatedStorage.WaitForChild("Structures")
		.WaitForChild("Underground Belt")
		.WaitForChild("Underground Belt Output") as Model,
	Merger: ReplicatedStorage.WaitForChild("Structures").WaitForChild("Merger") as Model,
	"Priority Merger": ReplicatedStorage.WaitForChild("Structures").WaitForChild("Priority Merger") as Model,
	Splitter: ReplicatedStorage.WaitForChild("Structures").WaitForChild("Splitter") as Model,
	"Smart Splitter": ReplicatedStorage.WaitForChild("Structures").WaitForChild("Smart Splitter") as Model,
	"Programmable Splitter": ReplicatedStorage.WaitForChild("Structures").WaitForChild(
		"Programmable Splitter",
	) as Model,
	"Storage Container": ReplicatedStorage.WaitForChild("Structures").WaitForChild("Storage Container") as Model,
	"Delivery Dock": ReplicatedStorage.WaitForChild("Structures").WaitForChild("Delivery Dock") as Model,
	//#endregion

	//#region Production
	Miner: ReplicatedStorage.WaitForChild("Structures").WaitForChild("Miner") as Model,
	Smelter: ReplicatedStorage.WaitForChild("Structures").WaitForChild("Smelter") as Model,
	Constructor: ReplicatedStorage.WaitForChild("Structures").WaitForChild("Constructor") as Model,
	Assembler: ReplicatedStorage.WaitForChild("Structures").WaitForChild("Assembler") as Model,
	//#endregion

	//#region Power
	"Power Line": ReplicatedStorage.WaitForChild("Structures").WaitForChild("Power Line") as Model,
	"Power Pole": ReplicatedStorage.WaitForChild("Structures").WaitForChild("Power Pole") as Model,
	"Power Switch": ReplicatedStorage.WaitForChild("Structures").WaitForChild("Power Switch") as Model,
	"Hand-Crank": ReplicatedStorage.WaitForChild("Structures").WaitForChild("Hand-Crank") as Model,
	"Wind Turbine": ReplicatedStorage.WaitForChild("Structures").WaitForChild("Wind Turbine") as Model,
	//#endregion

	//#region Items
	"Iron Ore": ReplicatedStorage.WaitForChild("Items").WaitForChild("Iron Ore") as Model,
	"Copper Ore": ReplicatedStorage.WaitForChild("Items").WaitForChild("Copper Ore") as Model,
	Coal: ReplicatedStorage.WaitForChild("Items").WaitForChild("Coal") as Model,
	Silica: ReplicatedStorage.WaitForChild("Items").WaitForChild("Silica") as Model,

	"Iron Ingot": ReplicatedStorage.WaitForChild("Items").WaitForChild("Iron Ingot") as Model,
	"Copper Ingot": ReplicatedStorage.WaitForChild("Items").WaitForChild("Copper Ingot") as Model,
	"Steel Ingot": ReplicatedStorage.WaitForChild("Items").WaitForChild("Steel Ingot") as Model,
	Silicon: ReplicatedStorage.WaitForChild("Items").WaitForChild("Silicon") as Model,

	"Iron Plate": ReplicatedStorage.WaitForChild("Items").WaitForChild("Iron Plate") as Model,
	"Iron Rod": ReplicatedStorage.WaitForChild("Items").WaitForChild("Iron Rod") as Model,
	"Copper Wire": ReplicatedStorage.WaitForChild("Items").WaitForChild("Copper Wire") as Model,
	"Steel Frame": ReplicatedStorage.WaitForChild("Items").WaitForChild("Steel Frame") as Model,
	"Glass Panel": ReplicatedStorage.WaitForChild("Items").WaitForChild("Glass Panel") as Model,

	"Circuit Board": ReplicatedStorage.WaitForChild("Items").WaitForChild("Circuit Board") as Model,
	Motor: ReplicatedStorage.WaitForChild("Items").WaitForChild("Motor") as Model,
	Battery: ReplicatedStorage.WaitForChild("Items").WaitForChild("Battery") as Model,
	"Control Unit": ReplicatedStorage.WaitForChild("Items").WaitForChild("Control Unit") as Model,
	//#endregion
};
