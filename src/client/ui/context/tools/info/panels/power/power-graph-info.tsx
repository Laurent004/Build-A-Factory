import { lerpBinding, useMotion, usePrevious, useUpdateEffect } from "@rbxts/pretty-react-hooks";
import React from "@rbxts/react";
import { useSelector } from "@rbxts/react-reflex";
import { PowerNetworkInfo } from "client/services/plot/power-service";
import { selectContextStructureModels } from "client/store/context";
import { colors, fonts, springs } from "client/ui/constants";
import { Frame } from "client/ui/core/frame";
import { Text } from "client/ui/core/text";

export interface InfoPanelPowerGraphInfoProps {
	index: number;
	info: keyof PowerNetworkInfo;
	position: UDim2;
	iconSize: UDim2;
	value: number;
}

export function InfoPanelPowerGraphInfo(props: InfoPanelPowerGraphInfoProps) {
	const structureModel = useSelector(selectContextStructureModels)[0];
	const previousStructureModel = usePrevious(structureModel);
	const [onMountAnimation, onMountAnimationMotion] = useMotion(0);

	useUpdateEffect(() => {
		if (structureModel === undefined) {
			onMountAnimationMotion.spring(0, springs.gentle);
		} else if (structureModel.Name !== previousStructureModel?.Name) {
			onMountAnimationMotion.immediate(0);
			task.delay((props.index + 1) * 0.025, () => {
				onMountAnimationMotion.spring(1, springs.gentle);
			});
		}
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
				backgroundColor={props.info === "consumption"
									? colors.lightblue
									: props.info === "production"
									? Color3.fromRGB(173, 173, 173)
									: props.info === "maxConsumption"
									? colors.white
									: Color3.fromRGB(79, 79, 79)}
				backgroundTransparency={onMountAnimation.map((value) => 1 - value)}
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
				text={`${props.info === "consumption"
							? "Cons."
							: props.info === "production"
							? "Production"
							: props.info === "maxConsumption"
							? "Max Cons."
							: "Max Prod."
					} : <font color="${
						props.info === "consumption"
							? "rgb(176,208,255)"
							: props.info === "production"
							? "rgb(173,173,137)"
							: props.info === "maxConsumption"
							? "rgb(255,255,255)"
							: "rgb(79,79,79)"
					}" weight="regular">${
						props.value
					} MW</font>`}
				textSize={12}
				textColor={colors.white}
				textTransparency={onMountAnimation.map((value) => 1 - value)}
				textXAlignment={Enum.TextXAlignment.Left}
				textYAlignment={Enum.TextYAlignment.Center}
			></Text>
		</Frame>
	);
}
