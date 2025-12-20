import React, { useState } from "@rbxts/react";
import { Text } from "../../core/text";
import { Frame } from "../../core/frame";
import { colors, fonts, springs } from "../../constants";
import { Button } from "../../core/button";
import { lerpBinding, useEventListener, useMotion } from "@rbxts/pretty-react-hooks";
import { useRem } from "client/hooks";
import { Data } from "shared/types";
import { Events } from "client/network";
import { LoadGameButton } from "./game-button";

export function Load() {
	const rem = useRem();
	const [games, setGames] = useState<Data["games"]>();
	const [onMountAnimation, onMountAnimationMotion] = useMotion(0);

	useEventListener(Events.OnDataInitialization, (data) => {
		setGames(data.games);
		onMountAnimationMotion.spring(1, springs.gentle);
	});

	useEventListener(Events.OnGamesUpdate, (games_) => {
		setGames([...games_]);
		if (games_.size() <= (games ?? []).size()) onMountAnimationMotion.spring(1, springs.gentle);
	});

	return (
		<>
			<Button
				active={onMountAnimation.map((value) => value > 0.01)}
				anchorPoint={new Vector2(0, 0)}
				position={new UDim2(0, 0, 0, 0)}
				size={new UDim2(1, 0, 1, 0)}
				visible={onMountAnimation.map((value) => value > 0.01)}
				zIndex={3}
			>
				<Frame
					anchorPoint={new Vector2(0, 0)}
					position={new UDim2(0, 0, 0, 0)}
					size={new UDim2(1, 0, 1, 0)}
					backgroundColor={Color3.fromRGB(0, 0, 0)}
					backgroundTransparency={lerpBinding(onMountAnimation, 1, 0.4)}
				></Frame>
			</Button>

			<canvasgroup
				GroupTransparency={onMountAnimation.map((value) => 1 - value)}
				Active={onMountAnimation.map((value) => value > 0.01)}
				AnchorPoint={new Vector2(0.5, 0.5)}
				Position={lerpBinding(onMountAnimation, new UDim2(0.5, 0, 0, rem(660)), new UDim2(0.5, 0, 0.5, 0))}
				Size={lerpBinding(onMountAnimation, new UDim2(0, 0, 0, 0), new UDim2(0, rem(621), 0, rem(483)))}
				BackgroundColor3={Color3.fromRGB(19, 19, 19)}
				BorderSizePixel={0}
				Interactable={onMountAnimation.map((value) => value > 0.01)}
				ZIndex={4}
			>
				<Text
					anchorPoint={new Vector2(0.5, 0.5)}
					position={UDim2.fromScale(0.5, 0.09)}
					size={UDim2.fromScale(0.5, 0.06)}
					font={fonts.josefinSans.bold}
					text={"Welcome to Build A Factory !"}
					textSize={18}
					textColor={colors.white}
					textXAlignment={Enum.TextXAlignment.Center}
					textYAlignment={Enum.TextYAlignment.Center}
				></Text>
				<Frame
					anchorPoint={new Vector2(0.5, 0.5)}
					position={UDim2.fromScale(0.5, 0.135)}
					size={lerpBinding(onMountAnimation, UDim2.fromScale(0, 0.003), UDim2.fromScale(0.56, 0.003))}
					backgroundColor={colors.grey}
				></Frame>
				<scrollingframe
					AnchorPoint={new Vector2(0.5, 1)}
					Position={UDim2.fromScale(0.5, 0.86)}
					Size={UDim2.fromScale(0.9, 0.6847)}
					BackgroundTransparency={1}
					BorderSizePixel={0}
					CanvasSize={new UDim2(0, 0, 3, 0)}
					ScrollBarThickness={0}
					ScrollBarImageTransparency={1}
					ScrollingDirection={Enum.ScrollingDirection.Y}
				>
					<uilistlayout
						Padding={new UDim(0, 12)}
						FillDirection={Enum.FillDirection.Vertical}
						SortOrder={Enum.SortOrder.LayoutOrder}
						HorizontalAlignment={Enum.HorizontalAlignment.Center}
						VerticalAlignment={Enum.VerticalAlignment.Top}
					></uilistlayout>
					<Frame
						anchorPoint={new Vector2(0, 0)}
						position={new UDim2(0, 0, 0, 0)}
						size={UDim2.fromScale(0.98, 0.035)}
						backgroundTransparency={1}
						layoutOrder={0}
					>
						<Text
							anchorPoint={new Vector2(0.5, 0.5)}
							position={new UDim2(0.5, 0, 0.5, 0)}
							size={UDim2.fromScale(1, 1)}
							font={fonts.josefinSans.regular}
							text={"Load an existing game :"}
							textSize={17}
							textColor={colors.white}
							textXAlignment={Enum.TextXAlignment.Center}
							textYAlignment={Enum.TextYAlignment.Center}
						></Text>
					</Frame>

					{(games ?? [])
						.sort((gameA, gameB) => os.time() - gameA.lastPlaytime < os.time() - gameB.lastPlaytime)
						.map((game_, index) => (
							<LoadGameButton
								index={index}
								game={game_}
								onClick={() => {
									Events.LoadGame(game_.id);
									onMountAnimationMotion.spring(0, springs.gentle);
								}}
							></LoadGameButton>
						))}
				</scrollingframe>

				{(() => {
					const [onHoverAnimation, onHoverAnimationMotion] = useMotion(0);
					return (
						<Button
							anchorPoint={new Vector2(0.5, 1)}
							position={UDim2.fromScale(0.5, 0.9571)}
							size={lerpBinding(
								onHoverAnimation,
								UDim2.fromScale(0.882, 0.057),
								UDim2.fromScale(0.9, 0.057),
							)}
							onMouseEnter={() => {
								onHoverAnimationMotion.spring(1, springs.gentle);
							}}
							onMouseLeave={() => {
								onHoverAnimationMotion.spring(0, springs.gentle);
							}}
							onClick={() => {
								Events.CreateGame();
								onMountAnimationMotion.spring(0, springs.gentle);
							}}
						>
							<Frame
								anchorPoint={new Vector2(0, 0)}
								position={UDim2.fromScale(0, 0)}
								size={UDim2.fromScale(1, 1)}
								backgroundColor={colors.white}
							>
								<Text
									anchorPoint={new Vector2(0, 0)}
									position={new UDim2(0, 0, 0, 0)}
									size={UDim2.fromScale(1, 1)}
									font={fonts.josefinSans.regular}
									text={"+ Create a New Game"}
									textSize={16}
									textColor={Color3.fromRGB(0, 0, 0)}
									textXAlignment={Enum.TextXAlignment.Center}
									textYAlignment={Enum.TextYAlignment.Center}
								></Text>
							</Frame>
						</Button>
					);
				})()}
			</canvasgroup>
		</>
	);
}
