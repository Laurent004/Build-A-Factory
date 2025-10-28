import React, { useState } from "@rbxts/react";
import { useRem } from "client/hooks/use-rem";
import { colors, fonts, springs } from "../constants";
import { Frame } from "../core/frame";
import { Text } from "../core/text";
import { lerpBinding, useEventListener, useMotion } from "@rbxts/pretty-react-hooks";
import { Events } from "client/network";
import { TUTORIAL } from "shared/constants/tutorial";

export function TutorialMenu() {
	const rem = useRem();

	const [tutorialStep, setTutorialStep] = useState<number>();
	const [onMountAnimation, onMountAnimationMotion] = useMotion(0);
	const [onMountAnimationCompleteAnimation, onMountAnimationMotionCompleteAnimationMotion] = useMotion(0);
	const [onUpdateAnimation, onUpdateAnimationMotion] = useMotion(1);

	useEventListener(Events.OnTutorialStepUpdate, (tutorialStep) => {
		if (tutorialStep === 0) {
			onMountAnimationMotion.spring(1, springs.gentle);
			const cleanup = onMountAnimationMotion.onComplete(() => {
				cleanup();
				setTutorialStep(tutorialStep);
				onMountAnimationMotionCompleteAnimationMotion.spring(1, springs.gentle);
			});
		} else if (tutorialStep === TUTORIAL.size()) {
			onMountAnimationMotionCompleteAnimationMotion.spring(0, springs.gentle);
			const cleanup = onMountAnimationMotionCompleteAnimationMotion.onComplete(() => {
				cleanup();
				onMountAnimationMotion.spring(0, springs.gentle);
			});
			setTutorialStep(undefined);
			onUpdateAnimationMotion.spring(1, springs.responsive);
		} else {
			onUpdateAnimationMotion.spring(0, springs.responsive);
			const cleanup = onUpdateAnimationMotion.onComplete(() => {
				cleanup();
				setTutorialStep(tutorialStep);
				onUpdateAnimationMotion.spring(1, springs.gentle);
			});
		}
	});

	return (
		<Frame
			anchorPoint={new Vector2(0.5, 0.5)}
			position={new UDim2(0, rem(960), 0, rem(136))}
			size={new UDim2(0, rem(658), 0, rem(179))}
			backgroundTransparency={onMountAnimationCompleteAnimation.map((value) => 1 - value)}
			backgroundColor={colors.black}
		>
			<Frame
				anchorPoint={new Vector2(0, 0)}
				position={lerpBinding(onMountAnimation, new UDim2(1, 0, 0, 0), new UDim2(0, 0, 0, 0))}
				size={lerpBinding(onMountAnimation, new UDim2(1, 0, 1, 0), new UDim2(0.013, 0, 1, 0))}
				backgroundTransparency={onMountAnimation.map((value) => 1 - value)}
				backgroundColor={colors.lightblue}
			></Frame>

			<Frame
				anchorPoint={new Vector2(0.5, 0.5)}
				position={new UDim2(0.507, 0, 0.5, 0)}
				size={new UDim2(0.987, 0, 1, 0)}
				backgroundTransparency={onUpdateAnimation}
				backgroundColor={Color3.fromRGB(0, 0, 0)}
				zIndex={2}
			></Frame>

			<Text
				anchorPoint={new Vector2(0.5, 0.5)}
				position={lerpBinding(
					onMountAnimationCompleteAnimation,
					new UDim2(0, 0, 0.22, 0),
					new UDim2(0.204, 0, 0.22, 0),
				)}
				size={new UDim2(0.304, 0, 0.18, 0)}
				font={fonts.josefinSans.bold}
				text={tutorialStep !== undefined ? `Tutorial (${tutorialStep}/${TUTORIAL.size() - 1})` : ""}
				textSize={26}
				textColor={colors.white}
				textXAlignment={Enum.TextXAlignment.Left}
				textYAlignment={Enum.TextYAlignment.Top}
			></Text>

			<Text
				anchorPoint={new Vector2(0.5, 0.5)}
				position={lerpBinding(
					onMountAnimationCompleteAnimation,
					new UDim2(0.51, 0, 0.84, 0),
					new UDim2(0.51, 0, 0.624, 0),
				)}
				size={new UDim2(0.919, 0, 0.509, 0)}
				font={fonts.josefinSans.regular}
				lineHeight={1.45}
				richText={true}
				text={tutorialStep !== undefined ? TUTORIAL[tutorialStep].description : ""}
				textSize={21}
				textColor={colors.white}
				textWrapped={true}
				textXAlignment={Enum.TextXAlignment.Left}
				textYAlignment={Enum.TextYAlignment.Top}
			></Text>
		</Frame>
	);
}
