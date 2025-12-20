import { Array } from "@rbxts/luau-polyfill";
import { lerpBinding, useMotion, useUpdateEffect } from "@rbxts/pretty-react-hooks";
import React from "@rbxts/react";
import { useSelector } from "@rbxts/react-reflex";
import { useRem, useStore } from "client/hooks";
import { Events } from "client/network";
import { selectContext, selectContextStructureModels } from "client/store/context";
import { colors, fonts, springs } from "client/ui/constants";
import { Button } from "client/ui/core/button";
import { Frame } from "client/ui/core/frame";
import { Image } from "client/ui/core/image";
import { Text } from "client/ui/core/text";
import { IMAGES } from "shared/assets/images";
import { STRUCTURES } from "shared/constants/structures";

export function DeleteWarning() {
	const store = useStore();
	const rem = useRem();
	const context = useSelector(selectContext);
	const structuresModels = useSelector(selectContextStructureModels);
	const [onMountAnimation, onMountAnimationMotion] = useMotion(0);

	useUpdateEffect(() => {
		onMountAnimationMotion.spring(context === "Delete" && structuresModels.size() > 1 ? 1 : 0, springs.gentle);
	}, [context, structuresModels]);

	return (
		<canvasgroup
			GroupTransparency={onMountAnimation.map((value) => 1 - value)}
			Active={context === "Delete" && structuresModels.size() > 1}
			AnchorPoint={new Vector2(0.5, 0.5)}
			Position={lerpBinding(onMountAnimation, new UDim2(0.5, 0, 0, rem(690)), new UDim2(0.5, 0, 0.5, 0))}
			Size={lerpBinding(
				onMountAnimation,
				new UDim2(0, rem(320), 0, rem(181)),
				new UDim2(0, rem(506), 0, rem(181)),
			)}
			BackgroundColor3={colors.black}
			BorderSizePixel={0}
			Interactable={context === "Delete" && structuresModels.size() > 1}
			ZIndex={2}
		>
			<Text
				anchorPoint={new Vector2(0, 0)}
				position={lerpBinding(onMountAnimation, new UDim2(-0.5, 0, 0.12, 0), new UDim2(0.04, 0, 0.12, 0))}
				size={new UDim2(0.5627, 0, 0.1302, 0)}
				font={fonts.josefinSans.semiBold}
				text={"Remove multiple structures ?"}
				textSize={20}
				textColor={colors.white}
				textTransparency={onMountAnimation.map((value) => 1 - value)}
				textXAlignment={Enum.TextXAlignment.Left}
				textYAlignment={Enum.TextYAlignment.Top}
			></Text>
			<Text
				anchorPoint={new Vector2(0, 0)}
				position={lerpBinding(onMountAnimation, new UDim2(0.04, 0, 0.6, 0), new UDim2(0.04, 0, 0.33, 0))}
				size={new UDim2(0.7646, 0, 0.0855, 0)}
				font={fonts.josefinSans.regular}
				text={`Are your sure you want to remove ${structuresModels.size()} structures ?`}
				textSize={16}
				textColor={colors.white}
				textTransparency={onMountAnimation.map((value) => 1 - value)}
				textXAlignment={Enum.TextXAlignment.Left}
				textYAlignment={Enum.TextYAlignment.Top}
			></Text>
			<Text
				anchorPoint={new Vector2(0, 0)}
				position={new UDim2(0.04, 0, 0.5, 0)}
				size={new UDim2(0.7765, 0, 0.0975, 0)}
				font={fonts.josefinSans.light}
				text={"Warning : You will be refunded 90% of the total cost."}
				textSize={16}
				textColor={colors.white}
				textTransparency={onMountAnimation.map((value) => 1 - value)}
				textXAlignment={Enum.TextXAlignment.Left}
				textYAlignment={Enum.TextYAlignment.Top}
			></Text>
			<Frame
				anchorPoint={new Vector2(0.5, 1)}
				position={new UDim2(0.5, 0, 1, 0)}
				size={new UDim2(1, 0, 0.2481, 0)}
				backgroundTransparency={1}
			>
				<Button
					anchorPoint={new Vector2(0, 0.5)}
					position={lerpBinding(onMountAnimation, new UDim2(0, 0, 1, 0), new UDim2(0, 0, 0.5, 0))}
					size={new UDim2(0.5, 0, 1, 0)}
					onClick={() => {
						onMountAnimationMotion.spring(0, springs.gentle);
					}}
				>
					<Text
						anchorPoint={new Vector2(0.5, 0.5)}
						position={new UDim2(0.5, 0, 0.5, 0)}
						size={new UDim2(1, 0, 1, 0)}
						font={fonts.josefinSans.regular}
						text={"Cancel"}
						textSize={12}
						textColor={colors.white}
						textTransparency={onMountAnimation.map((value) => 1 - value)}
						textXAlignment={Enum.TextXAlignment.Center}
						textYAlignment={Enum.TextYAlignment.Center}
					></Text>
					<uistroke
						ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
						Color={colors.grey}
						LineJoinMode={Enum.LineJoinMode.Miter}
						Thickness={1}
					></uistroke>
				</Button>

				<Button
					anchorPoint={new Vector2(1, 0.5)}
					position={lerpBinding(onMountAnimation, new UDim2(1, 0, 1, 0), new UDim2(1, 0, 0.5, 0))}
					size={new UDim2(0.5, 0, 1, 0)}
					onClick={() => {
						Events.DestroyStructures([
							...structuresModels,
							...Array.flatMap(structuresModels, (structureModel) =>
								structureModel
									.GetDescendants()
									.filter(
										(instance): instance is Model =>
											instance.IsA("Model") && instance.Name in STRUCTURES,
									),
							),
						]);
						store.setContextStructuresModels([]);
					}}
				>
					<Text
						anchorPoint={new Vector2(0.5, 0.5)}
						position={new UDim2(0.5, 0, 0.5, 0)}
						size={new UDim2(1, 0, 1, 0)}
						font={fonts.josefinSans.regular}
						text={`Remove ${structuresModels.size()} structures`}
						textSize={12}
						textColor={Color3.fromRGB(255, 120, 120)}
						textTransparency={onMountAnimation.map((value) => 1 - value)}
						textXAlignment={Enum.TextXAlignment.Center}
						textYAlignment={Enum.TextYAlignment.Center}
					></Text>
					<Image
						anchorPoint={new Vector2(0.5, 0.5)}
						position={new UDim2(0.5, 0, 0.5, 0)}
						size={new UDim2(0.8, 0, 1, 0)}
						image={IMAGES.ui.Glow}
						imageColor={Color3.fromRGB(255, 120, 120)}
						imageTransparency={lerpBinding(onMountAnimation, 1, 0.9)}
					></Image>
					<uistroke
						ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
						Color={colors.grey}
						LineJoinMode={Enum.LineJoinMode.Miter}
						Thickness={1}
					></uistroke>
				</Button>
			</Frame>
		</canvasgroup>
	);
}
