import { OnInit, Service } from "@flamework/core";
import { Events } from "server/network";
import DataService from "./data";
import { BlueprintData, createStructure, getStructureData, STRUCTURES } from "shared/constants/structures";
import { HttpService, Players, ReplicatedStorage, Workspace } from "@rbxts/services";
import { Array } from "@rbxts/luau-polyfill";

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
			(player, structuresModels, blueprintName, blueprintDescription, blueprintSubcategory, blueprintImage) => {
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
				const blueprint = {
					id: HttpService.GenerateGUID(),
					subcategory: blueprintSubcategory,
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
					this.dataService.set(player, "blueprints", [...blueprints, blueprint]);
					Events.OnBlueprintCreation.fire(
						player,
						this.createBlueprint(player, blueprint),
						blueprintDescription,
						blueprintSubcategory,
						blueprintImage,
					);
					Events.OnNotification.fire(
						player,
						`<font color="rgb(144, 187, 255)">Successfully created <i>"${blueprint.name}"</i> blueprint!</font>`,
						"sfx/success",
					);
				});
			},
		);

		Events.EditBlueprint.connect((player, blueprintModel, blueprintName, blueprintDescription, blueprintImage) => {
			this.dataService.get(player, "blueprints").then((blueprints) => {
				if (blueprints === undefined) return;
				const previousBlueprintName = blueprintModel.Name;
				const blueprint = blueprints.find((blueprint) => blueprint.id === blueprintModel.GetAttribute("Id"))!;
				blueprintModel.Name = blueprintName;
				blueprint.name = blueprintName;
				blueprint.description = blueprintDescription;
				blueprint.image = blueprintImage;
				Events.OnBlueprintEdit.fire(player, blueprintModel, blueprintDescription, blueprintImage);
				Events.OnNotification.fire(
					player,
					`<font color="rgb(144, 187, 255)">Successfully edited <i>"${previousBlueprintName}"</i> blueprint!</font>`,
					"sfx/success",
				);
			});
		});

		Events.DeleteBlueprint.connect((player, blueprintModel) => {
			this.dataService.get(player, "blueprints").then((blueprints) => {
				blueprintModel.Destroy();
				blueprints.remove(
					blueprints.findIndex((blueprint) => blueprint.id === blueprintModel.GetAttribute("Id")),
				);
				this.blueprintsModels.get(player)!.delete(blueprintModel);
				Events.OnNotification.fire(
					player,
					`<font color="rgb(144, 187, 255)">Successfully deleted <i>"${blueprintModel.Name}"</i> blueprint!</font>`,
					"sfx/success",
				);
			});
		});
	}

	private initBlueprints(player: Player): void {
		this.dataService.get(player, "blueprints").then((blueprints) => {
			this.blueprintsModels.set(player, new Set<Model>());
			for (const blueprint of blueprints) {
				const newBlueprint = this.createBlueprint(player, blueprint);
				Events.OnBlueprintCreation.fire(
					player,
					newBlueprint,
					blueprint.description,
					blueprint.subcategory,
					blueprint.image,
				);
				this.blueprintsModels.get(player)!.add(newBlueprint);
			}
		});
	}

	private resetBlueprints(player: Player): void {
		for (const blueprintModel of this.blueprintsModels.get(player)!) {
			blueprintModel.Destroy();
		}
		this.blueprintsModels.delete(player);
	}

	private createBlueprint(player: Player, blueprint: BlueprintData): Model {
		const newBlueprintModel = new Instance("Model");
		newBlueprintModel.Name = blueprint.name;
		newBlueprintModel.SetAttribute("Id", blueprint.id);

		for (const structure of blueprint.structures) {
			createStructure(structure, undefined, false, newBlueprintModel);
		}

		const attachments = newBlueprintModel
			.GetDescendants()
			.filter(
				(instance): instance is Attachment => instance.IsA("Attachment") && instance.Name === "PowerAttachment",
			);
		for (const powerLine of blueprint.powerLines) {
			const newPowerLine = STRUCTURES["Power Line"].model.FindFirstChildOfClass("RopeConstraint")!.Clone();
			newPowerLine.Attachment0 = attachments.find((attachment) =>
				attachment.WorldCFrame.FuzzyEq(new CFrame(...powerLine.startAttachmentCF)),
			)!;
			newPowerLine.Attachment1 = attachments.find((attachment) =>
				attachment.WorldCFrame.FuzzyEq(new CFrame(...powerLine.endAttachmentCF)),
			)!;
			newPowerLine.Parent = newBlueprintModel;
		}

		newBlueprintModel.Parent = ReplicatedStorage;
		this.blueprintsModels.get(player)!.add(newBlueprintModel);
		return newBlueprintModel;
	}
}
