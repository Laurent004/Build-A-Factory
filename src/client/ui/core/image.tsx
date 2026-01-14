import { useMountEffect } from "@rbxts/pretty-react-hooks";
import React, { forwardRef, useBinding } from "@rbxts/react";

interface ImageProps extends React.InstanceProps<ImageLabel> {
	rows?: number;
	columns?: number;
	fps?: number;
}

export const Image = forwardRef<ImageLabel, ImageProps>((props, ref) => {
	const { BackgroundTransparency = 1, BorderSizePixel = 0, rows = 8, columns = 8, fps = 8 } = props;
	const [imageRectOffset, setImageRectOffset] = useBinding(Vector2.zero);

	useMountEffect(() => {
		if (props.ImageRectSize !== undefined) {
			const imageRectSize = props.ImageRectSize as Vector2;
			task.spawn(() => {
				let frame: number = 0;
				while (task.wait(1 / fps)) {
					frame = (frame + 1) % (columns * rows);
					setImageRectOffset(
						new Vector2((frame % columns) * imageRectSize.X, math.floor(frame / columns) * imageRectSize.Y),
					);
				}
			});
		}
	});

	return (
		<imagelabel
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
			Image={props.Image}
			ImageColor3={props.ImageColor3}
			ImageContent={props.ImageContent}
			ImageRectOffset={imageRectOffset}
			ImageRectSize={props.ImageRectSize}
			ImageTransparency={props.ImageTransparency}
			ResampleMode={props.ResampleMode}
			ScaleType={props.ScaleType}
		>
			{props.children}
		</imagelabel>
	);
});
