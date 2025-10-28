import React from "@rbxts/react";
import { useSelector } from "@rbxts/react-reflex";
import {
	lerpBinding,
	useBindingState,
	useEventListener,
	useMotion,
	usePrevious,
	useUpdateEffect,
} from "@rbxts/pretty-react-hooks";
import { useStore } from "client/hooks";
import { springs } from "client/ui/constants";
import { fonts } from "client/ui/constants";
import { STRUCTURES } from "shared/constants/structures";
import { selectContext } from "client/store/context";
import { Frame } from "../../../core/frame";
import { Text } from "../../../core/text";
import { Image } from "../../../core/image";
import { colors } from "client/ui/constants";
import { EventBus } from "client/event-bus";
import { IMAGES } from "shared/assets/images";
import { selectInfoSelectionStructureModel } from "client/store/context/info";
import { useRem } from "client/hooks/use-rem";

export interface BaseInfoPanelProps extends React.PropsWithChildren {
	size: UDim2;
	headerSize: UDim2;
	headerIconSize: UDim2;
	descriptionPosition: UDim2;
	descriptionSize: UDim2;
	structuresNames: string[];
}

export function BaseInfoPanel(props: BaseInfoPanelProps) {
	const store = useStore();
	const rem = useRem();

	const context = useSelector(selectContext);
	const structureModel = useSelector(selectInfoSelectionStructureModel);
	const previousStructureModel = usePrevious(structureModel);

	const [onMountAnimation, onMountAnimationMotion] = useMotion(0);

	useUpdateEffect(() => {
		if (context !== "Info") {
			store.setInfoSelection(undefined);
			onMountAnimationMotion.spring(0, springs.responsive);
		}
	}, [context]);

	useEventListener(EventBus.ToolEvents.Info.OnSelection, (selection) => {
		store.setInfoSelection(selection);
		if (
			selection === undefined ||
			selection
				.GetChildren()
				.filter((instance): instance is Model => instance.IsA("Model") && instance.Name in STRUCTURES)
				.size() === 0
		) {
			onMountAnimationMotion.spring(0, springs.responsive);
		}
	});

	useUpdateEffect(() => {
		if (structureModel === undefined || structureModel === previousStructureModel) return;
		if (structureModel.Name !== previousStructureModel?.Name) {
			onMountAnimationMotion.immediate(0);
		}
		onMountAnimationMotion.spring(props.structuresNames.includes(structureModel.Name) ? 1 : 0, springs.gentle);
	}, [structureModel]);

	return (
		<canvasgroup
			AnchorPoint={new Vector2(1, 1)}
			Position={new UDim2(0, rem(1899), 0, rem(1068))}
			Size={props.size}
			BackgroundColor3={colors.black}
			GroupTransparency={onMountAnimation.map((value) => 1 - value)}
			Active={true}
			Interactable={
				context === "Info" &&
				structureModel !== undefined &&
				props.structuresNames.includes(structureModel.Name)
			}
			ZIndex={2}
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
					image={IMAGES.ui.PencilSquare}
					imageTransparency={onMountAnimation.map((value) => 1 - value)}
				></Image>

				<Text
					anchorPoint={new Vector2(0.5, 0.5)}
					position={lerpBinding(onMountAnimation, new UDim2(0.195, 0, 0.5, 0), new UDim2(0.545, 0, 0.5, 0))}
					size={new UDim2(0.84, 0, 0.56, 0)}
					font={fonts.josefinSans.medium}
					textSize={19}
					textColor={colors.white}
					text={structureModel?.Name}
					textTransparency={onMountAnimation.map((value) => 1 - value)}
					textXAlignment={Enum.TextXAlignment.Left}
					textYAlignment={Enum.TextYAlignment.Center}
				></Text>

				<uistroke
					ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
					Color={colors.grey}
					LineJoinMode={Enum.LineJoinMode.Miter}
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
				textTransparency={onMountAnimation.map((value) => 1 - value)}
				textColor={colors.white}
				textWrapped={true}
				textXAlignment={Enum.TextXAlignment.Left}
				textYAlignment={Enum.TextYAlignment.Top}
			></Text>
		</canvasgroup>
	);
}
