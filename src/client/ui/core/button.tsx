import React, { forwardRef, useRef } from "@rbxts/react";
import { FrameProps } from "./frame";

export interface ButtonProps extends FrameProps<TextButton> {
	onMouseEnter?: () => void;
	onMouseLeave?: () => void;
	onClick?: () => void;
	onDoubleClick?: () => void;
	onMouseDown?: () => void;
	onMouseUp?: () => void;
}

export const Button = forwardRef((props: ButtonProps, ref: React.Ref<TextButton>) => {
	const lastClickTime = useRef(0);
	const doubleClickTime = 0.35;

	return (
		<textbutton
			ref={ref}
			AutoButtonColor={false}
			AnchorPoint={props.anchorPoint}
			Position={props.position}
			Size={props.size}
			Rotation={props.rotation}
			BackgroundTransparency={1}
			BackgroundColor3={props.backgroundColor}
			BorderColor3={props.borderColor}
			BorderMode={props.borderMode}
			LayoutOrder={props.layoutOrder}
			Visible={props.visible}
			ZIndex={props.zIndex}
			ClipsDescendants={props.clipsDescendants}
			Event={{
				MouseEnter: () => props.onMouseEnter?.(),
				MouseLeave: () => props.onMouseLeave?.(),
				MouseButton1Click: () => {
					if (props.onDoubleClick === undefined) {
						props.onClick?.();
					} else {
						if (time() - lastClickTime.current < doubleClickTime) {
							props.onDoubleClick?.();
						} else {
							props.onClick?.();
						}
						lastClickTime.current = time();
					}
				},
				MouseButton1Down: () => props.onMouseDown?.(),
				MouseButton1Up: () => props.onMouseUp?.(),
			}}
			Change={props.change}
			Text={""}
		>
			{props.children}
		</textbutton>
	);
});
