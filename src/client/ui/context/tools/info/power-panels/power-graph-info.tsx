import { lerpBinding, useMotion, usePrevious, useUpdateEffect } from "@rbxts/pretty-react-hooks";
import React from "@rbxts/react";
import { useSelector } from "@rbxts/react-reflex";
import { selectInfoSelectionStructureModel } from "client/store/context/info";
import { colors, fonts, springs } from "client/ui/constants";
import { Frame } from "client/ui/core/frame";
import { Text } from "client/ui/core/text";

export interface InfoPanelPowerGraphInfoProps {
	index: number;
	position: UDim2;
	iconSize: UDim2;
	iconColor: Color3;
	text: string;
}

export function InfoPanelPowerGraphInfo(props: InfoPanelPowerGraphInfoProps) {
	const structureModel = useSelector(selectInfoSelectionStructureModel);

	const previousStructureModel = usePrevious(structureModel);
	const [onMountAnimation, onMountAnimationMotion] = useMotion(0);

	useUpdateEffect(() => {
		if (structureModel === undefined || structureModel.Name === previousStructureModel?.Name) return;
		onMountAnimationMotion.immediate(0);
		task.delay((props.index + 1) * 0.025, () => {
			onMountAnimationMotion.spring(1, springs.gentle);
		});
	}, [structureModel]);

	return (
		<Frame
			anchorPoint={new Vector2(0, 0)}
			position={props.position}
			size={new UDim2(0.5, 0, 0.5, 0)}
			backgroundTransparency={1}
		>
			<Frame
				anchorPoint={new Vector2(0.5, 0.5)}
				position={lerpBinding(
					onMountAnimation,
					new UDim2(0.06, 0, 1 + (props.index + 1) * 0.4, 0),
					new UDim2(0.06, 0, 0.5, 0),
				)}
				size={props.iconSize}
				backgroundTransparency={onMountAnimation.map((value) => 1 - value)}
				backgroundColor={props.iconColor}
			></Frame>

			<Text
				anchorPoint={new Vector2(1, 0.5)}
				position={lerpBinding(
					onMountAnimation,
					new UDim2(1, 0, 1.5 + (props.index + 1) * 0.4, 0),
					new UDim2(1, 0, 0.5, 0),
				)}
				size={new UDim2(0.84, 0, 0.6, 0)}
				font={fonts.josefinSans.regular}
				richText={true}
				text={props.text}
				textSize={12}
				textTransparency={onMountAnimation.map((value) => 1 - value)}
				textColor={colors.white}
				textXAlignment={Enum.TextXAlignment.Left}
				textYAlignment={Enum.TextYAlignment.Center}
			></Text>
		</Frame>
	);
}
