import { MarketplaceService, Players, Workspace } from "@rbxts/services";
import {
	getStructureData,
	getStructureModel,
	StructureData,
	StructureEditData,
	STRUCTURES,
} from "shared/constants/structures";
import { GridService } from "./plot/grid";
import { Object } from "@rbxts/luau-polyfill";
import { TECHS } from "shared/constants/tech";
import { TUTORIAL } from "shared/constants/tutorial";
import { PowerService } from "./plot";
import CurrencyService from "./progression/currency";
import TechService from "./progression/tech";

export default class ValidationService {
	//#region Singleton
	private static _inst: ValidationService;
	public static getInst(): ValidationService {
		this._inst = this._inst ?? new ValidationService();
		return this._inst;
	}
	//#endregion

	private readonly gridService = GridService.getInst();
	private readonly powerService = PowerService.getInst();
	private readonly currencyService = CurrencyService.getInst();
	private readonly techService = TechService.getInst();
	private readonly gamepasses = new Map<Player, Set<number>>();

	private readonly buildRules: {
		canBuild: (player: Player, structuresData: StructureData[]) => { success: boolean; error?: string };
	}[] = [
		{
			canBuild: (player, structuresData) => {
				const tutorialStep = player.GetAttribute("TutorialStep") as number;
				if (tutorialStep === TUTORIAL.size()) return { success: true };
				const tutorialStepDefinition = TUTORIAL[tutorialStep];
				if (tutorialStepDefinition.type !== "Build")
					return {
						success: false,
						error: `<font color="rgb(255, 98, 98)">Follow the tutorial!</font>`,
					};
				const plot = Workspace.WaitForChild("Plots")
					.GetChildren()
					.find((plot): plot is Model => plot.GetAttribute("UserId") === player.UserId)!;
				return structuresData.every((structureData) =>
					tutorialStepDefinition.structuresData.some(
						(structureData_) =>
							structureData_.name === structureData.name &&
							(structureData_.rotation !== undefined
								? new CFrame(structureData_.position)
										.mul(structureData_.rotation)
										.FuzzyEq(plot.GetPivot().ToObjectSpace(new CFrame(...structureData.cf)), 0.01)
								: structureData_.position.FuzzyEq(
										plot.GetPivot().ToObjectSpace(new CFrame(...structureData.cf)).Position,
										0.01,
								  )),
					),
				)
					? { success: true }
					: {
							success: false,
							error: `<font color="rgb(255, 98, 98)">You cannot place this during the tutorial!</font>`,
					  };
			},
		},
		{
			canBuild: (player, structuresData) => {
				for (const structureData of structuresData) {
					const gamepass = STRUCTURES[structureData.name].gamepass;
					if (gamepass !== undefined && !this.gamepasses.get(player)!.has(gamepass)) {
						return {
							success: false,
							error: `<font color="rgb(255, 98, 98)">You do not own the ${
								MarketplaceService.GetProductInfo(gamepass, Enum.InfoType.GamePass).Name
							} gamepass!</font>`,
						};
					}
					for (const [techName, techDefinition] of Object.entries(TECHS)) {
						if (
							techDefinition.type === "Structure" &&
							techDefinition.structures.includes(structureData.name) &&
							!this.techService.getTechs(player).has(techName)
						) {
							return {
								success: false,
								error: `<font color="rgb(255, 98, 98)">You haven't unlocked ${techName} tech yet!</font>`,
							};
						}
					}
				}
				return { success: true };
			},
		},
		{
			canBuild: (player, structuresData) => {
				const cash = this.currencyService.getCurrency(player, "Cash")!;
				const cost = structuresData.reduce(
					(cost, structureData) => (cost += STRUCTURES[structureData.name].cost),
					0,
				);
				return cash >= cost
					? { success: true }
					: {
							success: false,
							error: `<font color="rgb(255, 98, 98)">You need $${cost - cash} more to place this!</font>`,
					  };
			},
		},
		{
			canBuild: (player, structuresData) => {
				return this.gridService.canPlace(player, structuresData)
					? { success: true }
					: { success: false, error: `<font color="rgb(255, 98, 98)">You cannot place here!</font>` };
			},
		},
		{
			canBuild: (player, structuresData) => {
				this.overlapParams.AddToFilter(player.Character!);
				return structuresData.every((structureData) => {
					const structureModel = getStructureModel(
						structureData.name,
						structureData.attributes.get("IsMirrored") as boolean | undefined,
					)!;
					return (
						STRUCTURES[(structureData as StructureData).name].nodes.cells.size() === 0 ||
						Workspace.GetPartBoundsInBox(
							new CFrame(...(structureData as StructureData).cf).mul(
								structureModel.PrimaryPart!.PivotOffset.Inverse(),
							),
							structureModel.PrimaryPart!.Size,
							this.overlapParams,
						).size() === 0
					);
				})
					? { success: true }
					: {
							success: false,
							error: `<font color="rgb(255, 98, 98)">Move your character out of the way!</font>`,
					  };
			},
		},
	];
	private readonly editRules: {
		canEdit: (player: Player, structuresData: StructureData[]) => { success: boolean; error?: string };
	}[] = [
		{
			canEdit: (player, structuresData) => {
				const tutorialStep = player.GetAttribute("TutorialStep") as number;
				if (tutorialStep === TUTORIAL.size()) return { success: true };
				const tutorialStepDefinition = TUTORIAL[tutorialStep];
				if (tutorialStepDefinition.type !== "Edit")
					return {
						success: false,
						error: `<font color="rgb(255, 98, 98)">Follow the tutorial!</font>`,
					};
				const plot = Workspace.WaitForChild("Plots")
					.GetChildren()
					.find((plot): plot is Model => plot.GetAttribute("UserId") === player.UserId)!;
				return structuresData.size() === 1 &&
					structuresData[0].name === tutorialStepDefinition.structureData.name &&
					(tutorialStepDefinition.structureData.rotation !== undefined
						? new CFrame(tutorialStepDefinition.structureData.position)
								.mul(tutorialStepDefinition.structureData.rotation)
								.FuzzyEq(plot.GetPivot().ToObjectSpace(new CFrame(...structuresData[0].cf)), 0.01)
						: tutorialStepDefinition.structureData.position.FuzzyEq(
								plot.GetPivot().ToObjectSpace(new CFrame(...structuresData[0].cf)).Position,
								0.01,
						  ))
					? { success: true }
					: {
							success: false,
							error: `<font color="rgb(255, 98, 98)">You cannot edit this during the tutorial here!</font>`,
					  };
			},
		},
		{
			canEdit: (player, structuresData) => {
				return this.gridService.canPlace(player, structuresData)
					? { success: true }
					: { success: false, error: `<font color="rgb(255, 98, 98)">You cannot place here!</font>` };
			},
		},
		{
			canEdit: (player, structuresData) => {
				this.overlapParams.AddToFilter(player.Character!);
				return structuresData.every((structureData) => {
					const structureModel = getStructureModel(
						structureData.name,
						structureData.attributes.get("IsMirrored") as boolean | undefined,
					)!;
					return (
						STRUCTURES[(structureData as StructureData).name].nodes.cells.size() === 0 ||
						Workspace.GetPartBoundsInBox(
							new CFrame(...(structureData as StructureData).cf).mul(
								structureModel.PrimaryPart!.PivotOffset.Inverse(),
							),
							structureModel.PrimaryPart!.Size,
							this.overlapParams,
						).size() === 0
					);
				})
					? { success: true }
					: {
							success: false,
							error: `<font color="rgb(255, 98, 98)">Move your character out of the way!</font>`,
					  };
			},
		},
	];
	private readonly deleteRules: {
		canDelete: (player: Player, structuresModels: Model[]) => { success: boolean; error?: string };
	}[] = [
		{
			canDelete: (player, structuresModels) => {
				const tutorialStep = player.GetAttribute("TutorialStep") as number;
				if (tutorialStep === TUTORIAL.size()) return { success: true };
				const tutorialStepDefinition = TUTORIAL[tutorialStep];
				if (tutorialStepDefinition.type !== "Delete")
					return {
						success: false,
						error: `<font color="rgb(255, 98, 98)">Follow the tutorial!</font>`,
					};
				const plot = Workspace.WaitForChild("Plots")
					.GetChildren()
					.find((plot): plot is Model => plot.GetAttribute("UserId") === player.UserId)!;
				return structuresModels.every((structureModel) =>
					tutorialStepDefinition.structuresData.some(
						(structureData) =>
							structureData.name === structureModel.Name &&
							structureData.position.FuzzyEq(
								plot.GetPivot().ToObjectSpace(structureModel.GetPivot()).Position,
								0.01,
							),
					),
				)
					? { success: true }
					: {
							success: false,
							error: `<font color="rgb(255, 98, 98)">You cannot delete this during the tutorial!</font>`,
					  };
			},
		},
	];
	private readonly setAttributeRules: {
		canSetAttribute: (
			player: Player,
			structuresModels: Model[],
			attributeName: string,
			attributeValue: AttributeValue | undefined,
		) => { success: boolean; error?: string };
	}[] = [
		{
			canSetAttribute: (player, structuresModels, attributeName, attributeValue) => {
				const tutorialStep = player.GetAttribute("TutorialStep") as number;
				if (tutorialStep === TUTORIAL.size()) return { success: true };
				const tutorialStepDefinition = TUTORIAL[tutorialStep];
				return tutorialStepDefinition.type === "SetAttribute"
					? {
							success:
								structuresModels[0].Name === tutorialStepDefinition.structureName &&
								attributeName === tutorialStepDefinition.attributeName &&
								attributeValue === tutorialStepDefinition.attributeValue,
					  }
					: {
							success: false,
							error: `<font color="rgb(255, 98, 98)">Follow the tutorial!</font>`,
					  };
			},
		},
	];
	private readonly connectRules: {
		canConnect: (
			player: Player,
			startAttachment: Attachment,
			endAttachement: Attachment,
		) => { success: boolean; error?: string };
	}[] = [
		{
			canConnect: (player, startAttachment, endAttachment) => {
				const tutorialStep = player.GetAttribute("TutorialStep") as number;
				if (tutorialStep === TUTORIAL.size()) return { success: true };
				const tutorialStepDefinition = TUTORIAL[tutorialStep];
				if (tutorialStepDefinition.type !== "Connect")
					return {
						success: false,
						error: `<font color="rgb(255, 98, 98)">Follow the tutorial!</font>`,
					};
				const startStructureModel = startAttachment.FindFirstAncestorOfClass("Model")!;
				const endStructureModel = endAttachment.FindFirstAncestorOfClass("Model")!;
				return (startStructureModel.Name === tutorialStepDefinition.structuresNames[0] &&
					endStructureModel.Name === tutorialStepDefinition.structuresNames[1]) ||
					(startStructureModel.Name === tutorialStepDefinition.structuresNames[1] &&
						endStructureModel.Name === tutorialStepDefinition.structuresNames[0])
					? { success: true }
					: {
							success: false,
							error: `<font color="rgb(255, 98, 98)">You cannot connect this during the tutorial!</font>`,
					  };
			},
		},
		{
			canConnect: (_, startAttachment, endAttachment) => {
				return { success: this.powerService.canConnect(startAttachment, endAttachment) };
			},
		},
	];
	private readonly expandRules: {
		canExpand: (player: Player, expansion: Part) => { success: boolean; error?: string };
	}[] = [
		{
			canExpand: (player) => {
				return (player.GetAttribute("TutorialStep") as number) === TUTORIAL.size()
					? { success: true }
					: { success: false, error: `<font color="rgb(255, 98, 98)">Finish the tutorial first!</font>` };
			},
		},
		{
			canExpand: (player, expansion) => {
				const cash = this.currencyService.getCurrency(player, "Cash")!;
				const cost = expansion.GetAttribute("Cost") as number;
				return cash >= cost
					? { success: true }
					: {
							success: false,
							error: `<font color="rgb(255, 98, 98)">You need $${
								cost - cash
							} more to buy this expansion!</font>`,
					  };
			},
		},
	];
	private readonly techRules: {
		canUnlockTech: (player: Player, techName: string) => { success: boolean; error?: string };
	}[] = [
		{
			canUnlockTech: (player) => {
				return (player.GetAttribute("TutorialStep") as number) === TUTORIAL.size()
					? { success: true }
					: { success: false, error: `<font color="rgb(255, 98, 98)">Finish the tutorial first!</font>` };
			},
		},
		{
			canUnlockTech: (player, techName) => {
				const techDefinition = TECHS[techName];
				const queue: string[] = [...techDefinition.requirements];
				const visited = new Set<string>();
				while (queue.size() > 0) {
					const tech = queue.shift()!;
					visited.add(tech);
					if (!this.techService.getTechs(player).has(tech))
						return { success: false, error: `<font color="rgb(255, 98, 98)">nlock ${tech} first!</font>` };
					for (const requiredTech of TECHS[tech].requirements.filter((tech) => !visited.has(tech))) {
						queue.push(requiredTech);
					}
				}
				return { success: true };
			},
		},
		{
			canUnlockTech: (player, techName) => {
				const techDefinition = TECHS[techName];
				for (const [dataCurrency, cost] of Object.entries({
					"Logistics Data": techDefinition.cost.logisticsData,
					"Production Data": techDefinition.cost.productionData,
					"Power Data": techDefinition.cost.powerData,
				})) {
					const ownedDataCurrency = this.currencyService.getCurrency(player, dataCurrency);
					if (ownedDataCurrency < cost)
						return {
							success: false,
							error: `<font color="rgb(255, 98, 98)">You need ${
								cost - ownedDataCurrency
							} ${dataCurrency} to unlock this!</font>`,
						};
				}
				return { success: true };
			},
		},
	];
	private readonly overlapParams: OverlapParams;

	private constructor() {
		this.overlapParams = new OverlapParams();
		this.overlapParams.FilterType = Enum.RaycastFilterType.Include;
		this.init();
	}

	private init(): void {
		for (const player of Players.GetPlayers()) {
			this.initPlayer(player);
		}
		Players.PlayerAdded.Connect((player) => this.initPlayer(player));
		Players.PlayerRemoving.Connect((player) => {
			this.gamepasses.delete(player);
		});
		MarketplaceService.PromptGamePassPurchaseFinished.Connect((player, gamepass) => {
			this.gamepasses.get(player)!.add(gamepass);
		});
	}

	private initPlayer(player: Player): void {
		this.gamepasses.set(
			player,
			new Set<number>(
				Object.entries(STRUCTURES)
					.mapFiltered(([, structureDefinition]) => structureDefinition.gamepass)
					.filter((gamepass) => MarketplaceService.UserOwnsGamePassAsync(player.UserId, gamepass)),
			),
		);
	}

	public canBuild(player: Player, structuresModels: Model[]): { success: boolean; error?: string };
	public canBuild(player: Player, structuresData: StructureData[]): { success: boolean; error?: string };
	public canBuild(player: Player, structures: Model[] | StructureData[]): { success: boolean; error?: string } {
		const structuresData = typeIs(structures[0], "Instance")
			? (structures as Model[]).map((structureModel) => getStructureData(structureModel))
			: (structures as StructureData[]);
		for (const buildRule of this.buildRules) {
			const result = buildRule.canBuild(player, structuresData);
			if (!result.success) {
				return result;
			}
		}
		return { success: true };
	}

	public canEdit(player: Player, structuresModels: Model[]): { success: boolean; error?: string };
	public canEdit(player: Player, structuresEditData: StructureEditData[]): { success: boolean; error?: string };
	public canEdit(player: Player, structures: Model[] | StructureEditData[]): { success: boolean; error?: string } {
		const structuresData = typeIs(structures[0], "Instance")
			? (structures as Model[]).map((structureModel) => getStructureData(structureModel))
			: (structures as StructureEditData[]).map((structureEditData) => {
					return {
						...getStructureData(structureEditData.model),
						cf: structureEditData.cf.GetComponents(),
					};
			  });
		for (const editRule of this.editRules) {
			const result = editRule.canEdit(player, structuresData);
			if (!result.success) {
				return result;
			}
		}
		return { success: true };
	}

	public canDelete(player: Player, structuresModels: Model[]): { success: boolean; error?: string } {
		for (const deleteRule of this.deleteRules) {
			const result = deleteRule.canDelete(player, structuresModels);
			if (!result.success) {
				return result;
			}
		}
		return { success: true };
	}

	public canSetAttribute(
		player: Player,
		structuresModels: Model[],
		attributeName: string,
		attributeValue: AttributeValue | undefined,
	): { success: boolean; error?: string } {
		for (const setAttributeRule of this.setAttributeRules) {
			const result = setAttributeRule.canSetAttribute(player, structuresModels, attributeName, attributeValue);
			if (!result.success) {
				return result;
			}
		}
		return { success: true };
	}

	public canConnect(
		player: Player,
		startAttachment: Attachment,
		endAttachement: Attachment,
	): { success: boolean; error?: string } {
		for (const connectRule of this.connectRules) {
			const result = connectRule.canConnect(player, startAttachment, endAttachement);
			if (!result.success) {
				return result;
			}
		}
		return { success: true };
	}

	public canExpand(player: Player, expansion: Part): { success: boolean; error?: string } {
		for (const expandRule of this.expandRules) {
			const result = expandRule.canExpand(player, expansion);
			if (!result.success) {
				return result;
			}
		}
		return { success: true };
	}

	public canUnlockTech(player: Player, techName: string): { success: boolean; error?: string } {
		for (const techRule of this.techRules) {
			const result = techRule.canUnlockTech(player, techName);
			if (!result.success) {
				return result;
			}
		}
		return { success: true };
	}
}
