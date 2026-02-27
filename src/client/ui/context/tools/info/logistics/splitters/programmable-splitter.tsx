import React, { useMemo, useRef, useState } from "@rbxts/react";
import { fonts, colors } from "client/ui/constants";
import { useSelector } from "@rbxts/react-reflex";
import { useUpdateEffect } from "@rbxts/pretty-react-hooks";
import { ProgrammableSplitterComponent } from "client/components/logistics/splitters/programmable-splitter";
import { splitterOutputDirections } from "client/components/logistics/splitters/splitter";
import { selectContextStructureAttribute, selectContextStructureComponents } from "client/store/context";
import { HttpService } from "@rbxts/services";
import { useStore } from "client/hooks";
import { Frame, Button, Image, ScrollingFrame, TextBox, Text } from "client/ui/core";
import { splitterFilters } from "client/components/logistics/splitters/smart-splitter";
import { IMAGES } from "shared/assets/images";
import { SplitterInfoPanelFilterButton } from "./filter-button";
import { BaseInfoPanel } from "../../base";

export function ProgrammableSplitterInfoPanel() {
	const programmableSplitterComponent = useSelector(
		selectContextStructureComponents(ProgrammableSplitterComponent),
	)[0];

	return (
		<BaseInfoPanel active={programmableSplitterComponent !== undefined} size={UDim2.fromScale(0.212, 0.371)}>
			<Frame Size={UDim2.fromScale(1, 0.815)} BackgroundTransparency={1}>
				<Text
					Size={UDim2.fromScale(0.391, 0.085)}
					FontFace={fonts.josefinSans.medium}
					Text={"Configuration :"}
					TextSize={20}
					TextXAlignment={Enum.TextXAlignment.Left}
					TextYAlignment={Enum.TextYAlignment.Top}
				></Text>

				<Frame Position={UDim2.fromScale(0, 0.12)} Size={UDim2.fromScale(1, 0.88)} BackgroundTransparency={1}>
					<uilistlayout
						FillDirection={Enum.FillDirection.Horizontal}
						SortOrder={Enum.SortOrder.LayoutOrder}
					></uilistlayout>

					{splitterOutputDirections.map((outputDirection) => (
						<ProgrammableSplitterInfoPanelFilters
							outputDirection={outputDirection}
						></ProgrammableSplitterInfoPanelFilters>
					))}
				</Frame>
			</Frame>
		</BaseInfoPanel>
	);
}

interface ProgrammableSplitterInfoPanelFiltersProps {
	outputDirection: string;
}

function ProgrammableSplitterInfoPanelFilters({ outputDirection }: ProgrammableSplitterInfoPanelFiltersProps) {
	const store = useStore();
	const programmableSplitterComponent = useSelector(
		selectContextStructureComponents(ProgrammableSplitterComponent),
	)[0];
	const filtersJSON = useSelector(selectContextStructureAttribute(outputDirection)) as string | undefined;
	const filters =
		programmableSplitterComponent !== undefined && filtersJSON !== undefined
			? (HttpService.JSONDecode(filtersJSON) as string[])
			: undefined;

	return (
		<Frame
			AnchorPoint={new Vector2(0, 0)}
			Position={UDim2.fromScale(0, 0)}
			Size={UDim2.fromScale(0.333, 1)}
			BackgroundTransparency={1}
		>
			<Text
				AnchorPoint={new Vector2(0.5, 0)}
				Position={UDim2.fromScale(0.5, 0)}
				Size={UDim2.fromScale(0.8, 0.14)}
				Text={`${outputDirection} Output :`}
				TextSize={14}
			></Text>

			<ScrollingFrame
				AnchorPoint={new Vector2(0.5, 0.5)}
				Position={UDim2.fromScale(0.5, 0.5)}
				Size={UDim2.fromScale(0.9, 0.707)}
			>
				<uistroke
					ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
					Color={colors.mediumgrey}
					LineJoinMode={Enum.LineJoinMode.Miter}
				>
					<uigradient Rotation={90}></uigradient>
				</uistroke>

				<uilistlayout
					SortOrder={Enum.SortOrder.LayoutOrder}
					HorizontalAlignment={Enum.HorizontalAlignment.Center}
				></uilistlayout>

				{filters !== undefined
					? filters.map((filter, index) => (
							<ProgrammableSplitterInfoPanelFilter
								outputDirection={outputDirection}
								selectedFilter={filter}
								index={index}
							></ProgrammableSplitterInfoPanelFilter>
					  ))
					: undefined}
			</ScrollingFrame>

			<Button
				AnchorPoint={new Vector2(0.5, 0)}
				Position={UDim2.fromScale(0.5, 0.9)}
				Size={UDim2.fromScale(1, 0.1)}
				Event={{
					MouseButton1Click: () => {
						store.setContextStructuresModelsAttribute(
							outputDirection,
							HttpService.JSONEncode([...filters!, splitterFilters[0]]),
						);
					},
				}}
			>
				<Text Size={UDim2.fromScale(1, 1)} Text="+ Add Filter" TextSize={14}></Text>
			</Button>
		</Frame>
	);
}

interface ProgrammableSplitterInfoPanelFilterProps {
	outputDirection: string;
	selectedFilter: string;
	index: number;
}

function ProgrammableSplitterInfoPanelFilter({
	outputDirection,
	selectedFilter,
	index,
}: ProgrammableSplitterInfoPanelFilterProps) {
	const store = useStore();
	const programmableSplitterComponent = useSelector(
		selectContextStructureComponents(ProgrammableSplitterComponent),
	)[0];
	const filtersJson = useSelector(selectContextStructureAttribute(outputDirection)) as string | undefined;
	const filters =
		programmableSplitterComponent !== undefined && filtersJson !== undefined
			? (HttpService.JSONDecode(filtersJson) as string[])
			: undefined;
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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
		<>
			<Frame Size={UDim2.fromScale(1, 0.24)} BackgroundTransparency={1} LayoutOrder={index}>
				<uistroke
					ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
					Color={colors.mediumgrey}
					LineJoinMode={Enum.LineJoinMode.Miter}
				></uistroke>

				<Image
					AnchorPoint={new Vector2(0.5, 0.5)}
					Position={UDim2.fromScale(0.12, 0.5)}
					Size={UDim2.fromScale(0.15, 0.42)}
					Image={IMAGES[selectedFilter]}
					Visible={!isSearching}
				></Image>

				<Text
					Size={UDim2.fromScale(0.64, 1)}
					Text={selectedFilter}
					TextSize={11}
					TextWrapped={true}
					TextXAlignment={Enum.TextXAlignment.Left}
					Visible={!isSearching}
				>
					<uipadding PaddingLeft={new UDim(0, 27)}></uipadding>
				</Text>

				<Button
					Position={UDim2.fromScale(0.64, 0)}
					Size={UDim2.fromScale(0.18, 1)}
					Visible={!isSearching}
					Event={{
						MouseButton1Click: () => {
							if (programmableSplitterComponent === undefined) return;
							const newFilters = [...filters!];
							newFilters.remove(index);
							store.setContextStructuresModelsAttribute(
								outputDirection,
								HttpService.JSONEncode(newFilters),
							);
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
						Size={UDim2.fromScale(0.605, 0.3)}
						Image="rbxassetid://91331618506957"
					></Image>
				</Button>

				<Button
					Position={UDim2.fromScale(0.82, 0)}
					Size={UDim2.fromScale(0.18, 1)}
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
						Rotation={90}
						Size={UDim2.fromScale(0.76, 0.3)}
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
					Size={UDim2.fromScale(0.155, 0.43)}
					Visible={isSearching}
					Image="rbxassetid://136023776711700"
				></Image>
			</Frame>

			<ScrollingFrame Size={UDim2.fromScale(1, 0.7)} LayoutOrder={index + 1} Visible={isDropdownOpen}>
				<uistroke
					ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
					Color={colors.mediumgrey}
					LineJoinMode={Enum.LineJoinMode.Miter}
				></uistroke>

				<uipadding PaddingTop={new UDim(0, 1)}></uipadding>

				<uilistlayout SortOrder={Enum.SortOrder.LayoutOrder}></uilistlayout>

				{splitterFilters.map((filter, index_) => {
					return (
						<SplitterInfoPanelFilterButton
							filter={filter}
							index={index_}
							mouseButton1Click={() => {
								if (programmableSplitterComponent === undefined) return;
								const newFilters = [...filters!];
								newFilters[index] = filter;
								store.setContextStructuresModelsAttribute(
									outputDirection,
									HttpService.JSONEncode(newFilters),
								);
								setIsDropdownOpen(false);
							}}
							isVisible={visibleFilters.includes(filter)}
							isSelected={selectedFilter === filter}
						></SplitterInfoPanelFilterButton>
					);
				})}
			</ScrollingFrame>
		</>
	);
}
