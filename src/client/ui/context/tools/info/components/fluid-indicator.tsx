import React from "@rbxts/react";
import { useSelector } from "@rbxts/react-reflex";
import TransporterComponent from "client/components/logistics/transporter";
import { selectContextStructureComponents } from "client/store/context";
import { colors, fonts } from "client/ui/constants";
import { CanvasGroup, Frame, Image, Text } from "client/ui/core";
import { IMAGES } from "shared/assets/images";
import { STRUCTURES } from "shared/constants/structures";
import { round } from "shared/utils/math";

interface InfoPanelFluidIndicatorProps {
	fluid: React.Binding<[string, number] | undefined>;
}

export function InfoPanelFluidIndicator({ fluid }: InfoPanelFluidIndicatorProps) {
	const transporterComponents = useSelector(selectContextStructureComponents(TransporterComponent));

	return (
		<Frame
			AnchorPoint={new Vector2(0, 0.5)}
			Position={UDim2.fromScale(0, 0.5)}
			Size={UDim2.fromScale(0, 0.78)}
			BackgroundColor3={colors.white}
		>
			<uiaspectratioconstraint
				DominantAxis={Enum.DominantAxis.Height}
				AspectType={Enum.AspectType.ScaleWithParentSize}
			></uiaspectratioconstraint>

			<uicorner CornerRadius={new UDim(0, 128)}></uicorner>

			<uistroke ApplyStrokeMode={Enum.ApplyStrokeMode.Border} Color={colors.black}></uistroke>

			<uigradient
				Color={
					new ColorSequence([
						new ColorSequenceKeypoint(0, Color3.fromRGB(32, 32, 32)),
						new ColorSequenceKeypoint(1, Color3.fromRGB(47, 47, 47)),
					])
				}
				Rotation={-90}
			></uigradient>

			<CanvasGroup
				Active={false}
				AnchorPoint={new Vector2(0.5, 0.5)}
				Position={UDim2.fromScale(0.5, 0.5)}
				Size={UDim2.fromScale(0.84, 0.84)}
				BackgroundColor3={colors.black}
				Interactable={false}
			>
				<uicorner CornerRadius={new UDim(0, 128)}></uicorner>

				<Frame
					BackgroundColor3={colors.lightblue}
					AnchorPoint={new Vector2(0, 1)}
					Position={UDim2.fromScale(0, 1)}
					Size={fluid.map((value) =>
						UDim2.fromScale(
							1,
							(value?.[1] ?? 0) /
								transporterComponents.reduce(
									(capacity, transporter) =>
										(capacity +=
											(STRUCTURES[transporter.instance.Name].constants["FluidCapacity"] as
												| number
												| undefined) ?? 0),
									0,
								),
						),
					)}
				>
					<uigradient
						Color={
							new ColorSequence([
								new ColorSequenceKeypoint(0, Color3.fromRGB(138, 138, 138)),
								new ColorSequenceKeypoint(1, colors.white),
							])
						}
						Rotation={90}
					></uigradient>

					<Image
						AnchorPoint={new Vector2(0, 1)}
						Position={UDim2.fromScale(0, 0.01)}
						Size={new UDim2(1, 0, 0, 35)}
						Image="rbxassetid://137618825457886"
						ImageRectSize={new Vector2(128, 128)}
						ImageColor3={Color3.fromRGB(212, 227, 255)}
					></Image>
				</Frame>

				<Image
					AnchorPoint={new Vector2(0.5, 0.5)}
					Position={UDim2.fromScale(0.5, 0.79)}
					Size={UDim2.fromScale(0.9, 0.9)}
					ZIndex={3}
					Image={IMAGES.Glow}
					ImageTransparency={0.8}
				></Image>

				<Text
					AnchorPoint={new Vector2(0.5, 0.5)}
					Position={UDim2.fromScale(0.5, 0.36)}
					Size={UDim2.fromScale(0.8, 0.23)}
					ZIndex={3}
					FontFace={fonts.josefinSans.bold}
					Text={fluid.map((value) => value?.[0] ?? "")}
					TextScaled={true}
					TextStrokeTransparency={0.5}
					TextWrapped={true}
				></Text>

				<Text
					AnchorPoint={new Vector2(0.5, 0.5)}
					Position={UDim2.fromScale(0.5, 0.63)}
					Size={UDim2.fromScale(0.8, 0.13)}
					ZIndex={3}
					FontFace={fonts.josefinSans.bold}
					Text={fluid.map((value) => `${round(value?.[1] ?? 0, 2)}m³`)}
					TextSize={18}
					TextStrokeTransparency={0.5}
				></Text>
			</CanvasGroup>
		</Frame>
	);
}
