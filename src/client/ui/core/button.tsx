import React, { forwardRef, useRef } from "@rbxts/react";
import SoundService from "client/services/sound";

interface ButtonProps extends React.InstanceProps<TextButton> {
	enabled?: boolean | React.Binding<boolean>;
	doubleClickThreshold?: number;
	hoverSound?: string;
	clickSound?: string;
	doubleClickSound?: string;
	onDoubleClick?: () => void;
}

export const Button = forwardRef<
	TextButton,
	ButtonProps & Omit<React.InstanceProps<TextButton>, "AutoButtonColor" | "Event">
>((props, ref) => {
	const {
		BorderSizePixel=0,
		enabled = true,
		doubleClickThreshold = 0.2,
		hoverSound = "ui/hover",
		clickSound = "ui/click",
		doubleClickSound = "ui/click",
	} = props;
	const soundService = SoundService.getInst();
	const lastClick = useRef(0);

	return (
		<textbutton
			ref={ref}
			Archivable={props.Archivable}
			Active={enabled}
			AnchorPoint={props.AnchorPoint}
			AutomaticSize={props.AutomaticSize}
			BackgroundColor3={props.BackgroundColor3}
			BackgroundTransparency={1}
			BorderColor3={props.BorderColor3}
			BorderMode={props.BorderMode}
			BorderSizePixel={BorderSizePixel}
			Interactable={enabled}
			LayoutOrder={props.LayoutOrder}
			Position={props.Position}
			Rotation={props.Rotation}
			Size={props.Size}
			SizeConstraint={props.SizeConstraint}
			Style={props.Style}
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
			Event={{
				...props.Event,
				MouseEnter: (rbx, x, y) => {
					props.Event?.MouseEnter?.(rbx, x, y);
					soundService.playSound(hoverSound);
				},
				MouseLeave: (rbx, x, y) => {
					props.Event?.MouseLeave?.(rbx, x, y);
				},
				MouseButton1Click: (rbx) => {
					if (props.onDoubleClick !== undefined && time() - lastClick.current < doubleClickThreshold) {
						props.onDoubleClick();
						soundService.playSound(doubleClickSound);
					} else if (props.Event?.MouseButton1Click !== undefined) {
						props.Event.MouseButton1Click(rbx);
						soundService.playSound(clickSound);
					}
					lastClick.current = time();
				},
				MouseButton1Down: (rbx, x, y) => {
					props.Event?.MouseButton1Down?.(rbx, x, y);
				},
				MouseButton1Up: (rbx, x, y) => {
					props.Event?.MouseButton1Up?.(rbx, x, y);
				},
			}}
			Change={props.Change}
			AutoButtonColor={false}
			Text=""
		>
			{props.children}
		</textbutton>
	);
});
