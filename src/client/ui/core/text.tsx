import React from "@rbxts/react";
import { FrameProps } from "./frame";

export interface TextProps extends FrameProps<TextLabel> {
	font?: Font;
	lineHeight?: number | React.Binding<number>;
	text?: string | React.Binding<string>;
	textColor?: Color3 | React.Binding<Color3>;
	richText?: boolean | React.Binding<boolean>;
	maxVisibleGraphemes?: number | React.Binding<number>;
	textScaled?: boolean | React.Binding<boolean>;
	textSize?: number | React.Binding<number>;
	textTransparency?: number | React.Binding<number>;
	textTruncate?: Enum.TextTruncate | React.Binding<Enum.TextTruncate>;
	textWrapped?: boolean | React.Binding<boolean>;
	textXAlignment?: Enum.TextXAlignment | React.Binding<Enum.TextXAlignment>;
	textYAlignment?: Enum.TextYAlignment | React.Binding<Enum.TextYAlignment>;
}

export function Text(props: TextProps) {
	return (
		<textlabel
			FontFace={props.font}
			LineHeight={props.lineHeight}
			Text={props.text}
			TextColor3={props.textColor}
			RichText={props.richText}
			MaxVisibleGraphemes={props.maxVisibleGraphemes}
			TextScaled={props.textScaled}
			TextSize={props.textSize}
			TextTransparency={props.textTransparency}
			TextTruncate={props.textTruncate}
			TextWrapped={props.textWrapped}
			TextXAlignment={props.textXAlignment}
			TextYAlignment={props.textYAlignment}
			//frame
			AnchorPoint={props.anchorPoint}
			Position={props.position}
			Rotation={props.rotation}
			Size={props.size}
			BackgroundTransparency={props.backgroundTransparency ?? 1}
			BackgroundColor3={props.backgroundColor}
			LayoutOrder={props.layoutOrder}
			Visible={props.visible}
			ZIndex={props.zIndex}
			ClipsDescendants={props.clipsDescendants}
			Event={props.event}
			Change={props.change}
		>
			{props.children}
		</textlabel>
	);
}
