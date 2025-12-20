import React, { useRef, useState } from "@rbxts/react";
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
import { MarketplaceService } from "@rbxts/services";
import { Object } from "@rbxts/luau-polyfill";

export function BuildMenuBlueprintEditor() {
	const store = useStore();
	const rem = useRem();
	const context = useSelector(selectContext);
	const contextOpen = useSelector(selectContextOpen);
	const blueprintEditorOpen = useSelector(selectBuildMenuBlueprintEditorOpen);
	const structureInformation = useSelector(selectBuildMenuStructureInformation);
	const [presetsOpen, setPresetsOpen] = useState<boolean>(false);
	const blueprintNameTextBoxRef = useRef<TextBox>();
	const blueprintDescriptionTextBoxRef = useRef<TextBox>();
	const blueprintImageRef = useRef<ImageLabel>();
	const [onMountAnimation, onMountAnimationMotion] = useMotion(0);

	useUpdateEffect(() => {
		if (context === "Build" && contextOpen && blueprintEditorOpen) {
			blueprintNameTextBoxRef.current!.Text = structureInformation.structureModel.Name;
			blueprintImageRef.current!.Image = structureInformation.structureImage;
			blueprintDescriptionTextBoxRef.current!.Text = structureInformation.structureDescription;
		}
		onMountAnimationMotion.spring(
			context === "Build" && contextOpen && blueprintEditorOpen ? 1 : 0,
			springs.gentle,
		);
	}, [context, contextOpen, blueprintEditorOpen]);

	return (
		<canvasgroup
			GroupTransparency={onMountAnimation.map((value) => 1 - value)}
			Active={context === "Build" && contextOpen && blueprintEditorOpen}
			AnchorPoint={new Vector2(0.5, 0.5)}
			Position={lerpBinding(onMountAnimation, new UDim2(0.5, 0, 0, rem(660)), new UDim2(0.5, 0, 0.5, 0))}
			Size={lerpBinding(onMountAnimation, new UDim2(0, 0, 0, 0), new UDim2(0, rem(698), 0, rem(455)))}
			BackgroundColor3={colors.black}
			BorderSizePixel={0}
			Interactable={context === "Build" && contextOpen && blueprintEditorOpen}
			ZIndex={3}
		>
			<Frame
				anchorPoint={new Vector2(0.5, 0)}
				position={new UDim2(0.5, 0, 0, 0)}
				size={new UDim2(1, 0, 0.082, 0)}
				backgroundTransparency={1}
			>
				<Image
					anchorPoint={new Vector2(0.5, 0.5)}
					position={lerpBinding(onMountAnimation, new UDim2(0.037, 0, 1.5, 0), new UDim2(0.037, 0, 0.465, 0))}
					size={new UDim2(0.032, 0, 0.61, 0)}
					image="rbxassetid://106059788567013"
					imageTransparency={onMountAnimation.map((value) => 1 - value)}
				></Image>

				<Text
					anchorPoint={new Vector2(0.5, 0.5)}
					position={lerpBinding(onMountAnimation, new UDim2(-0.5, 0, 0.5, 0), new UDim2(0.172, 0, 0.5, 0))}
					size={new UDim2(0.21, 0, 0.54, 0)}
					font={fonts.josefinSans.medium}
					text={"Blueprint Designer"}
					textSize={18}
					textColor={colors.white}
					textTransparency={onMountAnimation.map((value) => 1 - value)}
					textXAlignment={Enum.TextXAlignment.Left}
					textYAlignment={Enum.TextYAlignment.Center}
				></Text>

				<uistroke
					ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
					Color={colors.grey}
					LineJoinMode={Enum.LineJoinMode.Miter}
					Thickness={1}
				></uistroke>
			</Frame>

			<Image
				ref={blueprintImageRef}
				anchorPoint={new Vector2(0.5, 0.5)}
				position={lerpBinding(onMountAnimation, new UDim2(0.146, 0, 0.9, 0), new UDim2(0.146, 0, 0.3, 0))}
				size={new UDim2(0.217, 0, 0.333, 0)}
				zIndex={0}
				image=""
				imageTransparency={onMountAnimation.map((value) => 1 - value)}
			></Image>

			<scrollingframe
				AnchorPoint={new Vector2(0, 0)}
				Position={new UDim2(0.046, 0, 0.465, 0)}
				Size={new UDim2(0.591, 0, 0.453, 0)}
				BackgroundColor3={colors.black}
				BorderSizePixel={0}
				Visible={presetsOpen}
				CanvasSize={new UDim2(0, 0, 2, 0)}
				ScrollingDirection={Enum.ScrollingDirection.Y}
				ScrollBarImageTransparency={1}
				ScrollBarThickness={0}
			>
				<uigridlayout
					CellPadding={new UDim2(0, 5, 0, 5)}
					CellSize={new UDim2(0, 70, 0, 70)}
					FillDirection={Enum.FillDirection.Horizontal}
					SortOrder={Enum.SortOrder.LayoutOrder}
					StartCorner={Enum.StartCorner.TopLeft}
					HorizontalAlignment={Enum.HorizontalAlignment.Left}
					VerticalAlignment={Enum.VerticalAlignment.Top}
				></uigridlayout>

				<uipadding
					PaddingTop={new UDim(0, 8)}
					PaddingLeft={new UDim(0, 8)}
					PaddingRight={new UDim(0, 8)}
					PaddingBottom={new UDim(0, 8)}
				></uipadding>

				{Object.values(IMAGES.ui).map((image, index) => {
					const [onMountAnimation, onMountAnimationMotion] = useMotion(0);
					useUpdateEffect(() => {
						if (!blueprintEditorOpen || !presetsOpen) return;
						onMountAnimationMotion.immediate(0);
						task.delay((index + 1) * 0.01, () => {
							onMountAnimationMotion.spring(1, springs.gentle);
						});
					}, [blueprintEditorOpen, presetsOpen]);

					return (
						<Button
							anchorPoint={new Vector2(0, 0)}
							position={new UDim2(0, 0, 0, 0)}
							size={new UDim2(0, 0, 0, 0)}
							onClick={() => {
								blueprintImageRef.current!.Image = image;
								setPresetsOpen(false);
							}}
						>
							<Image
								anchorPoint={new Vector2(0, 0)}
								position={new UDim2(0, 0, 0, 0)}
								size={new UDim2(1, 0, 1, 0)}
								image={image}
								imageTransparency={onMountAnimation.map((value) => 1 - value)}
							></Image>
						</Button>
					);
				})}
			</scrollingframe>

			<Frame
				anchorPoint={new Vector2(0.5, 0.5)}
				position={new UDim2(0.636, 0, 0.487, 0)}
				size={new UDim2(0.655, 0, 0.706, 0)}
				backgroundTransparency={1}
				zIndex={0}
			>
				<uilistlayout
					Padding={new UDim(0, 11)}
					FillDirection={Enum.FillDirection.Vertical}
					SortOrder={Enum.SortOrder.LayoutOrder}
					HorizontalAlignment={Enum.HorizontalAlignment.Left}
					VerticalAlignment={Enum.VerticalAlignment.Top}
				></uilistlayout>

				<Frame
					anchorPoint={new Vector2(0, 0)}
					position={new UDim2(0, 0, 0, 0)}
					size={new UDim2(1, 0, 0.097, 0)}
					backgroundTransparency={1}
					layoutOrder={0}
				>
					<Text
						anchorPoint={new Vector2(0, 0.5)}
						position={lerpBinding(onMountAnimation, new UDim2(-0.5, 0, 0.5, 0), new UDim2(0, 0, 0.5, 0))}
						size={new UDim2(1, 0, 1, 0)}
						font={fonts.josefinSans.regular}
						text={"Blueprint Name :"}
						textSize={18}
						textColor={colors.white}
						textTransparency={onMountAnimation.map((value) => 1 - value)}
						textXAlignment={Enum.TextXAlignment.Left}
						textYAlignment={Enum.TextYAlignment.Center}
					></Text>
				</Frame>

				<Frame
					anchorPoint={new Vector2(0, 0)}
					position={new UDim2(0, 0, 0, 0)}
					size={new UDim2(1, 0, 0.125, 0)}
					backgroundTransparency={1}
					layoutOrder={1}
				>
					<Frame
						anchorPoint={new Vector2(0, 0)}
						position={lerpBinding(onMountAnimation, new UDim2(0.5, 0, 0, 0), new UDim2(0, 0, 0, 0))}
						size={new UDim2(1, 0, 1, 0)}
						backgroundColor={colors.mediumgrey}
						backgroundTransparency={onMountAnimation.map((value) => 1 - value)}
					>
						<textbox
							ref={blueprintNameTextBoxRef}
							AnchorPoint={new Vector2(0.5, 0.5)}
							Position={new UDim2(0.5, 0, 0.5, 0)}
							Size={new UDim2(0.95, 0, 0.55, 0)}
							BackgroundTransparency={1}
							ClearTextOnFocus={false}
							FontFace={fonts.josefinSans.regular}
							PlaceholderText={"New Blueprint"}
							PlaceholderColor3={colors.grey}
							Text=""
							TextSize={16}
							TextColor3={colors.white}
							TextTruncate={Enum.TextTruncate.SplitWord}
							TextXAlignment={Enum.TextXAlignment.Left}
							TextYAlignment={Enum.TextYAlignment.Center}
						></textbox>
					</Frame>
				</Frame>

				<Frame
					anchorPoint={new Vector2(0, 0)}
					position={new UDim2(0, 0, 0, 0)}
					size={new UDim2(1, 0, 0.097, 0)}
					backgroundTransparency={1}
					layoutOrder={2}
				>
					<Text
						anchorPoint={new Vector2(0, 0.5)}
						position={lerpBinding(onMountAnimation, new UDim2(-0.5, 0, 0.5, 0), new UDim2(0, 0, 0.5, 0))}
						size={new UDim2(1, 0, 1, 0)}
						font={fonts.josefinSans.regular}
						text={"Blueprint Description :"}
						textSize={18}
						textColor={colors.white}
						textTransparency={onMountAnimation.map((value) => 1 - value)}
						textXAlignment={Enum.TextXAlignment.Left}
						textYAlignment={Enum.TextYAlignment.Center}
					></Text>
				</Frame>

				<Frame
					anchorPoint={new Vector2(0, 0)}
					position={new UDim2(0, 0, 0, 0)}
					size={new UDim2(1, 0, 0.273, 0)}
					backgroundTransparency={1}
					layoutOrder={3}
				>
					<Frame
						anchorPoint={new Vector2(0, 0)}
						position={lerpBinding(onMountAnimation, new UDim2(0.5, 0, 0, 0), new UDim2(0, 0, 0, 0))}
						size={new UDim2(1, 0, 1, 0)}
						backgroundColor={colors.mediumgrey}
						backgroundTransparency={onMountAnimation.map((value) => 1 - value)}
					>
						<textbox
							ref={blueprintDescriptionTextBoxRef}
							AnchorPoint={new Vector2(0.5, 0.5)}
							Position={new UDim2(0.5, 0, 0.5, 0)}
							Size={new UDim2(0.96, 0, 0.78, 0)}
							BackgroundTransparency={1}
							ClearTextOnFocus={false}
							FontFace={fonts.josefinSans.regular}
							PlaceholderText={"Description..."}
							PlaceholderColor3={colors.grey}
							Text=""
							TextSize={16}
							TextColor3={colors.white}
							TextTruncate={Enum.TextTruncate.SplitWord}
							TextXAlignment={Enum.TextXAlignment.Left}
							TextYAlignment={Enum.TextYAlignment.Top}
						></textbox>
					</Frame>
				</Frame>

				<Frame
					anchorPoint={new Vector2(0, 0)}
					position={new UDim2(0, 0, 0, 0)}
					size={new UDim2(1, 0, 0.097, 0)}
					backgroundTransparency={1}
					layoutOrder={4}
				>
					<Text
						anchorPoint={new Vector2(0, 0.5)}
						position={lerpBinding(onMountAnimation, new UDim2(-0.5, 0, 0.5, 0), new UDim2(0, 0, 0.5, 0))}
						size={new UDim2(1, 0, 1, 0)}
						font={fonts.josefinSans.regular}
						text={"Blueprint Icon :"}
						textSize={18}
						textColor={colors.white}
						textTransparency={onMountAnimation.map((value) => 1 - value)}
						textXAlignment={Enum.TextXAlignment.Left}
						textYAlignment={Enum.TextYAlignment.Center}
					></Text>
				</Frame>

				<Frame
					anchorPoint={new Vector2(0, 0)}
					position={new UDim2(0, 0, 0, 0)}
					size={new UDim2(1, 0, 0.125, 0)}
					backgroundTransparency={1}
					layoutOrder={5}
				>
					<Frame
						anchorPoint={new Vector2(0, 0)}
						position={lerpBinding(onMountAnimation, new UDim2(-0.5, 0, 0, 0), new UDim2(0, 0, 0, 0))}
						size={new UDim2(0.725, 0, 1, 0)}
						backgroundColor={colors.mediumgrey}
						backgroundTransparency={onMountAnimation.map((value) => 1 - value)}
					>
						<textbox
							AnchorPoint={new Vector2(0.5, 0.5)}
							Position={new UDim2(0.5, 0, 0.5, 0)}
							Size={new UDim2(0.95, 0, 0.55, 0)}
							BackgroundTransparency={1}
							ClearTextOnFocus={false}
							FontFace={fonts.josefinSans.regular}
							PlaceholderText={"Image ID"}
							PlaceholderColor3={colors.grey}
							Text=""
							TextSize={16}
							TextColor3={colors.white}
							TextTruncate={Enum.TextTruncate.SplitWord}
							TextXAlignment={Enum.TextXAlignment.Left}
							TextYAlignment={Enum.TextYAlignment.Center}
							Change={{
								Text: (textbox) => {
									const id = textbox.Text.match("%d+");
									if (id[0] === undefined) return;
									const [success, productInfo] = pcall((): AssetTypeId => {
										return MarketplaceService.GetProductInfo(tonumber(id[0])!).AssetTypeId;
									});
									if (
										!success ||
										(productInfo !== Enum.AssetType.Image.Value &&
											productInfo !== Enum.AssetType.Decal.Value)
									)
										return;
									blueprintImageRef.current!.Image = `rbxassetid://${id[0]}`;
								},
							}}
						></textbox>
					</Frame>

					<Button
						anchorPoint={new Vector2(1, 0)}
						position={lerpBinding(onMountAnimation, new UDim2(1.5, 0, 0, 0), new UDim2(1, 0, 0, 0))}
						size={new UDim2(0.248, 0, 1, 0)}
						onClick={() => {
							setPresetsOpen(!presetsOpen);
						}}
					>
						<Frame
							anchorPoint={new Vector2(0, 0)}
							position={new UDim2(0, 0, 0, 0)}
							size={new UDim2(1, 0, 1, 0)}
							backgroundColor={colors.mediumgrey}
						>
							<Text
								anchorPoint={new Vector2(0, 0)}
								position={new UDim2(0, 0, 0, 0)}
								size={new UDim2(1, 0, 1, 0)}
								font={fonts.josefinSans.regular}
								text={"Presets"}
								textSize={18}
								textColor={colors.white}
								textTransparency={onMountAnimation.map((value) => 1 - value)}
								textXAlignment={Enum.TextXAlignment.Center}
								textYAlignment={Enum.TextYAlignment.Center}
							></Text>
						</Frame>
					</Button>
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
					position={lerpBinding(onMountAnimation, new UDim2(0, 0, 1, 0), new UDim2(0, 0, 0.5, 0))}
					size={new UDim2(0.5, 0, 1, 0)}
					backgroundTransparency={1}
					onClick={() => {
						Events.DeleteBlueprint(structureInformation.structureModel);
						store.setBuildMenuBlueprintEditorOpen(false);
					}}
				>
					<Text
						anchorPoint={new Vector2(0.5, 0.5)}
						position={new UDim2(0.5, 0, 0.5, 0)}
						size={new UDim2(1, 0, 1, 0)}
						font={fonts.josefinSans.regular}
						text={"Delete Blueprint"}
						textSize={16}
						textColor={colors.lightred}
						textTransparency={onMountAnimation.map((value) => 1 - value)}
						textXAlignment={Enum.TextXAlignment.Center}
						textYAlignment={Enum.TextYAlignment.Center}
					></Text>

					<Image
						anchorPoint={new Vector2(0.5, 0.5)}
						position={lerpBinding(onMountAnimation, new UDim2(0.5, 0, 1.5, 0), new UDim2(0.5, 0, 0.5, 0))}
						size={new UDim2(0.8, 0, 1, 0)}
						image={IMAGES.ui.Glow}
						imageColor={colors.lightred}
						imageTransparency={lerpBinding(onMountAnimation, 1, 0.9)}
					></Image>

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
					backgroundTransparency={1}
					onClick={() => {
						Events.EditBlueprint(
							structureInformation.structureModel,
							blueprintNameTextBoxRef.current!.Text,
							blueprintImageRef.current!.Image,
							blueprintDescriptionTextBoxRef.current!.Text,
						);
						store.setBuildMenuBlueprintEditorOpen(false);
					}}
				>
					<Text
						anchorPoint={new Vector2(0.5, 0.5)}
						position={new UDim2(0.5, 0, 0.5, 0)}
						size={new UDim2(1, 0, 1, 0)}
						font={fonts.josefinSans.regular}
						text={"Save Changes"}
						textSize={16}
						textColor={colors.lightblue}
						textTransparency={onMountAnimation.map((value) => 1 - value)}
						textXAlignment={Enum.TextXAlignment.Center}
						textYAlignment={Enum.TextYAlignment.Center}
					></Text>

					<Image
						anchorPoint={new Vector2(0.5, 0.5)}
						position={lerpBinding(onMountAnimation, new UDim2(0.5, 0, 1.5, 0), new UDim2(0.5, 0, 0.5, 0))}
						size={new UDim2(0.8, 0, 1, 0)}
						image={IMAGES.ui.Glow}
						imageColor={colors.lightblue}
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
