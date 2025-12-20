import React from "@rbxts/react";
import { useSelector } from "@rbxts/react-reflex";
import { lerpBinding, useMotion, usePrevious, useUpdateEffect } from "@rbxts/pretty-react-hooks";
import { springs } from "client/ui/constants";
import { fonts } from "client/ui/constants";
import { STRUCTURES } from "shared/constants/structures";
import { selectContext, selectContextStructureModels } from "client/store/context";
import { Frame } from "../../../../core/frame";
import { Text } from "../../../../core/text";
import { Image } from "../../../../core/image";
import { colors } from "client/ui/constants";
import { IMAGES } from "shared/assets/images";
import { useRem } from "client/hooks/use-rem";

export interface BaseInfoPanelProps extends React.PropsWithChildren {
	active: boolean;
	size: UDim2;
	headerSize: UDim2;
	headerIconSize: UDim2;
	descriptionPosition: UDim2;
	descriptionSize: UDim2;
}

export function BaseInfoPanel(props: BaseInfoPanelProps) {
	const rem = useRem();
	const context = useSelector(selectContext);
	const structureModel = useSelector(selectContextStructureModels)[0];
	const previousStructureModel = usePrevious(structureModel);
	const [onMountAnimation, onMountAnimationMotion] = useMotion(0);

	useUpdateEffect(() => {
		if (
			context === "Info" &&
			structureModel !== undefined &&
			structureModel.Name !== previousStructureModel?.Name &&
			props.active
		) {
			onMountAnimationMotion.immediate(0);
		}
		onMountAnimationMotion.spring(
			context === "Info" && structureModel !== undefined && props.active ? 1 : 0,
			springs.gentle,
		);
	}, [props.active, structureModel]);

	return (
		<canvasgroup
			GroupTransparency={onMountAnimation.map((value) => 1 - value)}
			Active={context === "Info" && props.active}
			AnchorPoint={new Vector2(1, 1)}
			Position={new UDim2(0, rem(1899), 0, rem(1068))}
			Size={props.size}
			BackgroundColor3={colors.black}
			Interactable={context === "Info" && props.active}
		>
			<Frame
				anchorPoint={new Vector2(0.5, 0)}
				position={new UDim2(0.5, 0, 0, 0)}
				size={props.headerSize}
				backgroundTransparency={1}
			>
				<Image
					anchorPoint={new Vector2(0.5, 0.5)}
					position={lerpBinding(onMountAnimation, new UDim2(-0.386, 0, 0.95, 0), new UDim2(0.064, 0, 0.5, 0))}
					rotation={lerpBinding(onMountAnimation, -400, 0)}
					size={props.headerIconSize}
					image="rbxassetid://81869066413292"
					imageTransparency={onMountAnimation.map((value) => 1 - value)}
				></Image>

				<Text
					anchorPoint={new Vector2(0.5, 0.5)}
					position={lerpBinding(onMountAnimation, new UDim2(0.195, 0, 0.5, 0), new UDim2(0.545, 0, 0.5, 0))}
					size={new UDim2(0.84, 0, 0.56, 0)}
					font={fonts.josefinSans.medium}
					text={structureModel?.Name}
					textSize={19}
					textColor={colors.white}
					textTransparency={onMountAnimation.map((value) => 1 - value)}
					textTruncate={Enum.TextTruncate.SplitWord}
					textXAlignment={Enum.TextXAlignment.Left}
					textYAlignment={Enum.TextYAlignment.Center}
				></Text>

				<uistroke
					ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
					Color={colors.grey}
					LineJoinMode={Enum.LineJoinMode.Miter}
					Thickness={1}
				></uistroke>
			</Frame>

			{props.children}

			<Text
				anchorPoint={new Vector2(0.5, 0.5)}
				position={lerpBinding(
					onMountAnimation,
					new UDim2(props.descriptionPosition.X.Scale, 0, props.descriptionPosition.Y.Scale - 0.08, 0),
					props.descriptionPosition,
				)}
				size={props.descriptionSize}
				font={fonts.josefinSans.medium}
				lineHeight={1.4}
				text={structureModel !== undefined ? STRUCTURES[structureModel.Name].description : undefined}
				textSize={14}
				textColor={colors.white}
				textTransparency={onMountAnimation.map((value) => 1 - value)}
				textWrapped={true}
				textXAlignment={Enum.TextXAlignment.Left}
				textYAlignment={Enum.TextYAlignment.Top}
			></Text>
		</canvasgroup>
	);
}
