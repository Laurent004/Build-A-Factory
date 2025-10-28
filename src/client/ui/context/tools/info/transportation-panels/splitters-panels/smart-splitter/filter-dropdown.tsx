import React, { useRef, useState } from "@rbxts/react";
import { Text } from "client/ui/core/text";
import { fonts, colors, springs } from "client/ui/constants";
import { Frame } from "client/ui/core/frame";
import { IMAGES } from "shared/assets/images";
import { useStore } from "client/hooks";
import { lerpBinding, useMountEffect, useUpdateEffect, useMotion } from "@rbxts/pretty-react-hooks";
import { Image } from "client/ui/core/image";
import { Button } from "client/ui/core/button";
import { SplitterInfoPanelFilterDropdownButton } from "../filter-dropdown-button";
import { SplitterOutputFilter, splitterOutputFilters } from "client/components/transporters/splitters/smart-splitter";
import { SplitterOutputDirection } from "client/components/transporters/splitters/splitter";
import { useSelector } from "@rbxts/react-reflex";
import { selectInfoStructureAttribute } from "client/store/context/info";

export interface SmartSplitterPanelFilterDropdownProps {
	outputDirection: SplitterOutputDirection;
}

export function SmartSplitterInfoPanelFilterDropdown(props: SmartSplitterPanelFilterDropdownProps) {
	const store = useStore();

	const selectedOutputFilter = useSelector(selectInfoStructureAttribute(props.outputDirection)) as
		| SplitterOutputFilter
		| undefined;

	const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
	const [searching, setSearching] = useState<boolean>(false);
	const [searchText, setSearchText] = useState<string>("");
	const searchBoxRef = useRef<TextBox>();
	const [onMountAnimation, onMountAnimationMotion] = useMotion(0);

	useMountEffect(() => {
		onMountAnimationMotion.spring(1, springs.gentle);
		searchBoxRef.current!.FocusLost.Connect(() => {
			setSearching(false);
		});
	});

	useUpdateEffect(() => {
		if (!dropdownOpen) return;
		searchBoxRef.current!.CaptureFocus();
		setSearching(true);
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
				></uistroke>

				<Image
					anchorPoint={new Vector2(0.5, 0.5)}
					position={new UDim2(0.12, 0, 0.5, 0)}
					size={new UDim2(0.148, 0, 0.41, 0)}
					image={
						selectedOutputFilter !== undefined && splitterOutputFilters.includes(selectedOutputFilter)
							? IMAGES.ui[selectedOutputFilter]
							: undefined
					}
					imageTransparency={onMountAnimation.map((value) => 1 - value)}
					visible={!searching}
				></Image>

				<Text
					anchorPoint={new Vector2(0.5, 0.5)}
					position={new UDim2(0.428, 0, 0.5, 0)}
					size={new UDim2(0.387, 0, 0.825, 0)}
					font={fonts.josefinSans.regular}
					text={selectedOutputFilter}
					textSize={11}
					textTransparency={onMountAnimation.map((value) => 1 - value)}
					textColor={colors.white}
					textWrapped={true}
					textXAlignment={Enum.TextXAlignment.Left}
					textYAlignment={Enum.TextYAlignment.Center}
					visible={!searching}
				></Text>

				<Button
					anchorPoint={new Vector2(1, 0.5)}
					position={new UDim2(1, 0, 0.5, 0)}
					size={new UDim2(0.26, 0, 1, 0)}
					onClick={() => {
						setDropdownOpen(!dropdownOpen);
					}}
					visible={!searching}
				>
					<uistroke
						ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
						Color={Color3.fromRGB(45, 45, 45)}
						LineJoinMode={Enum.LineJoinMode.Miter}
					></uistroke>

					<Image
						anchorPoint={new Vector2(0.5, 0.5)}
						position={lerpBinding(onMountAnimation, new UDim2(0.5, 0, -0.25, 0), new UDim2(0.5, 0, 0.5, 0))}
						size={new UDim2(0.54, 0, 0.3, 0)}
						rotation={90}
						image={IMAGES.ui.Arrow}
						imageTransparency={onMountAnimation.map((value) => 1 - value)}
					></Image>
				</Button>

				<textbox
					ref={searchBoxRef}
					Change={{
						Text: (searchBox) => {
							setSearchText(searchBox.Text);
						},
					}}
					AnchorPoint={new Vector2(0.5, 0.5)}
					Position={new UDim2(0.399, 0, 0.5, 0)}
					Size={new UDim2(0.673, 0, 1, 0)}
					BackgroundTransparency={1}
					FontFace={fonts.josefinSans.regular}
					TextColor3={colors.white}
					TextSize={12}
					TextTruncate={Enum.TextTruncate.AtEnd}
					TextXAlignment={Enum.TextXAlignment.Left}
					TextYAlignment={Enum.TextYAlignment.Center}
					PlaceholderText="Search for..."
					PlaceholderColor3={Color3.fromRGB(190, 190, 190)}
					ClearTextOnFocus={true}
					Visible={searching}
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
				></uistroke>

				<uilistlayout
					FillDirection={Enum.FillDirection.Vertical}
					HorizontalAlignment={Enum.HorizontalAlignment.Center}
					VerticalAlignment={Enum.VerticalAlignment.Top}
					SortOrder={Enum.SortOrder.LayoutOrder}
				></uilistlayout>

				<uipadding PaddingTop={new UDim(0, 1)}></uipadding>

				{selectedOutputFilter !== undefined && splitterOutputFilters.includes(selectedOutputFilter)
					? splitterOutputFilters.map((splitterOutputFilter, index) => {
							return (
								<SplitterInfoPanelFilterDropdownButton
									size={new UDim2(1, 0, 0.028, 0)}
									index={index}
									outputFilter={splitterOutputFilter}
									selectedOutputFilter={selectedOutputFilter}
									dropdownOpen={dropdownOpen}
									searchText={searchText}
									onClick={() => {
										setDropdownOpen(false);
										store.setInfoStructuresAttribute(props.outputDirection, splitterOutputFilter);
									}}
								></SplitterInfoPanelFilterDropdownButton>
							);
					  })
					: undefined}
			</scrollingframe>
		</>
	);
}
