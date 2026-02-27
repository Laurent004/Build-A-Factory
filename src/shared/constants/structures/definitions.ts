import { HttpService } from "@rbxts/services";
import { IMAGES } from "shared/assets/images";
import { StructureDefinition } from "./types";

export const STRUCTURES: Record<string, StructureDefinition> = {
	//#region Logistics
	Transporter: {
		category: "Logistics",
		subcategory: "Conveyor Belts",
		image: "",
		description: "",
		cost: 1,

		tags: ["Transporter"],
		constants: {},
		attributes: {},
		maxElevation: 4,
		nodes: {
			cells: [],
			inputs: {
				solids: new Map<CFrame, boolean>([[new CFrame(0, 0, 0, 0, 1, 0, 0, 0, -1, -1, 0, 0), false]]),
				fluids: new Map<CFrame, boolean>(),
			},
			outputs: {
				solids: new Map<CFrame, boolean>([[new CFrame(0, 0, -4, 0, 1, 0, 0, 0, -1, -1, 0, 0), false]]),
				fluids: new Map<CFrame, boolean>(),
			},
			connections: new Map<CFrame, boolean>(),
		},
		priority: 0,
	},

	Conveyor: {
		category: "Logistics",
		subcategory: "Conveyor Belts",
		index: 0,
		image: IMAGES["Conveyor"],
		description: "Transports items forward at a steady rate, keeping production lines flowing smoothly.",
		cost: 1,

		tags: ["Transporter"],
		constants: {},
		attributes: {},
		maxElevation: 4,
		nodes: {
			cells: [new Vector3()],
			inputs: {
				solids: new Map<CFrame, boolean>([[new CFrame(0, 0, 0, 0, 1, 0, 0, 0, -1, -1, 0, 0), true]]),
				fluids: new Map<CFrame, boolean>(),
			},
			outputs: {
				solids: new Map<CFrame, boolean>([[new CFrame(0, 0, -4, 0, 1, 0, 0, 0, -1, -1, 0, 0), true]]),
				fluids: new Map<CFrame, boolean>(),
			},
			connections: new Map<CFrame, boolean>(),
		},
		priority: 0,
	},

	"Left Turn Conveyor": {
		category: "Logistics",
		subcategory: "Conveyor Belts",
		index: 1,
		image: IMAGES.Conveyor,
		description: "Redirects items 90° to the left while maintaining consistent movement and flow.",
		cost: 1,

		tags: ["Transporter"],
		constants: {
			ThroughputRate: 300,
		},
		attributes: {},
		maxElevation: 4,
		nodes: {
			cells: [new Vector3()],

			inputs: {
				solids: new Map<CFrame, boolean>([[new CFrame(0, 0, 0, 1, 0, 0, 0, 0, -1, 0, 1, 0), true]]),
				fluids: new Map<CFrame, boolean>(),
			},
			outputs: {
				solids: new Map<CFrame, boolean>([[new CFrame(0, 0, -4, 0, 1, 0, 0, 0, -1, -1, 0, 0), true]]),
				fluids: new Map<CFrame, boolean>(),
			},
			connections: new Map<CFrame, boolean>(),
		},
		priority: 0,
	},

	"Right Turn Conveyor": {
		category: "Logistics",
		subcategory: "Conveyor Belts",
		index: 2,
		image: IMAGES.Conveyor,
		description: "Redirects items 90° to the right while maintaining consistent movement and flow.",
		cost: 1,

		tags: ["Transporter"],
		constants: {
			ThroughputRate: 300,
		},
		attributes: {},
		maxElevation: 4,
		nodes: {
			cells: [new Vector3()],
			inputs: {
				solids: new Map<CFrame, boolean>([[new CFrame(0, 0, 0, -1, 0, -0, 0, 0, -1, 0, -1, -0), true]]),
				fluids: new Map<CFrame, boolean>(),
			},
			outputs: {
				solids: new Map<CFrame, boolean>([[new CFrame(0, 0, -4, 0, 1, 0, 0, 0, -1, -1, 0, 0), true]]),
				fluids: new Map<CFrame, boolean>(),
			},
			connections: new Map<CFrame, boolean>(),
		},
		priority: 0,
	},

	"Underground Conveyor": {
		category: "Logistics",
		subcategory: "Conveyor Belts",
		index: 3,
		image: IMAGES["Conveyor"],
		description: "Transfers items underground to bypass obstacles and crowded production areas.",
		cost: 0,

		tags: [],
		constants: {},
		attributes: {},
		maxElevation: 0,
		nodes: {
			cells: [],
			inputs: {
				solids: new Map<CFrame, boolean>(),
				fluids: new Map<CFrame, boolean>(),
			},
			outputs: {
				solids: new Map<CFrame, boolean>(),
				fluids: new Map<CFrame, boolean>(),
			},
			connections: new Map<CFrame, boolean>(),
		},
		priority: 0,
	},

	"Underground Conveyor Input": {
		category: "Logistics",
		subcategory: "Conveyor Belts",
		image: "",
		description: "",
		cost: 1,

		tags: ["Transporter", "UndergroundConveyorInput"],
		constants: {},
		attributes: {},
		maxElevation: 0,
		nodes: {
			cells: [new Vector3()],
			inputs: {
				solids: new Map<CFrame, boolean>([[new CFrame(0, 0, 0, 0, 1, 0, 0, 0, -1, -1, 0, 0), true]]),
				fluids: new Map<CFrame, boolean>(),
			},
			outputs: {
				solids: new Map<CFrame, boolean>([[new CFrame(0, 0, -4, 0, 1, 0, 0, 0, -1, -1, 0, 0), false]]),
				fluids: new Map<CFrame, boolean>(),
			},
			connections: new Map<CFrame, boolean>(),
		},
		priority: 0,
	},

	"Underground Conveyor Output": {
		category: "Logistics",
		subcategory: "Conveyor Belts",
		image: "",
		description: "",
		cost: 1,

		tags: ["Transporter", "UndergroundConveyorOutput"],
		constants: {},
		attributes: {},
		maxElevation: 0,
		nodes: {
			cells: [new Vector3()],
			inputs: {
				solids: new Map<CFrame, boolean>([[new CFrame(0, 0, 0, 0, 1, 0, 0, 0, -1, -1, 0, 0), false]]),
				fluids: new Map<CFrame, boolean>(),
			},
			outputs: {
				solids: new Map<CFrame, boolean>([[new CFrame(0, 0, -4, 0, 1, 0, 0, 0, -1, -1, 0, 0), true]]),
				fluids: new Map<CFrame, boolean>(),
			},
			connections: new Map<CFrame, boolean>(),
		},
		priority: 0,
	},

	"Conveyor Lift": {
		category: "Logistics",
		subcategory: "Conveyor Belts",
		index: 4,
		image: IMAGES["Conveyor"],
		description: "Moves items vertically to connect production lines across different heights.",
		cost: 0,

		tags: [],
		constants: {},
		attributes: {},
		maxElevation: 4,
		nodes: {
			cells: [],
			inputs: {
				solids: new Map<CFrame, boolean>(),
				fluids: new Map<CFrame, boolean>(),
			},
			outputs: {
				solids: new Map<CFrame, boolean>(),
				fluids: new Map<CFrame, boolean>(),
			},
			connections: new Map<CFrame, boolean>(),
		},
		priority: 0,
	},

	"Conveyor Lift Input": {
		category: "Logistics",
		subcategory: "Conveyor Belts",
		image: "",
		description: "",
		cost: 1,

		tags: ["Transporter", "ConveyorLiftInput"],
		constants: {},
		attributes: {},
		maxElevation: 4,
		nodes: {
			cells: [new Vector3()],
			inputs: {
				solids: new Map<CFrame, boolean>([[new CFrame(0, 0, 0, 0, 1, 0, 0, 0, -1, -1, 0, 0), true]]),
				fluids: new Map<CFrame, boolean>(),
			},
			outputs: {
				solids: new Map<CFrame, boolean>([[new CFrame(0, 4, 0, 0, 1, 0, 1, 0, 0, 0, 0, -1), false]]),
				fluids: new Map<CFrame, boolean>(),
			},
			connections: new Map<CFrame, boolean>(),
		},
		priority: 0,
	},

	"Conveyor Lift Elevator": {
		category: "Logistics",
		subcategory: "Conveyor Belts",
		image: "",
		description: "",
		cost: 0,

		tags: [],
		constants: {},
		attributes: {},
		maxElevation: 4,
		nodes: {
			cells: [new Vector3()],
			inputs: {
				solids: new Map<CFrame, boolean>(),
				fluids: new Map<CFrame, boolean>(),
			},
			outputs: {
				solids: new Map<CFrame, boolean>(),
				fluids: new Map<CFrame, boolean>(),
			},
			connections: new Map<CFrame, boolean>(),
		},
		priority: 0,
	},

	"Conveyor Lift Output": {
		category: "Logistics",
		subcategory: "Conveyor Belts",
		image: "",
		description: "",
		cost: 1,

		tags: ["Transporter", "ConveyorLiftOutput"],
		constants: {},
		attributes: {},
		maxElevation: 4,
		nodes: {
			cells: [new Vector3()],
			inputs: {
				solids: new Map<CFrame, boolean>([[new CFrame(0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, -1), false]]),
				fluids: new Map<CFrame, boolean>(),
			},
			outputs: {
				solids: new Map<CFrame, boolean>([[new CFrame(0, 0, -4, 0, 1, 0, 0, 0, -1, -1, 0, 0), true]]),
				fluids: new Map<CFrame, boolean>(),
			},
			connections: new Map<CFrame, boolean>(),
		},
		priority: 0,
	},

	"Conveyor Throughput Counter": {
		category: "Logistics",
		subcategory: "Conveyor Belts",
		index: 5,
		image: IMAGES["Conveyor"],
		description: "AAAA",
		cost: 1,

		tags: ["TrackedTransporter", "ThroughputCounter"],
		constants: {},
		attributes: {},
		maxElevation: 4,
		nodes: {
			cells: [new Vector3()],
			inputs: {
				solids: new Map<CFrame, boolean>([[new CFrame(0, 0, 0, 0, 1, 0, 0, 0, -1, -1, 0, 0), true]]),
				fluids: new Map<CFrame, boolean>(),
			},
			outputs: {
				solids: new Map<CFrame, boolean>([[new CFrame(0, 0, -4, 0, 1, 0, 0, 0, -1, -1, 0, 0), true]]),
				fluids: new Map<CFrame, boolean>(),
			},
			connections: new Map<CFrame, boolean>(),
		},
		priority: 0,
	},

	"Fluid Transporter": {
		category: "Logistics",
		subcategory: "Pipelines",
		image: "",
		description: "",
		cost: 1,

		tags: ["Transporter"],
		constants: {
			FluidCapacity: 6,
		},
		attributes: {},
		maxElevation: 0,
		nodes: {
			cells: [],
			inputs: {
				solids: new Map<CFrame, boolean>(),
				fluids: new Map<CFrame, boolean>(),
			},
			outputs: {
				solids: new Map<CFrame, boolean>(),
				fluids: new Map<CFrame, boolean>(),
			},
			connections: new Map<CFrame, boolean>([
				[new CFrame(0, 0, -4, 0, 1, 0, 0, 0, -1, -1, 0, 0), false],
				[new CFrame(0, 0, 4, 0, -1, 0, 0, 0, -1, 1, 0, 0), false],
			]),
		},
		priority: 0,
	},

	Pipeline: {
		category: "Logistics",
		subcategory: "Pipelines",
		index: 0,
		image: IMAGES["Conveyor"],
		description: "Moves fluids forward at a constant rate, supporting stable industrial flow.",
		cost: 1,

		tags: ["Transporter"],
		constants: {
			FluidCapacity: 6,
		},
		attributes: {},
		maxElevation: 0,
		nodes: {
			cells: [new Vector3()],
			inputs: {
				solids: new Map<CFrame, boolean>(),
				fluids: new Map<CFrame, boolean>(),
			},
			outputs: {
				solids: new Map<CFrame, boolean>(),
				fluids: new Map<CFrame, boolean>(),
			},
			connections: new Map<CFrame, boolean>([
				[new CFrame(0, 0, -4, 0, 1, 0, 0, 0, -1, -1, 0, 0), true],
				[new CFrame(0, 0, 4, 0, -1, 0, 0, 0, -1, 1, 0, 0), true],
			]),
		},
		priority: 0,
	},

	"Pipeline Turn": {
		category: "Logistics",
		subcategory: "Pipelines",
		index: 1,
		image: IMAGES["Conveyor"],
		description: "Redirects fluid flow by 90°, enabling compact and flexible pipe layouts.",
		cost: 1,

		tags: ["Transporter"],
		constants: {
			FluidCapacity: 6,
		},
		attributes: {},
		maxElevation: 0,
		nodes: {
			cells: [new Vector3()],
			inputs: {
				solids: new Map<CFrame, boolean>(),
				fluids: new Map<CFrame, boolean>(),
			},
			outputs: {
				solids: new Map<CFrame, boolean>(),
				fluids: new Map<CFrame, boolean>(),
			},
			connections: new Map<CFrame, boolean>([
				[new CFrame(4, 0, 0, 1, 0, 0, 0, 0, -1, 0, 1, 0), true],
				[new CFrame(0, 0, -4, 0, 1, 0, 0, 0, -1, -1, 0, 0), true],
			]),
		},
		priority: 0,
	},

	"Pipeline Junction": {
		category: "Logistics",
		subcategory: "Pipelines",
		image: IMAGES["Conveyor"],
		index: 2,
		description: "Splits or combines fluid streams to efficiently distribute resources.",
		cost: 1,

		tags: ["Transporter"],
		constants: {
			FluidCapacity: 6,
		},
		attributes: {},
		maxElevation: 0,
		nodes: {
			cells: [new Vector3()],
			inputs: {
				solids: new Map<CFrame, boolean>(),
				fluids: new Map<CFrame, boolean>(),
			},
			outputs: {
				solids: new Map<CFrame, boolean>(),
				fluids: new Map<CFrame, boolean>(),
			},
			connections: new Map<CFrame, boolean>([
				[new CFrame(4, 0, 0, 1, 0, 0, 0, 0, -1, 0, 1, 0), true],
				[new CFrame(0, 0, -4, 0, 1, 0, 0, 0, -1, -1, 0, 0), true],
				[new CFrame(-4, 0, 0, -1, 0, -0, 0, 0, -1, 0, -1, -0), true],
				[new CFrame(0, 0, 4, 0, -1, 0, 0, 0, -1, 1, 0, 0), true],
			]),
		},
		priority: 0,
	},

	"Underground Pipeline": {
		category: "Logistics",
		subcategory: "Pipelines",
		index: 3,
		image: IMAGES["Conveyor"],
		description: "Transfers fluids underground to avoid surface obstacles and congestion.",
		cost: 0,

		tags: [],
		constants: {},
		attributes: {},
		maxElevation: 0,
		nodes: {
			cells: [],
			inputs: {
				solids: new Map<CFrame, boolean>(),
				fluids: new Map<CFrame, boolean>(),
			},
			outputs: {
				solids: new Map<CFrame, boolean>(),
				fluids: new Map<CFrame, boolean>(),
			},
			connections: new Map<CFrame, boolean>(),
		},
		priority: 0,
	},

	"Underground Pipeline Input": {
		category: "Logistics",
		subcategory: "Pipelines",
		image: "",
		description: "",
		cost: 1,

		tags: ["Transporter"],
		constants: {
			FluidCapacity: 6,
		},
		attributes: {},
		maxElevation: 0,
		nodes: {
			cells: [new Vector3()],
			inputs: {
				solids: new Map<CFrame, boolean>(),
				fluids: new Map<CFrame, boolean>(),
			},
			outputs: {
				solids: new Map<CFrame, boolean>(),
				fluids: new Map<CFrame, boolean>(),
			},
			connections: new Map<CFrame, boolean>([
				[new CFrame(0, 0, 4, 0, -1, 0, 0, 0, -1, 1, 0, 0), true],
				[new CFrame(0, 0, -4, 0, 1, 0, 0, 0, -1, -1, 0, 0), false],
			]),
		},
		priority: 0,
	},

	"Underground Pipeline Output": {
		category: "Logistics",
		subcategory: "Pipelines",
		image: "",
		description: "",
		cost: 1,

		tags: ["Transporter"],
		constants: {
			FluidCapacity: 6,
		},
		attributes: {},
		maxElevation: 0,
		nodes: {
			cells: [new Vector3()],
			inputs: {
				solids: new Map<CFrame, boolean>(),
				fluids: new Map<CFrame, boolean>(),
			},
			outputs: {
				solids: new Map<CFrame, boolean>(),
				fluids: new Map<CFrame, boolean>(),
			},
			connections: new Map<CFrame, boolean>([
				[new CFrame(0, 0, -4, 0, 1, 0, 0, 0, -1, -1, 0, 0), true],
				[new CFrame(0, 0, 4, 0, -1, 0, 0, 0, -1, 1, 0, 0), false],
			]),
		},
		priority: 0,
	},

	Merger: {
		category: "Logistics",
		subcategory: "Sorting",
		index: 0,
		image: IMAGES["Conveyor"],
		description: "Combines multiple item streams into a single, continuous output line.",
		cost: 1,

		tags: ["Merger"],
		constants: {},
		attributes: {},
		maxElevation: 4,
		nodes: {
			cells: [new Vector3()],
			inputs: {
				solids: new Map<CFrame, boolean>([
					[new CFrame(0, 0, 0, 0, 1, 0, 0, 0, -1, -1, 0, 0), true],
					[new CFrame(0, 0, 0, 1, 0, 0, 0, 0, -1, 0, 1, 0), true],
					[new CFrame(0, 0, 0, -1, 0, -0, 0, 0, -1, 0, -1, 0), true],
				]),
				fluids: new Map<CFrame, boolean>(),
			},
			outputs: {
				solids: new Map<CFrame, boolean>([[new CFrame(0, 0, -4, 0, 1, 0, 0, 0, -1, -1, 0, 0), true]]),
				fluids: new Map<CFrame, boolean>(),
			},
			connections: new Map<CFrame, boolean>(),
		},
		priority: 1,
	},

	"Priority Merger": {
		category: "Logistics",
		subcategory: "Sorting",
		index: 1,
		image: IMAGES["Conveyor"],
		description: "Merges item streams while prioritizing selected inputs when congested.",
		cost: 1,

		tags: ["PriorityMerger"],
		constants: {},
		attributes: {
			Left: "Low",
			Backward: "Low",
			Right: "Low",
		},
		maxElevation: 4,
		nodes: {
			cells: [new Vector3()],
			inputs: {
				solids: new Map<CFrame, boolean>([
					[new CFrame(0, 0, 0, 0, 1, 0, 0, 0, -1, -1, 0, 0), true],
					[new CFrame(0, 0, 0, 1, 0, 0, 0, 0, -1, 0, 1, 0), true],
					[new CFrame(0, 0, 0, -1, 0, -0, 0, 0, -1, 0, -1, 0), true],
				]),
				fluids: new Map<CFrame, boolean>(),
			},
			outputs: {
				solids: new Map<CFrame, boolean>([[new CFrame(0, 0, -4, 0, 1, 0, 0, 0, -1, -1, 0, 0), true]]),
				fluids: new Map<CFrame, boolean>(),
			},
			connections: new Map<CFrame, boolean>(),
		},
		priority: 1,
	},

	Splitter: {
		category: "Logistics",
		subcategory: "Sorting",
		index: 2,
		image: IMAGES["Conveyor"],
		description: "Divides incoming items evenly across multiple output paths.",
		cost: 1,

		tags: ["Splitter"],
		constants: {},
		attributes: {},
		maxElevation: 4,

		nodes: {
			cells: [new Vector3()],
			inputs: {
				solids: new Map<CFrame, boolean>([[new CFrame(0, 0, 0, 0, 1, 0, 0, 0, -1, -1, 0, 0), true]]),
				fluids: new Map<CFrame, boolean>(),
			},
			outputs: {
				solids: new Map<CFrame, boolean>([
					[new CFrame(-4, 0, 0, -1, 0, -0, 0, 0, -1, 0, -1, 0), true],
					[new CFrame(4, 0, 0, 1, 0, 0, 0, 0, -1, 0, 1, 0), true],
					[new CFrame(0, 0, -4, 0, 1, 0, 0, 0, -1, -1, 0, 0), true],
				]),
				fluids: new Map<CFrame, boolean>(),
			},
			connections: new Map<CFrame, boolean>(),
		},
		priority: 1,
	},

	"Smart Splitter": {
		category: "Logistics",
		subcategory: "Sorting",
		index: 3,
		image: IMAGES["Conveyor"],
		description: "Sorts items using filters to direct them to specific outputs.",
		cost: 1,

		tags: ["SmartSplitter"],
		constants: {},
		attributes: {
			Left: "Any",
			Forward: "Any",
			Right: "Any",
		},
		maxElevation: 4,
		nodes: {
			cells: [new Vector3()],
			inputs: {
				solids: new Map<CFrame, boolean>([[new CFrame(0, 0, 0, 0, 1, 0, 0, 0, -1, -1, 0, 0), true]]),
				fluids: new Map<CFrame, boolean>(),
			},
			outputs: {
				solids: new Map<CFrame, boolean>([
					[new CFrame(-4, 0, 0, -1, 0, -0, 0, 0, -1, 0, -1, 0), true],
					[new CFrame(4, 0, 0, 1, 0, 0, 0, 0, -1, 0, 1, 0), true],
					[new CFrame(0, 0, -4, 0, 1, 0, 0, 0, -1, -1, 0, 0), true],
				]),
				fluids: new Map<CFrame, boolean>(),
			},
			connections: new Map<CFrame, boolean>(),
		},
		priority: 1,
	},

	"Programmable Splitter": {
		category: "Logistics",
		subcategory: "Sorting",
		index: 4,
		image: IMAGES["Conveyor"],
		description: "Sorts items using advanced, customizable filtering logic.",
		cost: 1,

		tags: ["ProgrammableSplitter"],
		constants: {},
		maxElevation: 4,
		attributes: {
			Left: HttpService.JSONEncode(["Any"]),
			Forward: HttpService.JSONEncode(["Any"]),
			Right: HttpService.JSONEncode(["Any"]),
		},
		nodes: {
			cells: [new Vector3()],
			inputs: {
				solids: new Map<CFrame, boolean>([[new CFrame(0, 0, 0, 0, 1, 0, 0, 0, -1, -1, 0, 0), true]]),
				fluids: new Map<CFrame, boolean>(),
			},
			outputs: {
				solids: new Map<CFrame, boolean>([
					[new CFrame(-4, 0, 0, -1, 0, -0, 0, 0, -1, 0, -1, 0), true],
					[new CFrame(4, 0, 0, 1, 0, 0, 0, 0, -1, 0, 1, 0), true],
					[new CFrame(0, 0, -4, 0, 1, 0, 0, 0, -1, -1, 0, 0), true],
				]),
				fluids: new Map<CFrame, boolean>(),
			},
			connections: new Map<CFrame, boolean>(),
		},
		priority: 1,
	},

	"Delivery Dock": {
		image: IMAGES["Conveyor"],
		category: "Logistics",
		index: 0,
		subcategory: "Miscellaneous",
		description: "Accepts delivered items to progress by producing money.",
		cost: 1,

		tags: ["DeliveryDock"],
		constants: {},
		attributes: {},
		maxElevation: 0,
		nodes: {
			cells: [
				new Vector3(-4, -3, -4),
				new Vector3(0, -3, 0),
				new Vector3(0, -3, -4),
				new Vector3(4, -3, -4),
				new Vector3(4, -3, 0),
				new Vector3(-4, -3, -0),
			],
			inputs: {
				solids: new Map<CFrame, boolean>([[new CFrame(0, -3, 0, 0, 1, 0, 0, 0, -1, -1, 0, 0), true]]),
				fluids: new Map<CFrame, boolean>(),
			},
			outputs: {
				solids: new Map<CFrame, boolean>(),
				fluids: new Map<CFrame, boolean>(),
			},
			connections: new Map<CFrame, boolean>(),
		},
		priority: 0,
	},

	"Data Center": {
		image: IMAGES["Conveyor"],
		category: "Logistics",
		index: 1,
		subcategory: "Miscellaneous",
		description: "Accepts delivered items to progress by producing money.",
		cost: 1,

		tags: ["DataCenter"],
		constants: {},
		attributes: {},
		maxElevation: 0,
		nodes: {
			cells: [new Vector3(0, -3, -4), new Vector3(0, -3, 0), new Vector3(0, -3, 4)],
			inputs: {
				solids: new Map<CFrame, boolean>([[new CFrame(0, -3, 4, 0, 1, 0, 0, 0, -1, -1, 0, 0), true]]),
				fluids: new Map<CFrame, boolean>(),
			},
			outputs: {
				solids: new Map<CFrame, boolean>(),
				fluids: new Map<CFrame, boolean>(),
			},
			connections: new Map<CFrame, boolean>(),
		},
		priority: 0,
	},
	//#endregion
	//#region Production
	Miner: {
		category: "Production",
		subcategory: "Extractors",
		index: 0,
		image: IMAGES["Conveyor"],
		description: "Automatically extracts solid resources from nearby resource deposits.",
		cost: 1,

		tags: ["Miner", "IndicatorLight"],
		constants: {
			PowerConsumption: 5,
		},
		attributes: {},
		maxElevation: 0,
		nodes: {
			cells: [
				new Vector3(-2, -3.5, -4),
				new Vector3(-2, -3.5, 4),
				new Vector3(2, -3.5, 4),
				new Vector3(2, -3.5, 0),
				new Vector3(2, -3.5, -4),
				new Vector3(-2, -3.5, 0),
			],
			inputs: {
				solids: new Map<CFrame, boolean>(),
				fluids: new Map<CFrame, boolean>(),
			},
			outputs: {
				solids: new Map<CFrame, boolean>([[new CFrame(0, -3.5, -12, 0, -1, 0, 0, 0, 1, -1, 0, 0), true]]),
				fluids: new Map<CFrame, boolean>(),
			},
			connections: new Map<CFrame, boolean>(),
		},
		priority: 2,
	},

	"Water Extractor": {
		category: "Production",
		subcategory: "Extractors",
		index: 1,
		image: IMAGES["Conveyor"],
		description: "Pumps water from natural sources for industrial and manufacturing use.",
		cost: 1,

		tags: ["FluidExtractor", "IndicatorLight"],
		constants: {
			Recipe: "Water",
			FluidCapacity: 200,
			PowerConsumption: 8,
		},
		attributes: {},
		maxElevation: 0,
		nodes: {
			cells: [new Vector3(0, 0, 2), new Vector3(0, 0, -2)],
			inputs: {
				solids: new Map<CFrame, boolean>(),

				fluids: new Map<CFrame, boolean>(),
			},
			outputs: {
				solids: new Map<CFrame, boolean>(),
				fluids: new Map<CFrame, boolean>([[new CFrame(0, 0, -8, 0, 1, 0, 0, 0, -1, -1, 0, 0), true]]),
			},
			connections: new Map<CFrame, boolean>(),
		},
		priority: 0,
	},

	"Oil Extractor": {
		category: "Production",
		subcategory: "Extractors",
		index: 2,
		image: IMAGES["Conveyor"],
		description: "Pumps water from natural sources for industrial and manufacturing use.",
		cost: 1,

		tags: ["FluidExtractor", "IndicatorLight"],
		constants: {
			Recipe: "Crude Oil",
			FluidCapacity: 200,
			PowerConsumption: 10,
		},
		attributes: {},
		maxElevation: 0,
		nodes: {
			cells: [new Vector3(0, 0, 2), new Vector3(0, 0, -2)],
			inputs: {
				solids: new Map<CFrame, boolean>(),

				fluids: new Map<CFrame, boolean>(),
			},
			outputs: {
				solids: new Map<CFrame, boolean>(),
				fluids: new Map<CFrame, boolean>([[new CFrame(0, 0, -8, 0, 1, 0, 0, 0, -1, -1, 0, 0), true]]),
			},
			connections: new Map<CFrame, boolean>(),
		},
		priority: 0,
	},

	Smelter: {
		category: "Production",
		subcategory: "Smelters",
		index: 0,
		image: IMAGES["Conveyor"],
		description: "Refines raw ores into usable metal ingots for production chains.",
		cost: 1,

		tags: ["Manufacturer", "IndicatorLight"],
		constants: {
			PowerConsumption: 8,
		},
		attributes: {},
		maxElevation: 0,
		nodes: {
			cells: [new Vector3(0, 0, -4), new Vector3(0, 0, 0)],
			inputs: {
				solids: new Map<CFrame, boolean>([[new CFrame(0, 0, 0, 0, 1, 0, 0, 0, -1, -1, 0, 0), true]]),
				fluids: new Map<CFrame, boolean>(),
			},
			outputs: {
				solids: new Map<CFrame, boolean>([[new CFrame(0, 0, -8, 0, 1, 0, 0, 0, -1, -1, 0, 0), true]]),
				fluids: new Map<CFrame, boolean>(),
			},
			connections: new Map<CFrame, boolean>(),
		},
		priority: 2,
	},

	Foundry: {
		category: "Production",
		subcategory: "Smelters",
		index: 1,
		image: IMAGES["Conveyor"],
		description: "Refines raw ores into usable metal ingots for production chains.",
		cost: 1,

		tags: ["Manufacturer", "IndicatorLight"],
		constants: {
			PowerConsumption: 15,
		},
		attributes: {},
		maxElevation: 0,
		nodes: {
			cells: [new Vector3(0, 0, -4), new Vector3(0, 0, 0)],
			inputs: {
				solids: new Map<CFrame, boolean>([[new CFrame(0, 0, 0, 0, 1, 0, 0, 0, -1, -1, 0, 0), true]]),
				fluids: new Map<CFrame, boolean>(),
			},
			outputs: {
				solids: new Map<CFrame, boolean>([[new CFrame(0, 0, -8, 0, 1, 0, 0, 0, -1, -1, 0, 0), true]]),
				fluids: new Map<CFrame, boolean>(),
			},
			connections: new Map<CFrame, boolean>(),
		},
		priority: 2,
	},

	Crusher: {
		category: "Production",
		subcategory: "Processors",
		index: 0,
		image: IMAGES["Conveyor"],
		description: "Refines raw ores into usable metal ingots for production chains.",
		cost: 1,

		tags: ["Manufacturer", "IndicatorLight"],
		constants: {
			PowerConsumption: 10,
		},
		attributes: {},
		maxElevation: 0,
		nodes: {
			cells: [new Vector3(0, 0, -4), new Vector3(0, 0, 0)],
			inputs: {
				solids: new Map<CFrame, boolean>([]),
				fluids: new Map<CFrame, boolean>(),
			},
			outputs: {
				solids: new Map<CFrame, boolean>([]),
				fluids: new Map<CFrame, boolean>(),
			},
			connections: new Map<CFrame, boolean>(),
		},
		priority: 2,
	},

	Press: {
		category: "Production",
		subcategory: "Processors",
		index: 1,
		image: IMAGES["Conveyor"],
		description: "Refines raw ores into usable metal ingots for production chains.",
		cost: 1,

		tags: ["Manufacturer", "IndicatorLight"],
		constants: {
			PowerConsumption: 10,
		},
		attributes: {},
		maxElevation: 0,
		nodes: {
			cells: [new Vector3(0, 0, -4), new Vector3(0, 0, 0)],
			inputs: {
				solids: new Map<CFrame, boolean>([]),
				fluids: new Map<CFrame, boolean>(),
			},
			outputs: {
				solids: new Map<CFrame, boolean>([]),
				fluids: new Map<CFrame, boolean>(),
			},
			connections: new Map<CFrame, boolean>(),
		},
		priority: 2,
	},

	Constructor: {
		category: "Production",
		subcategory: "Manufacturers",
		index: 0,
		image: IMAGES["Conveyor"],
		description: "Converts input materials into crafted components using selected recipes.",
		cost: 1,

		tags: ["Manufacturer", "IndicatorLight"],
		constants: {
			PowerConsumption: 12,
		},
		attributes: {},
		maxElevation: 0,
		nodes: {
			cells: [new Vector3(0, 0, -4), new Vector3(0, 0, 0)],
			inputs: {
				solids: new Map<CFrame, boolean>([[new CFrame(0, 0, 0, 0, 1, 0, 0, 0, -1, -1, 0, 0), true]]),
				fluids: new Map<CFrame, boolean>(),
			},
			outputs: {
				solids: new Map<CFrame, boolean>([[new CFrame(0, 0, -8, 0, 1, 0, 0, 0, -1, -1, 0, 0), true]]),
				fluids: new Map<CFrame, boolean>(),
			},
			connections: new Map<CFrame, boolean>(),
		},

		priority: 2,
	},

	Assembler: {
		category: "Production",
		subcategory: "Manufacturers",
		index: 1,
		image: IMAGES["Conveyor"],
		description: "Combines refined materials to produce advanced industrial components.",
		cost: 1,

		tags: ["Manufacturer", "IndicatorLight"],

		constants: {
			PowerConsumption: 20,
		},
		attributes: {},
		maxElevation: 0,
		nodes: {
			cells: [
				new Vector3(0, 0, 0),
				new Vector3(4, 0, 0),
				new Vector3(-4, 0, 0),
				new Vector3(0, 0, 4),
				new Vector3(0, 0, -4),
				new Vector3(4, 0, 4),
				new Vector3(-4, 0, 4),
				new Vector3(4, 0, -4),
				new Vector3(-4, 0, -4),
			],
			inputs: {
				solids: new Map<CFrame, boolean>([
					[new CFrame(-4, 0, 4, 0, 1, 0, 0, 0, -1, -1, 0, 0), true],
					[new CFrame(4, 0, 4, 0, 1, 0, 0, 0, -1, -1, 0, 0), true],
				]),
				fluids: new Map<CFrame, boolean>(),
			},
			outputs: {
				solids: new Map<CFrame, boolean>([[new CFrame(0, 0, -8, 0, 1, 0, 0, 0, -1, -1, 0, 0), true]]),
				fluids: new Map<CFrame, boolean>(),
			},
			connections: new Map<CFrame, boolean>(),
		},
		priority: 2,
	},

	Refinery: {
		category: "Production",
		subcategory: "Manufacturers",
		index: 2,
		image: IMAGES["Conveyor"],
		description: "Processes solid and liquid inputs into refined or composite resources.",
		cost: 1,

		tags: ["Manufacturer", "IndicatorLight"],
		constants: {
			PowerConsumption: 25,
		},
		attributes: {},
		maxElevation: 0,
		nodes: {
			cells: [new Vector3(-2, 0, 2), new Vector3(-2, 0, -2), new Vector3(2, 0, -2), new Vector3(2, 0, 2)],
			inputs: {
				solids: new Map<CFrame, boolean>([[new CFrame(-2, 0, 2, 0, 1, 0, 0, 0, -1, -1, 0, 0), true]]),
				fluids: new Map<CFrame, boolean>([[new CFrame(2, 0, 2, 0, 1, 0, 0, 0, -1, -1, 0, 0), true]]),
			},
			outputs: {
				solids: new Map<CFrame, boolean>([[new CFrame(-2, 0, -6, 0, 1, 0, 0, 0, -1, -1, 0, 0), true]]),
				fluids: new Map<CFrame, boolean>([[new CFrame(2, 0, -6, 0, 1, 0, 0, 0, -1, -1, 0, 0), true]]),
			},
			connections: new Map<CFrame, boolean>(),
		},
		priority: 2,
	},

	Incinerator: {
		image: IMAGES["Conveyor"],
		category: "Production",
		index: 0,
		subcategory: "Miscellaneous",
		description: "DESTROY",
		cost: 1,

		tags: ["Incinerator", "IndicatorLight"],
		constants: {
			PowerConsumption: 20,
		},
		attributes: {},
		maxElevation: 0,
		nodes: {
			cells: [
				new Vector3(-4, -3, -4),
				new Vector3(0, -3, 0),
				new Vector3(0, -3, -4),
				new Vector3(4, -3, -4),
				new Vector3(4, -3, 0),
				new Vector3(-4, -3, -0),
			],
			inputs: {
				solids: new Map<CFrame, boolean>([[new CFrame(0, -3, 0, 0, 1, 0, 0, 0, -1, -1, 0, 0), true]]),
				fluids: new Map<CFrame, boolean>(),
			},
			outputs: {
				solids: new Map<CFrame, boolean>(),
				fluids: new Map<CFrame, boolean>(),
			},
			connections: new Map<CFrame, boolean>(),
		},
		priority: 0,
	},
	//#endregion
	//#region Power
	"Solar Panel": {
		category: "Power",
		subcategory: "Renewables",
		index: 0,
		image: IMAGES["Conveyor"],
		description: "Converts sunlight into clean, reliable electrical power.",
		cost: 1,

		tags: ["SolarPanel"],
		constants: {
			PowerProduction: 8,
		},
		attributes: {},
		maxElevation: 0,
		nodes: {
			cells: [new Vector3(0, 0, 0)],
			inputs: {
				solids: new Map<CFrame, boolean>(),

				fluids: new Map<CFrame, boolean>(),
			},
			outputs: {
				solids: new Map<CFrame, boolean>(),
				fluids: new Map<CFrame, boolean>(),
			},
			connections: new Map<CFrame, boolean>(),
		},
		priority: 0,
	},

	"Wind Turbine": {
		category: "Power",
		subcategory: "Renewables",
		index: 1,
		image: IMAGES["Conveyor"],
		description: "Generates continuous power by harnessing wind energy.",
		cost: 1,

		tags: ["WindTurbine"],
		constants: {
			PowerProduction: 30,
		},
		attributes: {},
		maxElevation: 0,
		nodes: {
			cells: [new Vector3(0, -16, 0)],
			inputs: {
				solids: new Map<CFrame, boolean>(),
				fluids: new Map<CFrame, boolean>(),
			},
			outputs: {
				solids: new Map<CFrame, boolean>(),
				fluids: new Map<CFrame, boolean>(),
			},
			connections: new Map<CFrame, boolean>(),
		},
		priority: 0,
	},

	"Hand-Crank": {
		category: "Power",
		subcategory: "Renewables",
		index: 2,
		image: IMAGES["Conveyor"],
		description: "Generates small amounts of power through manual rotation.",
		cost: 1,

		tags: ["HandCrank"],
		constants: {
			PowerProduction: 15,
		},
		attributes: {},
		maxElevation: 0,
		nodes: {
			cells: [new Vector3(0, 0, 0)],
			inputs: {
				solids: new Map<CFrame, boolean>(),
				fluids: new Map<CFrame, boolean>(),
			},
			outputs: {
				solids: new Map<CFrame, boolean>(),
				fluids: new Map<CFrame, boolean>(),
			},
			connections: new Map<CFrame, boolean>(),
		},

		priority: 0,
	},

	Boiler: {
		category: "Power",
		subcategory: "Non-Renewables",
		index: 0,
		image: IMAGES["Conveyor"],
		description: "Burns coal to boil water to produce power.",
		cost: 1,

		tags: ["Manufacturer", "IndicatorLight"],
		constants: {},
		attributes: {
			Recipe: "Steam",
		},
		maxElevation: 0,
		nodes: {
			cells: [new Vector3(-2, 0, 2), new Vector3(-2, 0, -2), new Vector3(2, 0, -2), new Vector3(2, 0, 2)],
			inputs: {
				solids: new Map<CFrame, boolean>([[new CFrame(-2, 0, 2, 0, 1, 0, 0, 0, -1, -1, 0, 0), true]]),
				fluids: new Map<CFrame, boolean>([[new CFrame(2, 0, 2, 0, 1, 0, 0, 0, -1, -1, 0, 0), true]]),
			},
			outputs: {
				solids: new Map<CFrame, boolean>(),
				fluids: new Map<CFrame, boolean>([[new CFrame(2, 0, -6, 0, 1, 0, 0, 0, -1, -1, 0, 0), true]]),
			},
			connections: new Map<CFrame, boolean>(),
		},
		priority: 0,
	},

	"Coal Generator": {
		category: "Power",
		subcategory: "Non-Renewables",
		index: 1,
		image: IMAGES["Conveyor"],
		description: "Burns coal to boil water to produce power.",
		cost: 1,

		tags: ["CoalGenerator", "IndicatorLight"],
		constants: {
			FluidCapacity: 50,
			PowerProduction: 75,
		},
		attributes: {},
		maxElevation: 0,
		nodes: {
			cells: [
				new Vector3(0, 0, 0),
				new Vector3(4, 0, 0),
				new Vector3(-4, 0, 0),
				new Vector3(0, 0, 4),
				new Vector3(0, 0, -4),
				new Vector3(4, 0, 4),
				new Vector3(-4, 0, 4),
				new Vector3(4, 0, -4),
				new Vector3(-4, 0, -4),
			],
			inputs: {
				solids: new Map<CFrame, boolean>([[new CFrame(-4, 0, 4, 0, 1, 0, 0, 0, -1, -1, 0, 0), true]]),
				fluids: new Map<CFrame, boolean>([[new CFrame(4, 0, 4, 0, 1, 0, 0, 0, -1, -1, 0, 0), true]]),
			},
			outputs: {
				solids: new Map<CFrame, boolean>(),
				fluids: new Map<CFrame, boolean>(),
			},
			connections: new Map<CFrame, boolean>(),
		},
		priority: 0,
	},

	"Power Line": {
		category: "Power",
		subcategory: "Power Poles",
		index: 0,
		image: IMAGES["Conveyor"],
		description: "Transfers electrical power between connected structures.",
		cost: 0,

		tags: [],
		constants: {},
		attributes: {},
		maxElevation: 0,
		nodes: {
			cells: [],
			inputs: {
				solids: new Map<CFrame, boolean>(),
				fluids: new Map<CFrame, boolean>(),
			},
			outputs: {
				solids: new Map<CFrame, boolean>(),
				fluids: new Map<CFrame, boolean>(),
			},
			connections: new Map<CFrame, boolean>(),
		},
		priority: 0,
	},

	"Power Pole": {
		category: "Power",
		subcategory: "Power Poles",
		index: 1,
		image: IMAGES["Conveyor"],
		description: "Extends the power network to supply nearby buildings.",
		cost: 1,

		tags: [],
		constants: {
			MaxConnections: 5,
		},
		attributes: {},
		maxElevation: 0,
		nodes: {
			cells: [new Vector3(0, -6, 0)],
			inputs: {
				solids: new Map<CFrame, boolean>(),
				fluids: new Map<CFrame, boolean>(),
			},
			outputs: {
				solids: new Map<CFrame, boolean>(),
				fluids: new Map<CFrame, boolean>(),
			},
			connections: new Map<CFrame, boolean>(),
		},
		priority: 0,
	},

	"Power Switch": {
		category: "Power",
		subcategory: "Power Poles",
		index: 2,
		image: IMAGES["Conveyor"],
		description: "Manually controls power flow between connected circuits.",
		cost: 1,

		tags: ["PowerSwitch"],
		constants: {},
		attributes: {
			On: false,
		},
		maxElevation: 0,
		nodes: {
			cells: [new Vector3(0, -6, 0)],
			inputs: {
				solids: new Map<CFrame, boolean>(),
				fluids: new Map<CFrame, boolean>(),
			},
			outputs: {
				solids: new Map<CFrame, boolean>(),
				fluids: new Map<CFrame, boolean>(),
			},
			connections: new Map<CFrame, boolean>(),
		},
		priority: 0,
	},
	//#endregion
};
