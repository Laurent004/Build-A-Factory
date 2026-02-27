import React from "@rbxts/react";
import { fonts, colors, springs } from "client/ui/constants";
import { useSelector } from "@rbxts/react-reflex";
import { lerpBinding, useMotion, useUpdateEffect } from "@rbxts/pretty-react-hooks";
import { IMAGES } from "shared/assets/images";
import { store } from "client/store";
import { BaseInfoPanel } from "../base";
import { selectContextStructureAttribute, selectContextStructureModels } from "client/store/context";
import { Button, Frame, Image, Text } from "client/ui/core";
import { InfoPanelPowerGraph } from "./power-graph";

export function PowerSwitchInfoPanel() {
	const structureModel = useSelector(selectContextStructureModels)[0];
	const on = useSelector(selectContextStructureAttribute("On"));
	const [clickAnimation, clickAnimationMotion] = useMotion(0);

	useUpdateEffect(() => {
		clickAnimationMotion.spring(on ? 1 : 0, springs.gentle);
	}, [on]);

	return (
		<BaseInfoPanel active={structureModel?.Name === "Power Switch"} size={UDim2.fromScale(0.212, 0.687)}>
			<Frame Size={UDim2.fromScale(1, 0.41)} BackgroundTransparency={1} LayoutOrder={1}>
				<Text
					Size={UDim2.fromScale(0.511, 0.074)}
					FontFace={fonts.josefinSans.medium}
					Text={"Power Graph (Red) :"}
					TextSize={19}
					TextXAlignment={Enum.TextXAlignment.Left}
					TextYAlignment={Enum.TextYAlignment.Top}
				></Text>

				<InfoPanelPowerGraph
					attachment={
						structureModel !== undefined
							? structureModel
									.GetDescendants()
									.find(
										(instance): instance is Attachment =>
											instance.IsA("Attachment") &&
											instance.Name === "PowerAttachment" &&
											instance.Parent?.Name === "Red",
									)
							: undefined
					}
				></InfoPanelPowerGraph>
			</Frame>

			<Frame Size={UDim2.fromScale(0.564, 0.038)} BackgroundTransparency={1} LayoutOrder={2}>
				<Text
					Size={UDim2.fromScale(0.33, 1)}
					FontFace={fonts.josefinSans.medium}
					Text={"Switch :"}
					TextSize={19}
					TextXAlignment={Enum.TextXAlignment.Left}
				></Text>

				<Text
					AnchorPoint={new Vector2(0.5, 0)}
					Position={UDim2.fromScale(0.47, 0)}
					Size={UDim2.fromScale(0.148, 1)}
					FontFace={fonts.josefinSans.medium}
					Text={"OFF"}
					TextColor3={colors.grey}
					TextSize={15}
				></Text>

				<Button
					AnchorPoint={new Vector2(0.5, 0.5)}
					Position={UDim2.fromScale(0.705, 0.5)}
					Size={UDim2.fromScale(0.193, 0.85)}
					Event={{
						MouseButton1Click: () => {
							if (structureModel.Name !== "Power Switch") return;
							store.setContextStructuresModelsAttribute("On", !on);
						},
					}}
				>
					<uicorner CornerRadius={new UDim(0, 64)}></uicorner>

					<uistroke
						ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
						Color={lerpBinding(clickAnimation, colors.grey, colors.lightblue)}
						Thickness={1.5}
					></uistroke>

					<Frame
						AnchorPoint={new Vector2(0.5, 0.5)}
						Position={lerpBinding(clickAnimation, UDim2.fromScale(0.282, 0.5), UDim2.fromScale(0.718, 0.5))}
						Size={UDim2.fromScale(0.32, 0.624)}
						BackgroundColor3={lerpBinding(clickAnimation, colors.grey, colors.lightblue)}
					>
						<uicorner CornerRadius={new UDim(0, 64)}></uicorner>

						<Image
							AnchorPoint={new Vector2(0.5, 0.5)}
							Position={UDim2.fromScale(0.5, 0.5)}
							Size={UDim2.fromScale(2.52, 2.5)}
							Image={IMAGES.Glow}
							ImageColor3={colors.lightblue}
							ImageTransparency={lerpBinding(clickAnimation, 1, 0.8)}
						></Image>
					</Frame>
				</Button>

				<Text
					AnchorPoint={new Vector2(0.5, 0)}
					Position={UDim2.fromScale(0.926, 0)}
					Size={UDim2.fromScale(0.148, 1)}
					FontFace={fonts.josefinSans.medium}
					Text={"ON"}
					TextColor3={lerpBinding(clickAnimation, colors.grey, colors.lightblue)}
					TextSize={15}
				>
					<Image
						AnchorPoint={new Vector2(0.5, 0.5)}
						Position={UDim2.fromScale(0.5, 0.5)}
						Size={UDim2.fromScale(1.25, 2)}
						Image={IMAGES.Glow}
						ImageColor3={colors.lightblue}
						ImageTransparency={lerpBinding(clickAnimation, 1, 0.9)}
					></Image>
				</Text>
			</Frame>

			<Frame Size={UDim2.fromScale(1, 0.41)} BackgroundTransparency={1} LayoutOrder={3}>
				<Text
					Size={UDim2.fromScale(0.511, 0.074)}
					FontFace={fonts.josefinSans.medium}
					Text={"Power Graph (Blue) :"}
					TextSize={19}
					TextXAlignment={Enum.TextXAlignment.Left}
					TextYAlignment={Enum.TextYAlignment.Top}
				></Text>

				<InfoPanelPowerGraph
					attachment={
						structureModel !== undefined
							? structureModel
									.GetDescendants()
									.find(
										(instance): instance is Attachment =>
											instance.IsA("Attachment") &&
											instance.Name === "PowerAttachment" &&
											instance.Parent?.Name === "Blue",
									)
							: undefined
					}
				></InfoPanelPowerGraph>
			</Frame>
		</BaseInfoPanel>
	);
}
