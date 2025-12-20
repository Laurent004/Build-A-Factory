import { lerpBinding, useEventListener, useMotion, useUpdateEffect } from "@rbxts/pretty-react-hooks";
import React, { useState } from "@rbxts/react";
import { useSelector } from "@rbxts/react-reflex";
import { Players, SoundService, Workspace } from "@rbxts/services";
import { EventBus } from "client/event-bus";
import { useRem, useStore } from "client/hooks";
import { Events } from "client/network";
import { selectContext } from "client/store/context";
import { colors, fonts, springs } from "client/ui/constants";
import { Button } from "client/ui/core/button";
import { Frame } from "client/ui/core/frame";
import { Image } from "client/ui/core/image";
import { Text } from "client/ui/core/text";
import { IMAGES } from "shared/assets/images";
import { Data } from "shared/types";

export function SettingsMenu() {
	const store = useStore();
	const rem = useRem();
	const context = useSelector(selectContext);
	const [settings, setSettings] = useState<Data["settings"]>();
	const [onMountAnimation, onMountAnimationMotion] = useMotion(0);

	useEventListener(Events.OnDataInitialization, (data) => {
		setSettings(data.settings);
	});

	useEventListener(EventBus.OnSettingChange, (settingName, settingValue) => {
		setSettings((previousSettings) => {
			return {
				...previousSettings!,
				[settingName]: settingValue,
			};
		});
	});

	useUpdateEffect(() => {
		onMountAnimationMotion.spring(context === "Settings" ? 1 : 0, springs.gentle);
	}, [context]);

	return (
		<canvasgroup
			GroupTransparency={onMountAnimation.map((value) => 1 - value)}
			Active={context === "Settings"}
			AnchorPoint={new Vector2(0.5, 0.5)}
			Position={lerpBinding(onMountAnimation, new UDim2(0.5, 0, 0.66, 0), new UDim2(0.5, 0, 0.5, 0))}
			Size={lerpBinding(onMountAnimation, new UDim2(0, 0, 0, 0), new UDim2(0, rem(600), 0, rem(641)))}
			BackgroundColor3={colors.black}
			BorderSizePixel={0}
			Interactable={context === "Settings"}
			ZIndex={2}
		>
			<Frame
				anchorPoint={new Vector2(0.5, 0)}
				position={new UDim2(0.5, 0, 0, 0)}
				backgroundTransparency={1}
				size={UDim2.fromScale(1, 0.0821)}
			>
				<Text
					anchorPoint={new Vector2(0.5, 0.5)}
					position={UDim2.fromScale(0.1772, 0.486)}
					size={UDim2.fromScale(0.1607, 0.6764)}
					font={fonts.josefinSans.semiBold}
					text={"Settings"}
					textSize={24}
					textColor={colors.white}
					textXAlignment={Enum.TextXAlignment.Left}
					textYAlignment={Enum.TextYAlignment.Center}
				></Text>
				<Image
					anchorPoint={new Vector2(0.5, 0.5)}
					position={UDim2.fromScale(0.055, 0.484)}
					size={UDim2.fromScale(0.049, 0.56)}
					image={"rbxassetid://76532374632008"}
				></Image>
				<Button
					anchorPoint={new Vector2(0.5, 0.5)}
					size={UDim2.fromScale(0.037, 0.43)}
					position={UDim2.fromScale(0.952, 0.5)}
					onClick={() => {
						store.setContext(undefined);
					}}
				>
					<Image
						position={UDim2.fromScale(0.458, 0.5)}
						anchorPoint={new Vector2(0.5, 0.5)}
						size={UDim2.fromScale(1, 1)}
						image={"rbxassetid://85748466046800"}
					></Image>
				</Button>
			</Frame>

			<scrollingframe
				AnchorPoint={new Vector2(0, 0)}
				Position={new UDim2(0, 0, 0.082, 0)}
				Size={UDim2.fromScale(1, 0.918)}
				BackgroundTransparency={1}
				CanvasSize={new UDim2(0, 0, 4, 0)}
				ScrollBarThickness={0}
				ScrollBarImageTransparency={1}
			>
				<uistroke
					ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
					Color={colors.grey}
					LineJoinMode={Enum.LineJoinMode.Miter}
					Thickness={1}
				></uistroke>
				<uilistlayout
					Padding={new UDim(0, 25)}
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
					anchorPoint={new Vector2(0, 0)}
					position={new UDim2(0, 0, 0, 0)}
					size={UDim2.fromScale(0.91, 0.17)}
					backgroundTransparency={1}
					layoutOrder={0}
					zIndex={2}
				>
					<uilistlayout
						Padding={new UDim(0, 0)}
						FillDirection={Enum.FillDirection.Vertical}
						SortOrder={Enum.SortOrder.LayoutOrder}
						HorizontalAlignment={Enum.HorizontalAlignment.Left}
						VerticalAlignment={Enum.VerticalAlignment.Top}
					></uilistlayout>
					<Frame
						anchorPoint={new Vector2(0, 0)}
						position={new UDim2(0, 0, 0, 0)}
						size={UDim2.fromScale(1, 0.085)}
						backgroundTransparency={1}
					>
						<Text
							anchorPoint={new Vector2(0, 0.5)}
							position={UDim2.fromScale(0, 0.5)}
							size={UDim2.fromScale(0.344, 0.8)}
							font={fonts.josefinSans.semiBold}
							text={"Generic Settings :"}
							textSize={22}
							textColor={colors.white}
							textXAlignment={Enum.TextXAlignment.Left}
							textYAlignment={Enum.TextYAlignment.Center}
						></Text>
					</Frame>

					{(["music", "ambient", "soundEffects", "ui"] as const).map((settingName, index) => (
						<Frame
							anchorPoint={new Vector2(0, 0)}
							position={new UDim2(0, 0, 0, 0)}
							size={UDim2.fromScale(1, 0.15)}
							backgroundTransparency={1}
							layoutOrder={index + 1}
						>
							<Text
								anchorPoint={new Vector2(0, 0.5)}
								position={UDim2.fromScale(0, 0.5)}
								size={UDim2.fromScale(0.246, 0.35)}
								font={fonts.josefinSans.regular}
								text={
									settingName === "music"
										? "Music :"
										: settingName === "ambient"
										? "Ambient :"
										: settingName === "soundEffects"
										? "Sound Effects :"
										: "UI :"
								}
								textSize={18}
								textColor={colors.white}
								textXAlignment={Enum.TextXAlignment.Left}
								textYAlignment={Enum.TextYAlignment.Center}
							></Text>
							<Frame
								anchorPoint={new Vector2(0.5, 0.5)}
								position={UDim2.fromScale(0.575, 0.5)}
								size={UDim2.fromScale(0.579, 0.1525)}
								backgroundColor={colors.mediumgrey}
							>
								<Frame
									backgroundColor={colors.lightblue}
									anchorPoint={new Vector2(0.5, 0.5)}
									position={
										new UDim2(settings !== undefined ? settings[settingName] : -0.001, 0, 0.5, 0)
									}
									size={UDim2.fromScale(0.035, 2.6)}
									change={{
										Position: (frame) => {
											if (settings === undefined) return;
											frame.Position = new UDim2(
												math.clamp(frame.Position.X.Scale, 0, 1),
												0,
												0.5,
												0,
											);
											(
												SoundService.WaitForChild(
													settingName === "music"
														? "Music"
														: settingName === "ambient"
														? "Ambient"
														: settingName === "soundEffects"
														? "Sound Effects"
														: "UI",
												) as Sound
											).Volume = frame.Position.X.Scale;
											Events.SetSetting(settingName, frame.Position.X.Scale);
											EventBus.OnSettingChange.Fire(settingName, frame.Position.X.Scale);
										},
									}}
								>
									<uidragdetector
										DragRelativity={Enum.UIDragDetectorDragRelativity.Absolute}
										DragStyle={Enum.UIDragDetectorDragStyle.TranslateLine}
										DragAxis={new Vector2(1, 0)}
										ResponseStyle={Enum.UIDragDetectorResponseStyle.Scale}
									></uidragdetector>
									<uistroke
										ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
										Color={colors.marineblue}
										LineJoinMode={Enum.LineJoinMode.Miter}
										Thickness={1}
									></uistroke>
								</Frame>
								<uistroke
									ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
									Color={colors.grey}
									LineJoinMode={Enum.LineJoinMode.Miter}
									Thickness={1}
									Transparency={0.6}
								></uistroke>
							</Frame>
							<Text
								anchorPoint={new Vector2(1, 0.5)}
								position={UDim2.fromScale(1, 0.5)}
								size={UDim2.fromScale(0.077, 0.35)}
								font={fonts.josefinSans.regular}
								text={`${math.round((settings !== undefined ? settings[settingName] : 0) * 100)}%`}
								textSize={18}
								textColor={colors.white}
								textXAlignment={Enum.TextXAlignment.Right}
								textYAlignment={Enum.TextYAlignment.Center}
							></Text>
						</Frame>
					))}

					{(["simulateFactories", "renderItems"] as const).map((settingName, index) => {
						const [dropdownOpen, setDropdownOpen] = useState(false);
						return (
							<Frame
								anchorPoint={new Vector2(0, 0)}
								position={new UDim2(0, 0, 0, 0)}
								size={UDim2.fromScale(1, 0.1525)}
								backgroundTransparency={1}
								layoutOrder={5 + index}
								zIndex={["simulateFactories", "renderItems"].size() - index}
							>
								<Text
									anchorPoint={new Vector2(0, 0.5)}
									position={UDim2.fromScale(0, 0.5)}
									size={UDim2.fromScale(0.53, 0.35)}
									font={fonts.josefinSans.semiBold}
									text={
										settingName === "simulateFactories" ? "Simulate Factories :" : "Render Items :"
									}
									textSize={18}
									textColor={colors.white}
									textXAlignment={Enum.TextXAlignment.Left}
									textYAlignment={Enum.TextYAlignment.Center}
								></Text>

								<Frame
									anchorPoint={new Vector2(1, 0.5)}
									position={new UDim2(1, 0, 0.5, 0)}
									size={UDim2.fromScale(0.44, 0.6)}
									backgroundTransparency={1}
								>
									<uistroke
										ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
										Color={colors.grey}
										LineJoinMode={Enum.LineJoinMode.Miter}
										Thickness={1}
									></uistroke>
									<Text
										anchorPoint={new Vector2(0.5, 0.5)}
										position={new UDim2(0.31, 0, 0.5, 0)}
										size={UDim2.fromScale(0.496, 1)}
										font={fonts.josefinSans.regular}
										text={
											settings !== undefined
												? `${
														settingName === "simulateFactories" ? "Simulating" : "Rendering"
												  } (${Players.GetPlayers()
														.filter((player) =>
															settings![settingName].includes(player.UserId),
														)
														.size()}/${Players.GetPlayers().size()})`
												: undefined
										}
										textSize={14}
										textColor={colors.white}
										textXAlignment={Enum.TextXAlignment.Left}
										textYAlignment={Enum.TextYAlignment.Center}
									></Text>
									<Button
										anchorPoint={new Vector2(1, 0.5)}
										position={new UDim2(1, 0, 0.5, 0)}
										size={UDim2.fromScale(0.146, 1)}
										onClick={() => {
											setDropdownOpen(!dropdownOpen);
										}}
									>
										<uistroke
											ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
											Color={colors.grey}
											LineJoinMode={Enum.LineJoinMode.Miter}
											Thickness={1}
										></uistroke>
										<Image
											anchorPoint={new Vector2(0.5, 0.5)}
											position={new UDim2(0.5, 0, 0.5, 0)}
											rotation={90}
											size={new UDim2(0.42, 0, 0.42, 0)}
											image="rbxassetid://87835167641652"
										></Image>
									</Button>
								</Frame>

								<scrollingframe
									AnchorPoint={new Vector2(1, 0)}
									Position={new UDim2(1, 0, 0.8, 0)}
									Size={new UDim2(0.44, 0, 2.889, 0)}
									BackgroundColor3={colors.black}
									BorderSizePixel={0}
									Visible={dropdownOpen}
									CanvasSize={new UDim2(0, 0, 16, 0)}
									ScrollBarThickness={0}
									ScrollBarImageTransparency={1}
									ScrollingDirection={Enum.ScrollingDirection.Y}
								>
									<uistroke
										ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
										Color={colors.grey}
										LineJoinMode={Enum.LineJoinMode.Miter}
										Thickness={1}
									></uistroke>

									<uilistlayout
										Padding={new UDim(0, 0)}
										FillDirection={Enum.FillDirection.Vertical}
										SortOrder={Enum.SortOrder.LayoutOrder}
										HorizontalAlignment={Enum.HorizontalAlignment.Left}
										VerticalAlignment={Enum.VerticalAlignment.Top}
									></uilistlayout>

									{Players.GetPlayers().map((player, index) => (
										<Frame
											anchorPoint={new Vector2(0, 0)}
											position={new UDim2(0, 0, 0, 0)}
											size={UDim2.fromScale(1, 0.045)}
											backgroundTransparency={1}
											layoutOrder={index}
										>
											<Button
												anchorPoint={new Vector2(0.5, 0.5)}
												position={UDim2.fromScale(0.1, 0.5)}
												size={UDim2.fromScale(0.085, 0.44)}
												onClick={() => {
													Events.SetSetting(
														settingName,
														settings![settingName].includes(player.UserId)
															? settings![settingName].filter(
																	(userId) => userId !== player.UserId,
															  )
															: [...settings![settingName], player.UserId],
													);
													EventBus.OnSettingChange.Fire(
														settingName,
														settings![settingName].includes(player.UserId)
															? settings![settingName].filter(
																	(userId) => userId !== player.UserId,
															  )
															: [...settings![settingName], player.UserId],
													);
												}}
											>
												<Frame
													anchorPoint={new Vector2(0, 0)}
													position={new UDim2(0, 0, 0, 0)}
													size={UDim2.fromScale(1, 1)}
													backgroundColor={
														settings !== undefined
															? settings[settingName].includes(player.UserId)
																? colors.lightblue
																: undefined
															: undefined
													}
													backgroundTransparency={
														settings !== undefined
															? settings[settingName].includes(player.UserId)
																? 0
																: 1
															: undefined
													}
												>
													<uistroke
														ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
														Color={colors.white}
														LineJoinMode={Enum.LineJoinMode.Miter}
														Thickness={1}
														Transparency={
															settings !== undefined
																? settings[settingName].includes(player.UserId)
																	? 1
																	: 0
																: undefined
														}
													></uistroke>

													<Image
														anchorPoint={new Vector2(0.5, 0.5)}
														position={UDim2.fromScale(0.5, 0.5)}
														size={UDim2.fromScale(0.7, 0.7)}
														image={"rbxassetid://113903849727210"}
														imageTransparency={
															settings !== undefined
																? settings[settingName].includes(player.UserId)
																	? 0
																	: 1
																: undefined
														}
													></Image>
												</Frame>
											</Button>
											<Image
												anchorPoint={new Vector2(0.5, 0.5)}
												position={UDim2.fromScale(0.25, 0.5)}
												size={UDim2.fromScale(0.11, 0.56)}
												image={
													Players.GetUserThumbnailAsync(
														player.UserId,
														Enum.ThumbnailType.HeadShot,
														Enum.ThumbnailSize.Size150x150,
													)[0]
												}
											>
												<uicorner CornerRadius={new UDim(0, 64)}></uicorner>
											</Image>
											<Text
												anchorPoint={new Vector2(0.5, 0.5)}
												position={UDim2.fromScale(0.6558, 0.5)}
												size={UDim2.fromScale(0.5996, 1.0)}
												font={fonts.josefinSans.regular}
												text={player.Name}
												textSize={15}
												textColor={colors.white}
												textWrapped={true}
												textXAlignment={Enum.TextXAlignment.Left}
												textYAlignment={Enum.TextYAlignment.Center}
											></Text>
										</Frame>
									))}
								</scrollingframe>
							</Frame>
						);
					})}
				</Frame>

				<Frame
					anchorPoint={new Vector2(0, 0)}
					position={new UDim2(0, 0, 0, 0)}
					size={UDim2.fromScale(0.91, 0.065)}
					backgroundTransparency={1}
					layoutOrder={1}
				>
					<uilistlayout
						Padding={new UDim(0, 0)}
						FillDirection={Enum.FillDirection.Vertical}
						SortOrder={Enum.SortOrder.LayoutOrder}
						HorizontalAlignment={Enum.HorizontalAlignment.Left}
						VerticalAlignment={Enum.VerticalAlignment.Top}
					></uilistlayout>
					<Frame
						anchorPoint={new Vector2(0, 0)}
						position={new UDim2(0, 0, 0, 0)}
						size={UDim2.fromScale(1, 0.2)}
						backgroundTransparency={1}
					>
						<Text
							anchorPoint={new Vector2(0, 0.5)}
							position={UDim2.fromScale(0, 0.5)}
							size={UDim2.fromScale(0.344, 0.8)}
							font={fonts.josefinSans.semiBold}
							text={"Factory Settings :"}
							textSize={22}
							textColor={colors.white}
							textXAlignment={Enum.TextXAlignment.Left}
							textYAlignment={Enum.TextYAlignment.Center}
						></Text>
					</Frame>

					<Frame
						anchorPoint={new Vector2(0, 0)}
						position={new UDim2(0, 0, 0, 0)}
						size={UDim2.fromScale(1, 0.36)}
						backgroundTransparency={1}
					>
						<Text
							anchorPoint={new Vector2(0, 0.5)}
							position={UDim2.fromScale(0, 0.5)}
							size={UDim2.fromScale(0.12, 0.35)}
							font={fonts.josefinSans.regular}
							text={"Name :"}
							textSize={18}
							textColor={colors.white}
							textXAlignment={Enum.TextXAlignment.Left}
							textYAlignment={Enum.TextYAlignment.Center}
						></Text>

						<Frame
							anchorPoint={new Vector2(1, 0.5)}
							position={new UDim2(1, 0, 0.5, 0)}
							size={UDim2.fromScale(0.727, 0.6)}
							backgroundColor={colors.mediumgrey}
						>
							<textbox
								AnchorPoint={new Vector2(0.5, 0.5)}
								Position={new UDim2(0.5, 0, 0.5, 0)}
								Size={new UDim2(0.935, 0, 0.55, 0)}
								BackgroundTransparency={1}
								ClearTextOnFocus={false}
								FontFace={fonts.josefinSans.regular}
								PlaceholderText={"Factory name"}
								PlaceholderColor3={colors.grey}
								Text={
									Workspace.WaitForChild("Plots")
										.GetChildren()
										.find(
											(plot): plot is Model =>
												plot.GetAttribute("UserId") === Players.LocalPlayer.UserId,
										)?.Name
								}
								TextSize={16}
								TextColor3={colors.white}
								TextTruncate={Enum.TextTruncate.SplitWord}
								TextXAlignment={Enum.TextXAlignment.Left}
								TextYAlignment={Enum.TextYAlignment.Center}
								Change={{
									Text: (textbox) => {
										Events.SetFactoryName(textbox.Text);
									},
								}}
							></textbox>
						</Frame>
					</Frame>
				</Frame>
			</scrollingframe>

			<Frame
				anchorPoint={new Vector2(0.5, 1)}
				position={new UDim2(0.5, 0, 1, 0)}
				size={new UDim2(1, 0, 0.075, 0)}
				backgroundTransparency={1}
				zIndex={2}
			>
				<Button
					anchorPoint={new Vector2(0, 0.5)}
					position={new UDim2(0, 0, 0.5, 0)}
					size={new UDim2(0.5, 0, 1, 0)}
					onClick={() => {
						Events.UnloadGame.fire();
					}}
				>
					<uistroke
						ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
						Color={colors.grey}
						LineJoinMode={Enum.LineJoinMode.Miter}
						Thickness={1}
					></uistroke>

					<Frame
						anchorPoint={new Vector2(0, 0)}
						position={new UDim2(0, 0, 0, 0)}
						size={new UDim2(1, 0, 1, 0)}
						backgroundColor={colors.black}
					>
						<Text
							anchorPoint={new Vector2(0.5, 0.5)}
							position={new UDim2(0.5, 0, 0.5, 0)}
							size={new UDim2(1, 0, 1, 0)}
							font={fonts.josefinSans.regular}
							text="Unload Game"
							textSize={16}
							textColor={colors.white}
							textXAlignment={Enum.TextXAlignment.Center}
							textYAlignment={Enum.TextYAlignment.Center}
						></Text>
					</Frame>
				</Button>

				<Button
					anchorPoint={new Vector2(1, 0.5)}
					position={new UDim2(1, 0, 0.5, 0)}
					size={new UDim2(0.5, 0, 1, 0)}
					onClick={() => {
						Events.DeleteGame.fire();
					}}
				>
					<uistroke
						ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
						Color={colors.grey}
						LineJoinMode={Enum.LineJoinMode.Miter}
						Thickness={1}
					></uistroke>

					<Frame
						anchorPoint={new Vector2(0, 0)}
						position={new UDim2(0, 0, 0, 0)}
						size={new UDim2(1, 0, 1, 0)}
						backgroundColor={colors.black}
					>
						<Text
							anchorPoint={new Vector2(0.5, 0.5)}
							position={new UDim2(0.5, 0, 0.5, 0)}
							size={new UDim2(1, 0, 1, 0)}
							font={fonts.josefinSans.regular}
							text="Delete Game"
							textSize={16}
							textColor={colors.lightred}
							textXAlignment={Enum.TextXAlignment.Center}
							textYAlignment={Enum.TextYAlignment.Center}
						></Text>
					</Frame>

					<Image
						anchorPoint={new Vector2(0.5, 0.5)}
						position={new UDim2(0.5, 0, 0.5, 0)}
						size={new UDim2(0.8, 0, 1, 0)}
						image={IMAGES.ui.Glow}
						imageColor={colors.lightred}
						imageTransparency={0.9}
					></Image>
				</Button>
			</Frame>
		</canvasgroup>
	);
}
