import React, { forwardRef, useEffect, useState } from "@rbxts/react";
import { round } from "shared/utils";
import { colors, fonts } from "client/ui/constants";
import { Frame } from "./frame";
import { Text } from "./text";
import { CanvasGroup } from "./canvas-group";
import { HttpService, TextService } from "@rbxts/services";
import { isBinding, useMotion } from "@rbxts/pretty-react-hooks";

interface NumberSpinnerProps extends React.InstanceProps<TextLabel> {
	value: number;
	duration?: number;
	decimals?: number;
	prefix?: string;
	suffix?: string;
	commas?: boolean;
}

export const NumberSpinner = forwardRef<CanvasGroup, NumberSpinnerProps>((props, ref) => {
	const {
		BackgroundTransparency = 1,
		BorderSizePixel = 0,
		FontFace = fonts.josefinSans.regular,
		TextColor3 = colors.white,
		TextXAlignment = Enum.TextXAlignment.Center,
		TextYAlignment = Enum.TextYAlignment.Center,
		duration = 0.3,
		decimals = 0,
		prefix = "",
		suffix = "",
		commas = false,
	} = props;
	const [whole, decimal] = string.split(
		decimals > 0 ? tostring(round(props.value, decimals)) : string.format("%d", math.abs(props.value)),
		".",
	);
	const [wholeDigits, setWholeDigits] = useState<{ value: number | undefined; id: string }[]>([]);
	const [decimalDigits, setDecimalDigits] = useState<{ value: number | undefined; id: string }[]>([]);

	useEffect(() => {
		setWholeDigits((previousWholeDigits) => {
			const newWholeDigits = [...previousWholeDigits];
			for (let i = 0; i < newWholeDigits.size(); i++) {
				if (i < whole.size()) {
					newWholeDigits[i].value = tonumber([...whole][i]);
				} else {
					newWholeDigits[i].value = undefined;
					task.delay(duration, () => {
						setWholeDigits((previousWholeDigits) => {
							const newWholeDigits = [...previousWholeDigits];
							newWholeDigits.remove(i);
							return newWholeDigits;
						});
					});
				}
			}
			for (let i = newWholeDigits.size(); i < whole.size(); i++) {
				newWholeDigits.push({ value: tonumber([...whole][i]), id: HttpService.GenerateGUID() });
			}
			return newWholeDigits;
		});
	}, [whole]);

	useEffect(() => {
		setDecimalDigits((previousDecimalDigits) => {
			const newDecimalDigits = [...previousDecimalDigits];
			for (let i = 0; i < newDecimalDigits.size(); i++) {
				if (i < (decimal ?? "").size()) {
					newDecimalDigits[i].value = tonumber([...decimal][i]);
				} else {
					newDecimalDigits[i].value = undefined;
					task.delay(duration, () => {
						setDecimalDigits((previousDecimalDigits) => {
							const newDecimalDigits = [...previousDecimalDigits];
							newDecimalDigits.remove(i);
							return newDecimalDigits;
						});
					});
				}
			}
			for (let i = newDecimalDigits.size(); i < (decimal ?? "").size(); i++) {
				newDecimalDigits.push({ value: tonumber([...decimal][i]), id: HttpService.GenerateGUID() });
			}
			return newDecimalDigits;
		});
	}, [decimal]);

	return (
		<CanvasGroup
			ref={ref}
			Active={false}
			AnchorPoint={props.AnchorPoint}
			AutomaticSize={Enum.AutomaticSize.X}
			Position={props.Position}
			Rotation={props.Rotation}
			Size={UDim2.fromScale(0, isBinding(props.Size) ? props.Size.getValue().Y.Scale : props.Size?.Y.Scale ?? 1)}
			BackgroundTransparency={BackgroundTransparency}
			BorderSizePixel={BorderSizePixel}
			Interactable={false}
			LayoutOrder={props.LayoutOrder}
			ZIndex={props.ZIndex}
		>
			<uilistlayout
				FillDirection={Enum.FillDirection.Horizontal}
				SortOrder={Enum.SortOrder.LayoutOrder}
				HorizontalAlignment={
					TextXAlignment === Enum.TextXAlignment.Left
						? Enum.HorizontalAlignment.Left
						: TextXAlignment === Enum.TextXAlignment.Center
						? Enum.HorizontalAlignment.Center
						: Enum.HorizontalAlignment.Right
				}
				VerticalAlignment={
					TextYAlignment === Enum.TextYAlignment.Top
						? Enum.VerticalAlignment.Top
						: TextYAlignment === Enum.TextYAlignment.Center
						? Enum.VerticalAlignment.Center
						: Enum.VerticalAlignment.Bottom
				}
			></uilistlayout>

			<Text
				AutomaticSize={Enum.AutomaticSize.X}
				Size={UDim2.fromScale(0, 1)}
				LayoutOrder={-1000}
				Visible={prefix !== ""}
				FontFace={FontFace}
				LineHeight={props.LineHeight}
				MaxVisibleGraphemes={props.MaxVisibleGraphemes}
				OpenTypeFeatures={props.OpenTypeFeatures}
				RichText={props.RichText}
				Text={prefix}
				TextColor3={TextColor3}
				TextDirection={props.TextDirection}
				TextScaled={props.TextScaled}
				TextSize={props.TextSize}
				TextStrokeColor3={props.TextStrokeColor3}
				TextStrokeTransparency={props.TextStrokeTransparency}
				TextTransparency={props.TextTransparency}
				TextTruncate={props.TextTruncate}
				TextWrapped={props.TextWrapped}
				TextXAlignment={TextXAlignment}
				TextYAlignment={TextYAlignment}
			></Text>

			<Text
				AutomaticSize={Enum.AutomaticSize.X}
				Size={UDim2.fromScale(0, 1)}
				LayoutOrder={-999}
				Visible={props.value < 0}
				FontFace={FontFace}
				LineHeight={props.LineHeight}
				MaxVisibleGraphemes={props.MaxVisibleGraphemes}
				OpenTypeFeatures={props.OpenTypeFeatures}
				RichText={props.RichText}
				Text="-"
				TextColor3={TextColor3}
				TextDirection={props.TextDirection}
				TextScaled={props.TextScaled}
				TextSize={props.TextSize}
				TextStrokeColor3={props.TextStrokeColor3}
				TextStrokeTransparency={props.TextStrokeTransparency}
				TextTransparency={props.TextTransparency}
				TextTruncate={props.TextTruncate}
				TextWrapped={props.TextWrapped}
				TextXAlignment={TextXAlignment}
				TextYAlignment={TextYAlignment}
			></Text>

			{wholeDigits.map((whole, index) => (
				<NumberSpinnerDigit
					key={whole.id}
					LayoutOrder={(index + 1) * 2 - 900}
					FontFace={FontFace}
					LineHeight={props.LineHeight}
					MaxVisibleGraphemes={props.MaxVisibleGraphemes}
					OpenTypeFeatures={props.OpenTypeFeatures}
					RichText={props.RichText}
					TextColor3={TextColor3}
					TextDirection={props.TextDirection}
					TextScaled={props.TextScaled}
					TextSize={props.TextSize}
					TextStrokeColor3={props.TextStrokeColor3}
					TextStrokeTransparency={props.TextStrokeTransparency}
					TextTransparency={props.TextTransparency}
					TextTruncate={props.TextTruncate}
					TextWrapped={props.TextWrapped}
					TextXAlignment={TextXAlignment}
					TextYAlignment={TextYAlignment}
					value={whole.value}
					duration={duration}
				></NumberSpinnerDigit>
			))}

			{(commas ? [...string.format("%d", math.floor(math.abs(props.value)))] : []).map((_, index) => {
				if (index === 0 || index % 3 !== 0) return undefined;
				return (
					<Text
						AutomaticSize={Enum.AutomaticSize.X}
						Size={UDim2.fromScale(0, 1)}
						LayoutOrder={whole.size() * 2 - 900 - (index - 1) * 2 - 1}
						Text=","
						FontFace={FontFace}
						LineHeight={props.LineHeight}
						MaxVisibleGraphemes={props.MaxVisibleGraphemes}
						OpenTypeFeatures={props.OpenTypeFeatures}
						RichText={props.RichText}
						TextColor3={TextColor3}
						TextDirection={props.TextDirection}
						TextScaled={props.TextScaled}
						TextSize={props.TextSize}
						TextStrokeColor3={props.TextStrokeColor3}
						TextStrokeTransparency={props.TextStrokeTransparency}
						TextTransparency={props.TextTransparency}
						TextTruncate={props.TextTruncate}
						TextWrapped={props.TextWrapped}
						TextXAlignment={TextXAlignment}
						TextYAlignment={TextYAlignment}
					></Text>
				);
			})}

			<Text
				AutomaticSize={Enum.AutomaticSize.X}
				Size={UDim2.fromScale(0, 1)}
				Visible={decimal !== undefined}
				FontFace={FontFace}
				LineHeight={props.LineHeight}
				MaxVisibleGraphemes={props.MaxVisibleGraphemes}
				OpenTypeFeatures={props.OpenTypeFeatures}
				RichText={props.RichText}
				Text="."
				TextColor3={TextColor3}
				TextDirection={props.TextDirection}
				TextScaled={props.TextScaled}
				TextSize={props.TextSize}
				TextStrokeColor3={props.TextStrokeColor3}
				TextStrokeTransparency={props.TextStrokeTransparency}
				TextTransparency={props.TextTransparency}
				TextTruncate={props.TextTruncate}
				TextWrapped={props.TextWrapped}
				TextXAlignment={TextXAlignment}
				TextYAlignment={TextYAlignment}
			></Text>

			{decimalDigits.map((decimal, index) => (
				<NumberSpinnerDigit
					key={decimal.id}
					LayoutOrder={index + 1}
					FontFace={FontFace}
					LineHeight={props.LineHeight}
					MaxVisibleGraphemes={props.MaxVisibleGraphemes}
					OpenTypeFeatures={props.OpenTypeFeatures}
					RichText={props.RichText}
					TextColor3={TextColor3}
					TextDirection={props.TextDirection}
					TextScaled={props.TextScaled}
					TextSize={props.TextSize}
					TextStrokeColor3={props.TextStrokeColor3}
					TextStrokeTransparency={props.TextStrokeTransparency}
					TextTransparency={props.TextTransparency}
					TextTruncate={props.TextTruncate}
					TextWrapped={props.TextWrapped}
					TextXAlignment={TextXAlignment}
					TextYAlignment={TextYAlignment}
					value={decimal.value}
					duration={duration}
				></NumberSpinnerDigit>
			))}

			<Text
				AutomaticSize={Enum.AutomaticSize.X}
				Size={UDim2.fromScale(0, 1)}
				LayoutOrder={1000}
				Visible={suffix !== ""}
				FontFace={FontFace}
				LineHeight={props.LineHeight}
				MaxVisibleGraphemes={props.MaxVisibleGraphemes}
				OpenTypeFeatures={props.OpenTypeFeatures}
				RichText={props.RichText}
				Text={suffix}
				TextColor3={TextColor3}
				TextDirection={props.TextDirection}
				TextScaled={props.TextScaled}
				TextSize={props.TextSize}
				TextStrokeColor3={props.TextStrokeColor3}
				TextStrokeTransparency={props.TextStrokeTransparency}
				TextTransparency={props.TextTransparency}
				TextTruncate={props.TextTruncate}
				TextWrapped={props.TextWrapped}
				TextXAlignment={TextXAlignment}
				TextYAlignment={TextYAlignment}
			></Text>

			{props.children}
		</CanvasGroup>
	);
});

interface NumberSpinnerDigitProps extends React.InstanceProps<TextLabel> {
	value: number | undefined;
	duration: number;
}

function NumberSpinnerDigit(props: NumberSpinnerDigitProps) {
	const { BorderSizePixel = 0, FontFace = fonts.josefinSans.regular, TextColor3 = colors.white } = props;
	const [mountAnimation, mountAnimationMotion] = useMotion(0);
	const [updateAnimation, updateAnimationMotion] = useMotion(-(props.value ?? 0));

	useEffect(() => {
		if (props.value !== undefined) {
			mountAnimationMotion.tween(
				TextService.GetTextSize(
					tostring(props.value),
					isBinding(props.TextSize) ? props.TextSize.getValue() : props.TextSize!,
					Enum.Font.JosefinSans,
					new Vector2(10000, 10000),
				).X,
				{ time: props.duration },
			);
		} else {
			mountAnimationMotion.tween(0, { time: props.duration });
		}
	}, [props.value]);

	useEffect(() => {
		if (props.value === undefined) return;
		updateAnimationMotion.tween(props.value, { time: props.duration });
	}, [props.value]);

	return (
		<Frame
			Size={mountAnimation.map((value) => new UDim2(0, value, 1, 0))}
			BackgroundTransparency={1}
			LayoutOrder={props.LayoutOrder}
			ClipsDescendants={true}
		>
			<Frame
				AutomaticSize={Enum.AutomaticSize.X}
				Position={updateAnimation.map((value) => UDim2.fromScale(0, -value))}
				Size={UDim2.fromScale(0, 10)}
				BackgroundTransparency={1}
			>
				{[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((value) => {
					return (
						<Text
							Archivable={props.Archivable}
							Active={props.Active}
							AnchorPoint={props.AnchorPoint}
							AutomaticSize={Enum.AutomaticSize.X}
							Position={UDim2.fromScale(0, value * 0.1)}
							Rotation={props.Rotation}
							Size={UDim2.fromScale(0, 0.1)}
							SizeConstraint={props.SizeConstraint}
							BackgroundColor3={props.BackgroundColor3}
							BackgroundTransparency={1}
							BorderColor3={props.BorderColor3}
							BorderMode={props.BorderMode}
							BorderSizePixel={BorderSizePixel}
							Interactable={props.Interactable}
							LayoutOrder={props.LayoutOrder}
							Visible={props.Visible}
							ZIndex={props.ZIndex}
							ClipsDescendants={props.ClipsDescendants}
							AutoLocalize={props.AutoLocalize}
							RootLocalizationTable={props.RootLocalizationTable}
							NextSelectionDown={props.NextSelectionDown}
							NextSelectionLeft={props.NextSelectionLeft}
							NextSelectionRight={props.NextSelectionRight}
							NextSelectionUp={props.NextSelectionUp}
							Selectable={props.Selectable}
							SelectionGroup={props.SelectionGroup}
							SelectionOrder={props.SelectionOrder}
							Event={props.Event}
							Change={props.Change}
							FontFace={FontFace}
							LineHeight={props.LineHeight}
							MaxVisibleGraphemes={props.MaxVisibleGraphemes}
							OpenTypeFeatures={props.OpenTypeFeatures}
							RichText={props.RichText}
							Text={tostring(value)}
							TextColor3={TextColor3}
							TextDirection={props.TextDirection}
							TextScaled={props.TextScaled}
							TextSize={props.TextSize}
							TextStrokeColor3={props.TextStrokeColor3}
							TextStrokeTransparency={props.TextStrokeTransparency}
							TextTransparency={props.TextTransparency}
							TextTruncate={props.TextTruncate}
							TextWrapped={props.TextWrapped}
							TextXAlignment={props.TextXAlignment}
							TextYAlignment={props.TextYAlignment}
						></Text>
					);
				})}
			</Frame>
		</Frame>
	);
}
