import React, { forwardRef } from "@rbxts/react";
import { colors, fonts } from "../constants";

export const TextBox = forwardRef<TextBox, React.InstanceProps<TextBox>>((props, ref) => {
	const {
		BackgroundTransparency = 1,
		BorderSizePixel = 0,
		FontFace = fonts.josefinSans.regular,
		Text = "",
		TextColor3 = colors.white,
	} = props;

	return (
		<textbox
			ref={ref}
			Archivable={props.Archivable}
			Active={props.Active}
			AnchorPoint={props.AnchorPoint}
			AutomaticSize={props.AutomaticSize}
			BackgroundColor3={props.BackgroundColor3}
			BackgroundTransparency={BackgroundTransparency}
			BorderColor3={props.BorderColor3}
			BorderMode={props.BorderMode}
			BorderSizePixel={BorderSizePixel}
			Interactable={props.Interactable}
			LayoutOrder={props.LayoutOrder}
			Position={props.Position}
			Rotation={props.Rotation}
			Size={props.Size}
			SizeConstraint={props.SizeConstraint}
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
			ClearTextOnFocus={props.ClearTextOnFocus}
			CursorPosition={props.CursorPosition}
			MultiLine={props.MultiLine}
			SelectionStart={props.SelectionStart}
			ShowNativeInput={props.ShowNativeInput}
			TextEditable={props.TextEditable}
			FontFace={FontFace}
			LineHeight={props.LineHeight}
			MaxVisibleGraphemes={props.MaxVisibleGraphemes}
			OpenTypeFeatures={props.OpenTypeFeatures}
			PlaceholderColor3={props.PlaceholderColor3}
			PlaceholderText={props.PlaceholderText}
			RichText={props.RichText}
			Text={Text}
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
		>
			{props.children}
		</textbox>
	);
});
