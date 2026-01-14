import React, { forwardRef } from "@rbxts/react";

export const CanvasGroup = forwardRef<CanvasGroup, React.InstanceProps<CanvasGroup>>((props, ref) => {
	const { BorderSizePixel = 0 } = props;

	return (
		<canvasgroup
			ref={ref}
			Archivable={props.Archivable}
			Active={props.Active}
			AnchorPoint={props.AnchorPoint}
			AutomaticSize={props.AutomaticSize}
			BackgroundColor3={props.BackgroundColor3}
			BackgroundTransparency={props.BackgroundTransparency}
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
			GroupColor3={props.GroupColor3}
			GroupTransparency={props.GroupTransparency}
			SelectionImageObject={props.SelectionImageObject}
		>
			{props.children}
		</canvasgroup>
	);
});
