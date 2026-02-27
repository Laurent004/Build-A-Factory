import { useKeyPress, useMotion, useUpdateEffect } from "@rbxts/pretty-react-hooks";
import React, { useState } from "@rbxts/react";
import { useSelector } from "@rbxts/react-reflex";
import { selectContext, selectContextStructureModels } from "client/hooks/store/context";
import { colors, fonts, springs } from "client/ui/constants";
import { CanvasGroup, Frame, Text } from "client/ui/core";

export function InfoEfficiencyPanel() {
	const context = useSelector(selectContext);
	const structuresModels = useSelector(selectContextStructureModels);
	const isHPressed = useKeyPress(["H"]);
	const [isOpen, setIsOpen] = useState(false);

	const [mountAnimation, mountAnimationMotion] = useMotion(0);

	useUpdateEffect(() => {
		if (context !== "Info") {
			setIsOpen(false);
			return;
		}
		if (!isHPressed) return;
		setIsOpen(!isOpen);
	}, [context, isHPressed]);

	useUpdateEffect(() => {
		mountAnimationMotion.spring(isOpen ? 1 : 0, springs.gentle);
	}, [isOpen]);

	return (
		<CanvasGroup
			GroupTransparency={mountAnimation.map((value) => 1 - value)}
			Active={isOpen}
			AnchorPoint={new Vector2(1, 1)}
			AutomaticSize={Enum.AutomaticSize.Y}
			Position={UDim2.fromScale(0.989, 0.82)}
			Size={UDim2.fromScale(0.128, 0)}
			BackgroundColor3={colors.black}
			Visible={structuresModels.size() === 0}
		>
			<uipadding
				PaddingTop={new UDim(0, 20)}
				PaddingLeft={new UDim(0, 18)}
				PaddingRight={new UDim(0, 18)}
				PaddingBottom={new UDim(0, 20)}
			></uipadding>

			<uilistlayout
				Padding={new UDim(0, 28)}
				SortOrder={Enum.SortOrder.LayoutOrder}
				VerticalFlex={Enum.UIFlexAlignment.SpaceAround}
			></uilistlayout>

			{[0, 1, 2, 3, 4].map((value) => (
				<Frame
					AutomaticSize={Enum.AutomaticSize.Y}
					Size={UDim2.fromScale(1, 0)}
					BackgroundTransparency={1}
					LayoutOrder={4 - value}
				>
					<Frame
						AnchorPoint={new Vector2(0, 0.5)}
						Position={UDim2.fromScale(0, 0.5)}
						Size={UDim2.fromScale(0.05, 0.6)}
						BackgroundColor3={Color3.fromHSV((1 / 3) * (value * 0.25), 1, 1)}
					></Frame>

					<Text
						AutomaticSize={Enum.AutomaticSize.Y}
						Size={UDim2.fromScale(1, 0)}
						FontFace={fonts.josefinSans.medium}
						LineHeight={1.5}
						Text={`${value * 25}% Efficiency`}
						TextSize={18}
						TextXAlignment={Enum.TextXAlignment.Left}
					>
						<uipadding PaddingLeft={new UDim(0, 28)}></uipadding>
					</Text>
				</Frame>
			))}
		</CanvasGroup>
	);
}
