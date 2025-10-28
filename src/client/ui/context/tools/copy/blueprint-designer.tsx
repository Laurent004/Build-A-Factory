import React, { useRef, useState } from "@rbxts/react";
import { lerpBinding, useEventListener, useMotion, useUpdateEffect } from "@rbxts/pretty-react-hooks";
import { useSelector } from "@rbxts/react-reflex";
import { selectContext } from "client/store/context";
import { Button } from "client/ui/core/button";
import { colors, fonts, springs } from "client/ui/constants";
import { Frame } from "client/ui/core/frame";
import { Image } from "client/ui/core/image";
import { EventBus } from "client/event-bus";
import { Text } from "client/ui/core/text";
import { IMAGES } from "shared/assets/images";
import { Events } from "client/network";
import { STRUCTURES } from "shared/constants/structures";
import { useRem } from "client/hooks/use-rem";

export function BlueprintDesigner() {
	const rem = useRem();

	const context = useSelector(selectContext);

	const [selection, setSelection] = useState<Model>();
	const [open, setOpen] = useState(false);
	const blueprintNameTextBoxRef = useRef<TextBox>();
	const blueprintDescriptionTextBoxRef = useRef<TextBox>();
	const blueprintSubcategoryTextBoxRef = useRef<TextBox>();
	const [onMountAnimation, onMountAnimationMotion] = useMotion(0);
	const [onClickAnimation, onClickAnimationMotion] = useMotion(0);

	useUpdateEffect(() => {
		if (context === "Copy") return;
		setSelection(undefined);
		setOpen(false);
	}, [context]);

	useEventListener(EventBus.ToolEvents.Copy.OnSelection, (selection) => {
		setSelection(selection);
	});

	useUpdateEffect(() => {
		onMountAnimationMotion.spring(
			context === "Copy" &&
				selection !== undefined &&
				selection
					.GetChildren()
					.filter((instance): instance is Model => instance.IsA("Model") && instance.Name in STRUCTURES)
					.size() > 0
				? 1
				: 0,
			springs.gentle,
		);
	}, [selection]);

	useUpdateEffect(() => {
		blueprintNameTextBoxRef.current!.Text = "";
		blueprintDescriptionTextBoxRef.current!.Text = "";
		blueprintSubcategoryTextBoxRef.current!.Text = "";
		onClickAnimationMotion.spring(open ? 1 : 0, springs.gentle);
	}, [open]);

	return (
		<>
			<Button
				anchorPoint={new Vector2(0.5, 0.5)}
				position={lerpBinding(onMountAnimation, new UDim2(1.05, 0, 0.5, 0), new UDim2(0, rem(1862), 0.5, 0))}
				size={new UDim2(0, rem(65), 0, rem(65))}
				backgroundTransparency={onMountAnimation.map((value) => 1 - value)}
				backgroundColor={colors.black}
				onClick={() => {
					setOpen(!open);
				}}
			>
				<Frame
					anchorPoint={new Vector2(0.5, 0.5)}
					position={new UDim2(0.5, 0, 0.5, 0)}
					size={new UDim2(0.8, 0, 0.8, 0)}
					backgroundTransparency={1}
				>
					<uistroke
						ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
						Color={colors.white}
						LineJoinMode={Enum.LineJoinMode.Miter}
					></uistroke>

					<Image
						anchorPoint={new Vector2(0.5, 0.5)}
						position={lerpBinding(onMountAnimation, new UDim2(0.5, 0, 0.2, 0), new UDim2(0.5, 0, 0.5, 0))}
						size={new UDim2(0.65, 0, 0.65, 0)}
						image={IMAGES.ui.Blueprint}
					></Image>
				</Frame>
			</Button>

			<canvasgroup
				GroupTransparency={onClickAnimation.map((value) => 1 - value)}
				AnchorPoint={new Vector2(0.5, 0.5)}
				Position={lerpBinding(onClickAnimation, new UDim2(0.5, 0, 0, rem(730)), new UDim2(0.5, 0, 0.5, 0))}
				Size={lerpBinding(onClickAnimation, new UDim2(0, 0, 0, 0), new UDim2(0, rem(698), 0, rem(447)))}
				BackgroundColor3={colors.black}
				Active={true}
				Interactable={open}
			>
				<Frame
					anchorPoint={new Vector2(0.5, 0)}
					position={new UDim2(0.5, 0, 0, 0)}
					size={new UDim2(1, 0, 0.082, 0)}
					backgroundTransparency={1}
				>
					<Image
						anchorPoint={new Vector2(0.5, 0.5)}
						position={lerpBinding(
							onClickAnimation,
							new UDim2(0.036, 0, -2, 0),
							new UDim2(0.036, 0, 0.5, 0),
						)}
						size={new UDim2(0.032, 0, 0.61, 0)}
						image={IMAGES.ui.Blueprint}
						imageTransparency={onClickAnimation.map((value) => 1 - value)}
					></Image>

					<Text
						anchorPoint={new Vector2(0.5, 0.5)}
						position={lerpBinding(
							onClickAnimation,
							new UDim2(-0.5, 0, 0.5, 0),
							new UDim2(0.219, 0, 0.5, 0),
						)}
						size={new UDim2(0.304, 0, 0.54, 0)}
						font={fonts.josefinSans.medium}
						textSize={18}
						textTransparency={onClickAnimation.map((value) => 1 - value)}
						textColor={colors.white}
						text={"Blueprint Designer"}
						textXAlignment={Enum.TextXAlignment.Left}
						textYAlignment={Enum.TextYAlignment.Center}
					></Text>

					<uistroke
						ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
						Color={colors.grey}
						LineJoinMode={Enum.LineJoinMode.Miter}
					></uistroke>
				</Frame>

				<Image
					anchorPoint={new Vector2(0.5, 0.5)}
					position={lerpBinding(onClickAnimation, new UDim2(0.154, 0, 0.9, 0), new UDim2(0.154, 0, 0.303, 0))}
					size={new UDim2(0.217, 0, 0.34, 0)}
					image={IMAGES.ui["Iron Plate"]}
					imageTransparency={onClickAnimation.map((value) => 1 - value)}
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

					<Frame size={new UDim2(1, 0, 0.092, 0)} backgroundTransparency={1}>
						<Text
							anchorPoint={new Vector2(0, 0.5)}
							position={lerpBinding(
								onClickAnimation,
								new UDim2(-0.8, 0, 0.5, 0),
								new UDim2(0, 0, 0.5, 0),
							)}
							size={new UDim2(1, 0, 1, 0)}
							font={fonts.josefinSans.regular}
							textSize={18}
							textTransparency={onClickAnimation.map((value) => 1 - value)}
							textColor={colors.white}
							text={"Blueprint Name :"}
							textXAlignment={Enum.TextXAlignment.Left}
							textYAlignment={Enum.TextYAlignment.Center}
						></Text>
					</Frame>

					<Frame
						size={new UDim2(1, 0, 0.118, 0)}
						backgroundColor={colors.mediumgrey}
						backgroundTransparency={onClickAnimation.map((value) => 1 - value)}
					>
						<textbox
							ref={blueprintNameTextBoxRef}
							AnchorPoint={new Vector2(0.5, 0.5)}
							Position={lerpBinding(onClickAnimation, new UDim2(0.5, 0, 1, 0), new UDim2(0.5, 0, 0.5, 0))}
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

					<Frame size={new UDim2(1, 0, 0.092, 0)} backgroundTransparency={1}>
						<Text
							anchorPoint={new Vector2(0, 0.5)}
							position={lerpBinding(
								onClickAnimation,
								new UDim2(-1.2, 0, 0.5, 0),
								new UDim2(0, 0, 0.5, 0),
							)}
							size={new UDim2(1, 0, 1, 0)}
							font={fonts.josefinSans.regular}
							textSize={18}
							textTransparency={onClickAnimation.map((value) => 1 - value)}
							textColor={colors.white}
							text={"Blueprint Description :"}
							textXAlignment={Enum.TextXAlignment.Left}
							textYAlignment={Enum.TextYAlignment.Center}
						></Text>
					</Frame>

					<Frame
						size={new UDim2(1, 0, 0.259, 0)}
						backgroundColor={colors.mediumgrey}
						backgroundTransparency={onClickAnimation.map((value) => 1 - value)}
					>
						<textbox
							ref={blueprintDescriptionTextBoxRef}
							AnchorPoint={new Vector2(0.5, 0.5)}
							Position={lerpBinding(
								onClickAnimation,
								new UDim2(0.5, 0, 1.5, 0),
								new UDim2(0.5, 0, 0.5, 0),
							)}
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

					<Frame size={new UDim2(1, 0, 0.092, 0)} backgroundTransparency={1}>
						<Text
							anchorPoint={new Vector2(0, 0.5)}
							position={lerpBinding(
								onClickAnimation,
								new UDim2(-1.6, 0, 0.5, 0),
								new UDim2(0, 0, 0.5, 0),
							)}
							size={new UDim2(1, 0, 1, 0)}
							font={fonts.josefinSans.regular}
							textSize={18}
							textTransparency={onClickAnimation.map((value) => 1 - value)}
							textColor={colors.white}
							text={"Blueprint Subcategory :"}
							textXAlignment={Enum.TextXAlignment.Left}
							textYAlignment={Enum.TextYAlignment.Center}
						></Text>
					</Frame>

					<Frame
						size={new UDim2(1, 0, 0.118, 0)}
						backgroundColor={colors.mediumgrey}
						backgroundTransparency={onClickAnimation.map((value) => 1 - value)}
					>
						<textbox
							ref={blueprintSubcategoryTextBoxRef}
							AnchorPoint={new Vector2(0.5, 0.5)}
							Position={lerpBinding(onClickAnimation, new UDim2(0.5, 0, 2, 0), new UDim2(0.5, 0, 0.5, 0))}
							Size={new UDim2(0.95, 0, 0.55, 0)}
							BackgroundTransparency={1}
							FontFace={fonts.josefinSans.regular}
							TextSize={16}
							PlaceholderColor3={colors.grey}
							PlaceholderText={"New Subcategory"}
							TextColor3={colors.white}
							Text=""
							TextXAlignment={Enum.TextXAlignment.Left}
							TextYAlignment={Enum.TextYAlignment.Center}
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
							setOpen(false);
						}}
					>
						<Text
							anchorPoint={new Vector2(0.5, 0.5)}
							position={lerpBinding(
								onClickAnimation,
								new UDim2(0.5, 0, 0.8, 0),
								new UDim2(0.5, 0, 0.5, 0),
							)}
							size={new UDim2(1, 0, 1, 0)}
							font={fonts.josefinSans.regular}
							textSize={16}
							textTransparency={onClickAnimation.map((value) => 1 - value)}
							textColor={colors.lightred}
							text={"Cancel Blueprint"}
							textXAlignment={Enum.TextXAlignment.Center}
							textYAlignment={Enum.TextYAlignment.Center}
						></Text>

						<Image
							anchorPoint={new Vector2(0.5, 0.5)}
							position={lerpBinding(
								onClickAnimation,
								new UDim2(0.5, 0, 1.5, 0),
								new UDim2(0.5, 0, 0.5, 0),
							)}
							size={new UDim2(0.6, 0, 1, 0)}
							image={IMAGES.ui.Glow}
							imageColor={colors.lightred}
							imageTransparency={lerpBinding(onClickAnimation, 1, 0.8)}
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
							Events.CreateBlueprint(
								blueprintNameTextBoxRef.current!.Text,
								blueprintDescriptionTextBoxRef.current!.Text,
								blueprintSubcategoryTextBoxRef.current!.Text,
								[selection!, ...selection!.GetChildren()].filter(
									(instance): instance is Model =>
										instance.IsA("Model") && instance.Name in STRUCTURES,
								),
							);
							setOpen(false);
						}}
					>
						<Text
							anchorPoint={new Vector2(0.5, 0.5)}
							position={lerpBinding(
								onClickAnimation,
								new UDim2(0.5, 0, 1.5, 0),
								new UDim2(0.5, 0, 0.5, 0),
							)}
							size={new UDim2(1, 0, 1, 0)}
							font={fonts.josefinSans.regular}
							textSize={16}
							textTransparency={onClickAnimation.map((value) => 1 - value)}
							textColor={colors.lightblue}
							text={"Save Blueprint"}
							textXAlignment={Enum.TextXAlignment.Center}
							textYAlignment={Enum.TextYAlignment.Center}
						></Text>

						<Image
							anchorPoint={new Vector2(0.5, 0.5)}
							position={lerpBinding(
								onClickAnimation,
								new UDim2(0.5, 0, 1.5, 0),
								new UDim2(0.5, 0, 0.5, 0),
							)}
							size={new UDim2(0.6, 0, 1, 0)}
							image={IMAGES.ui.Glow}
							imageColor={colors.lightblue}
							imageTransparency={lerpBinding(onClickAnimation, 1, 0.8)}
						></Image>

						<uistroke
							ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
							Color={colors.grey}
							LineJoinMode={Enum.LineJoinMode.Miter}
						></uistroke>
					</Button>
				</Frame>
			</canvasgroup>
		</>
	);
}
