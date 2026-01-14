import { HttpService } from "@rbxts/services";
import { IMAGES } from "shared/assets/images";
import { MODELS } from "shared/assets/models";
import { StructureDefinition } from "./types";

export const STRUCTURES: Record<string, StructureDefinition> = {
	//#region Logistics
	Transporter: {
		category: "Logistics",
		subcategory: "Conveyor Belts",
		index: undefined,
		image: "",
		description: "",
		cost: 20,

		model: MODELS["Transporter"],
		tags: ["Transporter"],
		constants: {
			ThroughputRate: 300,
		},
		attributes: {},
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
			railway: [],
		},
		priority: 0,
	},

	Conveyor: {
		category: "Logistics",
		subcategory: "Conveyor Belts",
		index: 0,
		image: IMAGES.ui["Conveyor"],
		description: "Transports items forward at a steady rate, keeping production lines flowing smoothly.",
		cost: 20,

		model: MODELS["Conveyor"],
		tags: ["Transporter"],
		constants: {
			ThroughputRate: 300,
		},
		attributes: {},
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
			railway: [],
		},
		priority: 0,
	},

	"Left Turn Conveyor": {
		category: "Logistics",
		subcategory: "Conveyor Belts",
		index: 1,
		image: IMAGES.ui["Conveyor"],
		description: "Redirects items 90° to the left while maintaining consistent movement and flow.",
		cost: 20,

		model: MODELS["Left Turn Conveyor"],
		tags: ["Transporter"],
		constants: {
			ThroughputRate: 300,
		},
		attributes: {},
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
			railway: [],
		},
		priority: 0,
	},

	"Right Turn Conveyor": {
		category: "Logistics",
		subcategory: "Conveyor Belts",
		index: 2,
		image: IMAGES.ui["Conveyor"],
		description: "Redirects items 90° to the right while maintaining consistent movement and flow.",
		cost: 20,

		model: MODELS["Right Turn Conveyor"],
		tags: ["Transporter"],
		constants: {
			ThroughputRate: 300,
		},
		attributes: {},
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
			railway: [],
		},
		priority: 0,
	},

	"Underground Conveyor": {
		category: "Logistics",
		subcategory: "Conveyor Belts",
		index: 3,
		image: IMAGES.ui["Conveyor"],
		description: "Transfers items underground to bypass obstacles and crowded production areas.",
		cost: 0,

		model: MODELS["Underground Conveyor"],
		tags: [],
		constants: {},
		attributes: {},
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
			railway: [],
		},
		priority: 0,
	},

	"Underground Conveyor Input": {
		category: "Logistics",
		subcategory: "Conveyor Belts",
		index: undefined,
		image: "",
		description: "",
		cost: 60,

		model: MODELS["Underground Conveyor Input"],
		tags: ["LinkedTransporterInput"],
		constants: {
			ThroughputRate: 300,
		},
		attributes: {},
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
			railway: [],
		},
		priority: 0,
	},

	"Underground Conveyor Output": {
		category: "Logistics",
		subcategory: "Conveyor Belts",
		index: undefined,
		image: "",
		description: "",
		cost: 60,

		model: MODELS["Underground Conveyor Output"],
		tags: ["LinkedTransporterOutput"],
		constants: {
			ThroughputRate: 300,
		},
		attributes: {},
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
			railway: [],
		},
		priority: 0,
	},

	"Conveyor Lift": {
		category: "Logistics",
		subcategory: "Conveyor Belts",
		index: 4,
		image: IMAGES.ui["Conveyor"],
		description: "Moves items vertically to connect production lines across different heights.",
		cost: 0,

		model: MODELS["Conveyor Lift"],
		tags: [],
		constants: {},
		attributes: {},
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
			railway: [],
		},
		priority: 0,
	},

	"Conveyor Lift Input": {
		category: "Logistics",
		subcategory: "Conveyor Belts",
		index: undefined,
		image: "",
		description: "",
		cost: 80,

		model: MODELS["Conveyor Lift Input"],
		tags: ["LinkedTransporterInput"],
		constants: {
			ThroughputRate: 300,
		},
		attributes: {},
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
			railway: [],
		},
		priority: 0,
	},

	"Conveyor Lift Elevator": {
		category: "Logistics",
		subcategory: "Conveyor Belts",
		index: undefined,
		image: "",
		description: "",
		cost: 0,

		model: MODELS["Conveyor Lift Elevator"],
		tags: [],
		constants: {},
		attributes: {},
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
			railway: [],
		},
		priority: 0,
	},

	"Conveyor Lift Output": {
		category: "Logistics",
		subcategory: "Conveyor Belts",
		index: undefined,
		image: "",
		description: "",
		cost: 80,

		model: MODELS["Conveyor Lift Output"],
		tags: ["LinkedTransporterOutput"],
		constants: {
			ThroughputRate: 300,
		},
		attributes: {},
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
			railway: [],
		},
		priority: 0,
	},

	"Conveyor Throughput Counter": {
		category: "Logistics",
		subcategory: "Conveyor Belts",
		index: 5,
		image: IMAGES.ui["Conveyor"],
		description: "AAAA",
		cost: 80,

		model: MODELS["Conveyor Throughput Counter"],
		tags: ["Transporter", "ThroughputCounter"],
		constants: {
			ThroughputRate: 300,
		},
		attributes: {},
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
			railway: [],
		},
		priority: 0,
	},

	"Fluid Transporter": {
		category: "Logistics",
		subcategory: "Pipelines",
		index: undefined,
		image: "",
		description: "",
		cost: 30,

		model: MODELS["Fluid Transporter"],
		tags: ["Transporter"],
		constants: {
			FlowRate: 300,
			FluidCapacity: 6,
		},
		attributes: {},
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
			railway: [],
		},
		priority: 0,
	},

	Pipeline: {
		category: "Logistics",
		subcategory: "Pipelines",
		index: 0,
		image: IMAGES.ui["Conveyor"],
		description: "Moves fluids forward at a constant rate, supporting stable industrial flow.",
		cost: 30,

		model: MODELS["Pipeline"],
		tags: ["Transporter"],
		constants: {
			FlowRate: 300,
			FluidCapacity: 6,
		},
		attributes: {},
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
			railway: [],
		},
		priority: 0,
	},

	"Pipeline Turn": {
		category: "Logistics",
		subcategory: "Pipelines",
		index: 1,
		image: IMAGES.ui["Conveyor"],
		description: "Redirects fluid flow by 90°, enabling compact and flexible pipe layouts.",
		cost: 30,

		model: MODELS["Pipeline Turn"],
		tags: ["Transporter"],
		constants: {
			FlowRate: 300,
			FluidCapacity: 6,
		},
		attributes: {},
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
			railway: [],
		},
		priority: 0,
	},

	"Pipeline Junction": {
		category: "Logistics",
		subcategory: "Pipelines",
		image: IMAGES.ui["Conveyor"],
		index: 2,
		description: "Splits or combines fluid streams to efficiently distribute resources.",
		cost: 30,

		model: MODELS["Pipeline Junction"],
		tags: ["Transporter"],
		constants: {
			FlowRate: 300,
			FluidCapacity: 6,
		},
		attributes: {},
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
			railway: [],
		},
		priority: 0,
	},

	"Underground Pipeline": {
		category: "Logistics",
		subcategory: "Pipelines",
		index: 3,
		image: IMAGES.ui["Conveyor"],
		description: "Transfers fluids underground to avoid surface obstacles and congestion.",
		cost: 0,

		model: MODELS["Underground Pipeline"],
		tags: [],
		constants: {},
		attributes: {},
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
			railway: [],
		},
		priority: 0,
	},

	"Underground Pipeline Input": {
		category: "Logistics",
		subcategory: "Pipelines",
		index: undefined,
		image: "",
		description: "",
		cost: 70,

		model: MODELS["Underground Pipeline Input"],
		tags: ["LinkedTransporterInput"],
		constants: {
			FlowRate: 300,
			FluidCapacity: 6,
		},
		attributes: {},
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
			railway: [],
		},
		priority: 0,
	},

	"Underground Pipeline Output": {
		category: "Logistics",
		subcategory: "Pipelines",
		index: undefined,
		image: "",
		description: "",
		cost: 70,

		model: MODELS["Underground Pipeline Output"],
		tags: ["LinkedTransporterOutput"],
		constants: {
			FlowRate: 300,
			FluidCapacity: 6,
		},
		attributes: {},
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
			railway: [],
		},
		priority: 0,
	},

	Merger: {
		category: "Logistics",
		subcategory: "Sorting",
		index: 0,
		image: IMAGES.ui["Conveyor"],
		description: "Combines multiple item streams into a single, continuous output line.",
		cost: 100,

		model: MODELS.Merger,
		tags: ["Merger"],
		constants: {
			ThroughputRate: 300,
		},
		attributes: {},
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
			railway: [],
		},
		priority: 1,
	},

	"Priority Merger": {
		category: "Logistics",
		subcategory: "Sorting",
		index: 1,
		image: IMAGES.ui["Conveyor"],
		description: "Merges item streams while prioritizing selected inputs when congested.",
		cost: 500,
		gamepass: 1546305404,

		model: MODELS["Priority Merger"],
		tags: ["PriorityMerger"],
		constants: {
			ThroughputRate: 300,
		},
		attributes: {
			Left: "Low",
			Backward: "Low",
			Right: "Low",
		},
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
			railway: [],
		},
		priority: 1,
	},

	Splitter: {
		category: "Logistics",
		subcategory: "Sorting",
		index: 2,
		image: IMAGES.ui["Conveyor"],
		description: "Divides incoming items evenly across multiple output paths.",
		cost: 150,

		model: MODELS.Splitter,
		tags: ["Splitter"],
		constants: {
			ThroughputRate: 300,
		},
		attributes: {},
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
			railway: [],
		},
		priority: 1,
	},

	"Smart Splitter": {
		category: "Logistics",
		subcategory: "Sorting",
		index: 3,
		image: IMAGES.ui["Conveyor"],
		description: "Sorts items using filters to direct them to specific outputs.",
		cost: 500,

		model: MODELS["Smart Splitter"],
		tags: ["SmartSplitter"],
		constants: {
			ThroughputRate: 300,
		},
		attributes: {
			Left: "Any",
			Forward: "Any",
			Right: "Any",
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
			railway: [],
		},
		priority: 1,
	},

	"Programmable Splitter": {
		category: "Logistics",
		subcategory: "Sorting",
		index: 4,
		image: IMAGES.ui["Conveyor"],
		description: "Sorts items using advanced, customizable filtering logic.",
		cost: 2250,
		gamepass: 1546149382,

		model: MODELS["Programmable Splitter"],
		tags: ["ProgrammableSplitter"],
		constants: {
			ThroughputRate: 300,
		},
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
			railway: [],
		},
		priority: 1,
	},

	"Delivery Dock": {
		image: IMAGES.ui["Conveyor"],
		category: "Logistics",
		index: 0,
		subcategory: "Miscellaneous",
		description: "Accepts delivered items to progress by producing money.",
		cost: 17500,

		model: MODELS["Delivery Dock"],
		tags: ["DeliveryDock"],
		constants: {},
		attributes: {},
		nodes: {
			cells: [
				new Vector3(-6, -3, -6),
				new Vector3(2, -3, 6),
				new Vector3(-2, -3, 2),
				new Vector3(-2, -3, -2),
				new Vector3(-6, -3, -2),
				new Vector3(2, -3, -6),
				new Vector3(-2, -3, 6),
				new Vector3(2, -3, -2),
				new Vector3(6, -3, 2),
				new Vector3(6, -3, 6),
				new Vector3(-2, -3, -6),
				new Vector3(6, -3, -6),
				new Vector3(6, -3, -2),
				new Vector3(-6, -3, 6),
				new Vector3(2, -3, 2),
				new Vector3(-6, -3, 2),
			],
			inputs: {
				solids: new Map<CFrame, boolean>([
					[new CFrame(-6, -3, -6, 0, -1, 0, 0, 0, -1, 1, 0, 0), true],
					[new CFrame(6, -3, -6, 0, -1, 0, 0, 0, -1, 1, 0, 0), true],
					[new CFrame(-6, -3, 6, 0, 1, 0, 0, 0, -1, -1, 0, 0), true],
					[new CFrame(-2, -3, -6, 0, -1, 0, 0, 0, -1, 1, 0, 0), true],
					[new CFrame(-6, -3, 2, 1, 0, 0, 0, 0, -1, 0, 1, 0), true],
					[new CFrame(2, -3, -6, 0, -1, 0, 0, 0, -1, 1, 0, 0), true],
					[new CFrame(6, -3, -2, -1, 0, 0, 0, 0, -1, 0, -1, -0), true],
					[new CFrame(-2, -3, 6, 0, 1, 0, 0, 0, -1, -1, 0, 0), true],
					[new CFrame(-6, -3, 6, 1, 0, 0, 0, 0, -1, 0, 1, 0), true],
					[new CFrame(2, -3, 6, 0, 1, 0, 0, 0, -1, -1, 0, 0), true],
					[new CFrame(6, -3, 6, 0, 1, 0, 0, 0, -1, -1, 0, 0), true],
					[new CFrame(-6, -3, -2, 1, 0, 0, 0, 0, -1, 0, 1, 0), true],
					[new CFrame(6, -3, 2, -1, 0, 0, 0, 0, -1, 0, -1, -0), true],
					[new CFrame(6, -3, -6, -1, 0, 0, 0, 0, -1, 0, -1, -0), true],
					[new CFrame(6, -3, 6, -1, 0, 0, 0, 0, -1, 0, -1, -0), true],
					[new CFrame(-6, -3, -6, 1, 0, 0, 0, 0, -1, 0, 1, 0), true],
				]),
				fluids: new Map<CFrame, boolean>(),
			},
			outputs: {
				solids: new Map<CFrame, boolean>(),

				fluids: new Map<CFrame, boolean>(),
			},
			connections: new Map<CFrame, boolean>(),
			railway: [],
		},
		priority: 0,
	},
	//#endregion

	//#region Production
	Miner: {
		category: "Production",
		subcategory: "Extractors",
		index: 0,
		image: IMAGES.ui["Conveyor"],
		description: "Automatically extracts solid resources from nearby resource deposits.",
		cost: 200,

		model: MODELS.Miner,
		tags: ["Miner", "IndicatorLight"],
		constants: {
			ThroughputRate: 300,
			PowerConsumption: 6,
		},
		attributes: {
			Recipe: undefined,
		},
		nodes: {
			cells: [new Vector3(0, 0, -4), new Vector3(0, 0, 0)],
			inputs: {
				solids: new Map<CFrame, boolean>(),
				fluids: new Map<CFrame, boolean>(),
			},
			outputs: {
				solids: new Map<CFrame, boolean>([[new CFrame(0, 0, -8, 0, 1, 0, 0, 0, -1, -1, 0, 0), true]]),
				fluids: new Map<CFrame, boolean>(),
			},
			connections: new Map<CFrame, boolean>(),
			railway: [],
		},
		priority: 2,
	},

	"Water Extractor": {
		category: "Production",
		subcategory: "Extractors",
		index: 1,
		image: IMAGES.ui["Conveyor"],
		description: "Pumps water from natural sources for industrial and manufacturing use.",
		cost: 250,

		model: MODELS["Water Extractor"],
		tags: ["FluidExtractor", "IndicatorLight"],
		constants: {
			FlowRate: 600,
			FluidCapacity: 200,
			PowerConsumption: 15,
		},
		attributes: {},
		nodes: {
			cells: [new Vector3(0, 0, -4), new Vector3(0, 0, 0)],
			inputs: {
				solids: new Map<CFrame, boolean>(),

				fluids: new Map<CFrame, boolean>(),
			},
			outputs: {
				solids: new Map<CFrame, boolean>(),
				fluids: new Map<CFrame, boolean>([[new CFrame(0, 0, -8, 0, 1, 0, 0, 0, -1, -1, 0, 0), true]]),
			},
			connections: new Map<CFrame, boolean>(),
			railway: [],
		},
		priority: 0,
	},

	Smelter: {
		category: "Production",
		subcategory: "Smelters",
		index: 0,
		image: IMAGES.ui["Conveyor"],
		description: "Refines raw ores into usable metal ingots for production chains.",
		cost: 225,

		model: MODELS.Smelter,
		tags: ["Manufacturer", "IndicatorLight"],
		constants: {
			ThroughputRate: 300,
			PowerConsumption: 5,
		},
		attributes: {
			Recipe: undefined,
		},
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
			railway: [],
		},
		priority: 2,
	},

	"Blast Furnace": {
		category: "Production",
		subcategory: "Smelters",
		index: 1,
		image: IMAGES.ui["Conveyor"],
		description: "Refines raw ores into usable metal ingots for production chains.",
		cost: 225,

		model: MODELS["Blast Furnace"],
		tags: ["Manufacturer", "IndicatorLight"],
		constants: {
			ThroughputRate: 300,
			PowerConsumption: 5,
		},
		attributes: {
			Recipe: undefined,
		},
		nodes: {
			cells: [new Vector3(-2, 0, 2), new Vector3(2, 0, 2), new Vector3(2, 0, -2), new Vector3(-2, 0, -2)],
			inputs: {
				solids: new Map<CFrame, boolean>([
					[new CFrame(2, 0, 4, 0, 1, 0, 0, 0, -1, -1, 0, 0), true],
					[new CFrame(-2, 0, 4, 0, 1, 0, 0, 0, -1, -1, 0, 0), true],
				]),
				fluids: new Map<CFrame, boolean>(),
			},
			outputs: {
				solids: new Map<CFrame, boolean>([[new CFrame(2, 0, -8, 0, 1, 0, 0, 0, -1, -1, 0, 0), true]]),
				fluids: new Map<CFrame, boolean>(),
			},
			connections: new Map<CFrame, boolean>(),
			railway: [],
		},
		priority: 2,
	},

	Constructor: {
		category: "Production",
		subcategory: "Manufacturers",
		index: 0,
		image: IMAGES.ui["Conveyor"],
		description: "Converts input materials into crafted components using selected recipes.",
		cost: 400,

		model: MODELS.Constructor,
		tags: ["Manufacturer", "IndicatorLight"],
		constants: {
			ThroughputRate: 300,
			PowerConsumption: 20,
		},
		attributes: {
			Recipe: undefined,
		},
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
			railway: [],
		},

		priority: 2,
	},

	Assembler: {
		category: "Production",
		subcategory: "Manufacturers",
		index: 1,
		image: IMAGES.ui["Conveyor"],
		description: "Combines refined materials to produce advanced industrial components.",
		cost: 700,

		model: MODELS.Assembler,
		tags: ["Manufacturer", "IndicatorLight"],

		constants: {
			ThroughputRate: 300,
			PowerConsumption: 50,
		},
		attributes: {
			Recipe: undefined,
		},
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
			railway: [],
		},
		priority: 2,
	},

	Refinery: {
		category: "Production",
		subcategory: "Manufacturers",
		index: 2,
		image: IMAGES.ui["Conveyor"],
		description: "Processes solid and liquid inputs into refined or composite resources.",
		cost: 1250,

		model: MODELS.Refinery,
		tags: ["Manufacturer", "IndicatorLight"],
		constants: {
			ThroughputRate: 300,
			FlowRate: 600,
			PowerConsumption: 5,
		},
		attributes: {
			Recipe: undefined,
		},
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
			railway: [],
		},
		priority: 2,
	},

	Blender: {
		category: "Production",
		subcategory: "Manufacturers",
		index: 3,
		image: IMAGES.ui["Conveyor"],
		description: "Processes solid and liquid inputs into refined or composite resources.",
		cost: 1250,

		model: MODELS.Blender,
		tags: ["Manufacturer", "IndicatorLight"],
		constants: {
			ThroughputRate: 300,
			FlowRate: 600,
			PowerConsumption: 5,
		},
		attributes: {
			Recipe: undefined,
		},
		nodes: {
			cells: [
				new Vector3(6, 0, -6),
				new Vector3(6, 0, 6),
				new Vector3(6, 0, -2),
				new Vector3(-6, 0, -2),
				new Vector3(-2, 0, -6),
				new Vector3(-2, 0, 2),
				new Vector3(2, 0, 6),
				new Vector3(-2, 0, -2),
				new Vector3(2, 0, -6),
				new Vector3(2, 0, 2),
				new Vector3(-2, 0, 6),
				new Vector3(-6, 0, 2),
				new Vector3(-6, 0, -6),
				new Vector3(6, 0, 2),
				new Vector3(2, 0, -2),
				new Vector3(-6, 0, 6),
			],
			inputs: {
				solids: new Map<CFrame, boolean>([
					[new CFrame(2, 0, 6, 0, 1, 0, 0, 0, -1, -1, 0, 0), true],
					[new CFrame(6, 0, 6, 0, 1, 0, 0, 0, -1, -1, 0, 0), true],
				]),
				fluids: new Map<CFrame, boolean>([
					[new CFrame(-2, 0, 6, 0, 1, 0, 0, 0, -1, -1, 0, 0), true],
					[new CFrame(-6, 0, 6, 0, 1, 0, 0, 0, -1, -1, 0, 0), true],
				]),
			},
			outputs: {
				solids: new Map<CFrame, boolean>([[new CFrame(6, 0, -10, 0, 1, 0, 0, 0, -1, -1, 0, 0), true]]),
				fluids: new Map<CFrame, boolean>([[new CFrame(-6, 0, -10, 0, 1, 0, 0, 0, -1, -1, 0, 0), true]]),
			},
			connections: new Map<CFrame, boolean>(),
			railway: [],
		},
		priority: 2,
	},

	//#endregion

	//#region Power
	"Hand-Crank": {
		category: "Power",
		subcategory: "Generators",
		index: 0,
		image: IMAGES.ui["Conveyor"],
		description: "Generates small amounts of power through manual rotation.",
		cost: 50,

		model: MODELS["Hand-Crank"],
		tags: ["HandCrank"],
		constants: {
			PowerProduction: 25,
			MaxCrankHandleRotationSpeed: 7,
		},
		attributes: {},
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
			railway: [],
		},

		priority: 0,
	},

	"Solar Panel": {
		category: "Power",
		subcategory: "Generators",
		index: 1,
		image: IMAGES.ui["Conveyor"],
		description: "Converts sunlight into clean, reliable electrical power.",
		cost: 125,

		model: MODELS["Solar Panel"],
		tags: ["SolarPanel"],
		constants: {
			PowerProduction: 20,
		},
		attributes: {},
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
			railway: [],
		},
		priority: 0,
	},

	"Wind Turbine": {
		category: "Power",
		subcategory: "Generators",
		index: 2,
		image: IMAGES.ui["Conveyor"],
		description: "Generates continuous power by harnessing wind energy.",
		cost: 400,

		model: MODELS["Wind Turbine"],
		tags: ["WindTurbine"],
		constants: {
			PowerProduction: 40,
			MaxRotorRotationSpeed: 12,
		},
		attributes: {},
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
			railway: [],
		},
		priority: 0,
	},

	"Coal Generator": {
		category: "Power",
		subcategory: "Generators",
		index: 3,
		image: IMAGES.ui["Conveyor"],
		description: "Burns coal to boil water to produce power.",
		cost: 1250,

		model: MODELS["Coal Generator"],
		tags: ["PowerGenerator", "CoalGenerator", "IndicatorLight"],
		constants: {
			FluidCapacity: 50,
			PowerProduction: 75,
		},
		attributes: {},
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
			railway: [],
		},
		priority: 0,
	},

	"Power Line": {
		category: "Power",
		subcategory: "Power Poles",
		index: 0,
		image: IMAGES.ui["Conveyor"],
		description: "Transfers electrical power between connected structures.",
		cost: 0,

		model: MODELS["Power Line"],
		tags: [],
		constants: {},
		attributes: {},
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
			railway: [],
		},
		priority: 0,
	},

	"Power Pole": {
		category: "Power",
		subcategory: "Power Poles",
		index: 1,
		image: IMAGES.ui["Conveyor"],
		description: "Extends the power network to supply nearby buildings.",
		cost: 85,

		model: MODELS["Power Pole"],
		tags: [],
		constants: {
			MaxConnections: 5,
		},
		attributes: {},
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
			railway: [],
		},
		priority: 0,
	},

	"Power Switch": {
		category: "Power",
		subcategory: "Power Poles",
		index: 2,
		image: IMAGES.ui["Conveyor"],
		description: "Manually controls power flow between connected circuits.",
		cost: 275,

		model: MODELS["Power Switch"],
		tags: ["PowerSwitch"],
		constants: {},
		attributes: {
			On: false,
		},
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
			railway: [],
		},
		priority: 0,
	},
	//#endregion
};
