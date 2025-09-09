import React, { forwardRef } from "@rbxts/react";
import { FrameProps } from "./frame";

export interface ImageProps extends FrameProps<ImageLabel> {
	image?: string | React.Binding<string>;
	imageColor?: Color3 | React.Binding<Color3>;
	imageRectOffset?: Vector2 | React.Binding<Vector2>;
	imageRectSize?: Vector2 | React.Binding<Vector2>;
	imageTransparency?: number | React.Binding<number>;
	resampleMode?: Enum.ResamplerMode;
	scaleType?: Enum.ScaleType;
	sliceCenter?: Rect | React.Binding<Rect>;
	sliceScale?: number | React.Binding<number>;
	tileSize?: UDim2 | React.Binding<UDim2>;
}

export const Image = forwardRef((props: ImageProps, ref: React.Ref<ImageLabel>) => {
	return (
		<imagelabel
			ref={ref}
			Image={props.image}
			ImageColor3={props.imageColor}
			ImageRectOffset={props.imageRectOffset}
			ImageRectSize={props.imageRectSize}
			ImageTransparency={props.imageTransparency}
			ResampleMode={props.resampleMode}
			ScaleType={props.scaleType}
			SliceCenter={props.sliceCenter}
			SliceScale={props.sliceScale}
			TileSize={props.tileSize}
			//frame
			AnchorPoint={props.anchorPoint}
			Position={props.position}
			Size={props.size}
			Rotation={props.rotation}
			BackgroundTransparency={props.backgroundTransparency ?? 1}
			BackgroundColor3={props.backgroundColor}
			BorderColor3={props.borderColor}
			BorderMode={props.borderMode}
			LayoutOrder={props.layoutOrder}
			Visible={props.visible}
			ZIndex={props.zIndex}
			ClipsDescendants={props.clipsDescendants}
			Event={props.event}
			Change={props.change}
		>
			{props.children}
		</imagelabel>
	);
});
