import { useMotion, useUpdateEffect } from "@rbxts/pretty-react-hooks";
import React from "@rbxts/react";
import { colors, springs } from "client/ui/constants";
import { Frame } from "client/ui/core/frame";
import { useRem } from "client/hooks/use-rem";
import { ToolInputPanelText } from "./input-panel-text";

export interface ToolInputPanelProps {
	active: boolean;
	inputs: string[];
	size: UDim2;
	inputSize: UDim2;
}

export function ToolInputPanel(props: ToolInputPanelProps) {
	const rem = useRem();
	const [onMountAnimation, onMountAnimationMotion] = useMotion(0);

	useUpdateEffect(() => {
		onMountAnimationMotion.spring(props.active ? 1 : 0, springs.gentle);
	}, [props.active]);

	return (
		<canvasgroup
			GroupTransparency={onMountAnimation.map((value) => 1 - value)}
			Active={props.active}
			AnchorPoint={new Vector2(1, 1)}
			Position={new UDim2(0, rem(1897), 0, rem(1068))}
			Size={props.size}
			BackgroundColor3={colors.black}
			ZIndex={0}
		>
			<Frame
				anchorPoint={new Vector2(0, 0)}
				position={new UDim2(0, 0, 0, 0)}
				size={new UDim2(1, 0, 1, 0)}
				backgroundTransparency={1}
			>
				<uipadding
					PaddingBottom={new UDim(0, 20)}
					PaddingLeft={new UDim(0, 18)}
					PaddingRight={new UDim(0, 18)}
					PaddingTop={new UDim(0, 20)}
				></uipadding>

				<uilistlayout
					Padding={new UDim(0, 19)}
					FillDirection={Enum.FillDirection.Vertical}
					SortOrder={Enum.SortOrder.LayoutOrder}
					HorizontalAlignment={Enum.HorizontalAlignment.Left}
					VerticalAlignment={Enum.VerticalAlignment.Top}
				></uilistlayout>

				{props.inputs.map((input, index) => (
					<ToolInputPanelText
						index={index}
						active={props.active}
						size={props.inputSize}
						text={input}
					></ToolInputPanelText>
				))}
			</Frame>
		</canvasgroup>
	);
}
