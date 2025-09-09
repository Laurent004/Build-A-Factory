import React, { forwardRef } from "@rbxts/react";
import { FrameProps } from "./frame";

export interface ViewportFrameProps extends FrameProps<ViewportFrame> {
	ambient?: Color3 | React.Binding<Color3>;
	lightColor?: Color3 | React.Binding<Color3>;
	lightDirection?: Vector3 | React.Binding<Vector3>;
	imageColor?: Color3 | React.Binding<Color3>;
	imageTransparency?: number | React.Binding<number>;
}

export const ViewportFrame = forwardRef((props: ViewportFrameProps, ref: React.Ref<ViewportFrame>) => {
	return (
		<viewportframe
			Ambient={props.ambient}
			LightColor={props.lightColor}
			LightDirection={props.lightDirection}
			ImageColor3={props.imageColor}
			ImageTransparency={props.imageTransparency}
			//frame
			ref={ref}
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
		</viewportframe>
	);
});
