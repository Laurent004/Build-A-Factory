import { Object } from "@rbxts/luau-polyfill";
import { lerpBinding, useEventListener, useMotion } from "@rbxts/pretty-react-hooks";
import React, { useRef, useState } from "@rbxts/react";
import { Players } from "@rbxts/services";
import { useRem } from "client/hooks/use-rem";
import { Events } from "client/network";
import MilestoneService from "client/services/progression/milestone-service";
import { colors, fonts, springs } from "client/ui/constants";
import { Frame } from "client/ui/core/frame";
import { Text } from "client/ui/core/text";
import { MILESTONES } from "shared/constants/milestones";

export function MilestoneNotification() {
	const rem = useRem();

	const [milestoneName, setMilestoneName] = useState<string>("");
	const [onMountAnimation, onMountAnimationMotion] = useMotion(0);
	const [onMountAnimationCompleteAnimation, onMountAnimationMotionCompleteAnimationMotion] = useMotion(0);
	const notifiedMilestones = useRef<number[]>([]);

	useEventListener(Events.OnPlotInitialization, (player) => {
		if (player !== Players.LocalPlayer) return;
		MilestoneService.getInst().onMilestoneDataUpdate.Connect((milestoneData) => {
			const nextMilestone = Object.entries(MILESTONES).find(
				([_, milestone]) => milestone.index === milestoneData.milestone + 1,
			)!;
			if (notifiedMilestones.current.includes(nextMilestone[1].index)) return;

			if (
				Object.entries(nextMilestone[1].itemsToDeliver).every(
					([itemName, count]) =>
						milestoneData.deliveredItems[itemName] !== undefined &&
						milestoneData.deliveredItems[itemName] >= count,
				)
			) {
				notifiedMilestones.current = [...notifiedMilestones.current, nextMilestone[1].index];
				onMountAnimationMotion.spring(1, springs.gentle);
				const cleanup = onMountAnimationMotion.onComplete(() => {
					cleanup();
					setMilestoneName(nextMilestone[0]);
					onMountAnimationMotionCompleteAnimationMotion.spring(1, springs.gentle);

					task.delay(5, () => {
						onMountAnimationMotionCompleteAnimationMotion.spring(0, springs.gentle);
						const cleanup = onMountAnimationMotionCompleteAnimationMotion.onComplete(() => {
							cleanup();
							onMountAnimationMotion.spring(0, springs.gentle);
						});
					});
				});
			}
		});
	});

	return (
		<Frame
			anchorPoint={new Vector2(1, 0.5)}
			position={new UDim2(0, rem(1920), 0, rem(119))}
			size={new UDim2(0, rem(438), 0, rem(128))}
			backgroundTransparency={onMountAnimationCompleteAnimation.map((value) => 1 - value)}
			backgroundColor={colors.black}
		>
			<Frame
				anchorPoint={new Vector2(0, 0)}
				position={lerpBinding(onMountAnimation, new UDim2(1, 0, 0, 0), new UDim2(0, 0, 0, 0))}
				size={lerpBinding(onMountAnimation, new UDim2(1, 0, 1, 0), new UDim2(0, 0, 1, 0))}
				backgroundColor={colors.lightblue}
			></Frame>

			<Frame
				anchorPoint={new Vector2(0, 0)}
				position={new UDim2(0, 0, 0, 0)}
				size={lerpBinding(
					onMountAnimationCompleteAnimation,
					new UDim2(0, 0, 0.338, 0),
					new UDim2(1, 0, 0.338, 0),
				)}
				backgroundColor={colors.lightblue}
			>
				<Text
					anchorPoint={new Vector2(0.5, 0.5)}
					position={new UDim2(0.3, 0, 0.5, 0)}
					size={new UDim2(0.513, 0, 0.6, 0)}
					font={fonts.josefinSans.bold}
					text={`${milestoneName} !`}
					textSize={26}
					textTransparency={onMountAnimationCompleteAnimation.map((value) => 1 - value)}
					textColor={colors.white}
					textStrokeColor={Color3.fromRGB(0, 0, 0)}
					textStrokeTransparency={lerpBinding(onMountAnimationCompleteAnimation, 1, 0.9)}
					textXAlignment={Enum.TextXAlignment.Left}
					textYAlignment={Enum.TextYAlignment.Center}
				></Text>
			</Frame>

			<Text
				anchorPoint={new Vector2(0.5, 0.5)}
				position={lerpBinding(
					onMountAnimationCompleteAnimation,
					new UDim2(0.522, 0, 1, 0),
					new UDim2(0.522, 0, 0.678, 0),
				)}
				size={new UDim2(0.956, 0, 0.354, 0)}
				font={fonts.josefinSans.medium}
				lineHeight={1.35}
				text={"A new milestone has been achieved ! Open your milestones menu to get your rewards !"}
				textSize={19}
				textTransparency={onMountAnimationCompleteAnimation.map((value) => 1 - value)}
				textColor={colors.white}
				textWrapped={true}
				textXAlignment={Enum.TextXAlignment.Left}
				textYAlignment={Enum.TextYAlignment.Top}
			></Text>
		</Frame>
	);
}
