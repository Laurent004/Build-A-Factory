import React, { useRef } from "@rbxts/react";
import { fonts, colors } from "client/ui/constants";
import { useSelector } from "@rbxts/react-reflex";
import { mergerPriorities, PriorityMergerComponent } from "client/components/logistics/mergers/priority-merger";
import { mergerInputDirections } from "client/components/logistics/mergers/merger";
import { selectContextStructureAttribute, selectContextStructureComponents } from "client/store/context";
import { Frame, Image, Text } from "client/ui/core";
import { useStore } from "client/hooks";
import { IMAGES } from "shared/assets/images";
import { BaseInfoPanel } from "../base";
import { useMountEffect } from "@rbxts/pretty-react-hooks";

export function PriortyMergerInfoPanel() {
	const priorityMergerComponent = useSelector(selectContextStructureComponents(PriorityMergerComponent))[0];

	return (
		<BaseInfoPanel active={priorityMergerComponent !== undefined} size={UDim2.fromScale(.212,.371)}>
			<Frame Size={UDim2.fromScale(1, 0.816)} BackgroundTransparency={1} LayoutOrder={1}>
				<Text
					Size={UDim2.fromScale(0.391, 0.085)}
					FontFace={fonts.josefinSans.medium}
					Text={"Configuration :"}
					TextSize={20}
					TextXAlignment={Enum.TextXAlignment.Left}
					TextYAlignment={Enum.TextYAlignment.Top}
				></Text>

				<Frame Position={UDim2.fromScale(0, 0.1)} Size={UDim2.fromScale(1, 0.9)} BackgroundTransparency={1}>
					<uilistlayout
						FillDirection={Enum.FillDirection.Horizontal}
						SortOrder={Enum.SortOrder.LayoutOrder}
					></uilistlayout>

					{mergerInputDirections.map((inputDirection) => (
						<PriorityMergerInfoPanelPriority
							inputDirection={inputDirection}
						></PriorityMergerInfoPanelPriority>
					))}
				</Frame>
			</Frame>
		</BaseInfoPanel>
	);
}

interface PriorityMergerInfoPanelPriorityProps {
	inputDirection: string;
}

function PriorityMergerInfoPanelPriority({ inputDirection }: PriorityMergerInfoPanelPriorityProps) {
	const store = useStore();
	const priority = useSelector(selectContextStructureAttribute(inputDirection)) as string | undefined;
	const frameRef = useRef<Frame>();
	const uiDragDetectorRef=useRef<UIDragDetector>();

	useMountEffect(()=>{
	 	uiDragDetectorRef.current!.AddConstraintFunction(1,(proposedPosition,proposedRotation)=>
			$tuple(UDim2.fromScale(proposedPosition.X.Scale,math.clamp(math.round(proposedPosition.Y.Scale/(1/(mergerPriorities.size()-1)) )*(1/(mergerPriorities.size()-1)),0,1)),proposedRotation)
		)
	})

	return (
		<Frame Size={UDim2.fromScale(0.333, 1)} BackgroundTransparency={1}>
			<Text
				AnchorPoint={new Vector2(0.5, 0)}
				Position={UDim2.fromScale(0.5, 0)}
				Size={UDim2.fromScale(0.7, 0.13)}
				Text={`${inputDirection} Input :`}
				TextSize={14}
			></Text>

			<Frame
				ref={frameRef}
				AnchorPoint={new Vector2(0.5, 0.5)}
				Position={UDim2.fromScale(0.5, 0.5)}
				Size={UDim2.fromScale(0.07, 0.69)}
				BackgroundColor3={Color3.fromRGB(32, 32, 32)}
			>
				<uigradient Rotation={90}></uigradient>

				<uistroke
					ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
					Color={colors.mediumgrey}
					LineJoinMode={Enum.LineJoinMode.Miter}
				>
					<uigradient Rotation={90}></uigradient>
				</uistroke>

				<Frame
					AnchorPoint={new Vector2(0.5, 0.5)}
					Position={UDim2.fromScale(.5,.5)}
					Size={UDim2.fromScale(2.8, 0.05)}
					BackgroundColor3={colors.lightblue}
				>
					<uidragdetector
						ref={uiDragDetectorRef}
						DragStyle={Enum.UIDragDetectorDragStyle.TranslateLine}
						ReferenceUIInstance={frameRef.current}
						ResponseStyle={Enum.UIDragDetectorResponseStyle.Scale}
						DragAxis={new Vector2(0, 1)}
						DragUDim2={UDim2.fromScale(0,priority!==undefined?(mergerPriorities.indexOf(priority)-1)/-2:0)}
						Event={
							{
								DragEnd:(uiDragDetector)=>{
									store.setContextStructuresModelsAttribute(
										inputDirection,
										mergerPriorities[math.round(uiDragDetector.DragUDim2.Y.Scale*-2+1)],
									);
								}
						
							}
						}
						
						
					></uidragdetector>

					<uistroke
						ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
						Color={colors.marineblue}
						LineJoinMode={Enum.LineJoinMode.Miter}
					></uistroke>

					<Image
						AnchorPoint={new Vector2(0.5, 0.5)}
						Position={UDim2.fromScale(0.5, 0.5)}
						Size={UDim2.fromScale(2, 3)}
						Image={IMAGES.Glow}
						ImageColor3={colors.lightblue}
						ImageTransparency={0.75}
					></Image>
				</Frame>
			</Frame>

			<Text
				AnchorPoint={new Vector2(0.5, 0)}
				Position={UDim2.fromScale(0.5, 0.92)}
				Size={UDim2.fromScale(0.8, 0.08)}
				Text={`Priority : ${priority}`}
				TextSize={14}
			></Text>
		</Frame>
	);
}
