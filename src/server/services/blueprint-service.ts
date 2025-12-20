import { OnInit, Service } from "@flamework/core";
import { Events } from "server/network";
import DataService from "./data/data-service";
import { BlueprintData, getStructureData, STRUCTURES } from "shared/constants/structures";
import { HttpService, Players, ReplicatedStorage, Workspace } from "@rbxts/services";
import FactoryService from "./plot/factory-service";
import { Array } from "@rbxts/luau-polyfill";

@Service({})
export default class BlueprintService implements OnInit {
	private readonly blueprintsModels = new Map<Player, Set<Model>>();

	constructor(private readonly dataService: DataService, private readonly factoryService: FactoryService) {}

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
			(player, structuresModels, blueprintSubcategory, blueprintName, blueprintImage, blueprintDescription) => {
				const plot = Workspace.WaitForChild("Plots")
					.GetChildren()
					.find((plot): plot is Model => plot.GetAttribute("UserId") === player.UserId)!;
				const attachments: Attachment[] = Array.flatMap(structuresModels, (structureModel) =>
					structureModel
						.GetDescendants()
						.filter(
							(instance): instance is Attachment =>
								instance.IsA("Attachment") && instance.Name === "PowerAttachment",
						),
				);
				const blueprintData: BlueprintData = {
					id: HttpService.GenerateGUID(),
					subCategory: blueprintSubcategory,
					name: blueprintName,
					image: blueprintImage,
					description: blueprintDescription,
					structures: structuresModels.map((structureModel) => getStructureData(structureModel)),
					powerLines: (plot.WaitForChild("Power Lines").GetChildren() as RopeConstraint[])
						.filter(
							(powerLine) =>
								attachments.includes(powerLine.Attachment0!) &&
								attachments.includes(powerLine.Attachment1!),
						)
						.map((powerLine) => {
							return {
								startAttachmentCF: powerLine.Attachment0!.WorldCFrame.GetComponents(),
								endAttachmentCF: powerLine.Attachment1!.WorldCFrame.GetComponents(),
							};
						}),
				};
				this.dataService.get(player, "blueprints").then((blueprints) => {
					this.dataService.set(player, "blueprints", [...blueprints, blueprintData]);
					Events.OnBlueprintCreation.fire(
						player,
						this.createBlueprint(player, blueprintData),
						blueprintSubcategory,
						blueprintImage,
						blueprintDescription,
					);
					Events.OnNotification.fire(
						player,
						`<font color="rgb(144, 187, 255)">Successfully created <i>"${blueprintData.name}"</i> blueprint!</font>`,
					);
				});
			},
		);

		Events.EditBlueprint.connect((player, blueprintModel, blueprintName, blueprintImage, blueprintDescription) => {
			this.dataService.get(player, "blueprints").then((blueprints) => {
				if (blueprints === undefined) return;
				const previousBlueprintName = blueprintModel.Name;
				const blueprintIndex = blueprints.findIndex(
					(blueprintData) => blueprintData.id === blueprintModel.GetAttribute("Id"),
				);
				blueprintModel.Name = blueprintName;
				blueprints[blueprintIndex].name = blueprintName;
				blueprints[blueprintIndex].image = blueprintImage;
				blueprints[blueprintIndex].description = blueprintDescription;
				Events.OnBlueprintEdit.fire(player, blueprintModel, blueprintImage, blueprintDescription);
				Events.OnNotification.fire(
					player,
					`<font color="rgb(144, 187, 255)">Successfully edited <i>"${previousBlueprintName}"</i> blueprint!</font>`,
				);
			});
		});

		Events.DeleteBlueprint.connect((player, blueprintModel) => {
			this.dataService.get(player, "blueprints").then((blueprints) => {
				blueprintModel.Destroy();
				blueprints.remove(
					blueprints.findIndex((blueprintData) => blueprintData.id === blueprintModel.GetAttribute("Id")),
				);
				this.blueprintsModels.get(player)!.delete(blueprintModel);
				Events.OnNotification.fire(
					player,
					`<font color="rgb(144, 187, 255)">Successfully deleted <i>"${blueprintModel.Name}"</i> blueprint!</font>`,
				);
			});
		});
	}

	private initBlueprints(player: Player): void {
		this.dataService.get(player, "blueprints").then((blueprints) => {
			for (const blueprint of blueprints) {
				Events.OnBlueprintCreation.fire(
					player,
					this.createBlueprint(player, blueprint),
					blueprint.subCategory,
					blueprint.image,
					blueprint.description,
				);
			}
		});
		this.blueprintsModels.set(player, new Set<Model>());
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

		for (const structureData of blueprintData.structures) {
			const newStructureModel = this.factoryService.createStructure(structureData, undefined, newBlueprintModel);
			for (const structureModel of [newStructureModel, ...newStructureModel.GetChildren()].filter(
				(instance): instance is Model => instance.IsA("Model") && instance.Name in STRUCTURES,
			)) {
				for (const tag of structureModel.GetTags()) {
					structureModel.RemoveTag(tag);
				}
			}
		}

		const attachments = newBlueprintModel
			.GetDescendants()
			.filter(
				(instance): instance is Attachment => instance.IsA("Attachment") && instance.Name === "PowerAttachment",
			);
		for (const powerLineData of blueprintData.powerLines) {
			const newPowerLine = STRUCTURES["Power Line"].model.FindFirstChildOfClass("RopeConstraint")!.Clone();
			newPowerLine.Attachment0 = attachments.find((attachment) =>
				attachment.WorldCFrame.FuzzyEq(new CFrame(...powerLineData.startAttachmentCF)),
			)!;
			newPowerLine.Attachment1 = attachments.find((attachment) =>
				attachment.WorldCFrame.FuzzyEq(new CFrame(...powerLineData.endAttachmentCF)),
			)!;
			newPowerLine.Parent = newBlueprintModel;
		}

		newBlueprintModel.Parent = ReplicatedStorage;
		this.blueprintsModels.get(player)!.add(newBlueprintModel);
		return newBlueprintModel;
	}
}
