import React, { useState } from "@rbxts/react";
import { BaseInfoPanel } from "../base-panel";
import { Text } from "client/ui/core/text";
import { fonts, colors, springs } from "client/ui/constants";
import { Frame } from "client/ui/core/frame";
import { useSelector } from "@rbxts/react-reflex";
import { selectInfoSelectionStructureModel, selectInfoStructureAttribute } from "client/store/context/info";
import { lerpBinding, useUpdateEffect, useMotion } from "@rbxts/pretty-react-hooks";
import { Dependency } from "@flamework/core";
import { Components } from "@flamework/components";
import {
	mergerInputPriorities,
	MergerInputPriority,
	PriorityMergerComponent,
} from "client/components/transporters/mergers/priority-merger";
import { useRem } from "client/hooks/use-rem";
import { splitString } from "shared/utils/string";
import { Image } from "client/ui/core/image";
import { IMAGES } from "shared/assets/images";
import { useStore } from "client/hooks";
import { mergerInputDirections } from "client/components/transporters/mergers/merger";

export function PriortyMergerInfoPanel() {
	const store = useStore();
	const rem = useRem();

	const components = Dependency<Components>();

	const structureModel = useSelector(selectInfoSelectionStructureModel);

	const [mergerComponent, setMergerComponent] = useState<PriorityMergerComponent>();
	const [onMountAnimation, onMountAnimationMotion] = useMotion(0);

	useUpdateEffect(() => {
		setMergerComponent(
			structureModel !== undefined ? components.getComponent<PriorityMergerComponent>(structureModel) : undefined,
		);
	}, [structureModel]);

	useUpdateEffect(() => {
		onMountAnimationMotion.spring(mergerComponent !== undefined ? 1 : 0, springs.gentle);
	}, [mergerComponent]);

	return (
		<BaseInfoPanel
			structuresNames={["Priority Merger"]}
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
					anchorPoint={new Vector2(0.5, 0.5)}
					position={new UDim2(0.5, 0, 0.567, 0)}
					size={new UDim2(1, 0, 0.9, 0)}
					backgroundTransparency={1}
				>
					<uilistlayout
						FillDirection={Enum.FillDirection.Horizontal}
						HorizontalAlignment={Enum.HorizontalAlignment.Left}
						VerticalAlignment={Enum.VerticalAlignment.Top}
					></uilistlayout>

					{mergerInputDirections.map((inputDirection) => {
						const inputPriority = useSelector(selectInfoStructureAttribute(inputDirection)) as
							| MergerInputPriority
							| undefined;

						return (
							<Frame size={new UDim2(0.331, 0, 1, 0)} backgroundTransparency={1}>
								<Text
									anchorPoint={new Vector2(0.5, 0)}
									position={lerpBinding(
										onMountAnimation,
										inputDirection === "LeftInput"
											? new UDim2(0, 0, 0, 0)
											: inputDirection === "BackwardInput"
											? new UDim2(0.5, 0, 0.2, 0)
											: new UDim2(1, 0, 0, 0),
										new UDim2(0.5, 0, 0, 0),
									)}
									size={new UDim2(1, 0, 0.143, 0)}
									font={fonts.josefinSans.regular}
									text={`${splitString(inputDirection, " ")} :`}
									textSize={14}
									textTransparency={0}
									textColor={colors.white}
									textXAlignment={Enum.TextXAlignment.Center}
									textYAlignment={Enum.TextYAlignment.Center}
								></Text>
								<Frame
									anchorPoint={new Vector2(0.5, 0.5)}
									position={new UDim2(0.5, 0, 0.49, 0)}
									size={new UDim2(0.07, 0, 0.69, 0)}
									backgroundColor={Color3.fromRGB(37, 37, 37)}
								>
									<uistroke
										ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
										Color={colors.mediumgrey}
										LineJoinMode={Enum.LineJoinMode.Miter}
									>
										<uigradient
											Rotation={-90}
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

									<uigradient
										Rotation={-90}
										Transparency={onMountAnimation.map(
											(value) =>
												new NumberSequence([
													new NumberSequenceKeypoint(0, 0),
													new NumberSequenceKeypoint(math.clamp(value, 0, 0.999), 1 - value),
													new NumberSequenceKeypoint(1, 1),
												]),
										)}
									></uigradient>

									<Frame
										anchorPoint={new Vector2(0.5, 0.5)}
										position={
											inputPriority !== undefined
												? new UDim2(
														0.5,
														0,
														mergerInputPriorities.indexOf(inputPriority) /
															(mergerInputPriorities.size() - 1),
														0,
												  )
												: undefined
										}
										size={lerpBinding(
											onMountAnimation,
											new UDim2(0, 0, 0.05, 0),
											new UDim2(2.8, 0, 0.05, 0),
										)}
										backgroundColor={colors.lightblue}
										backgroundTransparency={onMountAnimation.map((value) => 1 - value)}
										change={{
											Position: (frame) => {
												const incrementYScale = 1 / (mergerInputPriorities.size() - 1);
												const snappedYScale = math.clamp(
													math.round(frame.Position.Y.Scale / incrementYScale) *
														incrementYScale,
													0,
													1,
												);
												frame.Position = new UDim2(0.5, 0, snappedYScale, 0);

												store.setInfoStructuresAttribute(
													inputDirection,
													mergerInputPriorities[
														math.floor((mergerInputPriorities.size() - 1) * snappedYScale)
													],
												);
											},
										}}
									>
										<uidragdetector
											DragRelativity={Enum.UIDragDetectorDragRelativity.Absolute}
											DragStyle={Enum.UIDragDetectorDragStyle.TranslateLine}
											DragAxis={new Vector2(0, 1)}
											ResponseStyle={Enum.UIDragDetectorResponseStyle.Scale}
										></uidragdetector>

										<uistroke
											ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
											Color={colors.marineblue}
											LineJoinMode={Enum.LineJoinMode.Miter}
										></uistroke>

										<Image
											anchorPoint={new Vector2(0.5, 0.5)}
											position={new UDim2(0.5, 0, 0.5, 0)}
											size={new UDim2(2.25, 0, 3, 0)}
											backgroundTransparency={1}
											image={IMAGES.ui.Glow}
											imageColor={colors.lightblue}
											imageTransparency={lerpBinding(onMountAnimation, 1, 0.7)}
										></Image>
									</Frame>
								</Frame>
								<Text
									anchorPoint={new Vector2(0.5, 1)}
									position={lerpBinding(
										onMountAnimation,
										new UDim2(0.5, 0, 1.5, 0),
										new UDim2(0.5, 0, 1, 0),
									)}
									size={new UDim2(1, 0, 0.143, 0)}
									font={fonts.josefinSans.regular}
									text={`Priority : ${inputPriority}`}
									textSize={14}
									textTransparency={onMountAnimation.map((value) => 1 - value)}
									textColor={colors.white}
									textXAlignment={Enum.TextXAlignment.Center}
									textYAlignment={Enum.TextYAlignment.Center}
								></Text>
							</Frame>
						);
					})}
				</Frame>
			</Frame>
		</BaseInfoPanel>
	);
}
