import React from "@rbxts/react";
import { useStore } from "client/hooks";
import { useSelector } from "@rbxts/react-reflex";
import { StructureButton } from "./structure-button";
import { fonts } from "client/constants/fonts";
import { StructureCategory, STRUCTURES, STRUCTURE_SUB_CATEGORIES } from "shared/constants/structures";
import { Frame } from "client/ui/core/frame";
import { Text } from "client/ui/core/text";
import { selectBuildMenuStructureCategory, selectBuildMenuStructureCategorySearchText } from "client/store/menus/build";
import { SearchBar } from "client/ui/primitive/search-bar";
import { colors } from "client/constants/colors";
import { Object } from "@rbxts/luau-polyfill";

export interface StructureButtonsProps {
	structureCategory: StructureCategory;
}

export function StructureButtons(props: StructureButtonsProps) {
	const store = useStore();
	const structureCategory = useSelector(selectBuildMenuStructureCategory);
	const structureSearchText = useSelector(selectBuildMenuStructureCategorySearchText(props.structureCategory));

	return (
		<scrollingframe
			AnchorPoint={new Vector2(0.5, 0.5)}
			Position={new UDim2(0.348, 0, 0.568, 0)}
			Size={new UDim2(0.697, 0, 0.865, 0)}
			BackgroundTransparency={1}
			BorderSizePixel={0}
			CanvasSize={new UDim2(0, 0, 2, 0)}
			ScrollBarThickness={6}
			ScrollBarImageColor3={Color3.fromRGB(206, 206, 206)}
			Visible={props.structureCategory === structureCategory}
		>
			<SearchBar
				position={new UDim2(0.153, 0, 0.029, 0)}
				size={new UDim2(0.304, 0, 0.02, 0)}
				magnifierImagePosition={new UDim2(0.939, 0, 0.5, 0)}
				magnifierImageSize={new UDim2(0.083, 0, 0.789, 0)}
				onSearchTextChanged={(newSearchText) => {
					store.setBuildMenuStructureCategorySearchText(props.structureCategory, newSearchText);
				}}
			></SearchBar>

			<Frame
				anchorPoint={new Vector2(0.5, 0.5)}
				position={new UDim2(0.5, 0, 0.555, 0)}
				size={new UDim2(1, 0, 1, 0)}
				backgroundTransparency={1}
			>
				<uilistlayout></uilistlayout>
				{STRUCTURE_SUB_CATEGORIES[props.structureCategory].map((structureSubCategory) => (
					<Frame
						size={new UDim2(1, 0, 0.3, 0)}
						backgroundTransparency={1}
						visible={
							Object.entries(STRUCTURES)
								.filter(
									([structureName, structureDefinition]) =>
										string.find(
											string.lower(structureName),
											string.lower(structureSearchText),
											1,
											true,
										)[0] !== undefined && structureDefinition.subCategory === structureSubCategory,
								)
								.size() > 0 ||
							string.find(
								string.lower(structureSubCategory),
								string.lower(structureSearchText),
								1,
								true,
							)[0] !== undefined
						}
					>
						<Frame
							anchorPoint={new Vector2(0, 0)}
							position={new UDim2(0, 0, 0, 0)}
							size={new UDim2(0.428, 0, 0.082, 0)}
							backgroundColor={Color3.fromRGB(225, 225, 225)}
						>
							<uigradient
								Color={
									new ColorSequence([
										new ColorSequenceKeypoint(0, Color3.fromRGB(35, 35, 35)),
										new ColorSequenceKeypoint(1, Color3.fromRGB(139, 139, 139)),
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
								textColor={colors.white}
								textXAlignment={Enum.TextXAlignment.Left}
							></Text>
						</Frame>

						<Frame
							anchorPoint={new Vector2(0.5, 0.5)}
							position={new UDim2(0.5, 0, 0.53, 0)}
							size={new UDim2(0.957, 0, 0.85, 0)}
							backgroundTransparency={1}
						>
							<uigridlayout
								CellPadding={new UDim2(0, 28, 0, 28)}
								CellSize={new UDim2(0, 120, 0, 120)}
								SortOrder={Enum.SortOrder.LayoutOrder}
								FillDirection={Enum.FillDirection.Horizontal}
								HorizontalAlignment={Enum.HorizontalAlignment.Left}
								VerticalAlignment={Enum.VerticalAlignment.Top}
							></uigridlayout>
							{Object.entries(STRUCTURES)
								.filter(
									([_, structureDefintion]) =>
										structureDefintion.subCategory === structureSubCategory,
								)
								.map(([structureName, _]) => (
									<StructureButton structureName={structureName}></StructureButton>
								))}
						</Frame>
					</Frame>
				))}
			</Frame>
		</scrollingframe>
	);
}
