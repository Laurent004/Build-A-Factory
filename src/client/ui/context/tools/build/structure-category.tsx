import React, { useMemo, useState } from "@rbxts/react";
import { colors } from "client/ui/constants";
import { BlueprintData, createBlueprint, getStructureModel, STRUCTURE_SUB_CATEGORIES, STRUCTURES } from "shared/constants/structures";
import { useEventListener } from "@rbxts/pretty-react-hooks";
import { Events } from "client/network";
import { Object } from "@rbxts/luau-polyfill";
import { BuildMenuStructureButton } from "./structure-button";
import { Frame, Image, ScrollingFrame, Text, TextBox } from "client/ui/core";
import { HttpService, MarketplaceService, Players, Workspace } from "@rbxts/services";
import { TECHS } from "shared/constants/tech";

interface BuildMenuStructureCategoryProps {
	structureCategory: string;
	isVisible:boolean;
}

export function BuildMenuStructureCategory({ structureCategory, isVisible }: BuildMenuStructureCategoryProps) {
	const [blueprints, setBlueprints] = useState<BlueprintData[]>([]);

	const [searchText, setSearchText] = useState<string>("");
	const visibleStructures = useMemo<string[]>(
		() =>
			Object.entries(STRUCTURES)
				.filter(
					([structureName, structureDefinition]) =>
						structureDefinition.category === structureCategory &&
						(structureName.lower().find(searchText.lower())[0] !== undefined||structureDefinition.subcategory.lower().find(searchText.lower())[0] !== undefined),
				)
				.map(([structureName]) => structureName),
		[searchText],
	);
	const visibleBlueprints = useMemo<string[]>(
		() =>
			blueprints
				.filter(
					(blueprint) =>
						blueprint.name.lower().find(searchText.lower())[0] !== undefined||
						blueprint.subcategory.lower().find(searchText.lower())[0] !== undefined
				)
				.map((blueprint) => blueprint.id),
		[blueprints, searchText],
	);

	useEventListener(
		Events.OnBlueprintsUpdate,
		(blueprints) => {
			if (structureCategory !== "Blueprints") return;
			setBlueprints(blueprints);
		},
	);

	return (
		<ScrollingFrame
			Position={UDim2.fromScale(0, 0.134)}
			Size={UDim2.fromScale(0.696, 0.866)}
			Visible={isVisible}
			ZIndex={0}
		>
			<uilistlayout
				SortOrder={Enum.SortOrder.LayoutOrder}
			></uilistlayout>

			<Frame Size={UDim2.fromScale(1, 0.15)} BackgroundTransparency={1} LayoutOrder={0}>
				<Frame
					Position={UDim2.fromScale(0, 0.36)}
					Size={UDim2.fromScale(0.303, 0.295)}
					BackgroundColor3={colors.white}
				>
					<uigradient
						Color={
							new ColorSequence([
								new ColorSequenceKeypoint(0, Color3.fromRGB(77, 77, 77)),
								new ColorSequenceKeypoint(1, Color3.fromRGB(31, 31, 31)),
							])
						}
						Rotation={90}
					></uigradient>

					<uistroke
						ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
						Color={Color3.fromRGB(71, 71, 71)}
						LineJoinMode={Enum.LineJoinMode.Miter}
					></uistroke>


					<TextBox
						Size={UDim2.fromScale(1, 1)}
						PlaceholderText={"Search for..."}
						PlaceholderColor3={colors.grey}
						TextSize={14}
						TextXAlignment={Enum.TextXAlignment.Left}
						TextTruncate={Enum.TextTruncate.SplitWord}
						Change={{
							Text: (textBox) => {
								setSearchText(textBox.Text);
							},
						}}
					>
						<uipadding PaddingLeft={new UDim(0, 9)} PaddingRight={new UDim(0, 30)}></uipadding>
					</TextBox>

					<Image
						AnchorPoint={new Vector2(0.5, 0.5)}
						Position={UDim2.fromScale(0.93, 0.5)}
						Size={UDim2.fromScale(0.082, 0.62)}
						Image="rbxassetid://136023776711700"
						ImageColor3={Color3.fromRGB(190, 190, 190)}
					></Image>
				</Frame>
			</Frame>

			{(structureCategory === "Blueprints"
				? [...new Set(blueprints.map((blueprint) => blueprint.subcategory))]:STRUCTURE_SUB_CATEGORIES[structureCategory]) .map(
						(subcategory, index) => (
							<>
								<Frame
									Size={UDim2.fromScale(0.428, 0.048)}
									BackgroundColor3={colors.white}
									LayoutOrder={index*2+1}
									Visible={subcategory.lower().find(searchText.lower())[0]!==undefined||(structureCategory==="Blueprints"?visibleBlueprints.some((blueprintId)=>blueprints.find((blueprint)=>blueprint.id===blueprintId)!.subcategory===subcategory):visibleStructures.some((structureName)=>STRUCTURES[structureName].subcategory===subcategory))}
								>
									<uigradient
										Color={
											new ColorSequence([
												new ColorSequenceKeypoint(0, Color3.fromRGB(24, 24, 24)),
												new ColorSequenceKeypoint(1, Color3.fromRGB(126, 126, 126)),
											])
										}
										Transparency={
											new NumberSequence([
												new NumberSequenceKeypoint(0, 0),
												new NumberSequenceKeypoint(0.481, 0.72),
												new NumberSequenceKeypoint(1, 1),
											])
										}
									></uigradient>

									<Text
										Size={UDim2.fromScale(1, 1)}
										Text={subcategory}
										TextSize={14}
										TextXAlignment={Enum.TextXAlignment.Left}
									>
										<uipadding PaddingLeft={new UDim(0, 15)}></uipadding>
									</Text>
								</Frame>

								<Frame
									AutomaticSize={Enum.AutomaticSize.Y}
									Size={UDim2.fromScale(1, 0)}
									BackgroundTransparency={1}
									LayoutOrder={index*2+2}
									Visible={subcategory.lower().find(searchText.lower())[0]!==undefined||(structureCategory==="Blueprints"?visibleBlueprints.some((blueprintId)=>blueprints.find((blueprint)=>blueprint.id===blueprintId)!.subcategory===subcategory):visibleStructures.some((structureName)=>STRUCTURES[structureName].subcategory===subcategory))}
								>
									<uipadding
										PaddingTop={new UDim(0,16)}
										PaddingLeft={new UDim(0,18)}
										PaddingRight={new UDim(0,18)}
										PaddingBottom={new UDim(0,46)}
									></uipadding>

									<uigridlayout
										CellPadding={UDim2.fromOffset(25, 25)}
										CellSize={UDim2.fromOffset(123, 123)}
										SortOrder={Enum.SortOrder.LayoutOrder}
									></uigridlayout>

									{structureCategory==="Blueprints"?
											blueprints
											.filter((blueprint) => blueprint.subcategory === subcategory)
											.map((blueprint, index) => (
												<BuildMenuStructureButton
													structureImage={blueprint.image}
													structureDescription={blueprint.description}
													structureModel={createBlueprint(blueprint,Workspace.WaitForChild("Plots").GetChildren()
													.find((plot): plot is Model => plot.GetAttribute("UserId") === Players.LocalPlayer.UserId)!
													.GetPivot())}
													index={index}
													isVisible={visibleBlueprints.includes(blueprint.id)}
													isUnlocked={true}
													isPurchased={true}
												></BuildMenuStructureButton>
											)):
											Object.entries(STRUCTURES)
											.filter(
												([, structureDefinition]) =>
													structureDefinition.index !== undefined &&
													structureDefinition.subcategory === subcategory,
											)
											.sort(
												([, structureDefinitionA], [, structureDefinitionB]) =>
													structureDefinitionA.index! < structureDefinitionB.index!,
											)
											.map(([structureName, structureDefinition], index) => (
												<BuildMenuStructureButton
													structureImage={structureDefinition.image}
													structureDescription={structureDefinition.description}
													structureModel={getStructureModel(structureName)!}
													index={index}
													isVisible={visibleStructures.includes(structureName)}
													isUnlocked={Object.entries(TECHS).every(
														([techName, techDefinition]) =>
															techDefinition.type !== "Structure" || !techDefinition.structures.includes(structureName)||(HttpService.JSONDecode(Players.LocalPlayer.GetAttribute("Techs") as string) as string[]).includes(techName)
													)}
													isPurchased={structureDefinition.gamepass===undefined || MarketplaceService.UserOwnsGamePassAsync(Players.LocalPlayer.UserId, structureDefinition.gamepass)}
												></BuildMenuStructureButton>
											))
										}
								</Frame>
							</>
						),
				  )
				}
		</ScrollingFrame>
	);
}
