import React from "@rbxts/react";
import { useStore } from "client/hooks";
import { IMAGES } from "shared/assets/images";
import { Image } from "client/ui/core/image";
import { Button } from "client/ui/core/button";
import { Frame } from "client/ui/core/frame";
import { Text } from "client/ui/core/text";
import { fonts, colors } from "client/ui/constants";
import { useSelector } from "@rbxts/react-reflex";
import { selectContext } from "client/store/context";
import { KeyCode, lerpBinding, useKeyPress, useUpdateEffect, useMotion } from "@rbxts/pretty-react-hooks";
import { springs } from "client/ui/constants";
import { Tool, TOOLS } from "client/constants/navigation/tools";

export interface ToolbarButtonProps {
	tool: Tool;
}

export function ToolbarButton(props: ToolbarButtonProps) {
	const store = useStore();
	const context = useSelector(selectContext);
	const isHotkeyPressed = useKeyPress([TOOLS[props.tool].hotkey] as KeyCode[]);

	const [onClickAnimation, onClickAnimationMotion] = useMotion(0);
	const [onHoverAnimation, onHoverAnimationMotion] = useMotion(0);

	useUpdateEffect(() => {
		onClickAnimationMotion.spring(context === props.tool ? 1 : 0, springs.slow);
	}, [context]);

	useUpdateEffect(() => {
		if (!isHotkeyPressed) return;
		store.setContext(props.tool);
	}, [isHotkeyPressed]);

	return (
		<Button
			anchorPoint={new Vector2(0.5, 0.5)}
			size={new UDim2(0.767, 0, 0.13, 0)}
			onMouseEnter={() => {
				onHoverAnimationMotion.spring(1, springs.responsive);
			}}
			onMouseLeave={() => {
				onHoverAnimationMotion.spring(0, springs.responsive);
			}}
			onClick={() => {
				store.setContext(props.tool);
			}}
			layoutOrder={TOOLS[props.tool].index}
		>
			<Frame size={new UDim2(1, 0, 1, 0)} backgroundColor={colors.black}>
				<uistroke
					ApplyStrokeMode={Enum.ApplyStrokeMode.Contextual}
					Color={lerpBinding(
						onClickAnimation,
						colors.white,
						props.tool === "Delete" ? colors.lightred : colors.lightblue,
					)}
					LineJoinMode={Enum.LineJoinMode.Round}
				></uistroke>

				<Image
					anchorPoint={new Vector2(0.5, 0.5)}
					position={new UDim2(0.5, 0, 0.5, 0)}
					size={new UDim2(0.58, 0, 0.58, 0)}
					image={IMAGES.ui[props.tool]}
					imageColor={lerpBinding(
						onClickAnimation,
						colors.white,
						props.tool === "Delete" ? colors.lightred : colors.white,
					)}
				></Image>

				<Image
					anchorPoint={new Vector2(0.5, 0.5)}
					position={new UDim2(0.5, 0, 0.5, 0)}
					size={new UDim2(1.4, 0, 1.4, 0)}
					image={IMAGES.ui.Glow}
					imageColor={props.tool === "Delete" ? colors.lightred : colors.lightblue}
					imageTransparency={lerpBinding(onClickAnimation, 1, 0.685)}
				></Image>

				<Frame
					anchorPoint={new Vector2(0, 1)}
					backgroundColor={Color3.fromRGB(30, 30, 30)}
					position={new UDim2(0.745, 0, 0.255, 0)}
					size={new UDim2(0.35, 0, 0.35, 0)}
				>
					<uistroke
						ApplyStrokeMode={Enum.ApplyStrokeMode.Contextual}
						Color={Color3.fromRGB(70, 70, 70)}
						LineJoinMode={Enum.LineJoinMode.Round}
					></uistroke>

					<Text
						size={new UDim2(1, 0, 1, 0)}
						font={fonts.josefinSans.regular}
						text={tostring(TOOLS[props.tool].index + 1)}
						textSize={14}
						textColor={colors.white}
						textXAlignment={Enum.TextXAlignment.Center}
						textYAlignment={Enum.TextYAlignment.Center}
					></Text>
				</Frame>

				<Frame
					position={new UDim2(1.136, 0, 0, 0)}
					size={lerpBinding(onHoverAnimation, new UDim2(0, 0, 1.015, 0), new UDim2(5.379, 0, 1.015, 0))}
					clipsDescendants={true}
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

					<Frame
						anchorPoint={new Vector2(0.5, 0.5)}
						position={new UDim2(0.178, 0, 0.262, 0)}
						size={new UDim2(0.294, 0, 0.318, 0)}
						backgroundTransparency={1}
					>
						<Text
							anchorPoint={new Vector2(0.5, 0.5)}
							position={new UDim2(0.5, 0, 0.5, 0)}
							size={new UDim2(1, 0, 1, 0)}
							font={fonts.josefinSans.medium}
							text={`${props.tool} Tool`}
							textColor={
								context === props.tool
									? props.tool === "Delete"
										? colors.lightred
										: colors.lightblue
									: colors.white
							}
							textTransparency={lerpBinding(onHoverAnimation, 1, 0)}
							textSize={14}
							textXAlignment={Enum.TextXAlignment.Left}
							textYAlignment={Enum.TextYAlignment.Center}
						></Text>
						<Image
							anchorPoint={new Vector2(0.5, 0.5)}
							position={new UDim2(0.6, 0, 0.5, 0)}
							size={new UDim2(2, 0, 2, 0)}
							image={IMAGES.ui.Glow}
							imageColor={props.tool === "Delete" ? colors.lightred : colors.lightblue}
							imageTransparency={lerpBinding(onClickAnimation, 1, 0.685)}
						></Image>
					</Frame>

					<Text
						anchorPoint={new Vector2(0.5, 0.5)}
						position={new UDim2(0.512, 0, 0.676, 0)}
						size={new UDim2(0.963, 0, 0.374, 0)}
						font={fonts.josefinSans.regular}
						text={TOOLS[props.tool].description}
						textColor={colors.white}
						textTransparency={lerpBinding(onHoverAnimation, 1, 0)}
						textSize={12}
						textXAlignment={Enum.TextXAlignment.Left}
						textYAlignment={Enum.TextYAlignment.Center}
					></Text>

					<Image
						anchorPoint={new Vector2(0.5, 0.5)}
						position={new UDim2(0.5, 0, 0.5, 0)}
						size={new UDim2(1.42, 0, 1.42, 0)}
						image="rbxassetid://122009683399101"
						imageTransparency={0.94}
					></Image>
				</Frame>
			</Frame>
		</Button>
	);
}
