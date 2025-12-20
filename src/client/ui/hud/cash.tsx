import React, { useRef, useState } from "@rbxts/react";
import { Frame } from "../core/frame";
import { colors, fonts, springs } from "../constants";
import { Image } from "../core/image";
import { IMAGES } from "shared/assets/images";
import { useEventListener, useMotion, useMountEffect } from "@rbxts/pretty-react-hooks";
import { Players } from "@rbxts/services";
import { NumberSpinner } from "../core/number-spinner";
import { useRem } from "client/hooks";
import { EventBus } from "client/event-bus";

export function Cash() {
	const rem = useRem();
	const [cash, setCash] = useState<number>(0);
	const updateConnectionRef = useRef<RBXScriptConnection>();
	const [onUpdateAnimation, onUpdateAnimationMotion] = useMotion(colors.white);

	useMountEffect(() => {
		onUpdateAnimationMotion.onComplete(() => {
			onUpdateAnimationMotion.spring(colors.white, springs.slow);
		});
	});

	useEventListener(EventBus.PlotEvents.OnPlotInitialization, (player) => {
		if (player !== Players.LocalPlayer) return;
		setCash((previousCash) => {
			if (
				(Players.LocalPlayer.WaitForChild("leaderstats").WaitForChild("Cash") as NumberValue).Value >
				previousCash
			)
				onUpdateAnimationMotion.spring(colors.lightgreen, springs.slow);
			return (Players.LocalPlayer.WaitForChild("leaderstats").WaitForChild("Cash") as NumberValue).Value;
		});
		updateConnectionRef.current?.Disconnect();
		updateConnectionRef.current = (
			Players.LocalPlayer.WaitForChild("leaderstats").WaitForChild("Cash") as NumberValue
		).Changed.Connect((cash) => {
			setCash((previousCash) => {
				if (cash > previousCash) onUpdateAnimationMotion.spring(colors.lightgreen, springs.slow);
				else onUpdateAnimationMotion.spring(colors.lightred, springs.slow);
				return cash;
			});
		});
	});

	return (
		<Frame
			anchorPoint={new Vector2(0.5, 0)}
			position={new UDim2(0.5, 0, 0, 0)}
			size={new UDim2(0, rem(192), 0, rem(45))}
			backgroundColor={colors.white}
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
				value={cash}
				duration={0.3}
				decimals={2}
				prefix="$"
				suffix=""
				commas={true}
				digitSize={new UDim2(0, 10, 1, 0)}
				prefixSize={new UDim2(0.08, 0, 1, 0)}
				suffixSize={new UDim2(0.08, 0, 1, 0)}
				commaSize={new UDim2(0.016, 0, 1, 0)}
				anchorPoint={new Vector2(0.5, 0.5)}
				position={new UDim2(0.5, 0, 0.5, 0)}
				size={new UDim2(1, 0, 1, 0)}
				font={fonts.josefinSans.bold}
				text=""
				textSize={18}
				textColor={onUpdateAnimation}
				textXAlignment={Enum.TextXAlignment.Center}
				textYAlignment={Enum.TextYAlignment.Center}
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
				anchorPoint={new Vector2(0.5, 0.5)}
				position={new UDim2(0.5, 0, 0.5, 0)}
				size={new UDim2(0.8, 0, 1, 0)}
				backgroundTransparency={1}
				image={IMAGES.ui.Glow}
				imageColor={onUpdateAnimation}
				imageTransparency={0.8}
			></Image>

			<Frame
				anchorPoint={new Vector2(0, 1)}
				position={new UDim2(0, 0, 1, 0)}
				size={new UDim2(1, 0, 0.02, 0)}
				backgroundColor={colors.white}
			></Frame>
		</Frame>
	);
}
