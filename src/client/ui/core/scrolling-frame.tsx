import React, { forwardRef } from "@rbxts/react";

export const ScrollingFrame = forwardRef<ScrollingFrame, React.InstanceProps<ScrollingFrame>>((props, ref) => {
	const {
		BackgroundTransparency = 1,
		BorderSizePixel = 0,
		AutomaticCanvasSize = Enum.AutomaticSize.Y,
		CanvasSize = UDim2.fromScale(0, 0),
		ScrollBarImageTransparency = 1,
		ScrollBarThickness = 0,
		ScrollingDirection = Enum.ScrollingDirection.Y,
	} = props;

	return (
		<scrollingframe
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
			AutomaticCanvasSize={AutomaticCanvasSize}
			BottomImage={props.BottomImage}
			BottomImageContent={props.BottomImageContent}
			CanvasPosition={props.CanvasPosition}
			CanvasSize={CanvasSize}
			ElasticBehavior={props.ElasticBehavior}
			MidImage={props.MidImage}
			MidImageContent={props.MidImageContent}
			ScrollBarImageColor3={props.ScrollBarImageColor3}
			ScrollBarImageTransparency={ScrollBarImageTransparency}
			ScrollBarThickness={ScrollBarThickness}
			ScrollingDirection={ScrollingDirection}
			ScrollingEnabled={props.ScrollingEnabled}
			TopImage={props.TopImage}
			TopImageContent={props.TopImageContent}
			VerticalScrollBarInset={props.VerticalScrollBarInset}
			VerticalScrollBarPosition={props.VerticalScrollBarPosition}
		>
			{props.children}
		</scrollingframe>
	);
});
