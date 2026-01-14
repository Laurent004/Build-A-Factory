import React, { useEffect, useRef } from "@rbxts/react";
import { SoundService } from "@rbxts/services";
import { EventBus } from "client/event-bus";
import { Events } from "client/network";
import { colors } from "client/ui/constants";
import { Frame, Text } from "client/ui/core";

interface SettingsMenuSettingSoundSliderProps {
	settingName: string;
	volume: number | undefined;
}

export function SettingsMenuSettingSoundSlider({ settingName, volume }: SettingsMenuSettingSoundSliderProps) {
	const frameRef = useRef<Frame>();

	useEffect(() => {
		if (volume === undefined) return;
		SoundService.GetChildren().find(
			(instance): instance is SoundGroup =>
				instance.IsA("SoundGroup") && instance.Name.lower().find(settingName.lower())[0] !== undefined,
		)!.Volume = volume;
	}, [volume]);

	return (
		<>
			<Frame
				ref={frameRef}
				AnchorPoint={new Vector2(0.5, 0.5)}
				Position={UDim2.fromScale(0.6, 0.5)}
				Size={UDim2.fromScale(0.559, 0.153)}
				BackgroundColor3={colors.mediumgrey}
			>
				<uistroke
					ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
					Color={colors.grey}
					LineJoinMode={Enum.LineJoinMode.Miter}
					Transparency={0.6}
				></uistroke>

				<Frame
					BackgroundColor3={colors.lightblue}
					AnchorPoint={new Vector2(0.5, 0.5)}
					Position={UDim2.fromScale(volume ?? 0.5, 0.5)}
					Size={UDim2.fromScale(0.035, 2.6)}
				>
					<uistroke
						ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
						Color={colors.marineblue}
						LineJoinMode={Enum.LineJoinMode.Miter}
					></uistroke>

					<uidragdetector
						key={"debugd"}
						DragStyle={Enum.UIDragDetectorDragStyle.TranslateLine}
						ReferenceUIInstance={frameRef.current}
						ResponseStyle={Enum.UIDragDetectorResponseStyle.Scale}
						DragAxis={new Vector2(1, 0)}
						MinDragTranslation={UDim2.fromScale(-0.5, 0)}
						MaxDragTranslation={UDim2.fromScale(0.5, 0)}
						DragUDim2={UDim2.fromScale((volume ?? 0) - 0.5, 0)}
						Event={{
							DragEnd: (uiDragDetector) => {
								Events.SetSetting(settingName, math.max(0, uiDragDetector.DragUDim2.X.Scale + 0.5));
								EventBus.OnSettingChange.Fire(
									settingName,
									math.max(0, uiDragDetector.DragUDim2.X.Scale + 0.5),
								);
							},
						}}
					></uidragdetector>
				</Frame>
			</Frame>

			<Text
				AnchorPoint={new Vector2(1, 0)}
				Position={UDim2.fromScale(1, 0)}
				Size={UDim2.fromScale(0.097, 1)}
				Text={`${math.round((volume ?? 0) * 100)}%`}
				TextSize={18}
				TextXAlignment={Enum.TextXAlignment.Right}
			></Text>
		</>
	);
}
