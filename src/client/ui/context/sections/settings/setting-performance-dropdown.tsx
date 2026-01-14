import React, { useState } from "@rbxts/react";
import { Players } from "@rbxts/services";
import { EventBus } from "client/event-bus";
import { Events } from "client/network";
import { colors } from "client/ui/constants";
import { Button, Frame, Image, ScrollingFrame, Text } from "client/ui/core";
import { PerformanceDropdownSettingDefinition } from "shared/constants/settings";

interface SettingsMenuSettingPerformanceDropdownProps {
	settingName: string;
	performanceDropdownSettingDefinition: PerformanceDropdownSettingDefinition;
	userIds: number[];
}

export function SettingsMenuSettingPerformanceDropdown({
	settingName,
	performanceDropdownSettingDefinition,
	userIds,
}: SettingsMenuSettingPerformanceDropdownProps) {
	const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

	return (
		<Frame
			AnchorPoint={new Vector2(1, 0.5)}
			Position={UDim2.fromScale(1, 0.5)}
			Size={UDim2.fromScale(0.44, 0.6)}
			BackgroundTransparency={1}
		>
			<uistroke
				ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
				Color={colors.grey}
				LineJoinMode={Enum.LineJoinMode.Miter}
			></uistroke>

			<Text
				Size={UDim2.fromScale(1, 1)}
				Text={`${
					performanceDropdownSettingDefinition.dropdownText
				} (${userIds.size()}/${Players.GetPlayers().size()})`}
				TextSize={14}
				TextXAlignment={Enum.TextXAlignment.Left}
			>
				<uipadding PaddingLeft={new UDim(0, 15)}></uipadding>
			</Text>

			<Button
				AnchorPoint={new Vector2(1, 0)}
				Position={UDim2.fromScale(1, 0)}
				Size={UDim2.fromScale(0.164, 1)}
				Event={{
					MouseButton1Click: () => {
						setIsDropdownOpen(!isDropdownOpen);
					},
				}}
			>
				<uistroke
					ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
					Color={colors.grey}
					LineJoinMode={Enum.LineJoinMode.Miter}
				></uistroke>

				<Image
					AnchorPoint={new Vector2(0.5, 0.5)}
					Position={UDim2.fromScale(0.5, 0.5)}
					Rotation={90}
					Size={UDim2.fromScale(0.42, 0.42)}
					Image="rbxassetid://87835167641652"
				></Image>
			</Button>

			<ScrollingFrame
				Position={UDim2.fromScale(0, 1)}
				Size={UDim2.fromScale(1, 3.333)}
				BackgroundColor3={colors.black}
				BackgroundTransparency={0}
				Visible={isDropdownOpen}
			>
				<uistroke
					ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
					Color={colors.grey}
					LineJoinMode={Enum.LineJoinMode.Miter}
				></uistroke>

				<uilistlayout SortOrder={Enum.SortOrder.LayoutOrder}></uilistlayout>

				{Players.GetPlayers().map((player, index) => (
					<Frame Size={UDim2.fromScale(1, 0.31)} BackgroundTransparency={1} LayoutOrder={index}>
						<Button
							AnchorPoint={new Vector2(0.5, 0.5)}
							Position={UDim2.fromScale(0.1, 0.5)}
							Size={UDim2.fromScale(0.085, 0.44)}
							Event={{
								MouseButton1Click: () => {
									Events.SetSetting(
										settingName,
										userIds.includes(player.UserId)
											? userIds.filter((userId) => userId !== player.UserId)
											: [...userIds, player.UserId],
									);
									EventBus.OnSettingChange.Fire(
										settingName,
										userIds.includes(player.UserId)
											? userIds.filter((userId) => userId !== player.UserId)
											: [...userIds, player.UserId],
									);
								},
							}}
						>
							<uistroke
								ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
								Color={colors.white}
								LineJoinMode={Enum.LineJoinMode.Miter}
							></uistroke>

							<Frame
								Size={UDim2.fromScale(1, 1)}
								Visible={userIds.includes(player.UserId)}
								BackgroundColor3={colors.lightblue}
							>
								<Image
									AnchorPoint={new Vector2(0.5, 0.5)}
									Position={UDim2.fromScale(0.5, 0.5)}
									Size={UDim2.fromScale(0.7, 0.7)}
									Visible={userIds.includes(player.UserId)}
									Image={"rbxassetid://113903849727210"}
								></Image>
							</Frame>
						</Button>

						<Image
							AnchorPoint={new Vector2(0.5, 0.5)}
							Position={UDim2.fromScale(0.25, 0.5)}
							Size={UDim2.fromScale(0.11, 0.56)}
							Image={
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
							Size={UDim2.fromScale(1, 1)}
							Text={player.Name}
							TextSize={15}
							TextWrapped={true}
							TextXAlignment={Enum.TextXAlignment.Left}
						>
							<uipadding PaddingLeft={new UDim(0, 86)} PaddingRight={new UDim(0, 12)}></uipadding>
						</Text>
					</Frame>
				))}
			</ScrollingFrame>
		</Frame>
	);
}
