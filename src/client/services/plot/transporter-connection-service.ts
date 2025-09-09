import { Components } from "@flamework/components";
import { Dependency } from "@flamework/core";
import { StructureName, STRUCTURES } from "shared/constants/structures";
import GridService from "./grid-service";
import { Events } from "client/network";
import { EventBus } from "client/event-bus";
import { Players } from "@rbxts/services";
import OutputComponent from "shared/components/structures/output";
import InputComponent from "shared/components/structures/input";

export default class TransporterConnectionService {
	private readonly gridService: GridService = GridService.getInst();
	private readonly components = Dependency<Components>();

	constructor() {
		EventBus.PlotEvents.OnPlotInitialization.Connect((player) => {
			if (player !== Players.LocalPlayer) return;

			for (const outputComponent of this.components.getAllComponents<OutputComponent>()) {
				this.updateConnections(
					Players.GetPlayerByUserId(
						outputComponent.instance.Parent!.Parent?.GetAttribute("UserId") as number,
					)!,
					outputComponent,
				);
			}

			EventBus.PlotEvents.OnStructuresPlacement.Connect((player, structuresModels) => {
				for (const structureModel of structuresModels) {
					const outputComponent = this.components.getComponent<OutputComponent>(structureModel);
					if (outputComponent !== undefined) {
						this.updateConnections(player, outputComponent);
					}
				}
			});

			Events.OnStructuresMovementStart.connect((structuresModels) => {
				for (const structureModel of structuresModels) {
					const outputComponent = this.components.getComponent<OutputComponent>(structureModel);
					if (outputComponent !== undefined) {
						this.disconnectConnections(outputComponent);
					}
				}
			});

			Events.OnStructuresMovement.connect((player, structuresModels) => {
				for (const structureModel of structuresModels) {
					const outputComponent = this.components.getComponent<OutputComponent>(structureModel);
					if (outputComponent !== undefined) {
						this.updateConnections(player, outputComponent);
					}
				}
			});

			Events.OnStructuresDestroying.connect((structuresModels) => {
				for (const structureModel of structuresModels) {
					const outputComponent = this.components.getComponent<OutputComponent>(structureModel);
					if (outputComponent !== undefined) {
						this.disconnectConnections(outputComponent);
					}
				}
			});
		});
	}

	private updateConnections(player: Player, outputComponent: OutputComponent) {
		const structureDefinition = STRUCTURES[outputComponent.instance.Name as StructureName];
		const structureGridPart = outputComponent.instance.WaitForChild("GridPart") as Part;
		const structureCellsNodesLocalPositions = structureDefinition.nodes.cells;

		const structuresOutputsComponents = new Set<OutputComponent>();
		if (!outputComponent.isFullyConnected()) {
			structuresOutputsComponents.add(outputComponent);
		}
		for (const structureCellNodeLocalPosition of structureCellsNodesLocalPositions) {
			const structureCellNodeWorldPosition =
				structureGridPart.CFrame.PointToWorldSpace(structureCellNodeLocalPosition);
			const cellNodeWorldPositionCellNeighbors = this.gridService.getNeighborsCells(
				player,
				structureCellNodeWorldPosition,
			);
			for (const cellNodeWorldPositionCellNeighbor of cellNodeWorldPositionCellNeighbors) {
				const structureModel = cellNodeWorldPositionCellNeighbor.structureModel;
				if (structureModel === undefined) continue;
				const outputComponent = this.components.getComponent<OutputComponent>(structureModel);
				if (outputComponent && !outputComponent.isFullyConnected()) {
					structuresOutputsComponents.add(outputComponent);
				}
			}
		}

		for (const outputComponent of structuresOutputsComponents) {
			const structureDefinition = STRUCTURES[outputComponent.instance.Name as StructureName];
			const structureGridPart = outputComponent.instance.WaitForChild("GridPart") as Part;
			const structureOutputsNodesLocalCFs = structureDefinition.nodes.outputs;
			for (const structureOutputNodeLocalCF of structureOutputsNodesLocalCFs) {
				const structureOutputNodeWorldCF = structureGridPart.CFrame.mul(structureOutputNodeLocalCF);
				const outputNodeWorldCell = this.gridService.getCellAtWorldPosition(
					player,
					structureOutputNodeWorldCF.Position,
				);
				if (outputNodeWorldCell === undefined || outputNodeWorldCell.structureModel === undefined) continue;
				const inputStructureModel = outputNodeWorldCell.structureModel;
				const inputComponent = this.components.getComponent<InputComponent>(inputStructureModel);
				if (inputComponent === undefined || inputComponent.isFullyConnected()) continue;
				const cellStructureGridPart = inputStructureModel.WaitForChild("GridPart") as Part;
				const cellStructureModelDefinition = STRUCTURES[inputStructureModel.Name as StructureName];
				const cellStructureInputsNodesLocalCFs = cellStructureModelDefinition.nodes.inputs;

				for (const cellStructureInputNodeLocalCF of cellStructureInputsNodesLocalCFs) {
					const cellStructureInputNodeWorldCF =
						cellStructureGridPart.CFrame.mul(cellStructureInputNodeLocalCF);
					if (
						structureOutputNodeWorldCF.Position.FuzzyEq(cellStructureInputNodeWorldCF.Position) &&
						structureOutputNodeWorldCF.RightVector.Dot(cellStructureInputNodeWorldCF.RightVector) === 1
					) {
						outputComponent.connect(cellStructureInputNodeWorldCF, inputComponent);
						inputComponent.connect(structureOutputNodeWorldCF, outputComponent);
						break;
					}
				}
			}
		}
	}

	private disconnectConnections(outputComponent: OutputComponent) {
		for (const [inputNodeWorldCF, connectedInputComponent] of outputComponent.getConnectedInputs()) {
			const connectedOutputs = connectedInputComponent.getConnectedOutputs();
			for (const [outputNodeWorldCF, connectedOutputComponent] of connectedOutputs) {
				if (connectedOutputComponent === outputComponent) {
					connectedInputComponent.disconnect(outputNodeWorldCF);
				}
			}
			outputComponent.disconnect(inputNodeWorldCF);
		}

		const inputComponent = this.components.getComponent<InputComponent>(outputComponent.instance);
		if (inputComponent !== undefined) {
			for (const [outputNodeWorldCF, connectedOutputComponent] of inputComponent.getConnectedOutputs()) {
				const connectedInputs = connectedOutputComponent.getConnectedInputs();
				for (const [inputNodeWorldCF, connectedInputComponent] of connectedInputs) {
					if (connectedInputComponent === inputComponent) {
						connectedOutputComponent.disconnect(inputNodeWorldCF);
					}
				}
				inputComponent.disconnect(outputNodeWorldCF);
			}
		}
	}
}
