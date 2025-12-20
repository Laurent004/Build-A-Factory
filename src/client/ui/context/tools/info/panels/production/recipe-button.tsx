import { lerpBinding, useMotion, usePrevious } from "@rbxts/pretty-react-hooks";
import React, { useEffect } from "@rbxts/react";
import { colors, fonts } from "client/ui/constants";
import { springs } from "client/ui/constants";
import { useStore } from "client/hooks";
import { Button } from "client/ui/core/button";
import { Frame } from "client/ui/core/frame";
import { Image } from "client/ui/core/image";
import { Text } from "client/ui/core/text";
import { ITEMS } from "shared/constants/items";
import { IMAGES } from "shared/assets/images";
import { useSelector } from "@rbxts/react-reflex";
import { selectContextStructureModelAttribute, selectContextStructureModels } from "client/store/context";

export interface InfoPanelRecipeButtonProps {
	index: number;
	recipeName: string;
}

export function InfoPanelRecipeButton(props: InfoPanelRecipeButtonProps) {
	const store = useStore();
	const structureModel = useSelector(selectContextStructureModels)[0];
	const previousStructureModel = usePrevious(structureModel);
	const recipe = useSelector(selectContextStructureModelAttribute("Recipe")) as string | undefined;
	const [onMountAnimation, onMountAnimationMotion] = useMotion(0);
	const [onHoverAnimation, onHoverAnimationMotion] = useMotion(0);
	const [onClickAnimation, onClickAnimationMotion] = useMotion(0);

	useEffect(() => {
		if (structureModel === undefined) {
			onMountAnimationMotion.spring(0, springs.gentle);
			return;
		} else if (structureModel.Name !== previousStructureModel?.Name) {
			onMountAnimationMotion.immediate(0);
		}
		task.delay((props.index + 1) * 0.005, () => {
			onMountAnimationMotion.spring(1, springs.gentle);
		});
	}, [structureModel]);

	useEffect(() => {
		onClickAnimationMotion.spring(recipe === props.recipeName ? 1 : 0, springs.gentle);
	}, [recipe]);

	return (
		<Button
			anchorPoint={new Vector2(0, 0)}
			position={new UDim2(0, 0, 0, 0)}
			size={new UDim2(0, 0, 0, 0)}
			layoutOrder={props.index}
			event={{
				MouseEnter: () => {
					onHoverAnimationMotion.spring(1, springs.responsive);
				},
				MouseLeave: () => {
					onHoverAnimationMotion.spring(0, springs.responsive);
				},
			}}
			onDoubleClick={() => {
				store.setContextStructuresModelsAttribute(
					"Recipe",
					recipe === props.recipeName ? undefined : props.recipeName,
				);
			}}
		>
			<Frame
				anchorPoint={new Vector2(0.5, 0.5)}
				position={lerpBinding(
					onMountAnimation,
					new UDim2(0.5, 0, 0.5 + (props.index + 1) * 0.35, 0),
					new UDim2(0.5, 0, 0.5, 0),
				)}
				size={new UDim2(1, 0, 1, 0)}
				backgroundTransparency={1}
			>
				<uistroke
					ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
					Color={lerpBinding(onClickAnimation, colors.grey, colors.lightblue)}
					LineJoinMode={Enum.LineJoinMode.Miter}
					Thickness={1}
				></uistroke>

				<Image
					anchorPoint={new Vector2(0.5, 0.5)}
					position={lerpBinding(
						onMountAnimation,
						new UDim2(0.5, 0, 0.4 - (props.index + 1) * 0.55, 0),
						new UDim2(0.5, 0, 0.4, 0),
					)}
					size={lerpBinding(onHoverAnimation, new UDim2(0.8, 0, 0.8, 0), new UDim2(0.92, 0, 0.92, 0))}
					image={ITEMS[props.recipeName].image}
					imageTransparency={onMountAnimation.map((value) => 1 - value)}
				></Image>

				<Image
					anchorPoint={new Vector2(0.5, 0.5)}
					position={new UDim2(0.5, 0, 0.5, 0)}
					size={new UDim2(1.5, 0, 1.5, 0)}
					image={IMAGES.ui.Glow}
					imageColor={colors.lightblue}
					imageTransparency={lerpBinding(onClickAnimation, 1, 0.7)}
				></Image>

				<Text
					anchorPoint={new Vector2(0.5, 0.5)}
					position={new UDim2(0.5, 0, 0.85, 0)}
					size={new UDim2(0.9, 0, 0.146, 0)}
					font={fonts.josefinSans.regular}
					text={props.recipeName}
					textSize={9}
					textColor={lerpBinding(onClickAnimation, colors.grey, colors.lightblue)}
					textXAlignment={Enum.TextXAlignment.Center}
					textYAlignment={Enum.TextYAlignment.Center}
				></Text>
			</Frame>
		</Button>
	);
}
