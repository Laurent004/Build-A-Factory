import { Components } from "@flamework/components";
import { Dependency, OnStart, Service } from "@flamework/core";
import {
	getStructureCellsNodesWorldPositions,
	getStructureInputsNodesWorldCFs,
	getStructureOutputsNodesWorldCFs,
} from "shared/constants/structures";
import OutputComponent from "shared/components/structures/output";
import InputComponent from "shared/components/structures/input";
import { Events } from "server/network";
import { Players } from "@rbxts/services";
import GridService from "./grid-service";
import { EventBus } from "server/event-bus";

@Service({})
export default class TransporterConnectionService implements OnStart {
	private readonly components = Dependency<Components>();
	constructor(private readonly gridService: GridService) {}

	onStart(): void {
		this.initEvents();
	}

	private initEvents() {
		this.components.onComponentAdded<OutputComponent>((outputComponent, instance) => {
			this.updateConnections(
				Players.GetPlayerByUserId(instance.Parent!.Parent!.GetAttribute("UserId") as number)!,
				outputComponent,
			);
		});

		Events.StartStructuresMovement.connect((_, structuresModels) => {
			for (const structureModel of structuresModels) {
				const outputComponent = this.components.getComponent<OutputComponent>(structureModel);
				if (outputComponent !== undefined) {
					this.disconnectConnections(outputComponent);
				}
			}
		});

		EventBus.OnStructureMovement.Connect((player, structuresModels) => {
			for (const structureModel of structuresModels) {
				const outputComponent = this.components.getComponent<OutputComponent>(structureModel);
				if (outputComponent !== undefined) {
					this.updateConnections(player, outputComponent);
				}
			}
		});

		Events.DestroyStructures.connect((_, structuresModels) => {
			for (const structureModel of structuresModels) {
				const outputComponent = this.components.getComponent<OutputComponent>(structureModel);
				if (outputComponent !== undefined) {
					this.disconnectConnections(outputComponent);
				}
			}
		});
	}

	private updateConnections(player: Player, outputComponent: OutputComponent) {
		const structuresOutputsComponents = new Set<OutputComponent>();
		if (!outputComponent.isFullyConnected()) {
			structuresOutputsComponents.add(outputComponent);
		}
		for (const structureCellNodeWorldPosition of getStructureCellsNodesWorldPositions(outputComponent.instance)) {
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
			for (const structureOutputNodeWorldCF of getStructureOutputsNodesWorldCFs(outputComponent.instance)) {
				const outputNodeWorldCell = this.gridService.getCellAtWorldPosition(
					player,
					structureOutputNodeWorldCF.Position,
				);
				if (outputNodeWorldCell === undefined || outputNodeWorldCell.structureModel === undefined) continue;
				const inputStructureModel = outputNodeWorldCell.structureModel;
				const inputComponent = this.components.getComponent<InputComponent>(inputStructureModel);
				if (inputComponent === undefined || inputComponent.isFullyConnected()) continue;
				for (const cellStructureInputNodeWorldCF of getStructureInputsNodesWorldCFs(inputStructureModel)) {
					const inputNodeWorldCell = this.gridService.getCellAtWorldPosition(
						player,
						cellStructureInputNodeWorldCF.Position,
					);
					if (
						outputNodeWorldCell === inputNodeWorldCell &&
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
