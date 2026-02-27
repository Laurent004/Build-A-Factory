import { Object } from "@rbxts/luau-polyfill";
import { lerpBinding, useKeyPress, useMotion, useUpdateEffect } from "@rbxts/pretty-react-hooks";
import React from "@rbxts/react";
import { useSelector } from "@rbxts/react-reflex";
import { TOOLS } from "client/constants/context/tools";
import { useStore } from "client/hooks";
import { selectContext } from "client/hooks/store/context";
import { colors, fonts, springs } from "client/ui/constants";
import { Button, Frame, Image, Text } from "client/ui/core";
import { IMAGES } from "shared/assets/images";

export function ToolBar() {
	const context = useSelector(selectContext);

	return (
		<Frame
			AnchorPoint={new Vector2(0, 1)}
			Position={UDim2.fromScale(0.009, 0.989)}
			Size={UDim2.fromScale(0.044, 0.46)}
			BackgroundColor3={colors.black}
		>
			<uilistlayout
				Padding={new UDim(0, 4)}
				SortOrder={Enum.SortOrder.LayoutOrder}
				HorizontalAlignment={Enum.HorizontalAlignment.Center}
				VerticalFlex={Enum.UIFlexAlignment.SpaceAround}
			></uilistlayout>

			{Object.keys(TOOLS).map((tool) => (
				<ToolButton tool={tool} isSelected={context === tool}></ToolButton>
			))}
		</Frame>
	);
}

interface ToolButtonProps {
	tool: string;
	isSelected: boolean;
}

function ToolButton({ tool, isSelected }: ToolButtonProps) {
	const store = useStore();
	const isKeyPressed = useKeyPress([TOOLS[tool].key]);
	const [hoverAnimation, hoverAnimationMotion] = useMotion(0);
	const [clickAnimation, clickAnimationMotion] = useMotion(0);

	useUpdateEffect(() => {
		clickAnimationMotion.spring(isSelected ? 1 : 0, springs.slow);
	}, [isSelected]);

	useUpdateEffect(() => {
		if (!isKeyPressed) return;
		store.setContext(tool);
	}, [isKeyPressed]);

	return (
		<Button
			Size={UDim2.fromScale(0.767, 0.13)}
			LayoutOrder={TOOLS[tool].index}
			Event={{
				MouseEnter: () => {
					hoverAnimationMotion.spring(1, springs.responsive);
				},

				MouseLeave: () => {
					hoverAnimationMotion.spring(0, springs.responsive);
				},

				MouseButton1Click: () => {
					store.setContext(tool);
				},
			}}
			hoverSound={"ui/hover_1"}
		>
			<uistroke
				ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
				Color={lerpBinding(
					clickAnimation,
					colors.white,
					tool === "Delete" ? colors.lightred : colors.lightblue,
				)}
				LineJoinMode={Enum.LineJoinMode.Miter}
			></uistroke>

			<Image
				AnchorPoint={new Vector2(0.5, 0.5)}
				Position={UDim2.fromScale(0.5, 0.5)}
				Size={UDim2.fromScale(0.58, 0.58)}
				Image={IMAGES[tool]}
				ImageColor3={lerpBinding(
					clickAnimation,
					colors.white,
					tool === "Delete" ? colors.lightred : colors.white,
				)}
			></Image>

			<Image
				AnchorPoint={new Vector2(0.5, 0.5)}
				Position={UDim2.fromScale(0.5, 0.5)}
				Size={UDim2.fromScale(1.4, 1.4)}
				Image={IMAGES.Glow}
				ImageColor3={tool === "Delete" ? colors.lightred : colors.lightblue}
				ImageTransparency={lerpBinding(clickAnimation, 1, 0.7)}
			></Image>

			<Frame
				AnchorPoint={new Vector2(0, 1)}
				BackgroundColor3={Color3.fromRGB(30, 30, 30)}
				Position={UDim2.fromScale(0.745, 0.255)}
				Size={UDim2.fromScale(0.35, 0.35)}
			>
				<uistroke
					ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
					Color={Color3.fromRGB(70, 70, 70)}
					LineJoinMode={Enum.LineJoinMode.Miter}
				></uistroke>

				<Text Size={UDim2.fromScale(1, 1)} Text={tostring(TOOLS[tool].index + 1)} TextSize={14}></Text>
			</Frame>

			<Frame
				Position={UDim2.fromScale(1.136, 0)}
				Size={lerpBinding(hoverAnimation, UDim2.fromScale(0, 1), UDim2.fromScale(5.379, 1))}
				ClipsDescendants={true}
			>
				<uigradient
					Color={
						new ColorSequence([
							new ColorSequenceKeypoint(0, Color3.fromRGB(19, 19, 19)),
							new ColorSequenceKeypoint(1, Color3.fromRGB(16, 16, 16)),
						])
					}
					Rotation={-88}
					Transparency={
						new NumberSequence([
							new NumberSequenceKeypoint(0, 0),
							new NumberSequenceKeypoint(0.601, 0.481),
							new NumberSequenceKeypoint(1, 1),
						])
					}
				></uigradient>

				<Text
					AnchorPoint={new Vector2(0.5, 0.5)}
					Position={UDim2.fromScale(0.163, 0.262)}
					Size={UDim2.fromScale(0.264, 0.2)}
					FontFace={fonts.josefinSans.bold}
					Text={`${tool} Tool`}
					TextSize={14}
					TextColor3={lerpBinding(
						clickAnimation,
						colors.white,
						tool === "Delete" ? colors.lightred : colors.lightblue,
					)}
					TextTransparency={hoverAnimation.map((value) => 1 - value)}
					TextXAlignment={Enum.TextXAlignment.Left}
				>
					<Image
						AnchorPoint={new Vector2(0.5, 0.5)}
						Position={UDim2.fromScale(0.4, 0.5)}
						Size={UDim2.fromScale(1.5, 2)}
						Image={IMAGES.Glow}
						ImageColor3={tool === "Delete" ? colors.lightred : colors.lightblue}
						ImageTransparency={lerpBinding(clickAnimation, 1, 0.7)}
					></Image>
				</Text>

				<Text
					AnchorPoint={new Vector2(0.5, 0.5)}
					Position={UDim2.fromScale(0.28, 0.64)}
					Size={UDim2.fromScale(0.499, 0.24)}
					Text={TOOLS[tool].description}
					TextSize={12}
					TextTransparency={hoverAnimation.map((value) => 1 - value)}
					TextXAlignment={Enum.TextXAlignment.Left}
				></Text>

				<Image
					AnchorPoint={new Vector2(0.5, 0.5)}
					Position={UDim2.fromScale(0.5, 0.5)}
					Size={UDim2.fromScale(1.25, 1)}
					ZIndex={0}
					Image="rbxassetid://122009683399101"
					ImageTransparency={0.9}
				></Image>
			</Frame>
		</Button>
	);
}
