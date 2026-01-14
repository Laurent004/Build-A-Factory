import React, { useState } from "@rbxts/react";
import { Frame } from "../core/frame";
import { colors, fonts, springs } from "../constants";
import { Image } from "../core/image";
import { IMAGES } from "shared/assets/images";
import { useMotion, useMountEffect } from "@rbxts/pretty-react-hooks";
import { Players } from "@rbxts/services";
import { NumberSpinner } from "../core";

export function CashDisplay() {
	const [cash, setCash] = useState<number>(0);
	const [updateAnimation, updateAnimationMotion] = useMotion(colors.white);

	useMountEffect(() => {
		(Players.LocalPlayer.WaitForChild("leaderstats").WaitForChild("Cash") as NumberValue).Changed.Connect(
			(cash) => {
				setCash((previousCash) => {
					updateAnimationMotion.spring(
						cash > previousCash ? colors.lightgreen : colors.lightred,
						springs.slow,
					);
					const cleanup = updateAnimationMotion.onComplete(() => {
						updateAnimationMotion.spring(colors.white, springs.slow);
						cleanup();
					});
					return cash;
				});
			},
		);
	});

	return (
		<Frame
			AnchorPoint={new Vector2(0.5, 0)}
			Position={UDim2.fromScale(0.5, 0)}
			Size={UDim2.fromScale(0.1, 0.042)}
			BackgroundColor3={colors.white}
			ZIndex={0}
		>
			<uigradient
				Color={
					new ColorSequence([
						new ColorSequenceKeypoint(0, colors.black),
						new ColorSequenceKeypoint(0.5, Color3.fromRGB(22, 22, 22)),
						new ColorSequenceKeypoint(1, colors.black),
					])
				}
			></uigradient>

			<NumberSpinner
				Size={UDim2.fromScale(1, 1)}
				FontFace={fonts.josefinSans.bold}
				TextSize={18}
				TextColor3={updateAnimation}
				value={cash}
				duration={0.3}
				decimals={2}
				prefix="$"
				suffix=""
				commas={true}
				digitSize={new UDim2(0, 10, 1, 0)}
				prefixSize={UDim2.fromScale(0.08, 1)}
				suffixSize={UDim2.fromScale(0.08, 1)}
				commaSize={UDim2.fromScale(0.016, 1)}
			>
				<uigradient
					Rotation={90}
					Transparency={
						new NumberSequence([
							new NumberSequenceKeypoint(0, 1),
							new NumberSequenceKeypoint(0.25, 0.6),
							new NumberSequenceKeypoint(0.5, 0),
							new NumberSequenceKeypoint(0.75, 0.6),
							new NumberSequenceKeypoint(1, 1),
						])
					}
				></uigradient>
			</NumberSpinner>

			<Image
				AnchorPoint={new Vector2(0.5, 0.5)}
				Position={UDim2.fromScale(0.5, 0.5)}
				Size={UDim2.fromScale(0.8, 1)}
				Image={IMAGES.ui.Glow}
				ImageColor3={updateAnimation}
				ImageTransparency={0.8}
			></Image>

			<Frame
				AnchorPoint={new Vector2(0, 1)}
				Position={UDim2.fromScale(0, 1)}
				Size={UDim2.fromScale(1, 0.02)}
				BackgroundColor3={colors.white}
			></Frame>
		</Frame>
	);
}
