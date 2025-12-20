import React from "@rbxts/react";
import { Text } from "../../core/text";
import { Frame } from "../../core/frame";
import { colors, fonts, springs } from "../../constants";
import { Button } from "../../core/button";
import { Data } from "shared/types";
import { round } from "shared/utils/math";
import { lerpBinding, useEventListener, useMotion, useMountEffect } from "@rbxts/pretty-react-hooks";
import { Events } from "client/network";

export interface LoadGameButtonProps {
	index: number;
	game: Data["games"][number];
	onClick: () => void;
}

export function LoadGameButton(props: LoadGameButtonProps) {
	const [onMountAnimation, onMountAnimationMotion] = useMotion(0);
	const [onHoverAnimation, onHoverAnimationMotion] = useMotion(0);

	useMountEffect(() => {
		task.delay((props.index + 1) * 0.1, () => {
			onMountAnimationMotion.spring(1, springs.gentle);
		});
	});

	useEventListener(Events.OnGamesUpdate, () => {
		onMountAnimationMotion.immediate(0);
		task.delay((props.index + 1) * 0.1, () => {
			onMountAnimationMotion.spring(1, springs.gentle);
		});
	});

	return (
		<Button
			anchorPoint={new Vector2(0, 0)}
			position={new UDim2(0, 0, 0, 0)}
			size={lerpBinding(onHoverAnimation, UDim2.fromScale(0.98, 0.06), UDim2.fromScale(1, 0.07))}
			layoutOrder={props.index}
			onMouseEnter={() => {
				onHoverAnimationMotion.spring(1, springs.gentle);
			}}
			onMouseLeave={() => {
				onHoverAnimationMotion.spring(0, springs.gentle);
			}}
			onClick={() => {
				props.onClick();
			}}
		>
			<Frame
				anchorPoint={new Vector2(0, 0)}
				position={lerpBinding(onMountAnimation, new UDim2(0, 0, 1, 0), new UDim2(0, 0, 0, 0))}
				size={UDim2.fromScale(1, 1)}
				backgroundColor={lerpBinding(onHoverAnimation, Color3.fromRGB(22, 22, 22), colors.white)}
				backgroundTransparency={onMountAnimation.map((value) => 1 - value)}
			>
				<Text
					anchorPoint={new Vector2(0, 0)}
					position={UDim2.fromScale(0.029, 0.16)}
					size={UDim2.fromScale(0.613, 0.231)}
					font={fonts.josefinSans.semiBold}
					text={props.game.name}
					textSize={22}
					textColor={lerpBinding(onHoverAnimation, colors.white, Color3.fromRGB(0, 0, 0))}
					textTransparency={onMountAnimation.map((value) => 1 - value)}
					textTruncate={Enum.TextTruncate.SplitWord}
					textXAlignment={Enum.TextXAlignment.Left}
					textYAlignment={Enum.TextYAlignment.Top}
				></Text>
				<Text
					anchorPoint={new Vector2(0, 0)}
					position={UDim2.fromScale(0.029, 0.568)}
					size={UDim2.fromScale(0.44, 0.166)}
					font={fonts.josefinSans.light}
					text={
						os.time() - props.game.lastPlaytime < 60
							? "Just now"
							: (os.time() - props.game.lastPlaytime) / 60 < 60
							? `${math.floor((os.time() - props.game.lastPlaytime) / 60)} minutes ago`
							: (os.time() - props.game.lastPlaytime) / 60 / 24 < 7
							? `${math.floor((os.time() - props.game.lastPlaytime) / 60 / 24)} hours ago`
							: (os.time() - props.game.lastPlaytime) / 60 / 24 / 7 < 4
							? `${math.floor((os.time() - props.game.lastPlaytime) / 60 / 24 / 7)} weeks ago`
							: (os.time() - props.game.lastPlaytime) / 60 / 24 / 7 / 30 < 12
							? `${math.floor((os.time() - props.game.lastPlaytime) / 60 / 24 / 7 / 30)} months ago`
							: `${math.floor((os.time() - props.game.lastPlaytime) / 60 / 24 / 7 / 30 / 365)} years ago`
					}
					textSize={22}
					textColor={lerpBinding(onHoverAnimation, colors.white, Color3.fromRGB(0, 0, 0))}
					textTransparency={onMountAnimation.map((value) => 1 - value)}
					textXAlignment={Enum.TextXAlignment.Left}
					textYAlignment={Enum.TextYAlignment.Top}
				></Text>

				<Text
					anchorPoint={new Vector2(1, 0.5)}
					position={UDim2.fromScale(0.975, 0.268)}
					size={UDim2.fromScale(0.263, 0.45)}
					font={fonts.josefinSans.regular}
					text={`$${props.game.cash}`}
					textSize={21}
					textColor={lerpBinding(onHoverAnimation, colors.white, Color3.fromRGB(0, 0, 0))}
					textTransparency={onMountAnimation.map((value) => 1 - value)}
					textXAlignment={Enum.TextXAlignment.Right}
					textYAlignment={Enum.TextYAlignment.Center}
				></Text>
				<Text
					anchorPoint={new Vector2(1, 0.5)}
					position={UDim2.fromScale(0.975, 0.65)}
					size={UDim2.fromScale(0.219, 0.45)}
					font={fonts.josefinSans.regular}
					text={`${round(props.game.size / 1024 / 1024, 2)}/2.25MB`}
					textSize={21}
					textColor={lerpBinding(onHoverAnimation, colors.white, Color3.fromRGB(0, 0, 0))}
					textTransparency={onMountAnimation.map((value) => 1 - value)}
					textXAlignment={Enum.TextXAlignment.Right}
					textYAlignment={Enum.TextYAlignment.Center}
				></Text>
			</Frame>
		</Button>
	);
}
