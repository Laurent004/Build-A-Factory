import { OnInit, Service } from "@flamework/core";
import { Events } from "server/network";
import DataService from "../data/data-service";
import { BlueprintData, BlueprintStructureData, PowerLineData, STRUCTURES } from "shared/constants/structures";
import { HttpService, Players, ReplicatedStorage, Workspace } from "@rbxts/services";

@Service({})
export default class BlueprintService implements OnInit {
	private readonly blueprintsModels = new Map<Player, Set<Model>>();

	constructor(private readonly dataService: DataService) {}

	onInit(): void | Promise<void> {
		this.initEvents();
	}

	private initEvents(): void {
		Players.PlayerAdded.Connect((player) => {
			this.initBlueprints(player);
		});

		Players.PlayerRemoving.Connect((player) => {
			this.resetBlueprints(player);
		});

		Events.CreateBlueprint.connect(
			(player, blueprintName, blueprintDescription, blueprintSubcategory, structuresModels) => {
				const primaryStructureModel = structuresModels[structuresModels.size() - 1];
				const blueprintsStructuresData: BlueprintStructureData[] = [];
				const powerAttachments: Attachment[] = [];
				for (const structureModel of structuresModels) {
					blueprintsStructuresData.push({
						name: structureModel.Name,
						cfsComponents: new Map<
							string,
							[
								number,
								number,
								number,
								number,
								number,
								number,
								number,
								number,
								number,
								number,
								number,
								number,
							]
						>(
							[
								structureModel,
								...structureModel
									.GetChildren()
									.filter(
										(instance): instance is Model =>
											instance.IsA("Model") && instance.Name in STRUCTURES,
									),
							].map((structureModel) => [
								structureModel.Name,
								structureModel.PrimaryPart === primaryStructureModel.PrimaryPart
									? structureModel.GetPivot().GetComponents()
									: primaryStructureModel
											.GetPivot()
											.ToObjectSpace(structureModel.GetPivot())
											.GetComponents(),
							]),
						),

						attributes: structureModel.GetAttributes(),
						isPrimary: structureModel === primaryStructureModel,
					});

					for (const powerAttachment of structureModel
						.GetDescendants()
						.filter(
							(instance): instance is Attachment =>
								instance.IsA("Attachment") && instance.Name === "PowerAttachment",
						)) {
						powerAttachments.push(powerAttachment);
					}
				}

				const powerLinesData: PowerLineData[] = [];
				for (const powerLine of (
					Workspace.WaitForChild("Plots")
						.GetChildren()
						.find((plot): plot is Model => plot.GetAttribute("UserId") === player.UserId)!
						.WaitForChild("PowerLines")
						.GetChildren() as RopeConstraint[]
				).filter(
					(powerLine) =>
						powerAttachments.includes(powerLine.Attachment0!) &&
						powerAttachments.includes(powerLine.Attachment1!),
				)) {
					powerLinesData.push({
						startPowerAttachmentCfComponents: primaryStructureModel
							.GetPivot()
							.ToObjectSpace(powerLine.Attachment0!.WorldCFrame)
							.GetComponents(),
						endPowerAttachmentCfComponents: primaryStructureModel
							.GetPivot()
							.ToObjectSpace(powerLine.Attachment1!.WorldCFrame)
							.GetComponents(),
					});
				}

				const blueprintData: BlueprintData = {
					id: HttpService.GenerateGUID(),
					name: blueprintName,
					description: blueprintDescription,
					subcategory: blueprintSubcategory,
					structuresData: blueprintsStructuresData,
					powerLinesData: powerLinesData,
				};
				this.dataService.get(player, "blueprintsData").then((blueprintsData) => {
					this.dataService.set(player, "blueprintsData", [...(blueprintsData ?? []), blueprintData]);
					Events.OnBlueprintCreation.fire(
						player,
						this.createBlueprint(player, blueprintData),
						blueprintDescription,
						blueprintSubcategory,
					);
				});
			},
		);

		Events.EditBlueprint.connect((player, blueprintModel, blueprintName, blueprintDescription) => {
			this.dataService.get(player, "blueprintsData").then((blueprintsData) => {
				if (blueprintsData === undefined) return;
				const blueprintDataIndex = blueprintsData.findIndex(
					(blueprintData) => blueprintData.id === blueprintModel.GetAttribute("Id"),
				);
				if (blueprintDataIndex === -1) return;

				blueprintModel.Name = blueprintName;

				const newBlueprintsData = [...blueprintsData];
				newBlueprintsData[blueprintDataIndex].name = blueprintName;
				newBlueprintsData[blueprintDataIndex].description = blueprintDescription;
				this.dataService.set(player, "blueprintsData", newBlueprintsData);

				Events.OnBlueprintEdit.fire(player, blueprintModel, blueprintDescription);
			});
		});

		Events.DeleteBlueprint.connect((player, blueprintModel) => {
			this.dataService.get(player, "blueprintsData").then((blueprintsData) => {
				if (blueprintsData === undefined) return;
				const blueprintDataIndex = blueprintsData.findIndex(
					(blueprintData) => blueprintData.id === blueprintModel.GetAttribute("Id"),
				);
				if (blueprintDataIndex === -1) return;

				blueprintModel.Destroy();
				this.blueprintsModels.get(player)!.delete(blueprintModel);

				const newBlueprintsData = [...blueprintsData];
				newBlueprintsData.remove(blueprintDataIndex);
				this.dataService.set(player, "blueprintsData", newBlueprintsData);
			});
		});
	}

	private initBlueprints(player: Player): void {
		this.blueprintsModels.set(player, new Set());
		this.dataService.get(player, "blueprintsData").then((blueprintsData) => {
			if (blueprintsData === undefined) return;
			for (const blueprintData of blueprintsData) {
				Events.OnBlueprintCreation.fire(
					player,
					this.createBlueprint(player, blueprintData),
					blueprintData.description,
					blueprintData.subcategory,
				);
			}
		});
	}

	private resetBlueprints(player: Player): void {
		for (const blueprintModel of this.blueprintsModels.get(player)!) {
			blueprintModel.Destroy();
		}
		this.blueprintsModels.delete(player);
	}

	private createBlueprint(player: Player, blueprintData: BlueprintData): Model {
		const newBlueprintModel = new Instance("Model");
		newBlueprintModel.Name = blueprintData.name;
		newBlueprintModel.SetAttribute("Id", blueprintData.id);

		const primaryStructureData = blueprintData.structuresData.find((structureData) => structureData.isPrimary)!;
		const primaryStructureModelCF = new CFrame(
			...primaryStructureData.cfsComponents.get(primaryStructureData.name)!,
		);
		const powerAttachments: Attachment[] = [];
		for (const structureData of blueprintData.structuresData) {
			const newStructureModel = STRUCTURES[structureData.name].model.Clone();
			for (const structureModel of [
				newStructureModel,
				...newStructureModel
					.GetChildren()
					.filter((instance): instance is Model => instance.IsA("Model") && instance.Name in STRUCTURES),
			]) {
				structureModel.PivotTo(
					structureData.isPrimary && structureModel.PrimaryPart === newStructureModel.PrimaryPart
						? primaryStructureModelCF
						: primaryStructureModelCF.mul(
								new CFrame(...structureData.cfsComponents.get(structureModel.Name)!),
						  ),
				);
			}

			for (const [attributeName, attributeValue] of structureData.attributes) {
				newStructureModel.SetAttribute(attributeName, attributeValue);
			}

			newStructureModel.Parent = newBlueprintModel;
			if (structureData.isPrimary) {
				newBlueprintModel.PrimaryPart = newStructureModel.PrimaryPart;
			}

			for (const powerAttachment of newStructureModel
				.GetDescendants()
				.filter(
					(instance): instance is Attachment =>
						instance.IsA("Attachment") && instance.Name === "PowerAttachment",
				)) {
				powerAttachments.push(powerAttachment);
			}
		}

		for (const powerLineData of blueprintData.powerLinesData) {
			const newPowerLine = STRUCTURES["Power Line"].model.FindFirstChildOfClass("RopeConstraint")!.Clone();
			newPowerLine.Attachment0 = powerAttachments.find((powerAttachment) =>
				powerAttachment.WorldCFrame.FuzzyEq(
					primaryStructureModelCF.mul(new CFrame(...powerLineData.startPowerAttachmentCfComponents)),
				),
			)!;
			newPowerLine.Attachment1 = powerAttachments.find((powerAttachment) =>
				powerAttachment.WorldCFrame.FuzzyEq(
					primaryStructureModelCF.mul(new CFrame(...powerLineData.endPowerAttachmentCfComponents)),
				),
			)!;
			newPowerLine.Parent = newBlueprintModel;
		}

		newBlueprintModel.Parent = ReplicatedStorage;
		this.blueprintsModels.get(player)!.add(newBlueprintModel);

		return newBlueprintModel;
	}
}
