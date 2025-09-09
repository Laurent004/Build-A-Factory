import React from "@rbxts/react";

export interface LayerProps extends React.PropsWithChildren {
	enabled?: boolean | React.Binding<boolean>;
	displayOrder?: number | React.Binding<number>;
	ignoreGUIInset?: boolean | React.Binding<boolean>;
	resetOnSpawn?: boolean | React.Binding<boolean>;
}

export function Layer(props: LayerProps) {
	return (
		<screengui
			Enabled={props.enabled}
			DisplayOrder={props.displayOrder}
			IgnoreGuiInset={props.ignoreGUIInset ?? true}
			ResetOnSpawn={props.resetOnSpawn ?? false}
			ZIndexBehavior={Enum.ZIndexBehavior.Sibling}
		>
			{props.children}
		</screengui>
	);
}
