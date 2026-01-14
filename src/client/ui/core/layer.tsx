import React, { forwardRef } from "@rbxts/react";

export const Layer = forwardRef<ScreenGui, React.InstanceProps<ScreenGui>>((props, ref) => {
	const { IgnoreGuiInset = true, ResetOnSpawn = false, ZIndexBehavior = Enum.ZIndexBehavior.Sibling } = props;

	return (
		<screengui
			ref={ref}
			ClipToDeviceSafeArea={props.ClipToDeviceSafeArea}
			SafeAreaCompatibility={props.SafeAreaCompatibility}
			ScreenInsets={props.ScreenInsets}
			Archivable={props.Archivable}
			DisplayOrder={props.DisplayOrder}
			Enabled={props.Enabled}
			IgnoreGuiInset={IgnoreGuiInset}
			ResetOnSpawn={ResetOnSpawn}
			ZIndexBehavior={ZIndexBehavior}
			AutoLocalize={props.AutoLocalize}
			RootLocalizationTable={props.RootLocalizationTable}
			SelectionGroup={props.SelectionGroup}
		>
			{props.children}
		</screengui>
	);
});
