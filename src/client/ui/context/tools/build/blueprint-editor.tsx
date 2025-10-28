import React, { useRef } from "@rbxts/react";
import { lerpBinding, useMotion, useUpdateEffect } from "@rbxts/pretty-react-hooks";
import { useSelector } from "@rbxts/react-reflex";
import { selectContext, selectContextOpen } from "client/store/context";
import { Button } from "client/ui/core/button";
import { colors, fonts, springs } from "client/ui/constants";
import { Frame } from "client/ui/core/frame";
import { Image } from "client/ui/core/image";
import { Text } from "client/ui/core/text";
import { IMAGES } from "shared/assets/images";
import { Events } from "client/network";
import { selectBuildMenuBlueprintEditorOpen, selectBuildMenuStructureInformation } from "client/store/context/build";
import { useStore } from "client/hooks";
import { useRem } from "client/hooks/use-rem";

export function BlueprintEditor() {
	const store = useStore();
	const rem = useRem();

	const context = useSelector(selectContext);
	const contextOpen = useSelector(selectContextOpen);
	const blueprintEditorOpen = useSelector(selectBuildMenuBlueprintEditorOpen);
	const selectedStructureInformation = useSelector(selectBuildMenuStructureInformation);

	const blueprintNameTextBoxRef = useRef<TextBox>();
	const blueprintDescriptionTextBoxRef = useRef<TextBox>();
	const [onMountAnimation, onMountAnimationMotion] = useMotion(0);

	useUpdateEffect(() => {
		onMountAnimationMotion.spring(
			context === "Build" && contextOpen && blueprintEditorOpen ? 1 : 0,
			springs.gentle,
		);
	}, [context, contextOpen, blueprintEditorOpen]);

	return (
		<canvasgroup
			GroupTransparency={onMountAnimation.map((value) => 1 - value)}
			AnchorPoint={new Vector2(0.5, 0.5)}
			Position={lerpBinding(onMountAnimation, new UDim2(0.5, 0, 0.36, 0), new UDim2(0.5, 0, 0.5, 0))}
			Size={lerpBinding(onMountAnimation, new UDim2(0, 0, 0, 0), new UDim2(0, rem(578), 0, rem(427)))}
			BackgroundColor3={colors.black}
			BorderSizePixel={0}
			ZIndex={3}
			Active={true}
			Interactable={context === "Build" && contextOpen && blueprintEditorOpen}
		>
			<Frame
				anchorPoint={new Vector2(0.5, 0)}
				position={new UDim2(0.5, 0, 0, 0)}
				size={new UDim2(1, 0, 0.082, 0)}
				backgroundTransparency={1}
			>
				<Image
					anchorPoint={new Vector2(0.5, 0.5)}
					position={lerpBinding(onMountAnimation, new UDim2(0.04, 0, -2, 0), new UDim2(0.04, 0, 0.5, 0))}
					size={new UDim2(0.038, 0, 0.61, 0)}
					image={IMAGES.ui.Blueprint}
					imageTransparency={onMountAnimation.map((value) => 1 - value)}
				></Image>

				<Text
					anchorPoint={new Vector2(0.5, 0.5)}
					position={lerpBinding(onMountAnimation, new UDim2(-0.5, 0, 0.5, 0), new UDim2(0.197, 0, 0.5, 0))}
					size={new UDim2(0.25, 0, 0.56, 0)}
					font={fonts.josefinSans.medium}
					textSize={18}
					textTransparency={onMountAnimation.map((value) => 1 - value)}
					textColor={colors.white}
					text={"Blueprint Editor"}
					textXAlignment={Enum.TextXAlignment.Left}
					textYAlignment={Enum.TextYAlignment.Center}
				></Text>

				<uistroke
					ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
					Color={colors.grey}
					LineJoinMode={Enum.LineJoinMode.Miter}
				></uistroke>

				<Button
					anchorPoint={new Vector2(0.5, 0.5)}
					position={new UDim2(0.957, 0, 0.5, 0)}
					size={new UDim2(0.028, 0, 0.46, 0)}
					onClick={() => {
						store.setBuildMenuBlueprintEditorOpen(false);
					}}
				>
					<Image
						anchorPoint={new Vector2(0.5, 0.5)}
						position={new UDim2(0.5, 0, 0.5, 0)}
						size={new UDim2(1, 0, 1, 0)}
						image={IMAGES.ui.Close}
					></Image>
				</Button>
			</Frame>

			<Image
				anchorPoint={new Vector2(0.5, 0.5)}
				position={lerpBinding(onMountAnimation, new UDim2(0.154, 0, 0.9, 0), new UDim2(0.154, 0, 0.297, 0))}
				size={new UDim2(0.231, 0, 0.312, 0)}
				image={IMAGES.ui["Iron Plate"]}
				imageTransparency={onMountAnimation.map((value) => 1 - value)}
			></Image>

			<Frame
				anchorPoint={new Vector2(0.5, 0.5)}
				position={new UDim2(0.65, 0, 0.485, 0)}
				size={new UDim2(0.626, 0, 0.702, 0)}
				backgroundTransparency={1}
			>
				<uilistlayout
					Padding={new UDim(0, 11)}
					HorizontalAlignment={Enum.HorizontalAlignment.Left}
					VerticalAlignment={Enum.VerticalAlignment.Top}
				></uilistlayout>

				<Frame size={new UDim2(1, 0, 0.108, 0)} backgroundTransparency={1}>
					<Text
						anchorPoint={new Vector2(0, 0.5)}
						position={lerpBinding(onMountAnimation, new UDim2(-0.8, 0, 0.5, 0), new UDim2(0, 0, 0.5, 0))}
						size={new UDim2(1, 0, 1, 0)}
						font={fonts.josefinSans.regular}
						textSize={18}
						textTransparency={onMountAnimation.map((value) => 1 - value)}
						textColor={colors.white}
						text={"Blueprint Name :"}
						textXAlignment={Enum.TextXAlignment.Left}
						textYAlignment={Enum.TextYAlignment.Center}
					></Text>
				</Frame>

				<Frame
					size={new UDim2(1, 0, 0.142, 0)}
					backgroundColor={colors.mediumgrey}
					backgroundTransparency={onMountAnimation.map((value) => 1 - value)}
				>
					<textbox
						ref={blueprintNameTextBoxRef}
						AnchorPoint={new Vector2(0.5, 0.5)}
						Position={lerpBinding(onMountAnimation, new UDim2(0.5, 0, 1, 0), new UDim2(0.5, 0, 0.5, 0))}
						Size={new UDim2(0.95, 0, 0.55, 0)}
						BackgroundTransparency={1}
						FontFace={fonts.josefinSans.regular}
						TextSize={16}
						PlaceholderColor3={colors.grey}
						PlaceholderText={"New Blueprint"}
						TextColor3={colors.white}
						Text=""
						TextXAlignment={Enum.TextXAlignment.Left}
						TextYAlignment={Enum.TextYAlignment.Center}
					></textbox>
				</Frame>

				<Frame size={new UDim2(1, 0, 0.103, 0)} backgroundTransparency={1}>
					<Text
						anchorPoint={new Vector2(0, 0.5)}
						position={lerpBinding(onMountAnimation, new UDim2(-1.2, 0, 0.5, 0), new UDim2(0, 0, 0.5, 0))}
						size={new UDim2(1, 0, 1, 0)}
						font={fonts.josefinSans.regular}
						textSize={18}
						textTransparency={onMountAnimation.map((value) => 1 - value)}
						textColor={colors.white}
						text={"Blueprint Description :"}
						textXAlignment={Enum.TextXAlignment.Left}
						textYAlignment={Enum.TextYAlignment.Center}
					></Text>
				</Frame>

				<Frame
					size={new UDim2(1, 0, 0.425, 0)}
					backgroundColor={colors.mediumgrey}
					backgroundTransparency={onMountAnimation.map((value) => 1 - value)}
				>
					<textbox
						ref={blueprintDescriptionTextBoxRef}
						AnchorPoint={new Vector2(0.5, 0.5)}
						Position={lerpBinding(onMountAnimation, new UDim2(0.5, 0, 1.5, 0), new UDim2(0.5, 0, 0.5, 0))}
						Size={new UDim2(0.95, 0, 0.78, 0)}
						BackgroundTransparency={1}
						FontFace={fonts.josefinSans.regular}
						TextSize={16}
						PlaceholderColor3={colors.grey}
						PlaceholderText={"Description..."}
						TextColor3={colors.white}
						Text=""
						TextXAlignment={Enum.TextXAlignment.Left}
						TextYAlignment={Enum.TextYAlignment.Top}
					></textbox>
				</Frame>
			</Frame>

			<Frame
				anchorPoint={new Vector2(0.5, 1)}
				position={new UDim2(0.5, 0, 1, 0)}
				size={new UDim2(1, 0, 0.082, 0)}
				backgroundTransparency={1}
			>
				<Button
					anchorPoint={new Vector2(0, 0.5)}
					position={new UDim2(0, 0, 0.5, 0)}
					size={new UDim2(0.5, 0, 1, 0)}
					backgroundTransparency={1}
					onClick={() => {
						Events.DeleteBlueprint(selectedStructureInformation.structureModel);
						store.setBuildMenuBlueprintEditorOpen(false);
						blueprintNameTextBoxRef.current!.Text = "";
						blueprintDescriptionTextBoxRef.current!.Text = "";
					}}
				>
					<Text
						anchorPoint={new Vector2(0.5, 0.5)}
						position={lerpBinding(onMountAnimation, new UDim2(0.5, 0, 0.8, 0), new UDim2(0.5, 0, 0.5, 0))}
						size={new UDim2(1, 0, 1, 0)}
						font={fonts.josefinSans.regular}
						textSize={16}
						textTransparency={onMountAnimation.map((value) => 1 - value)}
						textColor={colors.lightred}
						text={"Delete Blueprint"}
						textXAlignment={Enum.TextXAlignment.Center}
						textYAlignment={Enum.TextYAlignment.Center}
					></Text>

					<Image
						anchorPoint={new Vector2(0.5, 0.5)}
						position={lerpBinding(onMountAnimation, new UDim2(0.5, 0, 1.5, 0), new UDim2(0.5, 0, 0.5, 0))}
						size={new UDim2(0.6, 0, 1, 0)}
						image={IMAGES.ui.Glow}
						imageColor={colors.lightred}
						imageTransparency={lerpBinding(onMountAnimation, 1, 0.8)}
					></Image>

					<uistroke
						ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
						Color={colors.grey}
						LineJoinMode={Enum.LineJoinMode.Miter}
					></uistroke>
				</Button>

				<Button
					anchorPoint={new Vector2(1, 0.5)}
					position={new UDim2(1, 0, 0.5, 0)}
					size={new UDim2(0.5, 0, 1, 0)}
					backgroundTransparency={1}
					onClick={() => {
						Events.EditBlueprint(
							selectedStructureInformation.structureModel,
							blueprintNameTextBoxRef.current!.Text,
							blueprintDescriptionTextBoxRef.current!.Text,
						);

						store.setBuildMenuBlueprintEditorOpen(false);
						blueprintNameTextBoxRef.current!.Text = "";
						blueprintDescriptionTextBoxRef.current!.Text = "";
					}}
				>
					<Text
						anchorPoint={new Vector2(0.5, 0.5)}
						position={lerpBinding(onMountAnimation, new UDim2(0.5, 0, 1.5, 0), new UDim2(0.5, 0, 0.5, 0))}
						size={new UDim2(1, 0, 1, 0)}
						font={fonts.josefinSans.regular}
						textSize={16}
						textTransparency={onMountAnimation.map((value) => 1 - value)}
						textColor={colors.lightblue}
						text={"Save Blueprint"}
						textXAlignment={Enum.TextXAlignment.Center}
						textYAlignment={Enum.TextYAlignment.Center}
					></Text>

					<Image
						anchorPoint={new Vector2(0.5, 0.5)}
						position={lerpBinding(onMountAnimation, new UDim2(0.5, 0, 1.5, 0), new UDim2(0.5, 0, 0.5, 0))}
						size={new UDim2(0.6, 0, 1, 0)}
						image={IMAGES.ui.Glow}
						imageColor={colors.lightblue}
						imageTransparency={lerpBinding(onMountAnimation, 1, 0.8)}
					></Image>

					<uistroke
						ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
						Color={colors.grey}
						LineJoinMode={Enum.LineJoinMode.Miter}
					></uistroke>
				</Button>
			</Frame>
		</canvasgroup>
	);
}
