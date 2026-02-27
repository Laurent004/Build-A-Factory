import React, { useState } from "@rbxts/react";
import { colors, fonts, springs } from "./constants";
import { lerpBinding, useEventListener, useMotion, useMountEffect } from "@rbxts/pretty-react-hooks";
import { Events } from "client/network";
import { Button, CanvasGroup, Frame, ScrollingFrame, Text } from "./core";
import { round } from "shared/utils";
import { Data } from "shared/types/data";
import { Players } from "@rbxts/services";
import DataService from "client/services/data/data";

export function SaveSelector() {
	const [games, setGames] = useState<Data["saves"]>([]);
	const dataService = DataService.getInst();
	const [mountAnimation, mountAnimationMotion] = useMotion(0);

	useMountEffect(() => {
		const data = dataService.getData();
		if (data !== undefined) {
			setGames(data.saves);
			mountAnimationMotion.spring(1, springs.gentle);
		}
	});

	useEventListener(dataService.OnDataInitialization, (data) => {
		setGames(data.saves);
		mountAnimationMotion.spring(1, springs.gentle);
	});

	useEventListener(Events.OnSavesUpdate, (games_) => {
		setGames([...games_]);
		if (games_.size() <= (games ?? []).size()) mountAnimationMotion.spring(1, springs.gentle);
	});

	return (
		<>
			<Button Size={UDim2.fromScale(1, 1)} ZIndex={4} enabled={mountAnimation.map((value) => value > 0.01)}>
				<Frame
					AnchorPoint={new Vector2(0, 0)}
					Position={UDim2.fromScale(0, 0)}
					Size={UDim2.fromScale(1, 1)}
					BackgroundColor3={Color3.fromRGB(0, 0, 0)}
					BackgroundTransparency={lerpBinding(mountAnimation, 1, 0.4)}
				></Frame>
			</Button>

			<CanvasGroup
				GroupTransparency={mountAnimation.map((value) => 1 - value)}
				Active={mountAnimation.map((value) => value > 0.01)}
				AnchorPoint={new Vector2(0.5, 0.5)}
				Position={UDim2.fromScale(0.5, 0.5)}
				Size={lerpBinding(mountAnimation, UDim2.fromScale(0, 0), UDim2.fromScale(0.323, 0.448))}
				BackgroundColor3={colors.black}
				Interactable={mountAnimation.map((value) => value > 0.01)}
				ZIndex={5}
			>
				<Text
					AnchorPoint={new Vector2(0.5, 0.5)}
					Position={UDim2.fromScale(0.5, 0.09)}
					Size={UDim2.fromScale(0.43, 0.04)}
					FontFace={fonts.josefinSans.bold}
					Text={"Welcome to Build A Factory !"}
					TextSize={18}
				></Text>

				<Frame
					AnchorPoint={new Vector2(0.5, 0.5)}
					Position={UDim2.fromScale(0.5, 0.145)}
					Size={UDim2.fromScale(0.56, 0.002)}
					BackgroundColor3={colors.grey}
				></Frame>

				<ScrollingFrame
					AnchorPoint={new Vector2(0.5, 0.5)}
					Position={UDim2.fromScale(0.5, 0.515)}
					Size={UDim2.fromScale(0.9, 0.685)}
				>
					<uilistlayout
						Padding={new UDim(0, 12)}
						SortOrder={Enum.SortOrder.LayoutOrder}
						HorizontalAlignment={Enum.HorizontalAlignment.Center}
					></uilistlayout>

					<Text
						Size={UDim2.fromScale(1, 0.1)}
						LayoutOrder={0}
						Text={"Load an existing game :"}
						TextSize={17}
					></Text>

					{games.map((game_, index) => (
						<SaveButton
							game_={game_}
							index={index}
							mouseButton1Click={() => {
								Events.LoadSave(game_.id);
								mountAnimationMotion.spring(0, springs.gentle);
							}}
						></SaveButton>
					))}
				</ScrollingFrame>

				<Button
					AnchorPoint={new Vector2(0.5, 1)}
					Position={UDim2.fromScale(0.5, 0.957)}
					Size={UDim2.fromScale(0.9, 0.057)}
					Event={{
						MouseButton1Click: () => {
							Events.CreateSave();
							mountAnimationMotion.spring(0, springs.gentle);
						},
					}}
				>
					<Frame Size={UDim2.fromScale(1, 1)} BackgroundColor3={colors.white}>
						<Text
							Size={UDim2.fromScale(1, 1)}
							Text={"+ Create New Game"}
							TextColor3={Color3.fromRGB(0, 0, 0)}
							TextSize={16}
						></Text>
					</Frame>
				</Button>
			</CanvasGroup>
		</>
	);
}

interface SaveButtonProps {
	game_: Data["saves"][number];
	index: number;
	mouseButton1Click: () => void;
}

function SaveButton({ game_, index, mouseButton1Click }: SaveButtonProps) {
	const [hoverAnimation, hoverAnimationMotion] = useMotion(0);

	return (
		<Button
			Size={UDim2.fromScale(1, 0.3)}
			LayoutOrder={index + 1}
			Event={{
				MouseEnter: () => {
					hoverAnimationMotion.spring(1, springs.gentle);
				},
				MouseLeave: () => {
					hoverAnimationMotion.spring(0, springs.gentle);
				},
				MouseButton1Click: () => {
					mouseButton1Click();
				},
			}}
		>
			<Frame
				Size={UDim2.fromScale(1, 1)}
				BackgroundColor3={lerpBinding(hoverAnimation, Color3.fromRGB(22, 22, 22), colors.white)}
			>
				<Text
					AnchorPoint={new Vector2(0.5, 0.5)}
					Position={UDim2.fromScale(0.35, 0.264)}
					Size={UDim2.fromScale(0.626, 0.17)}
					FontFace={fonts.josefinSans.medium}
					Text={`${Players.LocalPlayer.Name}'s Factory`}
					TextColor3={lerpBinding(hoverAnimation, colors.white, Color3.fromRGB(0, 0, 0))}
					TextSize={22}
					TextTruncate={Enum.TextTruncate.SplitWord}
					TextXAlignment={Enum.TextXAlignment.Left}
					TextYAlignment={Enum.TextYAlignment.Top}
				></Text>

				<Text
					AnchorPoint={new Vector2(0.5, 0.5)}
					Position={UDim2.fromScale(0.169, 0.643)}
					Size={UDim2.fromScale(0.263, 0.16)}
					FontFace={fonts.josefinSans.light}
					Text="0 years ago"
					TextColor3={lerpBinding(hoverAnimation, colors.white, Color3.fromRGB(0, 0, 0))}
					TextSize={22}
					TextXAlignment={Enum.TextXAlignment.Left}
					TextYAlignment={Enum.TextYAlignment.Top}
				></Text>

				<Text
					AnchorPoint={new Vector2(0.5, 0.5)}
					Position={UDim2.fromScale(0.813, 0.264)}
					Size={UDim2.fromScale(0.302, 0.18)}
					Text="$"
					TextColor3={lerpBinding(hoverAnimation, colors.white, Color3.fromRGB(0, 0, 0))}
					TextSize={22}
					TextXAlignment={Enum.TextXAlignment.Right}
					TextYAlignment={Enum.TextYAlignment.Top}
				></Text>

				<Text
					AnchorPoint={new Vector2(0.5, 0.5)}
					Position={UDim2.fromScale(0.893, 0.643)}
					Size={UDim2.fromScale(0.141, 0.16)}
					Text={`${round(game_.size / 1024 / 1024, 2)}MB`}
					TextColor3={lerpBinding(hoverAnimation, colors.white, Color3.fromRGB(0, 0, 0))}
					TextSize={22}
					TextXAlignment={Enum.TextXAlignment.Right}
					TextYAlignment={Enum.TextYAlignment.Top}
				></Text>
			</Frame>
		</Button>
	);
}
