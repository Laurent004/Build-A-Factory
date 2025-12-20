import React, { useEffect, useRef, useState } from "@rbxts/react";
import { Text } from "client/ui/core/text";
import { fonts, colors, springs } from "client/ui/constants";
import { Frame } from "client/ui/core/frame";
import { IMAGES } from "shared/assets/images";
import { useStore } from "client/hooks";
import { lerpBinding, useUpdateEffect, useMotion, usePrevious } from "@rbxts/pretty-react-hooks";
import { Image } from "client/ui/core/image";
import { Button } from "client/ui/core/button";
import { InfoPanelFiltersDropdownButton } from "../filters-dropdown-button";
import { SplitterFilter, splitterFilters } from "client/components/logistics/splitters/smart-splitter";
import { SplitterOutputDirection } from "client/components/logistics/splitters/splitter";
import { useSelector } from "@rbxts/react-reflex";
import { selectContextStructureModelAttribute, selectContextStructureModels } from "client/store/context";

export interface SmartSplitterInfoPanelFiltersDropdownProps {
	outputDirection: SplitterOutputDirection;
}

export function SmartSplitterInfoPanelFiltersDropdown(props: SmartSplitterInfoPanelFiltersDropdownProps) {
	const store = useStore();
	const structureModel = useSelector(selectContextStructureModels)[0];
	const previousStructureModel = usePrevious(structureModel);
	const selectedFilter = useSelector(selectContextStructureModelAttribute(props.outputDirection)) as
		| SplitterFilter
		| undefined;
	const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
	const [searching, setSearching] = useState<boolean>(false);
	const [searchText, setSearchText] = useState<string>("");
	const searchBoxRef = useRef<TextBox>();
	const [onMountAnimation, onMountAnimationMotion] = useMotion(0);

	useEffect(() => {
		if (structureModel === undefined) {
			onMountAnimationMotion.spring(0, springs.gentle);
			return;
		} else if (structureModel.Name !== previousStructureModel?.Name) {
			onMountAnimationMotion.immediate(0);
			onMountAnimationMotion.spring(1, springs.gentle);
		}
	}, [structureModel]);

	useUpdateEffect(() => {
		if (!dropdownOpen) return;
		searchBoxRef.current!.CaptureFocus();
		setSearching(true);
		searchBoxRef.current!.FocusLost.Once(() => {
			setSearching(false);
		});
	}, [dropdownOpen]);

	return (
		<>
			<Frame
				anchorPoint={new Vector2(0.5, 0)}
				position={new UDim2(0.5, 0, 0, 0)}
				size={new UDim2(1, 0, 0.244, 0)}
				backgroundColor={Color3.fromRGB(18, 18, 18)}
			>
				<uistroke
					ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
					Color={Color3.fromRGB(45, 45, 45)}
					LineJoinMode={Enum.LineJoinMode.Miter}
					Thickness={1}
				></uistroke>

				<Image
					anchorPoint={new Vector2(0.5, 0.5)}
					position={new UDim2(0.12, 0, 0.5, 0)}
					rotation={
						props.outputDirection !== "ForwardOutput"
							? lerpBinding(onMountAnimation, props.outputDirection === "LeftOutput" ? -120 : 120, 0)
							: 0
					}
					size={new UDim2(0.148, 0, 0.41, 0)}
					visible={!searching}
					image={
						selectedFilter !== undefined && splitterFilters.includes(selectedFilter)
							? IMAGES.ui[selectedFilter]
							: undefined
					}
					imageTransparency={onMountAnimation.map((value) => 1 - value)}
				></Image>

				<Text
					anchorPoint={new Vector2(0.5, 0.5)}
					position={lerpBinding(onMountAnimation, new UDim2(0.428, 0, 1, 0), new UDim2(0.428, 0, 0.5, 0))}
					size={new UDim2(0.387, 0, 0.825, 0)}
					visible={!searching}
					font={fonts.josefinSans.regular}
					text={selectedFilter}
					textSize={11}
					textColor={colors.white}
					textTransparency={onMountAnimation.map((value) => 1 - value)}
					textWrapped={true}
					textXAlignment={Enum.TextXAlignment.Left}
					textYAlignment={Enum.TextYAlignment.Center}
				></Text>

				<Button
					anchorPoint={new Vector2(1, 0.5)}
					position={new UDim2(1, 0, 0.5, 0)}
					size={new UDim2(0.26, 0, 1, 0)}
					visible={!searching}
					onClick={() => {
						setDropdownOpen(!dropdownOpen);
					}}
				>
					<uistroke
						ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
						Color={Color3.fromRGB(45, 45, 45)}
						LineJoinMode={Enum.LineJoinMode.Miter}
						Thickness={1}
					></uistroke>

					<Image
						anchorPoint={new Vector2(0.5, 0.5)}
						position={lerpBinding(onMountAnimation, new UDim2(0.5, 0, -0.25, 0), new UDim2(0.5, 0, 0.5, 0))}
						size={new UDim2(0.54, 0, 0.3, 0)}
						rotation={90}
						image="rbxassetid://87835167641652"
						imageTransparency={onMountAnimation.map((value) => 1 - value)}
					></Image>
				</Button>

				<textbox
					ref={searchBoxRef}
					AnchorPoint={new Vector2(0.5, 0.5)}
					Position={new UDim2(0.399, 0, 0.5, 0)}
					Size={new UDim2(0.673, 0, 1, 0)}
					BackgroundTransparency={1}
					Visible={searching}
					ClearTextOnFocus={true}
					FontFace={fonts.josefinSans.regular}
					PlaceholderText="Search for..."
					PlaceholderColor3={Color3.fromRGB(190, 190, 190)}
					Text={""}
					TextSize={12}
					TextColor3={colors.white}
					TextTruncate={Enum.TextTruncate.SplitWord}
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
					position={new UDim2(0.86, 0, 0.5, 0)}
					size={new UDim2(0.155, 0, 0.44, 0)}
					image={IMAGES.ui.Magnifier}
					visible={searching}
				></Image>
			</Frame>

			<scrollingframe
				AnchorPoint={new Vector2(0.5, 1)}
				Position={new UDim2(0.5, 0, 1, 0)}
				Size={new UDim2(1, 0, 0.756, 0)}
				BackgroundTransparency={1}
				BorderSizePixel={0}
				Visible={dropdownOpen}
				CanvasSize={new UDim2(0, 0, 10, 0)}
				ScrollBarThickness={0}
				ScrollBarImageTransparency={1}
				ScrollingDirection={Enum.ScrollingDirection.Y}
			>
				<uistroke
					ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
					Color={Color3.fromRGB(45, 45, 45)}
					LineJoinMode={Enum.LineJoinMode.Miter}
					Thickness={1}
				></uistroke>

				<uilistlayout
					Padding={new UDim(0, 0)}
					FillDirection={Enum.FillDirection.Vertical}
					SortOrder={Enum.SortOrder.LayoutOrder}
					HorizontalAlignment={Enum.HorizontalAlignment.Center}
					VerticalAlignment={Enum.VerticalAlignment.Top}
				></uilistlayout>

				<uipadding
					PaddingTop={new UDim(0, 1)}
					PaddingLeft={new UDim(0, 0)}
					PaddingRight={new UDim(0, 0)}
					PaddingBottom={new UDim(0, 0)}
				></uipadding>

				{selectedFilter !== undefined && splitterFilters.includes(selectedFilter)
					? splitterFilters.map((filter, index) => {
							return (
								<InfoPanelFiltersDropdownButton
									index={index}
									filter={filter}
									dropdownOpen={dropdownOpen}
									selectedFilter={selectedFilter}
									searchText={searchText}
									size={new UDim2(1, 0, 0.028, 0)}
									onClick={() => {
										setDropdownOpen(false);
										store.setContextStructuresModelsAttribute(props.outputDirection, filter);
									}}
								></InfoPanelFiltersDropdownButton>
							);
					  })
					: undefined}
			</scrollingframe>
		</>
	);
}
