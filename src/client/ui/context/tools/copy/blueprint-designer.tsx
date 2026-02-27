import React, { useBinding, useState } from "@rbxts/react";
import { lerpBinding, useMotion, useUpdateEffect } from "@rbxts/pretty-react-hooks";
import { useSelector } from "@rbxts/react-reflex";
import { colors, fonts, springs } from "client/ui/constants";
import { IMAGES } from "shared/assets/images";
import { Events } from "client/network";
import { MarketplaceService } from "@rbxts/services";
import { Object } from "@rbxts/luau-polyfill";
import { Button, CanvasGroup, Frame, Image, ScrollingFrame, Text, TextBox } from "client/ui/core";
import { STRUCTURES } from "shared/constants/structures";
import { selectContext, selectContextStructureModels } from "client/hooks/store/context";

export function BlueprintDesigner() {
	const context = useSelector(selectContext);
	const structuresModels = useSelector(selectContextStructureModels);
	const isActive = context === "Copy" && structuresModels.size() > 0;

	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [name, setName] = useBinding<string>("");
	const [description, setDescription] = useBinding<string>("");
	const [subcategory, setSubcategory] = useBinding<string>("");
	const [image, setImage] = useBinding<string>(STRUCTURES["Conveyor"].image);
	const [areImagesOpen, setAreImagesOpen] = useState<boolean>(false);

	const [mountAnimation, mountAnimationMotion] = useMotion(0);
	const [clickAnimation, clickAnimationMotion] = useMotion(0);

	useUpdateEffect(() => {
		if (!isActive) {
			setIsOpen(false);
		}
		mountAnimationMotion.spring(isActive ? 1 : 0, springs.gentle);
		clickAnimationMotion.spring(isActive && isOpen ? 1 : 0, springs.gentle);
	}, [isActive, isOpen]);

	return (
		<>
			<Button
				AnchorPoint={new Vector2(0.5, 0.5)}
				Position={lerpBinding(mountAnimation, UDim2.fromScale(1.2, 0.5), UDim2.fromScale(0.97, 0.5))}
				Size={UDim2.fromScale(0.034, 0.06)}
				Event={{
					MouseButton1Click: () => {
						setIsOpen(!isOpen);
					},
				}}
			>
				<Frame Size={UDim2.fromScale(1, 1)} BackgroundColor3={colors.black}>
					<Frame
						AnchorPoint={new Vector2(0.5, 0.5)}
						Position={UDim2.fromScale(0.5, 0.5)}
						Size={UDim2.fromScale(0.8, 0.8)}
						BackgroundTransparency={1}
					>
						<uistroke
							ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
							Color={colors.white}
							LineJoinMode={Enum.LineJoinMode.Miter}
						></uistroke>

						<Image
							AnchorPoint={new Vector2(0.5, 0.5)}
							Position={UDim2.fromScale(0.5, 0.5)}
							Size={UDim2.fromScale(0.65, 0.65)}
							Image={IMAGES.Blueprints}
						></Image>
					</Frame>
				</Frame>
			</Button>

			<CanvasGroup
				GroupTransparency={clickAnimation.map((value) => 1 - value)}
				Active={isActive && isOpen}
				AnchorPoint={new Vector2(0.5, 0.5)}
				Position={UDim2.fromScale(0.5, 0.5)}
				Size={lerpBinding(clickAnimation, UDim2.fromOffset(0, 0), UDim2.fromScale(0.364, 0.422))}
				BackgroundColor3={colors.black}
				Interactable={isActive && isOpen}
				ZIndex={2}
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
						Image={IMAGES.Blueprints}
					></Image>

					<Text
						AnchorPoint={new Vector2(0.5, 0.5)}
						Position={UDim2.fromScale(0.172, 0.5)}
						Size={UDim2.fromScale(0.21, 0.54)}
						FontFace={fonts.josefinSans.bold}
						Text={"Blueprint Designer"}
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

					<Frame Size={UDim2.fromScale(1, 0.093)} BackgroundColor3={colors.mediumgrey} LayoutOrder={1}>
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

					<Frame Size={UDim2.fromScale(1, 0.072)} BackgroundTransparency={1} LayoutOrder={2}>
						<Text
							Size={UDim2.fromScale(1, 1)}
							Text={"Blueprint Description :"}
							TextSize={18}
							TextXAlignment={Enum.TextXAlignment.Left}
						></Text>
					</Frame>

					<Frame Size={UDim2.fromScale(1, 0.204)} BackgroundColor3={colors.mediumgrey} LayoutOrder={3}>
						<TextBox
							Size={UDim2.fromScale(1, 1)}
							ClearTextOnFocus={false}
							PlaceholderText={"Description..."}
							PlaceholderColor3={colors.grey}
							Text={description}
							TextSize={16}
							TextTruncate={Enum.TextTruncate.SplitWord}
							TextWrapped={true}
							TextXAlignment={Enum.TextXAlignment.Left}
							TextYAlignment={Enum.TextYAlignment.Top}
							Change={{
								Text: (textBox) => {
									setDescription(textBox.Text);
								},
							}}
						>
							<uipadding PaddingTop={new UDim(0, 12)} PaddingLeft={new UDim(0, 12)}></uipadding>
						</TextBox>
					</Frame>

					<Frame Size={UDim2.fromScale(1, 0.072)} BackgroundTransparency={1} LayoutOrder={4}>
						<Text
							Size={UDim2.fromScale(1, 1)}
							Text={"Blueprint Subcategory :"}
							TextSize={18}
							TextXAlignment={Enum.TextXAlignment.Left}
						></Text>
					</Frame>

					<Frame Size={UDim2.fromScale(1, 0.093)} BackgroundColor3={colors.mediumgrey} LayoutOrder={5}>
						<TextBox
							Size={UDim2.fromScale(1, 1)}
							ClearTextOnFocus={false}
							PlaceholderText={"New Subcategory"}
							PlaceholderColor3={colors.grey}
							Text={subcategory}
							TextSize={16}
							TextTruncate={Enum.TextTruncate.SplitWord}
							TextXAlignment={Enum.TextXAlignment.Left}
							Change={{
								Text: (textBox) => {
									setSubcategory(textBox.Text);
								},
							}}
						>
							<uipadding PaddingLeft={new UDim(0, 12)}></uipadding>
						</TextBox>
					</Frame>

					<Frame Size={UDim2.fromScale(1, 0.072)} BackgroundTransparency={1} LayoutOrder={6}>
						<Text
							Size={UDim2.fromScale(1, 1)}
							Text={"Blueprint Icon :"}
							TextSize={18}
							TextXAlignment={Enum.TextXAlignment.Left}
						></Text>
					</Frame>

					<Frame Size={UDim2.fromScale(1, 0.093)} BackgroundTransparency={1} LayoutOrder={7}>
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
								setIsOpen(false);
							},
						}}
					>
						<uistroke
							ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
							Color={colors.grey}
							LineJoinMode={Enum.LineJoinMode.Miter}
						></uistroke>

						<Text Size={UDim2.fromScale(1, 1)} Text={"Cancel Blueprint"} TextSize={16}></Text>
					</Button>

					<Button
						Position={UDim2.fromScale(0.5, 0)}
						Size={UDim2.fromScale(0.5, 1)}
						BackgroundTransparency={1}
						Event={{
							MouseButton1Click: () => {
								Events.CreateBlueprint(
									structuresModels,
									name.getValue(),
									description.getValue(),
									subcategory.getValue(),
									image.getValue(),
								);
								setIsOpen(false);
							},
						}}
					>
						<Text
							Size={UDim2.fromScale(1, 1)}
							Text={"Save Blueprint"}
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
		</>
	);
}
