import { useMotion, usePrevious } from "@rbxts/pretty-react-hooks";
import React, { useEffect } from "@rbxts/react";
import { useSelector } from "@rbxts/react-reflex";
import { selectInfoSelectionStructureModel } from "client/store/context/info";
import { springs } from "client/ui/constants";
import { Frame } from "client/ui/core/frame";

export interface InfoPanelPowerGraphSegmentProps {
	index: number;
	position: UDim2;
	size: UDim2;
	rotation: number;
	color: Color3;
}

export function InfoPanelPowerGraphSegment(props: InfoPanelPowerGraphSegmentProps) {
	const structureModel = useSelector(selectInfoSelectionStructureModel);

	const previousStructureModel = usePrevious(structureModel);
	const [onMountAnimation, onMountAnimationMotion] = useMotion(1);

	useEffect(() => {
		if (structureModel === undefined || structureModel.Name === previousStructureModel?.Name) return;
		onMountAnimationMotion.immediate(0);
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
			backgroundColor={props.color}
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
