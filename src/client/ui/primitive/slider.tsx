import React, { useEffect, useRef, useState } from "@rbxts/react";
import { Frame } from "../core/frame";
import { colors } from "client/constants/colors";
import { fonts } from "client/constants/fonts";

export interface SliderProps {
	barPosition: UDim2;
	barSize: UDim2;
	maxValue: number;
	onSliderMoved: (position: UDim2) => void;
}

export function Slider(props: SliderProps) {
	const boundingFrameRef = useRef<Frame>();
	const [boundingFrame, setBoundingFrame] = useState<Frame>();
	const dragdetectorRef = useRef<UIDragDetector>();

	const [sliderYScale, setSliderYScale] = useState(1 - 1 / props.maxValue);

	useEffect(() => {
		if (boundingFrameRef.current !== undefined) {
			setBoundingFrame(boundingFrameRef.current);
		}
	}, [boundingFrameRef.current]);

	useEffect(() => {
		if (dragdetectorRef.current !== undefined) {
			dragdetectorRef.current.AddConstraintFunction(1, (proposedPosition, proposedRotation) => {
				const yIncrement = 1 / props.maxValue;
				const snappedYScale = math.round(proposedPosition.Y.Scale / yIncrement) * yIncrement;
				return $tuple(new UDim2(proposedPosition.X.Scale, 0, snappedYScale, 0), proposedRotation);
			});
		}
	}, [dragdetectorRef.current]);

	return (
		<Frame size={new UDim2(1, 0, 1, 0)} backgroundTransparency={1}>
			<Frame
				ref={boundingFrameRef}
				anchorPoint={new Vector2(0.5, 0.5)}
				position={props.barPosition}
				size={props.barSize}
				backgroundColor={Color3.fromRGB(38, 38, 38)}
			>
				<uicorner CornerRadius={new UDim(0, 6)}></uicorner>
				<uistroke
					ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
					Color={Color3.fromRGB(70, 70, 70)}
					LineJoinMode={Enum.LineJoinMode.Round}
				></uistroke>
				<Frame
					anchorPoint={new Vector2(0.5, 0.5)}
					position={new UDim2(0.5, 0, sliderYScale, 0)}
					size={new UDim2(2, 0, 0.055, 0)}
					backgroundColor={colors.lightblue}
					change={{
						Position: (sliderFrame) => {
							setSliderYScale(sliderFrame.Position.Y.Scale);
							props.onSliderMoved(sliderFrame.Position);
						},
					}}
				>
					<uicorner CornerRadius={new UDim(0, 10)}></uicorner>
					<uistroke
						ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
						Color={colors.white}
						LineJoinMode={Enum.LineJoinMode.Round}
					></uistroke>

					<uidragdetector
						ref={dragdetectorRef}
						BoundingUI={boundingFrame}
						DragRelativity={Enum.UIDragDetectorDragRelativity.Absolute}
						DragStyle={Enum.UIDragDetectorDragStyle.TranslateLine}
						DragAxis={new Vector2(0, 1)}
						ResponseStyle={Enum.UIDragDetectorResponseStyle.Scale}
					></uidragdetector>
				</Frame>
			</Frame>

			<textbox
				AnchorPoint={new Vector2(0.5, 1)}
				Position={new UDim2(0.5, 0, 1, 0)}
				Size={new UDim2(0.477, 0, 0.1, 0)}
				BackgroundColor3={Color3.fromRGB(36, 36, 36)}
				Event={{
					FocusLost: (textbox) => {
						const inputNumber = tonumber(textbox.Text);
						setSliderYScale(inputNumber === undefined ? 0 : 1 - inputNumber / props.maxValue);
					},
				}}
				FontFace={fonts.josefinSans.regular}
				TextSize={15}
				Text={tostring(math.round((1 - sliderYScale) * props.maxValue))}
				TextColor3={colors.white}
				TextXAlignment={Enum.TextXAlignment.Center}
				TextYAlignment={Enum.TextYAlignment.Center}
			>
				<uistroke
					ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
					Color={Color3.fromRGB(70, 70, 70)}
					LineJoinMode={Enum.LineJoinMode.Round}
				></uistroke>
			</textbox>
		</Frame>
	);
}
