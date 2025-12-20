import React from "@rbxts/react";
import { Text, TextProps } from "../text";
import { round } from "shared/utils/math";
import { NumberSpinnerDigit } from "./digit";

export interface NumberSpinnerProps extends TextProps {
	value: number;
	duration: number;
	decimals: number;
	prefix: string;
	suffix: string;
	commas: boolean;
	digitSize: UDim2;
	prefixSize: UDim2;
	suffixSize: UDim2;
	commaSize: UDim2;
}

export function NumberSpinner(props: NumberSpinnerProps) {
	const [whole, decimal] = string.split(
		props.decimals > 0 ? tostring(round(props.value, props.decimals)) : string.format("%d", math.abs(props.value)),
		".",
	);

	return (
		<canvasgroup
			Active={false}
			AnchorPoint={props.anchorPoint}
			Position={props.position}
			Size={props.size}
			BackgroundTransparency={1}
			Interactable={false}
			BorderSizePixel={0}
			ZIndex={props.zIndex}
		>
			<uilistlayout
				Padding={new UDim(0, 0)}
				FillDirection={Enum.FillDirection.Horizontal}
				SortOrder={Enum.SortOrder.LayoutOrder}
				HorizontalAlignment={
					props.textXAlignment === Enum.TextXAlignment.Left
						? Enum.HorizontalAlignment.Left
						: props.textXAlignment === Enum.TextXAlignment.Center
						? Enum.HorizontalAlignment.Center
						: Enum.HorizontalAlignment.Right
				}
				VerticalAlignment={
					props.textYAlignment === Enum.TextYAlignment.Top
						? Enum.VerticalAlignment.Top
						: props.textYAlignment === Enum.TextYAlignment.Center
						? Enum.VerticalAlignment.Center
						: Enum.VerticalAlignment.Bottom
				}
			></uilistlayout>

			<Text
				anchorPoint={new Vector2(0, 0)}
				automaticSize={Enum.AutomaticSize.X}
				position={new UDim2(0, 0, 0, 0)}
				size={props.prefixSize}
				layoutOrder={-1000}
				visible={props.prefix !== ""}
				font={props.font}
				text={props.prefix}
				textSize={props.textSize}
				textColor={props.textColor}
				textTransparency={props.textTransparency}
				textStrokeColor={props.textStrokeColor}
				textStrokeTransparency={props.textStrokeTransparency}
				textTruncate={props.textTruncate}
				textWrapped={props.textWrapped}
				textXAlignment={props.textXAlignment}
				textYAlignment={props.textYAlignment}
			></Text>

			<Text
				anchorPoint={new Vector2(0, 0)}
				automaticSize={Enum.AutomaticSize.X}
				position={new UDim2(0, 0, 0, 0)}
				size={props.prefixSize}
				layoutOrder={-999}
				visible={props.value < 0}
				font={props.font}
				text="-"
				textSize={props.textSize}
				textColor={props.textColor}
				textTransparency={props.textTransparency}
				textStrokeColor={props.textStrokeColor}
				textStrokeTransparency={props.textStrokeTransparency}
				textTruncate={props.textTruncate}
				textWrapped={props.textWrapped}
				textXAlignment={props.textXAlignment}
				textYAlignment={props.textYAlignment}
			></Text>

			{[...whole].map((whole, index) => (
				<NumberSpinnerDigit
					value={tonumber(whole)!}
					duration={props.duration}
					anchorPoint={new Vector2(0, 0)}
					position={new UDim2(0, 0, 0, 0)}
					size={
						tonumber(whole) !== 1
							? props.digitSize
							: new UDim2(0, props.digitSize.X.Offset * 0.5, props.digitSize.Y.Scale, 0)
					}
					layoutOrder={(index + 1) * 2 - 900}
					font={props.font}
					text=""
					textSize={props.textSize}
					textColor={props.textColor}
					textTransparency={props.textTransparency}
					textStrokeColor={props.textStrokeColor}
					textStrokeTransparency={props.textStrokeTransparency}
					textTruncate={props.textTruncate}
					textWrapped={props.textWrapped}
					textXAlignment={props.textXAlignment}
					textYAlignment={props.textYAlignment}
				></NumberSpinnerDigit>
			))}

			{(props.commas ? [...string.format("%d", math.floor(math.abs(props.value)))] : []).mapFiltered(
				(_, index) => {
					if (index === 0 || index % 3 !== 0) return undefined;
					return (
						<Text
							anchorPoint={new Vector2(0, 0)}
							automaticSize={Enum.AutomaticSize.X}
							position={new UDim2(0, 0, 0, 0)}
							size={props.commaSize}
							layoutOrder={whole.size() * 2 - 900 - (index - 1) * 2 - 1}
							font={props.font}
							text=","
							textSize={props.textSize}
							textColor={props.textColor}
							textTransparency={props.textTransparency}
							textStrokeColor={props.textStrokeColor}
							textStrokeTransparency={props.textStrokeTransparency}
							textTruncate={props.textTruncate}
							textWrapped={props.textWrapped}
							textXAlignment={props.textXAlignment}
							textYAlignment={props.textYAlignment}
						></Text>
					);
				},
			)}

			<Text
				anchorPoint={new Vector2(0, 0)}
				automaticSize={Enum.AutomaticSize.X}
				position={new UDim2(0, 0, 0, 0)}
				size={new UDim2(0, 0, 1, 0)}
				layoutOrder={0}
				visible={decimal !== undefined}
				font={props.font}
				text="."
				textSize={props.textSize}
				textColor={props.textColor}
				textTransparency={props.textTransparency}
				textStrokeColor={props.textStrokeColor}
				textStrokeTransparency={props.textStrokeTransparency}
				textTruncate={props.textTruncate}
				textWrapped={props.textWrapped}
				textXAlignment={props.textXAlignment}
				textYAlignment={props.textYAlignment}
			></Text>

			{(decimal !== undefined ? [...decimal] : []).map((decimal, index) => (
				<NumberSpinnerDigit
					value={tonumber(decimal)!}
					duration={props.duration}
					anchorPoint={new Vector2(0, 0)}
					position={new UDim2(0, 0, 0, 0)}
					size={
						tonumber(decimal) !== 1
							? props.digitSize
							: new UDim2(0, props.digitSize.X.Offset * 0.5, props.digitSize.Y.Scale, 0)
					}
					layoutOrder={index + 1}
					font={props.font}
					text=""
					textSize={props.textSize}
					textColor={props.textColor}
					textTransparency={props.textTransparency}
					textStrokeColor={props.textStrokeColor}
					textStrokeTransparency={props.textStrokeTransparency}
					textTruncate={props.textTruncate}
					textWrapped={props.textWrapped}
					textXAlignment={props.textXAlignment}
					textYAlignment={props.textYAlignment}
				></NumberSpinnerDigit>
			))}

			<Text
				anchorPoint={new Vector2(0, 0)}
				automaticSize={Enum.AutomaticSize.X}
				position={new UDim2(0, 0, 0, 0)}
				size={props.suffixSize}
				layoutOrder={1000}
				visible={props.suffix !== ""}
				font={props.font}
				text={props.suffix}
				textSize={props.textSize}
				textColor={props.textColor}
				textTransparency={props.textTransparency}
				textStrokeColor={props.textStrokeColor}
				textStrokeTransparency={props.textStrokeTransparency}
				textTruncate={props.textTruncate}
				textWrapped={props.textWrapped}
				textXAlignment={props.textXAlignment}
				textYAlignment={props.textYAlignment}
			></Text>

			{props.children}
		</canvasgroup>
	);
}
