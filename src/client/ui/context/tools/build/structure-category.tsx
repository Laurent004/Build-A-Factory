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
import { selectContext } from "client/store/context";
import { selectBuildMenuStructureCategory } from "client/store/context/build";
import { StructureButton } from "./structure-button";
import { Text } from "client/ui/core/text";

export interface StructureCategoryProps {
	structureCategory: StructureCategory;
	milestone: number;
}

export function StructureCategory(props: StructureCategoryProps) {
	const context = useSelector(selectContext);
	const selectedStructureCategory = useSelector(selectBuildMenuStructureCategory);

	const [blueprints, setBlueprints] = useState<
		{
			blueprintModel: Model;
			blueprintDescription: string;
			blueprintSubcategory: string;
		}[]
	>([]);
	const [searchText, setSearchText] = useState<string>("");
	const [onMountAnimation, onMountAnimationMotion] = useMotion(0);

	useUpdateEffect(() => {
		if (context !== "Build" || selectedStructureCategory !== props.structureCategory) return;
		onMountAnimationMotion.immediate(0);
		onMountAnimationMotion.spring(1, springs.gentle);
	}, [context, selectedStructureCategory]);

	useEventListener(Events.OnBlueprintCreation, (blueprintModel, blueprintDescription, blueprintSubCategory) => {
		if (props.structureCategory !== "Blueprint") return;
		const newBlueprint = {
			blueprintModel: blueprintModel,
			blueprintDescription: blueprintDescription,
			blueprintSubcategory: blueprintSubCategory,
		};
		setBlueprints((previousBlueprints) => [...previousBlueprints, newBlueprint]);

		blueprintModel.Destroying.Once(() => {
			setBlueprints((previousBlueprints) => {
				const newBlueprints = [...previousBlueprints];
				newBlueprints.remove(newBlueprints.indexOf(newBlueprint));
				return newBlueprints;
			});
		});
	});

	useEventListener(Events.OnBlueprintEdit, (blueprintModel, blueprintDescription) => {
		if (props.structureCategory !== "Blueprint") return;
		setBlueprints((previousBlueprints) => {
			const newBlueprints = [...previousBlueprints];
			newBlueprints[
				newBlueprints.findIndex((blueprint) => blueprint.blueprintModel === blueprintModel)
			].blueprintDescription = blueprintDescription;
			return newBlueprints;
		});
	});

	return (
		<scrollingframe
			AnchorPoint={new Vector2(0.5, 0.5)}
			Position={new UDim2(0.348, 0, 0.568, 0)}
			Size={new UDim2(0.697, 0, 0.865, 0)}
			BackgroundTransparency={1}
			CanvasSize={new UDim2(0, 0, 2, 0)}
			ScrollBarThickness={0}
			ScrollBarImageTransparency={1}
			ScrollingDirection={Enum.ScrollingDirection.Y}
			Visible={selectedStructureCategory === props.structureCategory}
		>
			<Frame
				anchorPoint={new Vector2(0.5, 0.5)}
				position={lerpBinding(onMountAnimation, new UDim2(-0.153, 0, 0.029, 0), new UDim2(0.153, 0, 0.029, 0))}
				size={new UDim2(0.304, 0, 0.02, 0)}
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
					PlaceholderColor3={colors.grey}
					PlaceholderText={"Search for..."}
					TextSize={14}
					TextColor3={Color3.fromRGB(207, 207, 207)}
					Text=""
					TextXAlignment={Enum.TextXAlignment.Left}
					TextYAlignment={Enum.TextYAlignment.Center}
					Change={{
						Text: (textBox) => {
							setSearchText(textBox.Text);
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
				size={new UDim2(1, 0, 0.94, 0)}
				backgroundTransparency={1}
			>
				<uilistlayout
					HorizontalAlignment={Enum.HorizontalAlignment.Left}
					VerticalAlignment={Enum.VerticalAlignment.Top}
					SortOrder={Enum.SortOrder.LayoutOrder}
				></uilistlayout>
				{props.structureCategory === "Blueprint"
					? [...new Set(blueprints.map((blueprint) => blueprint.blueprintSubcategory))].map(
							(blueprintSubcategory) => (
								<Frame
									size={new UDim2(1, 0, 0.23, 0)}
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
											new UDim2(0, 0, 0.1, 0),
											new UDim2(0.428, 0, 0.1, 0),
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
											textTransparency={onMountAnimation.map((value) => 1 - value)}
											textColor={colors.white}
											textXAlignment={Enum.TextXAlignment.Left}
										></Text>
									</Frame>

									<Frame
										anchorPoint={new Vector2(0.5, 1)}
										position={new UDim2(0.5, 0, 1, 0)}
										size={new UDim2(0.95, 0, 0.815, 0)}
										backgroundTransparency={1}
									>
										<uigridlayout
											CellPadding={new UDim2(0, 25, 0, 25)}
											CellSize={new UDim2(0, 120, 0, 120)}
											SortOrder={Enum.SortOrder.LayoutOrder}
											FillDirection={Enum.FillDirection.Horizontal}
											HorizontalAlignment={Enum.HorizontalAlignment.Left}
											VerticalAlignment={Enum.VerticalAlignment.Top}
										></uigridlayout>
										{blueprints
											.filter(
												(blueprint) => blueprint.blueprintSubcategory === blueprintSubcategory,
											)
											.map((blueprint) => {
												return {
													structureModel: blueprint.blueprintModel,
													structureDescription: blueprint.blueprintDescription,
												};
											})
											.map((structure, index) => (
												<StructureButton
													index={index}
													structureSubCategory={blueprintSubcategory}
													structureModel={structure.structureModel}
													structureDescription={structure.structureDescription}
													milestone={props.milestone}
													searchText={searchText}
												></StructureButton>
											))}
									</Frame>
								</Frame>
							),
					  )
					: STRUCTURE_SUB_CATEGORIES[props.structureCategory].map((structureSubCategory) => (
							<Frame
								size={new UDim2(1, 0, 0.23, 0)}
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
										new UDim2(0, 0, 0.1, 0),
										new UDim2(0.428, 0, 0.1, 0),
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
									></Text>
								</Frame>

								<Frame
									anchorPoint={new Vector2(0.5, 1)}
									position={new UDim2(0.5, 0, 1, 0)}
									size={new UDim2(0.95, 0, 0.815, 0)}
									backgroundTransparency={1}
								>
									<uigridlayout
										CellPadding={new UDim2(0, 25, 0, 25)}
										CellSize={new UDim2(0, 120, 0, 120)}
										SortOrder={Enum.SortOrder.LayoutOrder}
										FillDirection={Enum.FillDirection.Horizontal}
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
											<StructureButton
												index={index}
												structureSubCategory={structureSubCategory}
												structureModel={structure.structureModel}
												structureDescription={structure.structureDescription}
												milestone={props.milestone}
												searchText={searchText}
											></StructureButton>
										))}
								</Frame>
							</Frame>
					  ))}
			</Frame>
		</scrollingframe>
	);
}
