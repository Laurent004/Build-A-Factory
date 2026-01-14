import React, { useMemo, useRef, useState } from "@rbxts/react";
import { fonts, colors } from "client/ui/constants";
import { useSelector } from "@rbxts/react-reflex";
import { useUpdateEffect } from "@rbxts/pretty-react-hooks";
import { SmartSplitterComponent, splitterFilters } from "client/components/logistics/splitters/smart-splitter";
import { splitterOutputDirections } from "client/components/logistics/splitters/splitter";
import { selectContextStructureAttribute, selectContextStructureComponents } from "client/store/context";
import { Button, Frame, Image, ScrollingFrame, Text, TextBox } from "client/ui/core";
import { useStore } from "client/hooks";
import { IMAGES } from "shared/assets/images";
import { SplitterInfoPanelFilterButton } from "./filter-button";
import { BaseInfoPanel } from "../../base";

export function SmartSplitterInfoPanel() {
	const smartSplitterComponent = useSelector(selectContextStructureComponents(SmartSplitterComponent))[0];

	return (
		<BaseInfoPanel active={smartSplitterComponent !== undefined} size={UDim2.fromScale(0.212, 0.345)}>
			<Frame Size={UDim2.fromScale(1, 0.799)} BackgroundTransparency={1} LayoutOrder={1}>
				<Text
					Size={UDim2.fromScale(0.391, 0.085)}
					FontFace={fonts.josefinSans.medium}
					Text={"Configuration :"}
					TextSize={20}
					TextXAlignment={Enum.TextXAlignment.Left}
					TextYAlignment={Enum.TextYAlignment.Top}
				></Text>

				<Frame Position={UDim2.fromScale(0, 0.13)} Size={UDim2.fromScale(1, 0.87)} BackgroundTransparency={1}>
					<uilistlayout
						FillDirection={Enum.FillDirection.Horizontal}
						SortOrder={Enum.SortOrder.LayoutOrder}
					></uilistlayout>

					{splitterOutputDirections.map((outputDirection) => {
						return (
							<SmartSplitterInfoPanelFilter
								outputDirection={outputDirection}
							></SmartSplitterInfoPanelFilter>
						);
					})}
				</Frame>
			</Frame>
		</BaseInfoPanel>
	);
}

interface SmartSplitterInfoPanelFilterProps {
	outputDirection: string;
}

function SmartSplitterInfoPanelFilter({ outputDirection }: SmartSplitterInfoPanelFilterProps) {
	const store = useStore();
	const smartSplitterComponent = useSelector(selectContextStructureComponents(SmartSplitterComponent));
	const selectedFilter = useSelector(selectContextStructureAttribute(outputDirection)) as string | undefined;
	const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
	const [isSearching, setIsSearching] = useState<boolean>(false);
	const [searchText, setSearchText] = useState<string>("");
	const textBoxRef = useRef<TextBox>();
	const visibleFilters = useMemo<string[]>(
		() => splitterFilters.filter((filter) => filter.lower().find(searchText)[0] !== undefined),
		[searchText],
	);

	useUpdateEffect(() => {
		if (!isDropdownOpen) return;
		textBoxRef.current!.CaptureFocus();
	}, [isDropdownOpen]);

	return (
		<Frame
			AnchorPoint={new Vector2(0, 0)}
			Position={UDim2.fromScale(0, 0)}
			Size={UDim2.fromScale(0.331, 1)}
			BackgroundTransparency={1}
		>
			<Text
				AnchorPoint={new Vector2(0.5, 0)}
				Position={UDim2.fromScale(0.5, 0)}
				Size={UDim2.fromScale(0.8, 0.14)}
				Text={`${outputDirection} Output :`}
				TextSize={14}
			></Text>

			<Frame
				AnchorPoint={new Vector2(0.5, 0.5)}
				Position={UDim2.fromScale(0.5, 0.565)}
				Size={UDim2.fromScale(0.9, 0.8)}
				BackgroundTransparency={1}
			>
				<uistroke
					ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
					Color={colors.mediumgrey}
					LineJoinMode={Enum.LineJoinMode.Miter}
				>
					<uigradient Rotation={90}></uigradient>
				</uistroke>

				<Frame Size={UDim2.fromScale(1, 0.244)} BackgroundTransparency={1}>
					<uistroke
						ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
						Color={colors.mediumgrey}
						LineJoinMode={Enum.LineJoinMode.Miter}
					></uistroke>

					<Image
						AnchorPoint={new Vector2(0.5, 0.5)}
						Position={UDim2.fromScale(0.12, 0.5)}
						Size={UDim2.fromScale(0.148, 0.41)}
						Visible={!isSearching}
						Image={selectedFilter !== undefined ? IMAGES.ui[selectedFilter] : undefined}
					></Image>

					<Text
						Size={UDim2.fromScale(0.74, 1)}
						Visible={!isSearching}
						Text={selectedFilter}
						TextSize={11}
						TextWrapped={true}
						TextXAlignment={Enum.TextXAlignment.Left}
					>
						<uipadding PaddingLeft={new UDim(0, 27)}></uipadding>
					</Text>

					<Button
						Position={UDim2.fromScale(0.74, 0)}
						Size={UDim2.fromScale(0.26, 1)}
						Visible={!isSearching}
						Event={{
							MouseButton1Click: () => {
								setIsDropdownOpen(!isDropdownOpen);
							},
						}}
					>
						<uistroke
							ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
							Color={colors.mediumgrey}
							LineJoinMode={Enum.LineJoinMode.Miter}
						></uistroke>

						<Image
							AnchorPoint={new Vector2(0.5, 0.5)}
							Position={UDim2.fromScale(0.5, 0.5)}
							Size={UDim2.fromScale(0.54, 0.3)}
							Rotation={90}
							Image="rbxassetid://87835167641652"
						></Image>
					</Button>

					<TextBox
						ref={textBoxRef}
						Size={UDim2.fromScale(1, 1)}
						Visible={isSearching}
						PlaceholderText="Search for..."
						PlaceholderColor3={Color3.fromRGB(190, 190, 190)}
						TextSize={12}
						TextTruncate={Enum.TextTruncate.SplitWord}
						TextXAlignment={Enum.TextXAlignment.Left}
						Event={{
							Focused: () => {
								setIsSearching(true);
							},
							FocusLost: () => {
								setIsSearching(false);
							},
						}}
						Change={{
							Text: (textBox) => {
								setSearchText(textBox.Text);
							},
						}}
					>
						<uipadding PaddingLeft={new UDim(0, 7)} PaddingRight={new UDim(0, 28)}></uipadding>
					</TextBox>

					<Image
						AnchorPoint={new Vector2(0.5, 0.5)}
						Position={UDim2.fromScale(0.84, 0.5)}
						Size={UDim2.fromScale(0.16, 0.43)}
						Visible={isSearching}
						Image="rbxassetid://136023776711700"
					></Image>
				</Frame>

				<ScrollingFrame
					Position={UDim2.fromScale(0, 0.244)}
					Size={UDim2.fromScale(1, 0.756)}
					Visible={isDropdownOpen}
				>
					<uistroke
						ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
						Color={colors.mediumgrey}
						LineJoinMode={Enum.LineJoinMode.Miter}
					></uistroke>

					<uipadding PaddingTop={new UDim(0, 1)}></uipadding>

					<uilistlayout SortOrder={Enum.SortOrder.LayoutOrder}></uilistlayout>

					{splitterFilters.map((filter, index) => {
						return (
							<SplitterInfoPanelFilterButton
								filter={filter}
								index={index}
								mouseButton1Click={() => {
									if (smartSplitterComponent === undefined) return;
									store.setContextStructuresModelsAttribute(outputDirection, filter);
									setIsDropdownOpen(false);
								}}
								isVisible={visibleFilters.includes(filter)}
								isSelected={selectedFilter === filter}
							></SplitterInfoPanelFilterButton>
						);
					})}
				</ScrollingFrame>
			</Frame>
		</Frame>
	);
}
