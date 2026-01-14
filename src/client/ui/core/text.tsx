import React, { forwardRef } from "@rbxts/react";
import { colors, fonts } from "../constants";

export const Text = forwardRef<TextLabel, React.InstanceProps<TextLabel>>((props, ref) => {
	const { BorderSizePixel = 0, FontFace = fonts.josefinSans.regular, TextColor3 = colors.white } = props;

	return (
		<textlabel
			ref={ref}
			Archivable={props.Archivable}
			Active={props.Active}
			AnchorPoint={props.AnchorPoint}
			AutomaticSize={props.AutomaticSize}
			BackgroundColor3={props.BackgroundColor3}
			BackgroundTransparency={1}
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
			FontFace={FontFace}
			LineHeight={props.LineHeight}
			MaxVisibleGraphemes={props.MaxVisibleGraphemes}
			OpenTypeFeatures={props.OpenTypeFeatures}
			RichText={props.RichText}
			Text={props.Text}
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
		</textlabel>
	);
});
