import { Object } from "@rbxts/luau-polyfill";
import { lerpBinding, useEventListener, useMotion, useUpdateEffect } from "@rbxts/pretty-react-hooks";
import React, {useState } from "@rbxts/react";
import { useSelector } from "@rbxts/react-reflex";
import { EventBus } from "client/event-bus";
import { useStore } from "client/hooks";
import { Events } from "client/network";
import { selectContext } from "client/store/context";
import { colors, fonts, springs } from "client/ui/constants";
import { Button, CanvasGroup, Frame, Image, ScrollingFrame, Text } from "client/ui/core";
import { IMAGES } from "shared/assets/images";
import { SETTING_CATEGORIES, SETTINGS } from "shared/constants/settings";
import { SettingsMenuSettingSoundSlider } from "./setting-sound-slider";
import { SettingsMenuSettingPerformanceDropdown } from "./setting-performance-dropdown";

export function SettingsMenu() {
	const store = useStore();
	const context = useSelector(selectContext);
	const [settings, setSettings] = useState<Record<string, unknown>>();

	const [mountAnimation, mountAnimationMotion] = useMotion(0);

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
		mountAnimationMotion.spring(context === "Settings" ? 1 : 0, springs.gentle);
	}, [context]);

	return (
		<CanvasGroup
			GroupTransparency={mountAnimation.map((value) => 1 - value)}
			Active={context === "Settings"}
			AnchorPoint={new Vector2(0.5, 0.5)}
			Position={UDim2.fromScale(0.5, 0.5)}
			Size={lerpBinding(mountAnimation, UDim2.fromScale(0, 0), UDim2.fromScale(.313,.594))}
			BackgroundColor3={colors.black}
			Interactable={context === "Settings"}
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
					Position={UDim2.fromScale(0.055, 0.484)}
					Size={UDim2.fromScale(0.049, 0.56)}
					Image={"rbxassetid://76532374632008"}
				></Image>

				<Text
					AnchorPoint={new Vector2(0.5, 0.5)}
					Position={UDim2.fromScale(0.177, 0.486)}
					Size={UDim2.fromScale(0.161, 0.38)}
					FontFace={fonts.josefinSans.bold}
					Text={"Settings"}
					TextSize={24}
					TextXAlignment={Enum.TextXAlignment.Left}
				></Text>

				<Button
					AnchorPoint={new Vector2(0.5, 0.5)}
					Position={UDim2.fromScale(0.952, 0.5)}
					Size={UDim2.fromScale(0.037, 0.43)}
					Event={{
						MouseButton1Click: () => {
							store.setContext(undefined);
						},
					}}
				>
					<Image Size={UDim2.fromScale(1, 1)} Image={IMAGES.ui.Close}></Image>
				</Button>
			</Frame>

			<ScrollingFrame Position={UDim2.fromScale(0, 0.082)} Size={UDim2.fromScale(1, 0.843)} ZIndex={0}>
				<uilistlayout
					SortOrder={Enum.SortOrder.LayoutOrder}
					HorizontalAlignment={Enum.HorizontalAlignment.Center}
				></uilistlayout>

				<Frame Size={UDim2.fromScale(1, 0.03)} BackgroundTransparency={1} LayoutOrder={0}></Frame>

				{SETTING_CATEGORIES.map((settingCategory, index, settingCategories) => 
					 (
						<>
							<Text
								Size={UDim2.fromScale(0.91, 0.07)}
								BackgroundTransparency={1}
								LayoutOrder={settingCategories
									.filter((_, index_) => index_ >= 0 && index_ < index)
									.reduce(
										(index, settingCategory) =>
											(index += Object.entries(SETTINGS)
												.filter(
													([, settingDefinition]) =>
														settingDefinition.category === settingCategory,
												)
												.size()),
										1 + index,
									)}
								FontFace={fonts.josefinSans.semiBold}
								Text={`${settingCategory} :`}
								TextSize={22}
								TextXAlignment={Enum.TextXAlignment.Left}
							></Text>

							{Object.entries(SETTINGS)
								.filter(([, settingDefinition]) => settingDefinition.category === settingCategory)
								.map(([settingName, settingDefinition],_,settings_) =>
									(
									<Frame
										Size={UDim2.fromScale(0.91, 0.14)}
										BackgroundTransparency={1}
										LayoutOrder={settingCategories
											.filter((_, index_) => index_ >= 0 && index_ < index)
											.reduce(
												(index, settingCategory) =>
													(index += Object.entries(SETTINGS)
														.filter(
															([, settingDefinition]) =>
																settingDefinition.category === settingCategory,
														)
														.size()),
												2+index+settingDefinition.index,
											)}
										ZIndex={settingDefinition.type==="PerformanceDropdown"?settings_.size()-settingDefinition.index:1}
									>
										<Text
											Size={UDim2.fromScale(1, 1)}
											Text={`${settingDefinition.text} :`}
											TextSize={18}
											TextXAlignment={Enum.TextXAlignment.Left}
										></Text>

										{settingDefinition.type === "SoundSlider" ? (
											<SettingsMenuSettingSoundSlider
												settingName={settingName}
												volume={(settings?.[settingName] as number | undefined)}
											></SettingsMenuSettingSoundSlider>
										) : (
											<SettingsMenuSettingPerformanceDropdown
												settingName={settingName}
												performanceDropdownSettingDefinition={settingDefinition}
												userIds={(settings?.[settingName] as number[] | undefined) ?? []}
											></SettingsMenuSettingPerformanceDropdown>
										)}
									</Frame>
								))}
						</>
					)
				)}

				<Frame Size={UDim2.fromScale(1, 0.32)} BackgroundTransparency={1} LayoutOrder={100}></Frame>
			</ScrollingFrame>

			<Frame
				AnchorPoint={new Vector2(0, 1)}
				Position={UDim2.fromScale(0, 1)}
				Size={UDim2.fromScale(1, 0.075)}
				BackgroundColor3={colors.black}
			>
				<uistroke
					ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
					Color={colors.grey}
					LineJoinMode={Enum.LineJoinMode.Miter}
				></uistroke>

				<Button
					Size={UDim2.fromScale(0.5, 1)}
					Event={{
						MouseButton1Click: () => {
							Events.UnloadGame.fire();
						},
					}}
				>
					<uistroke
						ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
						Color={colors.grey}
						LineJoinMode={Enum.LineJoinMode.Miter}
					></uistroke>

					<Text Size={UDim2.fromScale(1, 1)} Text="Unload Game" TextSize={16}></Text>
				</Button>

				<Button
					AnchorPoint={new Vector2(0, 0)}
					Position={UDim2.fromScale(0.5, 0)}
					Size={UDim2.fromScale(0.5, 1)}
					Event={{
						MouseButton1Click: () => {
							Events.DeleteGame.fire();
						},
					}}
				>
					<Text
						Size={UDim2.fromScale(1, 1)}
						Text="Delete Game"
						TextSize={16}
						TextColor3={colors.lightred}
					></Text>

					<Image
						AnchorPoint={new Vector2(0.5, 0.5)}
						Position={UDim2.fromScale(0.5, 0.5)}
						Size={UDim2.fromScale(0.8, 1)}
						Image={IMAGES.ui.Glow}
						ImageColor3={colors.lightred}
						ImageTransparency={0.9}
					></Image>
				</Button>
			</Frame>
		</CanvasGroup>
	);
}
