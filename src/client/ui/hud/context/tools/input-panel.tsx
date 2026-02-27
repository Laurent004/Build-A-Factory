import { useMotion, useUpdateEffect } from "@rbxts/pretty-react-hooks";
import React from "@rbxts/react";
import { colors, fonts, springs } from "client/ui/constants";
import { CanvasGroup, Text } from "client/ui/core";

interface ToolInputPanelProps {
	inputs: string[];
	active: boolean;
}

export function ToolInputPanel({ inputs, active }: ToolInputPanelProps) {
	const [mountAnimation, mountAnimationMotion] = useMotion(0);

	useUpdateEffect(() => {
		mountAnimationMotion.spring(active ? 1 : 0, springs.gentle);
	}, [active]);

	return (
		<CanvasGroup
			GroupTransparency={mountAnimation.map((value) => 1 - value)}
			Active={active}
			AnchorPoint={new Vector2(1, 1)}
			AutomaticSize={Enum.AutomaticSize.Y}
			Position={UDim2.fromScale(0.989, 0.99)}
			Size={UDim2.fromScale(0.22, 0)}
			BackgroundColor3={colors.black}
		>
			<uipadding
				PaddingTop={new UDim(0, 20)}
				PaddingLeft={new UDim(0, 18)}
				PaddingRight={new UDim(0, 18)}
				PaddingBottom={new UDim(0, 20)}
			></uipadding>

			<uilistlayout
				Padding={new UDim(0, 12)}
				SortOrder={Enum.SortOrder.LayoutOrder}
				VerticalFlex={Enum.UIFlexAlignment.SpaceAround}
			></uilistlayout>

			{inputs.map((input, index) => (
				<Text
					AutomaticSize={Enum.AutomaticSize.Y}
					Size={UDim2.fromScale(1, 0)}
					LayoutOrder={index}
					FontFace={fonts.josefinSans.medium}
					LineHeight={1.5}
					RichText={true}
					Text={input}
					TextSize={18}
					TextWrapped={true}
					TextXAlignment={Enum.TextXAlignment.Left}
				></Text>
			))}
		</CanvasGroup>
	);
}
