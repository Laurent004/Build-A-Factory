import { OnInit, Service } from "@flamework/core";
import { Events } from "server/network";
import { getStructureData } from "shared/constants/structures";
import { HttpService, Players, Workspace } from "@rbxts/services";
import { Array } from "@rbxts/luau-polyfill";
import { DataService } from "./data";

@Service()
export default class BlueprintService implements OnInit {
	constructor(private readonly dataService: DataService) {}

	onInit(): void | Promise<void> {
		this.initEvents();
	}

	private initEvents(): void {
		Players.PlayerAdded.Connect((player) => {
			this.initBlueprints(player);
		});

		Events.CreateBlueprint.connect(
			(player, structuresModels, blueprintName, blueprintDescription, blueprintSubcategory, blueprintImage) => {
				this.dataService.get(player, "blueprints").then((blueprints) => {
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
						description: blueprintDescription,
						image: blueprintImage,
						structures: structuresModels.map((structureModel) =>
							getStructureData(structureModel, plot.GetPivot()),
						),
						powerLines: (
							Workspace.WaitForChild("Plots")
								.GetChildren()
								.find((plot): plot is Model => plot.GetAttribute("UserId") === player.UserId)!
								.WaitForChild("PowerLines")
								.GetChildren() as RopeConstraint[]
						)
							.filter(
								(powerLine) =>
									attachments.includes(powerLine.Attachment0!) &&
									attachments.includes(powerLine.Attachment1!),
							)
							.map((powerLine) => {
								return {
									startAttachmentCF: plot
										.GetPivot()
										.ToObjectSpace(powerLine.Attachment0!.WorldCFrame)
										.GetComponents(),
									endAttachmentCF: plot
										.GetPivot()
										.ToObjectSpace(powerLine.Attachment1!.WorldCFrame)
										.GetComponents(),
								};
							}),
					};
					this.dataService.set(player, "blueprints", [...blueprints, blueprint]);
					Events.OnBlueprintsUpdate.fire(player, [...blueprints, blueprint]);
					Events.OnNotification.fire(
						player,
						`<font color="rgb(144, 187, 255)">Successfully created <i>"${blueprint.name}"</i> blueprint!</font>`,
						"sfx/success",
					);
				});
			},
		);

		Events.EditBlueprint.connect((player, blueprintId, blueprintName, blueprintDescription, blueprintImage) => {
			this.dataService.get(player, "blueprints").then((blueprints) => {
				if (blueprints === undefined) return;
				const blueprint = blueprints.find((blueprint) => blueprint.id === blueprintId)!;
				const previousBlueprintName = blueprint.name;
				blueprint.name = blueprintName;
				blueprint.description = blueprintDescription;
				blueprint.image = blueprintImage;
				Events.OnBlueprintsUpdate.fire(player, blueprints);
				Events.OnNotification.fire(
					player,
					`<font color="rgb(144, 187, 255)">Successfully edited <i>"${previousBlueprintName}"</i> blueprint!</font>`,
					"sfx/success",
				);
			});
		});

		Events.DeleteBlueprint.connect((player, blueprintId) => {
			this.dataService.get(player, "blueprints").then((blueprints) => {
				const blueprint = blueprints.find((blueprint) => blueprint.id === blueprintId)!;
				blueprints.remove(blueprints.indexOf(blueprint));
				Events.OnBlueprintsUpdate.fire(player, blueprints);
				Events.OnNotification.fire(
					player,
					`<font color="rgb(144, 187, 255)">Successfully deleted <i>"${blueprint.name}"</i> blueprint!</font>`,
					"sfx/success",
				);
			});
		});
	}

	private initBlueprints(player: Player): void {
		this.dataService.get(player, "blueprints").then((blueprints) => {
			Events.OnBlueprintsUpdate.fire(player, blueprints);
		});
	}
}
