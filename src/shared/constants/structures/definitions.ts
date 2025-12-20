import { HttpService } from "@rbxts/services";
import { IMAGES } from "shared/assets/images";
import { MODELS } from "shared/assets/models";
import { StructureDefinition } from "./types";

export const STRUCTURES: Record<string, StructureDefinition> = {
	//#region Logistics
	Transporter: {
		index: undefined,
		category: "Logistics",
		subCategory: "Conveyor Belts",
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
		index: 0,
		category: "Logistics",
		subCategory: "Conveyor Belts",
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
		index: 1,
		category: "Logistics",
		subCategory: "Conveyor Belts",
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
		index: 2,
		category: "Logistics",
		subCategory: "Conveyor Belts",
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
		index: 3,
		category: "Logistics",
		subCategory: "Conveyor Belts",
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
		index: undefined,
		category: "Logistics",
		subCategory: "Conveyor Belts",
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
		index: undefined,
		category: "Logistics",
		subCategory: "Conveyor Belts",
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
		index: 4,
		category: "Logistics",
		subCategory: "Conveyor Belts",
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
		index: undefined,
		category: "Logistics",
		subCategory: "Conveyor Belts",
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
		index: undefined,
		category: "Logistics",
		subCategory: "Conveyor Belts",
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
		index: undefined,
		category: "Logistics",
		subCategory: "Conveyor Belts",
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

	"Fluid Transporter": {
		index: undefined,
		category: "Logistics",
		subCategory: "Pipelines",
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
		index: 0,
		category: "Logistics",
		subCategory: "Pipelines",
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
		index: 1,
		category: "Logistics",
		subCategory: "Pipelines",
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
		index: 3,
		category: "Logistics",
		subCategory: "Pipelines",
		image: IMAGES.ui["Conveyor"],
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
		index: 4,
		category: "Logistics",
		subCategory: "Pipelines",
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
		index: undefined,
		category: "Logistics",
		subCategory: "Pipelines",
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
		index: undefined,
		category: "Logistics",
		subCategory: "Pipelines",
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
		index: 0,
		category: "Logistics",
		subCategory: "Sorting",
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
		index: 1,
		category: "Logistics",
		subCategory: "Sorting",
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
			LeftInput: "Low",
			BackwardInput: "Low",
			RightInput: "Low",
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
		index: 2,
		category: "Logistics",
		subCategory: "Sorting",
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
		index: 3,
		category: "Logistics",
		subCategory: "Sorting",
		image: IMAGES.ui["Conveyor"],
		description: "Sorts items using filters to direct them to specific outputs.",
		cost: 500,

		model: MODELS["Smart Splitter"],
		tags: ["SmartSplitter"],
		constants: {
			ThroughputRate: 300,
		},
		attributes: {
			LeftOutput: "Any",
			ForwardOutput: "Any",
			RightOutput: "Any",
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
		index: 4,
		category: "Logistics",
		subCategory: "Sorting",
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
			LeftOutput: HttpService.JSONEncode(["Any"]),
			ForwardOutput: HttpService.JSONEncode(["Any"]),
			RightOutput: HttpService.JSONEncode(["Any"]),
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
		index: 0,
		image: IMAGES.ui["Conveyor"],
		category: "Logistics",
		subCategory: "Miscellaneous",
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
		index: 0,
		category: "Production",
		subCategory: "Extractors",
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
		index: 1,
		category: "Production",
		subCategory: "Extractors",
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
		index: 0,
		category: "Production",
		subCategory: "Processors",
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

	Constructor: {
		index: 0,
		category: "Production",
		subCategory: "Manufacturers",
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
		index: 1,
		category: "Production",
		subCategory: "Manufacturers",
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
		index: 2,
		category: "Production",
		subCategory: "Manufacturers",
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
	//#endregion

	//#region Power
	"Hand-Crank": {
		index: 0,
		category: "Power",
		subCategory: "Generators",
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
		index: 1,
		category: "Power",
		subCategory: "Generators",
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
		index: 2,
		category: "Power",
		subCategory: "Generators",
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

	"Power Line": {
		index: 0,
		category: "Power",
		subCategory: "Power Poles",
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
		index: 1,
		category: "Power",
		subCategory: "Power Poles",
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
		index: 2,
		category: "Power",
		subCategory: "Power Poles",
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
