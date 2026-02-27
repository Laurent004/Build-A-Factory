import React, { useBinding, useState } from "@rbxts/react";
import { lerpBinding, useMotion, useUpdateEffect } from "@rbxts/pretty-react-hooks";
import { useSelector } from "@rbxts/react-reflex";
import { Button } from "client/ui/core/button";
import { colors, fonts, springs } from "client/ui/constants";
import { IMAGES } from "shared/assets/images";
import { Events } from "client/network";
import { useStore } from "client/hooks";
import { MarketplaceService } from "@rbxts/services";
import { Object } from "@rbxts/luau-polyfill";
import { CanvasGroup, Frame, Image, ScrollingFrame, Text, TextBox } from "client/ui/core";
import { selectContext, selectContextOpen } from "client/hooks/store/context";
import { selectIsBlueprintEditorOpen, selectStructureInfo } from "client/hooks/store/context/tools";

export function BlueprintEditor() {
	const store = useStore();
	const context = useSelector(selectContext);
	const isContextOpen = useSelector(selectContextOpen);
	const isBlueprintEditorOpen = useSelector(selectIsBlueprintEditorOpen);
	const structureInfo = useSelector(selectStructureInfo);
	const isActive = context === "Build" && isContextOpen && isBlueprintEditorOpen;

	const [name, setName] = useBinding<string>("");
	const [description, setDescription] = useBinding<string>("");
	const [image, setImage] = useBinding<string>("");
	const [areImagesOpen, setAreImagesOpen] = useState<boolean>(false);

	const [mountAnimation, mountAnimationMotion] = useMotion(0);

	useUpdateEffect(() => {
		if (isActive) {
			setName(structureInfo.structureModel.Name);
			setImage(structureInfo.structureImage);
			setDescription(structureInfo.structureDescription);
		}
		mountAnimationMotion.spring(isActive ? 1 : 0, springs.gentle);
	}, [isActive]);

	return (
		<CanvasGroup
			GroupTransparency={mountAnimation.map((value) => 1 - value)}
			Active={isActive}
			AnchorPoint={new Vector2(0.5, 0.5)}
			Position={UDim2.fromScale(0.5, 0.5)}
			Size={lerpBinding(mountAnimation, UDim2.fromScale(0, 0), UDim2.fromScale(0.364, 0.422))}
			BackgroundColor3={colors.black}
			Interactable={isActive}
			ZIndex={3}
		>
			<Frame Size={UDim2.fromScale(1, 0.082)} BackgroundTransparency={1}>
				<uistroke
					ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
					Color={colors.grey}
					LineJoinMode={Enum.LineJoinMode.Miter}
				></uistroke>

				<Image
					AnchorPoint={new Vector2(0.5, 0.5)}
					Position={UDim2.fromScale(0.037, 0.465)}
					Size={UDim2.fromScale(0.032, 0.61)}
					Image="rbxassetid://106059788567013"
				></Image>

				<Text
					AnchorPoint={new Vector2(0.5, 0.5)}
					Position={UDim2.fromScale(0.172, 0.5)}
					Size={UDim2.fromScale(0.21, 0.54)}
					FontFace={fonts.josefinSans.bold}
					Text={"Blueprint Editor"}
					TextSize={18}
					TextXAlignment={Enum.TextXAlignment.Left}
				></Text>
			</Frame>

			<Image
				AnchorPoint={new Vector2(0.5, 0.5)}
				Position={UDim2.fromScale(0.15, 0.3)}
				Size={UDim2.fromScale(0.217, 0.333)}
				Image={image}
			></Image>

			<ScrollingFrame
				Position={UDim2.fromScale(0.039, 0.465)}
				Size={UDim2.fromScale(0.591, 0.453)}
				BackgroundColor3={colors.black}
				BackgroundTransparency={0}
				Visible={areImagesOpen}
			>
				<uipadding
					PaddingTop={new UDim(0, 8)}
					PaddingLeft={new UDim(0, 8)}
					PaddingRight={new UDim(0, 8)}
					PaddingBottom={new UDim(0, 8)}
				></uipadding>

				<uigridlayout
					CellPadding={UDim2.fromOffset(5, 5)}
					CellSize={UDim2.fromOffset(75, 75)}
					SortOrder={Enum.SortOrder.LayoutOrder}
				></uigridlayout>

				{Object.values(IMAGES).map((image, index) => (
					<Button
						LayoutOrder={index}
						Event={{
							MouseButton1Click: () => {
								setImage(image);
								setAreImagesOpen(false);
							},
						}}
					>
						<Image Size={UDim2.fromScale(1, 1)} Image={image}></Image>
					</Button>
				))}
			</ScrollingFrame>

			<Frame
				AnchorPoint={new Vector2(0.5, 0.5)}
				Position={UDim2.fromScale(0.636, 0.487)}
				Size={UDim2.fromScale(0.655, 0.706)}
				BackgroundTransparency={1}
				ZIndex={0}
			>
				<uilistlayout Padding={new UDim(0, 11)} SortOrder={Enum.SortOrder.LayoutOrder}></uilistlayout>

				<Frame Size={UDim2.fromScale(1, 0.097)} BackgroundTransparency={1} LayoutOrder={0}>
					<Text
						Size={UDim2.fromScale(1, 1)}
						Text={"Blueprint Name :"}
						TextSize={18}
						TextXAlignment={Enum.TextXAlignment.Left}
					></Text>
				</Frame>

				<Frame Size={UDim2.fromScale(1, 0.125)} BackgroundColor3={colors.mediumgrey} LayoutOrder={1}>
					<TextBox
						Size={UDim2.fromScale(1, 1)}
						ClearTextOnFocus={false}
						PlaceholderText={"New Blueprint"}
						PlaceholderColor3={colors.grey}
						Text={name}
						TextSize={16}
						TextTruncate={Enum.TextTruncate.SplitWord}
						TextXAlignment={Enum.TextXAlignment.Left}
						Change={{
							Text: (textBox) => {
								setName(textBox.Text);
							},
						}}
					>
						<uipadding PaddingLeft={new UDim(0, 12)}></uipadding>
					</TextBox>
				</Frame>

				<Frame Size={UDim2.fromScale(1, 0.097)} BackgroundTransparency={1} LayoutOrder={2}>
					<Text
						Size={UDim2.fromScale(1, 1)}
						Text={"Blueprint Description :"}
						TextSize={18}
						TextXAlignment={Enum.TextXAlignment.Left}
					></Text>
				</Frame>

				<Frame
					Size={UDim2.fromScale(1, 0.273)}
					BackgroundColor3={colors.mediumgrey}
					BackgroundTransparency={mountAnimation.map((value) => 1 - value)}
					LayoutOrder={3}
				>
					<TextBox
						Size={UDim2.fromScale(1, 1)}
						ClearTextOnFocus={false}
						PlaceholderText={"Description..."}
						PlaceholderColor3={colors.grey}
						Text={description}
						TextSize={16}
						TextTruncate={Enum.TextTruncate.SplitWord}
						TextXAlignment={Enum.TextXAlignment.Left}
						TextYAlignment={Enum.TextYAlignment.Top}
						TextWrapped={true}
						Change={{
							Text: (textBox) => {
								setDescription(textBox.Text);
							},
						}}
					>
						<uipadding PaddingTop={new UDim(0, 12)} PaddingLeft={new UDim(0, 12)}></uipadding>
					</TextBox>
				</Frame>

				<Frame Size={UDim2.fromScale(1, 0.097)} BackgroundTransparency={1} LayoutOrder={4}>
					<Text
						Size={UDim2.fromScale(1, 1)}
						Text={"Blueprint Icon :"}
						TextSize={18}
						TextXAlignment={Enum.TextXAlignment.Left}
					></Text>
				</Frame>

				<Frame Size={UDim2.fromScale(1, 0.125)} BackgroundTransparency={1} LayoutOrder={5}>
					<Frame Size={UDim2.fromScale(0.725, 1)} BackgroundColor3={colors.mediumgrey}>
						<TextBox
							Size={UDim2.fromScale(1, 1)}
							ClearTextOnFocus={false}
							PlaceholderText={"Image ID"}
							PlaceholderColor3={colors.grey}
							TextSize={16}
							TextTruncate={Enum.TextTruncate.SplitWord}
							TextXAlignment={Enum.TextXAlignment.Left}
							Event={{
								FocusLost: (textBox) => {
									const match = textBox.Text.match("%d+");
									if (match[0] === undefined) return;
									const id = tonumber(match[0]);
									if (id === undefined) return;
									task.spawn(() => {
										const [success, productInfo] = pcall(() =>
											MarketplaceService.GetProductInfo(id, Enum.InfoType.Asset),
										);
										if (
											!success ||
											(productInfo.AssetTypeId !== Enum.AssetType.Image.Value &&
												productInfo.AssetTypeId !== Enum.AssetType.Decal.Value)
										)
											return;
										setImage(`rbxassetid://${id}`);
									});
								},
							}}
						>
							<uipadding PaddingLeft={new UDim(0, 12)}></uipadding>
						</TextBox>
					</Frame>

					<Button
						AnchorPoint={new Vector2(1, 0)}
						Position={UDim2.fromScale(1, 0)}
						Size={UDim2.fromScale(0.248, 1)}
						Event={{
							MouseButton1Click: () => {
								setAreImagesOpen(!areImagesOpen);
							},
						}}
					>
						<Frame Size={UDim2.fromScale(1, 1)} BackgroundColor3={colors.mediumgrey}>
							<Text Size={UDim2.fromScale(1, 1)} Text={"Images"} TextSize={18}></Text>
						</Frame>
					</Button>
				</Frame>
			</Frame>

			<Frame
				AnchorPoint={new Vector2(0, 1)}
				Position={UDim2.fromScale(0, 1)}
				Size={UDim2.fromScale(1, 0.082)}
				BackgroundTransparency={1}
			>
				<uistroke
					ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
					Color={colors.grey}
					LineJoinMode={Enum.LineJoinMode.Miter}
				></uistroke>

				<Button
					Size={UDim2.fromScale(0.5, 1)}
					BackgroundTransparency={1}
					Event={{
						MouseButton1Click: () => {
							Events.DeleteBlueprint(structureInfo.structureModel.GetAttribute("Id") as string);
							store.setBlueprintEditorOpen(false);
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
						Text={"Delete Blueprint"}
						TextSize={16}
						TextColor3={colors.lightred}
					></Text>

					<Image
						AnchorPoint={new Vector2(0.5, 0.5)}
						Position={UDim2.fromScale(0.5, 0.5)}
						Size={UDim2.fromScale(0.6, 1.5)}
						Image={IMAGES.Glow}
						ImageColor3={colors.lightred}
						ImageTransparency={0.9}
					></Image>
				</Button>

				<Button
					Position={UDim2.fromScale(0.5, 0)}
					Size={UDim2.fromScale(0.5, 1)}
					BackgroundTransparency={1}
					Event={{
						MouseButton1Click: () => {
							Events.EditBlueprint(
								structureInfo.structureModel.GetAttribute("Id") as string,
								name.getValue(),
								description.getValue(),
								image.getValue(),
							);
							store.setBlueprintEditorOpen(false);
						},
					}}
				>
					<Text
						Size={UDim2.fromScale(1, 1)}
						Text={"Save Changes"}
						TextSize={16}
						TextColor3={colors.lightblue}
					></Text>

					<Image
						AnchorPoint={new Vector2(0.5, 0.5)}
						Position={UDim2.fromScale(0.5, 0.5)}
						Size={UDim2.fromScale(0.6, 1.5)}
						Image={IMAGES.Glow}
						ImageColor3={colors.lightblue}
						ImageTransparency={0.9}
					></Image>
				</Button>
			</Frame>
		</CanvasGroup>
	);
}
