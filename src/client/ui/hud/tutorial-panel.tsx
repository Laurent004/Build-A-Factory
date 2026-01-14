import React, { useState } from "@rbxts/react";
import { colors, fonts, springs } from "../constants";
import { lerpBinding, useEventListener, useMotion } from "@rbxts/pretty-react-hooks";
import { Events } from "client/network";
import { TUTORIAL } from "shared/constants/tutorial";
import { Players } from "@rbxts/services";
import { Frame, NumberSpinner, Text } from "../core";

export function TutorialPanel() {
	const [tutorialStep, setTutorialStep] = useState<number>();
	const [mountAnimation, mountAnimationMotion] = useMotion(0);

	useEventListener(Events.OnPlotReset, (player) => {
		if (player !== Players.LocalPlayer) return;
		setTutorialStep(undefined);
		mountAnimationMotion.spring(0, springs.gentle);
	});

	useEventListener(Events.OnTutorialStepUpdate, (newTutorialStep) => {
		if (tutorialStep === undefined && newTutorialStep !== TUTORIAL.size()) {
			setTutorialStep(newTutorialStep);
			mountAnimationMotion.spring(1, springs.gentle);
		} else if (newTutorialStep === TUTORIAL.size()) {
			setTutorialStep(undefined);
			mountAnimationMotion.spring(0, springs.gentle);
		} else {
			setTutorialStep(newTutorialStep);
		}
	});

	return (
		<Frame
			AnchorPoint={new Vector2(0.5, 0)}
			Position={UDim2.fromScale(0.5, 0.043)}
			Size={UDim2.fromScale(0.343, 0.166)}
			BackgroundColor3={colors.black}
			BackgroundTransparency={mountAnimation.map((value) => 1 - value)}
		>
			<Frame
				Size={lerpBinding(mountAnimation, UDim2.fromScale(0, 1), UDim2.fromScale(0.01, 1))}
				BackgroundColor3={colors.lightblue}
			></Frame>

			<Frame
				AnchorPoint={new Vector2(0.5, 0.5)}
				Position={lerpBinding(mountAnimation, UDim2.fromScale(0.06, 0.196), UDim2.fromScale(0.201, 0.196))}
				Size={UDim2.fromScale(0.302, 0.133)}
				BackgroundTransparency={1}
			>
				<Text
					Size={UDim2.fromScale(1, 1)}
					FontFace={fonts.josefinSans.bold}
					Text={
						tutorialStep !== undefined
							? `Tutorial (${" ".rep(tostring(tutorialStep)!.size() + 1)}/${TUTORIAL.size() - 1})`
							: ""
					}
					TextSize={26}
					TextXAlignment={Enum.TextXAlignment.Left}
					TextYAlignment={Enum.TextYAlignment.Top}
				></Text>

				<NumberSpinner
					Position={UDim2.fromScale(tostring(tutorialStep)!.size() === 1 ? 0.6 : 0.58, 0)}
					Size={UDim2.fromScale(0.15, 1)}
					FontFace={fonts.josefinSans.bold}
					TextSize={26}
					TextTransparency={mountAnimation.map((value) => 1 - value)}
					TextYAlignment={Enum.TextYAlignment.Top}
					value={tutorialStep ?? 0}
					duration={0.3}
					decimals={0}
					prefix=""
					suffix=""
					commas={false}
					digitSize={new UDim2(0, 16, 1, 0)}
					prefixSize={UDim2.fromScale(0, 1)}
					suffixSize={UDim2.fromScale(0, 1)}
					commaSize={UDim2.fromScale(0, 1)}
				></NumberSpinner>
			</Frame>

			<Text
				AnchorPoint={new Vector2(0.5, 0.5)}
				Position={lerpBinding(mountAnimation, UDim2.fromScale(0.51, 0.83), UDim2.fromScale(0.51, 0.606))}
				Size={UDim2.fromScale(0.919, 0.472)}
				LineHeight={1.45}
				RichText={true}
				Text={tutorialStep !== undefined ? TUTORIAL[tutorialStep].description : ""}
				TextSize={21}
				TextWrapped={true}
				TextXAlignment={Enum.TextXAlignment.Left}
				TextYAlignment={Enum.TextYAlignment.Top}
			></Text>
		</Frame>
	);
}
