import React, { useState } from "@rbxts/react";
import { colors, fonts, springs } from "client/ui/constants";
import { StructureCategory, STRUCTURE_SUB_CATEGORIES, STRUCTURES } from "shared/constants/structures";
import { Frame } from "client/ui/core/frame";
import { lerpBinding, useUpdateEffect, useMotion, useEventListener } from "@rbxts/pretty-react-hooks";
import { Events } from "client/network";
import { Object } from "@rbxts/luau-polyfill";
import { IMAGES } from "shared/assets/images";
import { Image } from "client/ui/core/image";
import { useSelector } from "@rbxts/react-reflex";
import { selectContext, selectContextOpen } from "client/store/context";
import { selectBuildMenuStructureCategory } from "client/store/context/build";
import { BuildMenuStructureButton } from "./structure-button";
import { Text } from "client/ui/core/text";

export interface BuildMenuStructureCategoryProps {
	structureCategory: StructureCategory;
}

export function BuildMenuStructureCategory(props: BuildMenuStructureCategoryProps) {
	const context = useSelector(selectContext);
	const contextOpen = useSelector(selectContextOpen);
	const structureCategory = useSelector(selectBuildMenuStructureCategory);
	const [blueprints, setBlueprints] = useState<
		{
			blueprintModel: Model;
			blueprintSubcategory: string;
			blueprintImage: string;
			blueprintDescription: string;
		}[]
	>([]);
	const [searchText, setSearchText] = useState<string>("");
	const [onMountAnimation, onMountAnimationMotion] = useMotion(0);

	useUpdateEffect(() => {
		if (context === "Build" && contextOpen && structureCategory === props.structureCategory) {
			onMountAnimationMotion.immediate(0);
		}
		onMountAnimationMotion.spring(
			context === "Build" && contextOpen && structureCategory === props.structureCategory ? 1 : 0,
			springs.gentle,
		);
	}, [context, contextOpen, structureCategory]);

	useEventListener(
		Events.OnBlueprintCreation,
		(blueprintModel, blueprintSubCategory, blueprintImage, blueprintDescription) => {
			if (props.structureCategory !== "Blueprints") return;
			const newBlueprint = {
				blueprintModel: blueprintModel,
				blueprintSubcategory: blueprintSubCategory,
				blueprintImage: blueprintImage,
				blueprintDescription: blueprintDescription,
			};
			setBlueprints((previousBlueprints) => [...previousBlueprints, newBlueprint]);
			blueprintModel.Destroying.Once(() => {
				setBlueprints((previousBlueprints) => {
					const newBlueprints = [...previousBlueprints];
					newBlueprints.remove(newBlueprints.indexOf(newBlueprint));
					return newBlueprints;
				});
			});
		},
	);

	useEventListener(Events.OnBlueprintEdit, (blueprintModel, blueprintImage, blueprintDescription) => {
		if (props.structureCategory !== "Blueprints") return;
		setBlueprints((previousBlueprints) => {
			const newBlueprints = [...previousBlueprints];
			const blueprintIndex = newBlueprints.findIndex((blueprint) => blueprint.blueprintModel === blueprintModel);
			if (blueprintIndex === -1) return newBlueprints;
			newBlueprints[blueprintIndex].blueprintImage = blueprintImage;
			newBlueprints[blueprintIndex].blueprintDescription = blueprintDescription;
			return newBlueprints;
		});
	});

	return (
		<scrollingframe
			Active={true}
			AnchorPoint={new Vector2(0, 0)}
			Position={new UDim2(0, 0, 0.134, 0)}
			Size={new UDim2(0.696, 0, 0.866, 0)}
			BackgroundTransparency={1}
			BorderSizePixel={0}
			Visible={structureCategory === props.structureCategory}
			CanvasSize={new UDim2(0, 0, 3, 0)}
			ScrollBarThickness={0}
			ScrollBarImageTransparency={1}
			ScrollingDirection={Enum.ScrollingDirection.Y}
		>
			<Frame
				anchorPoint={new Vector2(0, 0.5)}
				position={lerpBinding(onMountAnimation, new UDim2(-0.28, 0, 0.022, 0), new UDim2(0, 0, 0.022, 0))}
				size={new UDim2(0.303, 0, 0.013, 0)}
				backgroundColor={Color3.fromRGB(134, 134, 134)}
			>
				<uigradient
					Color={
						new ColorSequence([
							new ColorSequenceKeypoint(0, Color3.fromRGB(83, 83, 83)),
							new ColorSequenceKeypoint(1, Color3.fromRGB(173, 173, 173)),
						])
					}
					Rotation={-90}
				></uigradient>

				<uistroke
					Color={Color3.fromRGB(71, 71, 71)}
					LineJoinMode={Enum.LineJoinMode.Miter}
					Thickness={1.5}
				></uistroke>

				<textbox
					AnchorPoint={new Vector2(1, 0.5)}
					Position={new UDim2(1, 0, 0.5, 0)}
					Size={new UDim2(0.94, 0, 1, 0)}
					BackgroundTransparency={1}
					FontFace={fonts.josefinSans.regular}
					PlaceholderText={"Search for..."}
					PlaceholderColor3={colors.grey}
					Text=""
					TextSize={14}
					TextColor3={Color3.fromRGB(207, 207, 207)}
					TextXAlignment={Enum.TextXAlignment.Left}
					TextYAlignment={Enum.TextYAlignment.Center}
					Change={{
						Text: (textbox) => {
							setSearchText(textbox.Text);
						},
					}}
				></textbox>

				<Image
					anchorPoint={new Vector2(0.5, 0.5)}
					position={new UDim2(0.938, 0, 0.5, 0)}
					size={new UDim2(0.082, 0, 0.62, 0)}
					image={IMAGES.ui.Magnifier}
					imageColor={Color3.fromRGB(190, 190, 190)}
				></Image>
			</Frame>

			<Frame
				anchorPoint={new Vector2(0.5, 1)}
				position={new UDim2(0.5, 0, 1, 0)}
				size={new UDim2(1, 0, 0.954, 0)}
				backgroundTransparency={1}
			>
				<uilistlayout
					Padding={new UDim(0, 0)}
					FillDirection={Enum.FillDirection.Vertical}
					SortOrder={Enum.SortOrder.LayoutOrder}
					HorizontalAlignment={Enum.HorizontalAlignment.Left}
					VerticalAlignment={Enum.VerticalAlignment.Top}
				></uilistlayout>
				{props.structureCategory === "Blueprints"
					? [...new Set(blueprints.map((blueprint) => blueprint.blueprintSubcategory))].map(
							(blueprintSubcategory) => (
								<Frame
									anchorPoint={new Vector2(0, 0)}
									position={new UDim2(0, 0, 0, 0)}
									size={new UDim2(1, 0, 0.169, 0)}
									backgroundTransparency={1}
									visible={
										blueprints
											.filter(
												(blueprint) => blueprint.blueprintSubcategory === blueprintSubcategory,
											)
											.map((blueprint) => {
												return {
													structureModel: blueprint.blueprintModel,
													structureDescription: blueprint.blueprintDescription,
												};
											})
											.filter(
												(structure) =>
													string.find(
														string.lower(structure.structureModel.Name),
														string.lower(searchText),
														1,
														true,
													)[0] !== undefined,
											)
											.size() > 0 ||
										string.find(
											string.lower(blueprintSubcategory),
											string.lower(searchText),
											1,
											true,
										)[0] !== undefined
									}
								>
									<Frame
										anchorPoint={new Vector2(0, 0)}
										position={new UDim2(0, 0, 0, 0)}
										size={lerpBinding(
											onMountAnimation,
											new UDim2(0, 0, 0.09, 0),
											new UDim2(0.428, 0, 0.09, 0),
										)}
										backgroundColor={colors.white}
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
											anchorPoint={new Vector2(0.5, 0.5)}
											position={new UDim2(0.524, 0, 0.52, 0)}
											size={new UDim2(0.951, 0, 1, 0)}
											font={fonts.josefinSans.regular}
											text={blueprintSubcategory}
											textSize={14}
											textColor={colors.white}
											textTransparency={onMountAnimation.map((value) => 1 - value)}
											textXAlignment={Enum.TextXAlignment.Left}
											textYAlignment={Enum.TextYAlignment.Center}
										></Text>
									</Frame>

									<Frame
										anchorPoint={new Vector2(0.5, 1)}
										position={new UDim2(0.5, 0, 1, 0)}
										size={new UDim2(0.95, 0, 0.84, 0)}
										backgroundTransparency={1}
									>
										<uigridlayout
											CellPadding={new UDim2(0, 26, 0, 26)}
											CellSize={new UDim2(0, 120, 0, 120)}
											FillDirection={Enum.FillDirection.Horizontal}
											SortOrder={Enum.SortOrder.LayoutOrder}
											StartCorner={Enum.StartCorner.TopLeft}
											HorizontalAlignment={Enum.HorizontalAlignment.Left}
											VerticalAlignment={Enum.VerticalAlignment.Top}
										></uigridlayout>

										{blueprints
											.filter(
												(blueprint) => blueprint.blueprintSubcategory === blueprintSubcategory,
											)
											.map((blueprint, index) => (
												<BuildMenuStructureButton
													index={index}
													structureSubCategory={blueprintSubcategory}
													structureModel={blueprint.blueprintModel}
													structureImage={blueprint.blueprintImage}
													structureDescription={blueprint.blueprintDescription}
													searchText={searchText}
												></BuildMenuStructureButton>
											))}
									</Frame>
								</Frame>
							),
					  )
					: STRUCTURE_SUB_CATEGORIES[props.structureCategory].map((structureSubCategory) => (
							<Frame
								anchorPoint={new Vector2(0, 0)}
								position={new UDim2(0, 0, 0, 0)}
								size={new UDim2(1, 0, 0.169, 0)}
								backgroundTransparency={1}
								visible={
									Object.entries(STRUCTURES)
										.filter(
											([, structureDefinition]) =>
												structureDefinition.index !== undefined &&
												structureDefinition.subCategory === structureSubCategory,
										)
										.sort(
											([, structureDefinitionA], [, structureDefinitionB]) =>
												structureDefinitionA.index! < structureDefinitionB.index!,
										)
										.map(([_, structureDefinition]) => {
											return {
												structureModel: structureDefinition.model,
												structureDescription: structureDefinition.description,
											};
										})
										.filter(
											(structure) =>
												string.find(
													string.lower(structure.structureModel.Name),
													string.lower(searchText),
													1,
													true,
												)[0] !== undefined,
										)
										.size() > 0 ||
									string.find(
										string.lower(structureSubCategory),
										string.lower(searchText),
										1,
										true,
									)[0] !== undefined
								}
							>
								<Frame
									anchorPoint={new Vector2(0, 0)}
									position={new UDim2(0, 0, 0, 0)}
									size={lerpBinding(
										onMountAnimation,
										new UDim2(0, 0, 0.09, 0),
										new UDim2(0.428, 0, 0.09, 0),
									)}
									backgroundColor={colors.white}
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
										anchorPoint={new Vector2(0.5, 0.5)}
										position={new UDim2(0.524, 0, 0.52, 0)}
										size={new UDim2(0.951, 0, 1, 0)}
										font={fonts.josefinSans.regular}
										text={structureSubCategory}
										textSize={14}
										textTransparency={onMountAnimation.map((value) => 1 - value)}
										textColor={colors.white}
										textXAlignment={Enum.TextXAlignment.Left}
										textYAlignment={Enum.TextYAlignment.Center}
									></Text>
								</Frame>

								<Frame
									anchorPoint={new Vector2(0.5, 1)}
									position={new UDim2(0.5, 0, 1, 0)}
									size={new UDim2(0.95, 0, 0.84, 0)}
									backgroundTransparency={1}
								>
									<uigridlayout
										CellPadding={new UDim2(0, 26, 0, 26)}
										CellSize={new UDim2(0, 120, 0, 120)}
										FillDirection={Enum.FillDirection.Horizontal}
										SortOrder={Enum.SortOrder.LayoutOrder}
										StartCorner={Enum.StartCorner.TopLeft}
										HorizontalAlignment={Enum.HorizontalAlignment.Left}
										VerticalAlignment={Enum.VerticalAlignment.Top}
									></uigridlayout>

									{Object.entries(STRUCTURES)
										.filter(
											([, structureDefinition]) =>
												structureDefinition.index !== undefined &&
												structureDefinition.subCategory === structureSubCategory,
										)
										.sort(
											([, structureDefinitionA], [, structureDefinitionB]) =>
												structureDefinitionA.index! < structureDefinitionB.index!,
										)
										.map(([_, structureDefinition]) => {
											return {
												structureModel: structureDefinition.model,
												structureDescription: structureDefinition.description,
											};
										})
										.map((structure, index) => (
											<BuildMenuStructureButton
												index={index}
												structureSubCategory={structureSubCategory}
												structureModel={structure.structureModel}
												structureImage={STRUCTURES[structure.structureModel.Name].image}
												structureDescription={structure.structureDescription}
												searchText={searchText}
											></BuildMenuStructureButton>
										))}
								</Frame>
							</Frame>
					  ))}
			</Frame>
		</scrollingframe>
	);
}
