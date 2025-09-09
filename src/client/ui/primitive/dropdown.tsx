import React, { useEffect, useState } from "@rbxts/react";
import { Frame } from "../core/frame";
import { Text } from "../core/text";
import { fonts } from "client/constants/fonts";
import { Image } from "../core/image";
import { Button } from "../core/button";
import { colors } from "client/constants/colors";
import { DropdownButton } from "./dropdown-button";

export interface DropdownProps extends React.PropsWithChildren {
	position: UDim2;
	size: UDim2;

	selectedOptionIndex: number;
	selectedOptionImage: string;
	selectedOptionText: string;

	optionsListSize: UDim2;
	optionsListCanvasSize: UDim2;

	optionButtonSize: UDim2;
	optionsButtons: {
		image: string;
		text: string;
		onClick: () => void;
	}[];
}

export function Dropdown(props: DropdownProps) {
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const [selectedOptionIndex, setSelectedOptionIndex] = useState(props.selectedOptionIndex);
	useEffect(() => {
		setSelectedOptionIndex(props.selectedOptionIndex);
	}, [props.selectedOptionIndex]);

	return (
		<Frame
			anchorPoint={new Vector2(0.5, 0.5)}
			position={props.position}
			size={props.size}
			backgroundColor={Color3.fromRGB(20, 20, 20)}
		>
			<uistroke
				ApplyStrokeMode={Enum.ApplyStrokeMode.Contextual}
				Color={Color3.fromRGB(45, 45, 45)}
				LineJoinMode={Enum.LineJoinMode.Miter}
			></uistroke>

			<Image
				anchorPoint={new Vector2(0.5, 0.5)}
				position={new UDim2(0.12, 0, 0.5, 0)}
				size={new UDim2(0.148, 0, 0.458, 0)}
				image={props.selectedOptionImage}
			></Image>

			<Text
				anchorPoint={new Vector2(0.5, 0.5)}
				position={new UDim2(0.5, 0, 0.5, 0)}
				size={new UDim2(0.532, 0, 0.825, 0)}
				font={fonts.josefinSans.regular}
				text={props.selectedOptionText}
				textSize={11}
				textColor={colors.white}
				textWrapped={true}
				textXAlignment={Enum.TextXAlignment.Left}
				textYAlignment={Enum.TextYAlignment.Center}
			></Text>

			<Button
				anchorPoint={new Vector2(1, 0.5)}
				position={new UDim2(1, 0, 0.5, 0)}
				size={new UDim2(0.227, 0, 1, 0)}
				onClick={() => {
					setDropdownOpen(!dropdownOpen);
				}}
			>
				<uistroke
					ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
					Color={Color3.fromRGB(45, 45, 45)}
					LineJoinMode={Enum.LineJoinMode.Miter}
				></uistroke>

				<Image
					anchorPoint={new Vector2(0.5, 0.5)}
					position={new UDim2(0.5, 0, 0.5, 0)}
					size={new UDim2(0.589, 0, 0.408, 0)}
					rotation={90}
					image="rbxassetid://87835167641652"
				></Image>
			</Button>

			<scrollingframe
				AnchorPoint={new Vector2(0.5, 0)}
				Position={new UDim2(0.5, 0, 1, 0)}
				Size={props.optionsListSize}
				BackgroundTransparency={1}
				CanvasSize={props.optionsListCanvasSize}
				ScrollBarThickness={0}
				ScrollBarImageTransparency={1}
				Visible={dropdownOpen}
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
				{props.optionsButtons.map((optionButton, index) => {
					return (
						<DropdownButton
							size={props.optionButtonSize}
							image={optionButton.image}
							text={optionButton.text}
							index={index}
							selectedOptionIndex={selectedOptionIndex}
							onClick={() => {
								optionButton.onClick();
								setSelectedOptionIndex(index);
							}}
						></DropdownButton>
					);
				})}
			</scrollingframe>
		</Frame>
	);
}
