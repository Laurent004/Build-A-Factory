import { Object } from "@rbxts/luau-polyfill";
import { lerpBinding, useMotion, useUpdateEffect } from "@rbxts/pretty-react-hooks";
import React from "@rbxts/react";
import { useSelector } from "@rbxts/react-reflex";
import { MarketplaceService, Players } from "@rbxts/services";
import { useStore } from "client/hooks";
import { useRem } from "client/hooks/use-rem";
import { selectContext } from "client/store/context";
import { colors, fonts, springs } from "client/ui/constants";
import { Button } from "client/ui/core/button";
import { Frame } from "client/ui/core/frame";
import { Image } from "client/ui/core/image";
import { Text } from "client/ui/core/text";
import { IMAGES } from "shared/assets/images";
import { STRUCTURES } from "shared/constants/structures";

export function ShopMenu() {
	const store = useStore();
	const rem = useRem();

	const context = useSelector(selectContext);

	const [mountAnimation, mountAnimationMotion] = useMotion(0);

	useUpdateEffect(() => {
		mountAnimationMotion.spring(context === "Shop" ? 1 : 0, springs.gentle);
	}, [context]);

	return (
		<canvasgroup
			GroupTransparency={mountAnimation.map((value) => 1 - value)}
			AnchorPoint={new Vector2(0.5, 0.5)}
			Position={lerpBinding(mountAnimation, new UDim2(0.5, 0, 0, rem(1267)), new UDim2(0.5, 0, 0.5, 0))}
			Size={lerpBinding(mountAnimation, new UDim2(0, 0, 0, 0), new UDim2(0, rem(751), 0, rem(577)))}
			BackgroundColor3={colors.black}
			BorderSizePixel={0}
			Interactable={context === "Shop"}
		>
			<Frame
				anchorPoint={new Vector2(0.5, 0)}
				position={new UDim2(0.5, 0, 0, 0)}
				size={new UDim2(1, 0, 0.082, 0)}
				backgroundTransparency={1}
			>
				<Image
					anchorPoint={new Vector2(0.5, 0.5)}
					position={new UDim2(0.036, 0, 0.465, 0)}
					rotation={lerpBinding(mountAnimation, -1440, 0)}
					size={new UDim2(0.036, 0, 0.56, 0)}
					image={IMAGES.ui.Shop}
				></Image>

				<Text
					anchorPoint={new Vector2(0.5, 0.5)}
					position={lerpBinding(mountAnimation, new UDim2(-0.5, 0, 0.5, 0), new UDim2(0.11, 0, 0.5, 0))}
					size={new UDim2(0.083, 0, 0.676, 0)}
					font={fonts.josefinSans.medium}
					textSize={24}
					textTransparency={mountAnimation.map((value) => 1 - value)}
					textColor={colors.white}
					text={"Shop"}
					textXAlignment={Enum.TextXAlignment.Left}
					textYAlignment={Enum.TextYAlignment.Center}
				></Text>

				<Button
					anchorPoint={new Vector2(0.5, 0.5)}
					position={new UDim2(0.96, 0, 0.5, 0)}
					size={new UDim2(0.027, 0, 0.43, 0)}
					onClick={() => {
						store.setContext(undefined);
					}}
				>
					<Image
						anchorPoint={new Vector2(0.5, 0.5)}
						position={new UDim2(0.5, 0, 0.5, 0)}
						rotation={lerpBinding(mountAnimation, 0, 720)}
						size={new UDim2(1, 0, 1, 0)}
						image={IMAGES.ui.Close}
					></Image>
				</Button>

				<uistroke
					ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
					Color={colors.grey}
					LineJoinMode={Enum.LineJoinMode.Miter}
				></uistroke>
			</Frame>

			<scrollingframe
				AnchorPoint={new Vector2(0.5, 1)}
				Position={new UDim2(0.5, 0, 1, 0)}
				Size={new UDim2(1, 0, 0.918, 0)}
				BackgroundTransparency={1}
				ZIndex={0}
				CanvasSize={new UDim2(0, 0, 2, 0)}
				ScrollBarThickness={0}
				ScrollBarImageTransparency={1}
				ScrollingDirection={Enum.ScrollingDirection.Y}
			>
				<uipadding
					PaddingBottom={new UDim(0, 15)}
					PaddingLeft={new UDim(0, 20)}
					PaddingRight={new UDim(0, 20)}
					PaddingTop={new UDim(0, 15)}
				></uipadding>

				<Frame
					anchorPoint={new Vector2(0.5, 0)}
					position={new UDim2(0.5, 0, 0, 0)}
					size={new UDim2(1, 0, 0.4, 0)}
					backgroundTransparency={1}
				>
					<Frame
						anchorPoint={new Vector2(0.5, 0)}
						position={new UDim2(0.5, 0, 0, 0)}
						size={new UDim2(1, 0, 0.102, 0)}
						backgroundColor={colors.white}
					>
						<uigradient
							Color={
								new ColorSequence([
									new ColorSequenceKeypoint(0, Color3.fromRGB(0, 0, 0)),
									new ColorSequenceKeypoint(0.5, Color3.fromRGB(33, 33, 33)),
									new ColorSequenceKeypoint(1, Color3.fromRGB(0, 0, 0)),
								])
							}
							Transparency={
								new NumberSequence([
									new NumberSequenceKeypoint(0, 1),
									new NumberSequenceKeypoint(0.25, 0.65),
									new NumberSequenceKeypoint(0.5, 0),
									new NumberSequenceKeypoint(0.75, 0.65),
									new NumberSequenceKeypoint(1, 1),
								])
							}
						></uigradient>

						<uistroke
							ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
							Color={colors.grey}
							LineJoinMode={Enum.LineJoinMode.Miter}
							Thickness={1}
						>
							<uigradient
								Color={
									new ColorSequence([
										new ColorSequenceKeypoint(0, colors.white),
										new ColorSequenceKeypoint(1, colors.white),
									])
								}
								Transparency={
									new NumberSequence([
										new NumberSequenceKeypoint(0, 1),
										new NumberSequenceKeypoint(0.25, 0.65),
										new NumberSequenceKeypoint(0.5, 0),
										new NumberSequenceKeypoint(0.75, 0.65),
										new NumberSequenceKeypoint(1, 1),
									])
								}
							></uigradient>
						</uistroke>

						<Text
							anchorPoint={new Vector2(0.5, 0.5)}
							position={new UDim2(0.5, 0, 0.5, 0)}
							size={new UDim2(0.4, 0, 1, 0)}
							font={fonts.josefinSans.medium}
							textSize={22}
							textColor={colors.white}
							text={"Gamepasses"}
							textXAlignment={Enum.TextXAlignment.Center}
							textYAlignment={Enum.TextYAlignment.Center}
						></Text>
					</Frame>

					<Frame
						anchorPoint={new Vector2(0.5, 0)}
						position={new UDim2(0.5, 0, 0.141, 0)}
						size={new UDim2(0.975, 0, 0.425, 0)}
						backgroundColor={Color3.fromRGB(22, 22, 22)}
					>
						<uistroke
							ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
							Color={colors.grey}
							LineJoinMode={Enum.LineJoinMode.Miter}
							Thickness={1}
						></uistroke>

						<Image
							anchorPoint={new Vector2(0.5, 0.5)}
							position={new UDim2(0.145, 0, 0.5, 0)}
							size={new UDim2(0.197, 0, 0.715, 0)}
							image={"rbxassetid://137642288020227"}
						></Image>

						<Text
							anchorPoint={new Vector2(0.5, 0.5)}
							position={new UDim2(0.432, 0, 0.174, 0)}
							size={new UDim2(0.222, 0, 0.167, 0)}
							font={fonts.josefinSans.semiBold}
							textSize={30}
							textColor={colors.white}
							text={"Gamepass"}
							textXAlignment={Enum.TextXAlignment.Left}
							textYAlignment={Enum.TextYAlignment.Top}
						></Text>

						<Text
							anchorPoint={new Vector2(0.5, 0.5)}
							position={new UDim2(0.509, 0, 0.42, 0)}
							size={new UDim2(0.385, 0, 0.256, 0)}
							font={fonts.josefinSans.semiBold}
							textSize={55}
							textColor={colors.white}
							text={"Blueprints"}
							textXAlignment={Enum.TextXAlignment.Left}
							textYAlignment={Enum.TextYAlignment.Top}
						></Text>

						<Button
							anchorPoint={new Vector2(1, 1)}
							position={new UDim2(0.975, 0, 0.92, 0)}
							size={new UDim2(0.253, 0, 0.217, 0)}
						>
							<Frame size={new UDim2(1, 0, 1, 0)} backgroundColor={colors.lightblue}>
								<uistroke
									ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
									Color={colors.marineblue}
									LineJoinMode={Enum.LineJoinMode.Miter}
									Thickness={1}
								></uistroke>

								<Text
									size={new UDim2(1, 0, 1, 0)}
									font={fonts.josefinSans.medium}
									textSize={26}
									textColor={colors.white}
									text={" 799"}
									textXAlignment={Enum.TextXAlignment.Center}
									textYAlignment={Enum.TextYAlignment.Center}
								></Text>
							</Frame>
						</Button>
					</Frame>

					<Frame
						anchorPoint={new Vector2(0, 1)}
						position={new UDim2(0.012, 0, 1, 0)}
						size={new UDim2(0.47, 0, 0.384, 0)}
						backgroundColor={Color3.fromRGB(22, 22, 22)}
					>
						<uistroke
							ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
							Color={colors.grey}
							LineJoinMode={Enum.LineJoinMode.Miter}
							Thickness={1}
						></uistroke>

						<Image
							anchorPoint={new Vector2(0.5, 0.5)}
							position={new UDim2(0.221, 0, 0.563, 0)}
							size={new UDim2(0.374, 0, 0.713, 0)}
							image={"rbxassetid://79676260319790"}
						></Image>

						<Text
							anchorPoint={new Vector2(0.5, 0.5)}
							position={new UDim2(0.515, 0, 0.139, 0)}
							size={new UDim2(0.342, 0, 0.13, 0)}
							font={fonts.josefinSans.semiBold}
							textSize={22}
							textColor={colors.white}
							text={"Structure"}
							textXAlignment={Enum.TextXAlignment.Left}
							textYAlignment={Enum.TextYAlignment.Top}
						></Text>

						<Text
							anchorPoint={new Vector2(0.5, 0.5)}
							position={new UDim2(0.662, 0, 0.306, 0)}
							size={new UDim2(0.636, 0, 0.125, 0)}
							font={fonts.josefinSans.semiBold}
							textSize={22}
							textColor={colors.white}
							text={"Priority Merger"}
							textXAlignment={Enum.TextXAlignment.Left}
							textYAlignment={Enum.TextYAlignment.Top}
						></Text>

						<Button
							anchorPoint={new Vector2(1, 1)}
							position={new UDim2(0.95, 0, 0.9, 0)}
							size={new UDim2(0.463, 0, 0.217, 0)}
							onClick={() => {
								MarketplaceService.PromptGamePassPurchase(
									Players.LocalPlayer,
									STRUCTURES["Priority Merger"].gamepass!,
								);
							}}
						>
							<Frame size={new UDim2(1, 0, 1, 0)} backgroundColor={colors.lightblue}>
								<uistroke
									ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
									Color={colors.marineblue}
									LineJoinMode={Enum.LineJoinMode.Miter}
									Thickness={1}
								></uistroke>

								<Text
									size={new UDim2(1, 0, 1, 0)}
									font={fonts.josefinSans.medium}
									textSize={23}
									textColor={colors.white}
									text={" 299"}
									textXAlignment={Enum.TextXAlignment.Center}
									textYAlignment={Enum.TextYAlignment.Center}
								></Text>
							</Frame>
						</Button>
					</Frame>
				</Frame>

				<Frame
					anchorPoint={new Vector2(0.5, 0)}
					position={new UDim2(0.5, 0, 0.445, 0)}
					size={new UDim2(1, 0, 0.4, 0)}
					backgroundTransparency={1}
				>
					<Frame
						anchorPoint={new Vector2(0.5, 0)}
						position={new UDim2(0.5, 0, 0, 0)}
						size={new UDim2(1, 0, 0.102, 0)}
						backgroundColor={colors.white}
					>
						<uigradient
							Color={
								new ColorSequence([
									new ColorSequenceKeypoint(0, Color3.fromRGB(0, 0, 0)),
									new ColorSequenceKeypoint(0.5, Color3.fromRGB(33, 33, 33)),
									new ColorSequenceKeypoint(1, Color3.fromRGB(0, 0, 0)),
								])
							}
							Transparency={
								new NumberSequence([
									new NumberSequenceKeypoint(0, 1),
									new NumberSequenceKeypoint(0.25, 0.65),
									new NumberSequenceKeypoint(0.5, 0),
									new NumberSequenceKeypoint(0.75, 0.65),
									new NumberSequenceKeypoint(1, 1),
								])
							}
						></uigradient>

						<uistroke
							ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
							Color={colors.grey}
							LineJoinMode={Enum.LineJoinMode.Miter}
							Thickness={1}
						>
							<uigradient
								Color={
									new ColorSequence([
										new ColorSequenceKeypoint(0, colors.white),
										new ColorSequenceKeypoint(1, colors.white),
									])
								}
								Transparency={
									new NumberSequence([
										new NumberSequenceKeypoint(0, 1),
										new NumberSequenceKeypoint(0.25, 0.65),
										new NumberSequenceKeypoint(0.5, 0),
										new NumberSequenceKeypoint(0.75, 0.65),
										new NumberSequenceKeypoint(1, 1),
									])
								}
							></uigradient>
						</uistroke>

						<Text
							anchorPoint={new Vector2(0.5, 0.5)}
							position={new UDim2(0.5, 0, 0.5, 0)}
							size={new UDim2(0.4, 0, 1, 0)}
							font={fonts.josefinSans.medium}
							textSize={22}
							textColor={colors.white}
							text={"Credits"}
							textXAlignment={Enum.TextXAlignment.Center}
							textYAlignment={Enum.TextYAlignment.Center}
						></Text>
					</Frame>
				</Frame>
			</scrollingframe>
		</canvasgroup>
	);
}
