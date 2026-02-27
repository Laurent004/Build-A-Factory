import React, { useState } from "@rbxts/react";
import { colors, fonts, springs } from "../constants";
import { useEventListener, useMotion } from "@rbxts/pretty-react-hooks";
import { TUTORIAL } from "shared/constants/tutorial";
import { Players } from "@rbxts/services";
import { Frame, NumberSpinner, Text } from "../core";

export function TutorialPanel() {
	const [tutorialStep, setTutorialStep] = useState<number>();
	const [mountAnimation, mountAnimationMotion] = useMotion(0);

	useEventListener(Players.LocalPlayer.GetAttributeChangedSignal("TutorialStep"), () => {
		const tutorialStep_ = Players.LocalPlayer.GetAttribute("TutorialStep") as number;
		if (tutorialStep === undefined && tutorialStep_ !== TUTORIAL.size()) {
			setTutorialStep(tutorialStep_);
			mountAnimationMotion.spring(1, springs.gentle);
		} else if (tutorialStep_ === TUTORIAL.size()) {
			setTutorialStep(undefined);
			mountAnimationMotion.spring(0, springs.gentle);
		} else {
			setTutorialStep(tutorialStep_);
		}
	});

	return (
		<Frame
			AnchorPoint={new Vector2(0.5, 0)}
			Position={UDim2.fromScale(0.5, 0.053)}
			Size={UDim2.fromScale(0.343, 0.166)}
			BackgroundColor3={colors.black}
			BackgroundTransparency={mountAnimation.map((value) => 1 - value)}
		>
			<Frame
				Size={UDim2.fromScale(0.01, 1)}
				BackgroundColor3={colors.lightblue}
				BackgroundTransparency={mountAnimation.map((value) => 1 - value)}
			></Frame>

			<NumberSpinner
				Position={UDim2.fromScale(0.05, 0.13)}
				Size={UDim2.fromScale(0, 0.133)}
				FontFace={fonts.josefinSans.bold}
				TextSize={26}
				TextTransparency={mountAnimation.map((value) => 1 - value)}
				TextXAlignment={Enum.TextXAlignment.Left}
				TextYAlignment={Enum.TextYAlignment.Top}
				value={tutorialStep ?? 0}
				prefix="Tutorial ("
				suffix={`/${TUTORIAL.size() - 1})`}
			></NumberSpinner>

			<Text
				AnchorPoint={new Vector2(0.5, 0.5)}
				Position={UDim2.fromScale(0.51, 0.606)}
				Size={UDim2.fromScale(0.919, 0.472)}
				LineHeight={1.45}
				RichText={true}
				Text={tutorialStep !== undefined ? TUTORIAL[tutorialStep].description : ""}
				TextSize={21}
				TextWrapped={true}
				TextTransparency={mountAnimation.map((value) => 1 - value)}
				TextXAlignment={Enum.TextXAlignment.Left}
				TextYAlignment={Enum.TextYAlignment.Top}
			></Text>
		</Frame>
	);
}
