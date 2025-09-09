import React, { forwardRef } from "@rbxts/react";

export interface FrameProps<T extends Instance = Frame> extends React.PropsWithChildren {
	anchorPoint?: Vector2 | React.Binding<Vector2>;
	position?: UDim2 | React.Binding<UDim2>;
	size?: UDim2 | React.Binding<UDim2>;
	rotation?: number | React.Binding<number>;
	backgroundTransparency?: number | React.Binding<number>;
	backgroundColor?: Color3 | React.Binding<Color3>;
	borderColor?: Color3 | React.Binding<Color3>;
	borderMode?: Enum.BorderMode | React.Binding<Enum.BorderMode>;
	layoutOrder?: number | React.Binding<number>;
	visible?: boolean | React.Binding<boolean>;
	zIndex?: number | React.Binding<number>;
	clipsDescendants?: boolean | React.Binding<boolean>;

	event?: React.InstanceEvent<T>;
	change?: React.InstanceChangeEvent<T>;
}

export const Frame = forwardRef((props: FrameProps, ref: React.Ref<Frame>) => {
	return (
		<frame
			ref={ref}
			AnchorPoint={props.anchorPoint}
			Position={props.position}
			Size={props.size}
			Rotation={props.rotation}
			BackgroundTransparency={props.backgroundTransparency}
			BackgroundColor3={props.backgroundColor}
			BorderColor3={props.borderColor}
			BorderMode={props.borderMode}
			BorderSizePixel={0}
			LayoutOrder={props.layoutOrder}
			Visible={props.visible}
			ZIndex={props.zIndex}
			ClipsDescendants={props.clipsDescendants}
			Event={props.event}
			Change={props.change}
		>
			{props.children}
		</frame>
	);
});
