import { Array } from "@rbxts/luau-polyfill";
import { lerpBinding, useMotion, useUpdateEffect } from "@rbxts/pretty-react-hooks";
import React from "@rbxts/react";
import { useSelector } from "@rbxts/react-reflex";
import { useStore } from "client/hooks";
import { Events } from "client/network";
import { selectContext, selectContextStructureModels } from "client/store/context";
import { colors, fonts, springs } from "client/ui/constants";
import { Button, CanvasGroup, Frame, Image, Text } from "client/ui/core";
import { IMAGES } from "shared/assets/images";
import { STRUCTURES } from "shared/constants/structures";

export function DeleteModal() {
	const store = useStore();
	const context = useSelector(selectContext);
	const structuresModels = useSelector(selectContextStructureModels);
	const isActive = context === "Delete" && structuresModels.size() > 1;
	const [mountAnimation, mountAnimationMotion] = useMotion(0);

	useUpdateEffect(() => {
		mountAnimationMotion.spring(isActive ? 1 : 0, springs.gentle);
	}, [isActive]);

	return (
		<CanvasGroup
			GroupTransparency={mountAnimation.map((value) => 1 - value)}
			Active={isActive}
			AnchorPoint={new Vector2(0.5, 0.5)}
			Position={UDim2.fromScale(0.5, 0.5)}
			Size={lerpBinding(mountAnimation, UDim2.fromScale(0, 0), UDim2.fromScale(0.264, 0.157))}
			BackgroundColor3={colors.black}
			Interactable={isActive}
			ZIndex={4}
		>
			<Text
				AnchorPoint={new Vector2(0.5, 0.5)}
				Position={UDim2.fromScale(0.323, 0.188)}
				Size={UDim2.fromScale(0.569, 0.11)}
				FontFace={fonts.josefinSans.bold}
				Text={"Remove multiple structures ?"}
				TextSize={20}
				TextXAlignment={Enum.TextXAlignment.Left}
				TextYAlignment={Enum.TextYAlignment.Top}
			></Text>

			<Text
				AnchorPoint={new Vector2(0.5, 0.5)}
				Position={UDim2.fromScale(0.493, 0.49)}
				Size={UDim2.fromScale(0.91, 0.253)}
				LineHeight={1.5}
				Text={`You will earn back $${Array.flatMap(structuresModels, (structureModel) =>
					[structureModel, ...structureModel.GetDescendants()].filter(
						(instance): instance is Model => instance.IsA("Model") && instance.Name in STRUCTURES,
					),
				).reduce(
					(value, structureModel) => (value += STRUCTURES[structureModel.Name].cost),
					0,
				)}. Are you sure you want to remove ${structuresModels.size()} structures ?`}
				TextSize={16}
				TextWrapped={true}
				TextXAlignment={Enum.TextXAlignment.Left}
				TextYAlignment={Enum.TextYAlignment.Top}
			></Text>

			<Frame
				AnchorPoint={new Vector2(0, 1)}
				Position={UDim2.fromScale(0, 1)}
				Size={UDim2.fromScale(1, 0.248)}
				BackgroundTransparency={1}
			>
				<Button
					Position={UDim2.fromScale(0, 0)}
					Size={UDim2.fromScale(0.5, 1)}
					Event={{
						MouseButton1Click: () => {
							mountAnimationMotion.spring(0, springs.gentle);
						},
					}}
				>
					<uistroke
						ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
						Color={colors.grey}
						LineJoinMode={Enum.LineJoinMode.Miter}
					></uistroke>

					<Text Size={UDim2.fromScale(1, 1)} Text={"Cancel"} TextSize={14}></Text>
				</Button>

				<Button
					Position={UDim2.fromScale(0.5, 0)}
					Size={UDim2.fromScale(0.5, 1)}
					Event={{
						MouseButton1Click: () => {
							Events.DestroyStructures(
								Array.flatMap(structuresModels, (structureModel) =>
									[structureModel, ...structureModel.GetDescendants()].filter(
										(instance): instance is Model =>
											instance.IsA("Model") && instance.Name in STRUCTURES,
									),
								),
							);
							store.setContextStructuresModels([]);
						},
					}}
				>
					<uistroke
						ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
						Color={colors.grey}
						LineJoinMode={Enum.LineJoinMode.Miter}
					></uistroke>

					<Text
						Size={UDim2.fromScale(1, 1)}
						Text={`Remove ${structuresModels.size()} structures`}
						TextColor3={colors.lightred}
						TextSize={14}
					></Text>

					<Image
						AnchorPoint={new Vector2(0.5, 0.5)}
						Position={UDim2.fromScale(0.5, 0.5)}
						Size={UDim2.fromScale(0.8, 1)}
						Image={IMAGES.ui.Glow}
						ImageColor3={colors.lightred}
						ImageTransparency={0.8}
					></Image>
				</Button>
			</Frame>
		</CanvasGroup>
	);
}
