import React from "@rbxts/react";
import { Text } from "client/ui/core/text";
import { fonts, colors, springs } from "client/ui/constants";
import { Frame } from "client/ui/core/frame";
import { useSelector } from "@rbxts/react-reflex";
import { lerpBinding, useUpdateEffect, useMotion } from "@rbxts/pretty-react-hooks";
import { SplitterFilter, splitterFilters } from "client/components/logistics/splitters/smart-splitter";
import { useRem } from "client/hooks/use-rem";
import { useStore } from "client/hooks";
import { HttpService } from "@rbxts/services";
import { Button } from "client/ui/core/button";
import { ProgrammableSplitterComponent } from "client/components/logistics/splitters/programmable-splitter";
import { splitterOutputDirections } from "client/components/logistics/splitters/splitter";
import { ProgrammableSplitterInfoPanelFiltersDropdown } from "./filters-dropdown";
import { BaseInfoPanel } from "../../../base";
import { selectContextStructureModelAttribute, selectContextStructureModelComponent } from "client/store/context";

export function ProgrammableSplitterInfoPanel() {
	const store = useStore();
	const rem = useRem();
	const programmableSplitterComponent = useSelector(
		selectContextStructureModelComponent(ProgrammableSplitterComponent),
	);
	const [onMountAnimation, onMountAnimationMotion] = useMotion(0);

	useUpdateEffect(() => {
		onMountAnimationMotion.spring(programmableSplitterComponent !== undefined ? 1 : 0, springs.gentle);
	}, [programmableSplitterComponent]);

	return (
		<BaseInfoPanel
			active={programmableSplitterComponent !== undefined}
			size={new UDim2(0, rem(409), 0, rem(400))}
			headerSize={new UDim2(1, 0, 0.119, 0)}
			headerIconSize={new UDim2(0.058, 0, 0.502, 0)}
			descriptionPosition={new UDim2(0.5, 0, 0.212, 0)}
			descriptionSize={new UDim2(0.913, 0, 0.095, 0)}
		>
			<Frame
				anchorPoint={new Vector2(0.5, 0.5)}
				position={new UDim2(0.5, 0, 0.626, 0)}
				size={new UDim2(0.913, 0, 0.657, 0)}
				backgroundTransparency={1}
			>
				<Text
					anchorPoint={new Vector2(0, 0)}
					position={lerpBinding(onMountAnimation, new UDim2(-0.25, 0, 0, 0), new UDim2(0, 0, 0, 0))}
					size={new UDim2(0.5, 0, 0.08, 0)}
					font={fonts.josefinSans.medium}
					text={"Configuration :"}
					textSize={20}
					textTransparency={onMountAnimation.map((value) => 1 - value)}
					textColor={colors.white}
					textXAlignment={Enum.TextXAlignment.Left}
					textYAlignment={Enum.TextYAlignment.Top}
				></Text>

				<Frame
					anchorPoint={new Vector2(0.5, 1)}
					position={new UDim2(0.5, 0, 1, 0)}
					size={new UDim2(1, 0, 0.9, 0)}
					backgroundTransparency={1}
				>
					<uilistlayout
						Padding={new UDim(0, 0)}
						FillDirection={Enum.FillDirection.Horizontal}
						SortOrder={Enum.SortOrder.LayoutOrder}
						HorizontalAlignment={Enum.HorizontalAlignment.Left}
						VerticalAlignment={Enum.VerticalAlignment.Top}
					></uilistlayout>

					{splitterOutputDirections.map((outputDirection) => {
						const selectedFiltersJSON = useSelector(
							selectContextStructureModelAttribute(outputDirection),
						) as string | undefined;
						const selectedFilters =
							selectedFiltersJSON !== undefined && !splitterFilters.includes(selectedFiltersJSON)
								? (HttpService.JSONDecode(selectedFiltersJSON) as SplitterFilter[])
								: undefined;

						return (
							<Frame
								anchorPoint={new Vector2(0, 0)}
								position={new UDim2(0, 0, 0, 0)}
								size={new UDim2(0.331, 0, 1, 0)}
								backgroundTransparency={1}
							>
								<Text
									anchorPoint={new Vector2(0.5, 0)}
									position={lerpBinding(
										onMountAnimation,
										outputDirection === "LeftOutput"
											? new UDim2(1, 0, 0, 0)
											: outputDirection === "ForwardOutput"
											? new UDim2(0.5, 0, 0.2, 0)
											: new UDim2(0, 0, 0, 0),
										new UDim2(0.5, 0, 0, 0),
									)}
									size={new UDim2(1, 0, 0.143, 0)}
									font={fonts.josefinSans.regular}
									text={`${outputDirection.gsub("(%u)", " %1")[0].gsub("^%s+", "")[0]} :`}
									textSize={14}
									textColor={colors.white}
									textTransparency={onMountAnimation.map((value) => 1 - value)}
									textXAlignment={Enum.TextXAlignment.Center}
									textYAlignment={Enum.TextYAlignment.Center}
								></Text>

								<scrollingframe
									AnchorPoint={new Vector2(0.5, 0.5)}
									Position={new UDim2(0.5, 0, 0.5, 0)}
									Size={new UDim2(0.9, 0, 0.707, 0)}
									BackgroundTransparency={1}
									BorderSizePixel={0}
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
									>
										<uigradient
											Rotation={90}
											Transparency={onMountAnimation.map(
												(value) =>
													new NumberSequence([
														new NumberSequenceKeypoint(0, 0),
														new NumberSequenceKeypoint(
															math.clamp(value, 0, 0.999),
															1 - value,
														),
														new NumberSequenceKeypoint(1, 1),
													]),
											)}
										></uigradient>
									</uistroke>

									<uilistlayout
										Padding={new UDim(0, 0)}
										FillDirection={Enum.FillDirection.Vertical}
										SortOrder={Enum.SortOrder.LayoutOrder}
										HorizontalAlignment={Enum.HorizontalAlignment.Center}
										VerticalAlignment={Enum.VerticalAlignment.Top}
									></uilistlayout>

									{selectedFilters !== undefined
										? selectedFilters.map((selectedFilter, index) => {
												return (
													<ProgrammableSplitterInfoPanelFiltersDropdown
														index={index}
														outputDirection={outputDirection}
														filter={selectedFilter}
														selectedFilters={selectedFilters}
													></ProgrammableSplitterInfoPanelFiltersDropdown>
												);
										  })
										: undefined}
								</scrollingframe>

								<Button
									anchorPoint={new Vector2(0.5, 1)}
									position={new UDim2(0.5, 0, 1, 0)}
									size={new UDim2(1, 0, 0.11, 0)}
									onClick={() => {
										store.setContextStructuresModelsAttribute(
											outputDirection,
											HttpService.JSONEncode([...selectedFilters!, splitterFilters[0]]),
										);
									}}
								>
									<Text
										anchorPoint={new Vector2(0.5, 0.5)}
										position={lerpBinding(
											onMountAnimation,
											new UDim2(0.5, 0, 1, 0),
											new UDim2(0.5, 0, 0.5, 0),
										)}
										size={new UDim2(1, 0, 1, 0)}
										font={fonts.josefinSans.regular}
										text="+ Add Filter"
										textSize={14}
										textColor={colors.white}
										textTransparency={onMountAnimation.map((value) => 1 - value)}
										textXAlignment={Enum.TextXAlignment.Center}
										textYAlignment={Enum.TextYAlignment.Center}
									></Text>
								</Button>
							</Frame>
						);
					})}
				</Frame>
			</Frame>
		</BaseInfoPanel>
	);
}
