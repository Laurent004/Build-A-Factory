import React from "@rbxts/react";
import { useStore } from "client/hooks";
import { Events } from "client/network";
import { colors } from "client/ui/constants";
import { Button, Frame, Image, Text } from "client/ui/core";
import { IMAGES } from "shared/assets/images";
import { TECHS } from "shared/constants/tech";

interface TechTreeMenuTechNodeProps {
	techName: string;
	isUnlocked: boolean;
}

export function TechTreeMenuTechNode({ techName, isUnlocked }: TechTreeMenuTechNodeProps) {
	const store = useStore();

	return (
		<Button
			AnchorPoint={new Vector2(0.5, 0.5)}
			Position={UDim2.fromOffset(TECHS[techName].layout!.column * 300, TECHS[techName].layout!.row * 300)}
			Size={UDim2.fromOffset(171, 220)}
			Event={{
				MouseEnter: () => {
					store.setTips([TECHS[techName].description]);
				},
				MouseLeave: () => {
					store.setTips([]);
				},
				MouseButton1Click: () => {
					if (isUnlocked) return;
					Events.UnlockTech(techName);
				},
			}}
		>
			<Text
				Position={UDim2.fromScale(0.117, 0)}
				Size={UDim2.fromScale(0.883, 0.07)}
				Text={`${
					TECHS[techName].type === "Structure"
						? TECHS[techName].structures.size() > 1
							? "Structures"
							: "Structure"
						: TECHS[techName].type
				} :`}
				TextSize={13}
				TextXAlignment={Enum.TextXAlignment.Left}
			></Text>

			<Text
				Position={UDim2.fromScale(0.117, 0.12)}
				Size={UDim2.fromScale(0.883, 0.07)}
				Text={techName}
				TextSize={13}
				TextXAlignment={Enum.TextXAlignment.Left}
			></Text>

			<Frame
				AnchorPoint={new Vector2(0.5, 0.5)}
				Position={UDim2.fromScale(0.5, 0.55)}
				Size={UDim2.fromScale(0.75, 0.585)}
				BackgroundColor3={Color3.fromRGB(32, 32, 32)}
			>
				<uistroke
					ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
					Color={isUnlocked ? colors.white : Color3.fromRGB(0, 0, 0)}
					LineJoinMode={Enum.LineJoinMode.Miter}
					Thickness={2}
				></uistroke>

				<Image
					AnchorPoint={new Vector2(0.5, 0.5)}
					Position={UDim2.fromScale(0.5, 0.5)}
					Size={UDim2.fromScale(0.85, 0.85)}
					Image={IMAGES.Conveyor}
				></Image>
			</Frame>

			<Frame
				AnchorPoint={new Vector2(0, 1)}
				Position={UDim2.fromScale(0.117, 1)}
				Size={UDim2.fromScale(0.883, 0.117)}
				BackgroundTransparency={1}
			>
				<uilistlayout
					Padding={new UDim(0, 26)}
					FillDirection={Enum.FillDirection.Horizontal}
					SortOrder={Enum.SortOrder.LayoutOrder}
				></uilistlayout>

				{(["logisticsData", "productionData", "powerData"] as const)
					.filter((dataType) => TECHS[techName].cost[dataType] > 0)
					.map((dataType, index) => (
						<Frame
							AutomaticSize={Enum.AutomaticSize.X}
							Size={UDim2.fromScale(0, 1)}
							BackgroundTransparency={1}
							LayoutOrder={index}
						>
							<Frame
								AnchorPoint={new Vector2(0, 0.5)}
								Position={UDim2.fromScale(0, 0.5)}
								Size={UDim2.fromScale(0, 0.3)}
							>
								<uiaspectratioconstraint
									AspectType={Enum.AspectType.ScaleWithParentSize}
									DominantAxis={Enum.DominantAxis.Height}
								></uiaspectratioconstraint>
							</Frame>

							<Text
								AutomaticSize={Enum.AutomaticSize.X}
								Size={UDim2.fromScale(0, 1)}
								Text={tostring(TECHS[techName].cost[dataType])}
								TextSize={16}
								TextXAlignment={Enum.TextXAlignment.Left}
							>
								<uipadding PaddingLeft={new UDim(0, 16)}></uipadding>
							</Text>
						</Frame>
					))}
			</Frame>
		</Button>
	);
}
