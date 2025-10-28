import { useBindingState, useMotion, useUpdateEffect } from "@rbxts/pretty-react-hooks";
import React from "@rbxts/react";
import { colors, springs } from "client/ui/constants";
import { Frame } from "client/ui/core/frame";
import { InputPanelInput } from "./input";
import { useRem } from "client/hooks/use-rem";

export interface BaseInputPanelProps {
	size: UDim2;
	inputSize: UDim2;
	active: boolean;
	inputs: string[];
}

export function BaseInputPanel(props: BaseInputPanelProps) {
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
		>
			<Frame size={new UDim2(1, 0, 1, 0)} backgroundTransparency={1}>
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
					<InputPanelInput
						index={index}
						size={props.inputSize}
						active={props.active}
						input={input}
					></InputPanelInput>
				))}
			</Frame>
		</canvasgroup>
	);
}
