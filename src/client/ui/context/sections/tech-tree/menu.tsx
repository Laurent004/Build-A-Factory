import React from "@rbxts/react";
import { useSelector } from "@rbxts/react-reflex";
import { selectContext } from "client/store/context";
import { colors } from "client/ui/constants";
import { Button, Frame, Image, Text } from "client/ui/core";
import { IMAGES } from "shared/assets/images";

export function TechTreeMenu() {
	const context = useSelector(selectContext);

	return (
		<Frame
			Size={UDim2.fromScale(1, 1)}
			BackgroundColor3={colors.black}
			Visible={context === "Tech Tree"}
			ZIndex={2}
			ClipsDescendants={true}
		>
			<Frame AnchorPoint={new Vector2(0.5, 0.5)} Position={UDim2.fromScale(0.5, 0.5)}>
				<uiscale Scale={1}></uiscale>

				<TechTreeMenuTechNode position={UDim2.fromOffset(0, 0)}></TechTreeMenuTechNode>

				<Frame Position={UDim2.fromOffset(-1, 16)} Size={UDim2.fromOffset(2, 303)} ZIndex={0}></Frame>

				<TechTreeMenuTechNode position={UDim2.fromOffset(0, 300)}></TechTreeMenuTechNode>
			</Frame>
		</Frame>
	);
}

interface TechTreeMenuTechNodeProps {
	position: UDim2;
}

function TechTreeMenuTechNode({ position }: TechTreeMenuTechNodeProps) {
	return (
		<Button AnchorPoint={new Vector2(0.5, 0.5)} Position={position} Size={UDim2.fromOffset(171, 200)}>
			<Text
				Position={UDim2.fromScale(0.117, 0)}
				Size={UDim2.fromScale(0.883, 0.092)}
				Text={"Speed Upgrades :"}
				TextSize={11}
				TextXAlignment={Enum.TextXAlignment.Left}
			></Text>

			<Text
				Position={UDim2.fromScale(0.117, 0.11)}
				Size={UDim2.fromScale(0.883, 0.092)}
				Text={"Conveyor Speed Lvl 1 :"}
				TextSize={13}
				TextXAlignment={Enum.TextXAlignment.Left}
			></Text>

			<Frame
				AnchorPoint={new Vector2(0.5, 0.5)}
				Position={UDim2.fromScale(0.5, 0.58)}
				Size={UDim2.fromScale(0.75, 0.64)}
				BackgroundColor3={Color3.fromRGB(32, 32, 32)}
			>
				<uistroke
					ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
					Color={colors.white}
					LineJoinMode={Enum.LineJoinMode.Miter}
					Thickness={1.5}
				></uistroke>

				<Image
					AnchorPoint={new Vector2(0.5, 0.5)}
					Position={UDim2.fromScale(0.5, 0.5)}
					Size={UDim2.fromScale(0.85, 0.85)}
					Image={IMAGES.Conveyor}
				></Image>
			</Frame>
		</Button>
	);
}
