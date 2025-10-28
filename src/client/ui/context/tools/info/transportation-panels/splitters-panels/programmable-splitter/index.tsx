import React, { useState } from "@rbxts/react";
import { BaseInfoPanel } from "../../../base-panel";
import { Text } from "client/ui/core/text";
import { fonts, colors, springs } from "client/ui/constants";
import { Frame } from "client/ui/core/frame";
import { useSelector } from "@rbxts/react-reflex";
import { selectInfoSelectionStructureModel, selectInfoStructureAttribute } from "client/store/context/info";
import { lerpBinding, useUpdateEffect, useMotion } from "@rbxts/pretty-react-hooks";
import { Dependency } from "@flamework/core";
import { Components } from "@flamework/components";
import { SplitterOutputFilter, splitterOutputFilters } from "client/components/transporters/splitters/smart-splitter";
import { useRem } from "client/hooks/use-rem";
import { splitString } from "shared/utils/string";
import { useStore } from "client/hooks";
import { HttpService } from "@rbxts/services";
import { Button } from "client/ui/core/button";
import { ProgrammableSplitterComponent } from "client/components/transporters/splitters/programmable-splitter";
import { splitterOutputDirections } from "client/components/transporters/splitters/splitter";
import { ProgrammableSplitterInfoPanelFilterDropdown } from "./filter-dropdown";

export function ProgrammableSplitterInfoPanel() {
	const store = useStore();
	const rem = useRem();

	const components = Dependency<Components>();

	const structureModel = useSelector(selectInfoSelectionStructureModel);

	const [programmableSplitterComponent, setProgrammableSplitterComponent] = useState<ProgrammableSplitterComponent>();
	const [onMountAnimation, onMountAnimationMotion] = useMotion(0);

	useUpdateEffect(() => {
		setProgrammableSplitterComponent(
			structureModel !== undefined
				? components.getComponent<ProgrammableSplitterComponent>(structureModel)
				: undefined,
		);
	}, [structureModel]);

	useUpdateEffect(() => {
		onMountAnimationMotion.spring(programmableSplitterComponent !== undefined ? 1 : 0, springs.gentle);
	}, [programmableSplitterComponent]);

	return (
		<BaseInfoPanel
			structuresNames={["Programmable Splitter"]}
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
					position={lerpBinding(onMountAnimation, new UDim2(-0.25, 0, 0, 0), new UDim2(0, 0, 0, 0))}
					size={new UDim2(0.5, 0, 0.109, 0)}
					font={fonts.josefinSans.medium}
					text={"Configuration :"}
					textSize={20}
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
						FillDirection={Enum.FillDirection.Horizontal}
						HorizontalAlignment={Enum.HorizontalAlignment.Left}
						VerticalAlignment={Enum.VerticalAlignment.Top}
					></uilistlayout>

					{splitterOutputDirections.map((outputDirection) => {
						const selectedOutputFiltersJSON = useSelector(selectInfoStructureAttribute(outputDirection)) as
							| string
							| undefined;
						const selectedOutputFilters =
							selectedOutputFiltersJSON !== undefined &&
							!splitterOutputFilters.includes(selectedOutputFiltersJSON)
								? (HttpService.JSONDecode(selectedOutputFiltersJSON) as SplitterOutputFilter[])
								: undefined;

						return (
							<Frame size={new UDim2(0.331, 0, 1, 0)} backgroundTransparency={1}>
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
									text={`${splitString(outputDirection, " ")} :`}
									textSize={14}
									textTransparency={onMountAnimation.map((value) => 1 - value)}
									textColor={colors.white}
									textXAlignment={Enum.TextXAlignment.Center}
									textYAlignment={Enum.TextYAlignment.Center}
								></Text>

								<scrollingframe
									AnchorPoint={new Vector2(0.5, 0.5)}
									Position={new UDim2(0.5, 0, 0.5, 0)}
									Size={new UDim2(0.9, 0, 0.707, 0)}
									BackgroundTransparency={1}
									CanvasSize={new UDim2(0, 0, 10, 0)}
									ScrollBarThickness={0}
									ScrollBarImageTransparency={1}
									ScrollingDirection={Enum.ScrollingDirection.Y}
								>
									<uistroke
										ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
										Color={Color3.fromRGB(45, 45, 45)}
										LineJoinMode={Enum.LineJoinMode.Miter}
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
										FillDirection={Enum.FillDirection.Vertical}
										SortOrder={Enum.SortOrder.LayoutOrder}
										VerticalAlignment={Enum.VerticalAlignment.Top}
										HorizontalAlignment={Enum.HorizontalAlignment.Center}
									></uilistlayout>

									{selectedOutputFilters !== undefined
										? selectedOutputFilters.map((selectedOutputFilter, index) => {
												return (
													<ProgrammableSplitterInfoPanelFilterDropdown
														index={index}
														outputDirection={outputDirection}
														selectedOutputFilter={selectedOutputFilter}
														selectedOutputFilters={selectedOutputFilters}
													></ProgrammableSplitterInfoPanelFilterDropdown>
												);
										  })
										: undefined}
								</scrollingframe>

								<Button
									anchorPoint={new Vector2(0.5, 1)}
									position={new UDim2(0.5, 0, 1, 0)}
									size={new UDim2(1, 0, 0.11, 0)}
									onClick={() => {
										store.setInfoStructuresAttribute(
											outputDirection,
											HttpService.JSONEncode([
												...selectedOutputFilters!,
												splitterOutputFilters[0],
											]),
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
										textTransparency={onMountAnimation.map((value) => 1 - value)}
										textColor={colors.white}
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
