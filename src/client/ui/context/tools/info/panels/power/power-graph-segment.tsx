import { useMotion, usePrevious } from "@rbxts/pretty-react-hooks";
import React, { useEffect } from "@rbxts/react";
import { useSelector } from "@rbxts/react-reflex";
import { PowerNetworkInfo } from "client/services/plot/power-service";
import { selectContextStructureModels } from "client/store/context";
import { colors, springs } from "client/ui/constants";
import { Frame } from "client/ui/core/frame";

export interface InfoPanelPowerGraphSegmentProps {
	index: number;
	info: keyof PowerNetworkInfo;
	position: UDim2;
	rotation: number;
	size: UDim2;
}

export function InfoPanelPowerGraphSegment(props: InfoPanelPowerGraphSegmentProps) {
	const structureModel = useSelector(selectContextStructureModels)[0];
	const previousStructureModel = usePrevious(structureModel);
	const [onMountAnimation, onMountAnimationMotion] = useMotion(1);

	useEffect(() => {
		if (structureModel === undefined) {
			onMountAnimationMotion.spring(0, springs.gentle);
			return;
		} else if (structureModel.Name !== previousStructureModel?.Name) {
			onMountAnimationMotion.immediate(0);
		}
		task.delay((props.index + 1) * 0.025, () => {
			onMountAnimationMotion.spring(1, springs.gentle);
		});
	}, [structureModel]);

	return (
		<Frame
			anchorPoint={new Vector2(0.5, 0.5)}
			position={props.position}
			size={props.size}
			rotation={props.rotation}
			backgroundColor={
				props.info === "consumption"
					? colors.lightblue
					: props.info === "production"
					? Color3.fromRGB(173, 173, 173)
					: props.info === "maxConsumption"
					? colors.white
					: Color3.fromRGB(79, 79, 79)
			}
		>
			<uigradient
				Transparency={onMountAnimation.map(
					(value) =>
						new NumberSequence([
							new NumberSequenceKeypoint(0, 0),
							new NumberSequenceKeypoint(math.clamp(value, 0, 0.999), 1 - value),
							new NumberSequenceKeypoint(1, 1),
						]),
				)}
			></uigradient>
		</Frame>
	);
}
