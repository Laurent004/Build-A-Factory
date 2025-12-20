import React, { useRef, useState } from "@rbxts/react";
import { Text } from "client/ui/core/text";
import { fonts, colors, springs } from "client/ui/constants";
import { Frame } from "client/ui/core/frame";
import { IMAGES } from "shared/assets/images";
import { useStore } from "client/hooks";
import { lerpBinding, useMountEffect, useUpdateEffect, useMotion } from "@rbxts/pretty-react-hooks";
import { Image } from "client/ui/core/image";
import { Button } from "client/ui/core/button";
import { InfoPanelFiltersDropdownButton } from "../filters-dropdown-button";
import { HttpService } from "@rbxts/services";
import { SplitterFilter, splitterFilters } from "client/components/logistics/splitters/smart-splitter";
import { SplitterOutputDirection } from "client/components/logistics/splitters/splitter";

export interface ProgrammableSplitterInfoPanelFiltersDropdownProps {
	index: number;
	outputDirection: SplitterOutputDirection;
	filter: SplitterFilter;
	selectedFilters: SplitterFilter[] | undefined;
}

export function ProgrammableSplitterInfoPanelFiltersDropdown(props: ProgrammableSplitterInfoPanelFiltersDropdownProps) {
	const store = useStore();
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const [searching, setSearching] = useState<boolean>(false);
	const [searchText, setSearchText] = useState<string>("");
	const searchBoxRef = useRef<TextBox>();
	const [onMountAnimation, onMountAnimationMotion] = useMotion(0);

	useMountEffect(() => {
		onMountAnimationMotion.spring(1, springs.gentle);
	});

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
				size={new UDim2(1, 0, 0.017, 0)}
				backgroundColor={Color3.fromRGB(18, 18, 18)}
				layoutOrder={props.index}
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
					size={new UDim2(0.148, 0, 0.42, 0)}
					rotation={
						props.outputDirection !== "ForwardOutput"
							? lerpBinding(onMountAnimation, props.outputDirection === "LeftOutput" ? -120 : 120, 0)
							: 0
					}
					image={IMAGES.ui[props.filter]}
					imageTransparency={onMountAnimation.map((value) => 1 - value)}
					visible={!searching}
				></Image>

				<Text
					anchorPoint={new Vector2(0.5, 0.5)}
					position={lerpBinding(onMountAnimation, new UDim2(0.428, 0, 1, 0), new UDim2(0.428, 0, 0.5, 0))}
					size={new UDim2(0.387, 0, 0.825, 0)}
					font={fonts.josefinSans.regular}
					text={props.filter}
					textSize={11}
					textColor={colors.white}
					textTransparency={onMountAnimation.map((value) => 1 - value)}
					textWrapped={true}
					textXAlignment={Enum.TextXAlignment.Left}
					textYAlignment={Enum.TextYAlignment.Center}
					visible={!searching}
				></Text>

				<Button
					anchorPoint={new Vector2(1, 0.5)}
					position={new UDim2(0.81, 0, 0.5, 0)}
					size={new UDim2(0.18, 0, 1, 0)}
					visible={!searching}
					onClick={() => {
						const newFilters = [...props.selectedFilters!];
						newFilters.remove(props.index);
						store.setContextStructuresModelsAttribute(
							props.outputDirection,
							HttpService.JSONEncode(newFilters),
						);
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
						size={new UDim2(0.605, 0, 0.32, 0)}
						image="rbxassetid://91331618506957"
						imageTransparency={onMountAnimation.map((value) => 1 - value)}
					></Image>
				</Button>

				<Button
					anchorPoint={new Vector2(1, 0.5)}
					position={new UDim2(1, 0, 0.5, 0)}
					size={new UDim2(0.18, 0, 1, 0)}
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
						size={new UDim2(0.605, 0, 0.32, 0)}
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
				Size={new UDim2(1, 0, 0.054, 0)}
				BackgroundTransparency={1}
				BorderSizePixel={0}
				LayoutOrder={props.index + 1}
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
				{splitterFilters.map((filter, index) => {
					return (
						<InfoPanelFiltersDropdownButton
							size={new UDim2(1, 0, 0.002, 0)}
							index={index}
							filter={filter}
							dropdownOpen={dropdownOpen}
							selectedFilter={props.filter}
							searchText={searchText}
							onClick={() => {
								setDropdownOpen(false);
								const newFilters = [...props.selectedFilters!];
								newFilters[props.index] = filter;
								store.setContextStructuresModelsAttribute(
									props.outputDirection,
									HttpService.JSONEncode(newFilters),
								);
							}}
						></InfoPanelFiltersDropdownButton>
					);
				})}
			</scrollingframe>
		</>
	);
}
