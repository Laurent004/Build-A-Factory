import { Object } from "@rbxts/luau-polyfill";
import { lerpBinding, useMotion, useUpdateEffect } from "@rbxts/pretty-react-hooks";
import React from "@rbxts/react";
import { useSelector } from "@rbxts/react-reflex";
import { MarketplaceService, Players } from "@rbxts/services";
import { useRem, useStore } from "client/hooks";
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
	const [onMountAnimation, onMountAnimationMotion] = useMotion(0);

	useUpdateEffect(() => {
		onMountAnimationMotion.spring(context === "Shop" ? 1 : 0, springs.gentle);
	}, [context]);

	return (
		<canvasgroup
			GroupTransparency={onMountAnimation.map((value) => 1 - value)}
			Active={context === "Shop"}
			AnchorPoint={new Vector2(0.5, 0.5)}
			Position={lerpBinding(onMountAnimation, UDim2.fromScale(0.5, 0.62), UDim2.fromScale(0.5, 0.5))}
			Size={lerpBinding(onMountAnimation, new UDim2(0, 0, 0, 0), new UDim2(0, rem(582), 0, rem(642)))}
			BackgroundColor3={Color3.fromRGB(19, 19, 19)}
			BorderSizePixel={0}
			Interactable={context === "Shop"}
			ZIndex={2}
		>
			<Frame
				anchorPoint={new Vector2(0.5, 0)}
				position={new UDim2(0.5, 0, 0, 0)}
				backgroundTransparency={1}
				size={UDim2.fromScale(1, 0.072)}
			>
				<Image
					anchorPoint={new Vector2(0.5, 0.5)}
					position={UDim2.fromScale(0.05, 0.465)}
					size={UDim2.fromScale(0.043, 0.54)}
					image={"rbxassetid://118960057424812"}
				></Image>
				<Text
					anchorPoint={new Vector2(0.5, 0.5)}
					position={UDim2.fromScale(0.148, 0.5)}
					size={UDim2.fromScale(0.1048, 0.676)}
					font={fonts.josefinSans.medium}
					text={"Shop"}
					textSize={24}
					textColor={colors.white}
					textXAlignment={Enum.TextXAlignment.Left}
					textYAlignment={Enum.TextYAlignment.Center}
				></Text>
				<Button
					anchorPoint={new Vector2(0.5, 0.5)}
					position={UDim2.fromScale(0.945, 0.5)}
					size={UDim2.fromScale(0.037, 0.46)}
					onClick={() => {
						store.setContext(undefined);
					}}
				>
					<Image
						anchorPoint={new Vector2(0.5, 0.5)}
						position={UDim2.fromScale(0.5, 0.5)}
						size={UDim2.fromScale(1, 1)}
						image={"rbxassetid://85748466046800"}
					></Image>
				</Button>
				<uistroke
					ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
					Color={Color3.fromRGB(140, 140, 140)}
					LineJoinMode={Enum.LineJoinMode.Miter}
					Thickness={1}
				></uistroke>
			</Frame>
			<scrollingframe
				AnchorPoint={new Vector2(0, 0)}
				Position={new UDim2(0, 0, 0.072, 0)}
				Size={UDim2.fromScale(1, 0.928)}
				BackgroundTransparency={1}
				BorderSizePixel={0}
				CanvasSize={new UDim2(0, 0, 3, 0)}
				ScrollBarThickness={0}
				ScrollBarImageTransparency={1}
				ScrollingDirection={Enum.ScrollingDirection.Y}
			>
				<uilistlayout
					Padding={new UDim(0, 30)}
					FillDirection={Enum.FillDirection.Vertical}
					SortOrder={Enum.SortOrder.LayoutOrder}
					HorizontalAlignment={Enum.HorizontalAlignment.Center}
					VerticalAlignment={Enum.VerticalAlignment.Top}
				></uilistlayout>
				<uipadding
					PaddingTop={new UDim(0, 18)}
					PaddingLeft={new UDim(0, 0)}
					PaddingRight={new UDim(0, 0)}
					PaddingBottom={new UDim(0, 18)}
				></uipadding>
				<Frame
					anchorPoint={new Vector2(0.5, 0.5)}
					position={UDim2.fromScale(0.5, 0.0207)}
					size={UDim2.fromScale(0.92, 0.1444)}
					backgroundTransparency={1}
				>
					<uilistlayout
						Padding={new UDim(0, 10)}
						FillDirection={Enum.FillDirection.Vertical}
						SortOrder={Enum.SortOrder.LayoutOrder}
						HorizontalAlignment={Enum.HorizontalAlignment.Center}
						VerticalAlignment={Enum.VerticalAlignment.Center}
					></uilistlayout>
					<Frame
						anchorPoint={new Vector2(0, 0)}
						position={new UDim2(0, 0, 0, 0)}
						size={UDim2.fromScale(1, 0.1198)}
						backgroundTransparency={1}
					>
						<Text
							anchorPoint={new Vector2(0, 0)}
							position={new UDim2(0, 0, 0, 0)}
							size={UDim2.fromScale(0.261, 1)}
							font={fonts.josefinSans.regular}
							text={"Gamepasses :"}
							textColor={colors.white}
							textSize={22}
							textXAlignment={Enum.TextXAlignment.Left}
							textYAlignment={Enum.TextYAlignment.Center}
						></Text>
					</Frame>
					<Frame
						anchorPoint={new Vector2(0, 0)}
						position={new UDim2(0, 0, 0, 0)}
						size={UDim2.fromScale(1, 0.843)}
						backgroundTransparency={1}
					>
						<uilistlayout
							Padding={new UDim(0, 19)}
							FillDirection={Enum.FillDirection.Horizontal}
							SortOrder={Enum.SortOrder.LayoutOrder}
							HorizontalAlignment={Enum.HorizontalAlignment.Left}
							VerticalAlignment={Enum.VerticalAlignment.Top}
						></uilistlayout>

						{Object.entries(STRUCTURES)
							.filter(([, structureDefinition]) => structureDefinition.gamepass !== undefined)
							.map(([structureName, structureDefinition]) => (
								<Frame
									anchorPoint={new Vector2(0, 0)}
									position={new UDim2(0, 0, 0, 0)}
									size={UDim2.fromScale(0.3092, 1.0)}
									backgroundTransparency={1}
									layoutOrder={structureDefinition.index}
								>
									<uistroke
										ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
										Color={Color3.fromRGB(140, 140, 140)}
										LineJoinMode={Enum.LineJoinMode.Miter}
										Thickness={1}
									></uistroke>
									<Frame
										anchorPoint={new Vector2(0, 1)}
										position={new UDim2(0, 0, 1.0, 0)}
										backgroundTransparency={1}
										size={UDim2.fromScale(1, 0.4)}
									>
										<Text
											anchorPoint={new Vector2(0.5, 0.5)}
											position={UDim2.fromScale(0.505, 0.415)}
											size={UDim2.fromScale(0.8604, 0.2)}
											font={fonts.josefinSans.bold}
											text={structureName}
											textSize={12}
											textColor={colors.white}
											textStrokeTransparency={0.7}
											textXAlignment={Enum.TextXAlignment.Left}
											textYAlignment={Enum.TextYAlignment.Center}
										/>
										<Button
											anchorPoint={new Vector2(0.5, 0.5)}
											position={UDim2.fromScale(0.5, 0.77)}
											size={UDim2.fromScale(0.9, 0.3)}
											onClick={() => {
												MarketplaceService.PromptGamePassPurchase(
													Players.LocalPlayer,
													structureDefinition.gamepass!,
												);
											}}
										>
											<Frame
												anchorPoint={new Vector2(0, 0)}
												position={new UDim2(0, 0, 0, 0)}
												size={UDim2.fromScale(1, 1)}
												backgroundColor={colors.white}
											>
												<Text
													anchorPoint={new Vector2(0, 0)}
													position={new UDim2(0, 0, 0, 0)}
													size={UDim2.fromScale(1, 1)}
													font={
														new Font(
															"rbxasset://fonts/families/JosefinSans.json",
															Enum.FontWeight.SemiBold,
															Enum.FontStyle.Normal,
														)
													}
													text={`${
														MarketplaceService.GetProductInfo(
															structureDefinition.gamepass!,
															Enum.InfoType.GamePass,
														).PriceInRobux
													}`}
													textSize={12}
													textColor={Color3.fromRGB(0, 0, 0)}
													textXAlignment={Enum.TextXAlignment.Center}
													textYAlignment={Enum.TextYAlignment.Center}
												/>
											</Frame>
										</Button>
										<Text
											anchorPoint={new Vector2(0.5, 0.5)}
											position={UDim2.fromScale(0.332, 0.18)}
											size={UDim2.fromScale(0.514, 0.15)}
											font={fonts.josefinSans.bold}
											text={"STRUCTURE"}
											textSize={12}
											textColor={colors.white}
											textStrokeTransparency={0.7}
											textXAlignment={Enum.TextXAlignment.Left}
											textYAlignment={Enum.TextYAlignment.Center}
										></Text>
										<uistroke
											ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
											Color={Color3.fromRGB(140, 140, 140)}
											LineJoinMode={Enum.LineJoinMode.Miter}
											Thickness={1}
										></uistroke>
									</Frame>
									<Frame
										anchorPoint={new Vector2(0, 0)}
										position={new UDim2(0, 0, 0, 0)}
										size={UDim2.fromScale(1, 0.6)}
										backgroundTransparency={1}
									>
										<Image
											anchorPoint={new Vector2(0.5, 0.5)}
											position={UDim2.fromScale(0.5, 0.48)}
											size={UDim2.fromScale(0.816, 0.973)}
											image={`rbxassetid://${
												MarketplaceService.GetProductInfo(
													structureDefinition.gamepass!,
													Enum.InfoType.GamePass,
												).IconImageAssetId
											}`}
										>
											<Image
												anchorPoint={new Vector2(0.5, 0.5)}
												position={UDim2.fromScale(0.5, 0.5)}
												size={UDim2.fromScale(1, 1)}
												image={IMAGES.ui.Glow}
												imageColor={
													structureName === "Priority Merger"
														? Color3.fromRGB(188, 147, 255)
														: colors.lightblue
												}
												imageTransparency={0.2}
											></Image>
										</Image>
									</Frame>
								</Frame>
							))}
					</Frame>
				</Frame>
			</scrollingframe>
		</canvasgroup>
	);
}
