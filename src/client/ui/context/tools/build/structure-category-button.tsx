import React, { useEffect } from "@rbxts/react";
import { useStore } from "client/hooks";
import { springs } from "client/ui/constants";
import { useMotion, lerpBinding, useUpdateEffect } from "@rbxts/pretty-react-hooks";
import { Button } from "client/ui/core/button";
import { Image } from "client/ui/core/image";
import { Text } from "client/ui/core/text";
import { fonts, colors } from "client/ui/constants";
import { STRUCTURE_CATEGORIES, StructureCategory } from "shared/constants/structures";
import { IMAGES } from "shared/assets/images";
import { useSelector } from "@rbxts/react-reflex";
import { selectContext } from "client/store/context";
import { selectBuildMenuStructureCategory } from "client/store/context/build";

export interface StructureCategoryButtonProps {
	structureCategory: StructureCategory;
}

export function StructureCategoryButton(props: StructureCategoryButtonProps) {
	const store = useStore();

	const context = useSelector(selectContext);
	const selectedStructureCategory = useSelector(selectBuildMenuStructureCategory);

	const [onMountAnimation, onMountAnimationMotion] = useMotion(0);
	const [onClickAnimation, onClickAnimationMotion] = useMotion(0);

	useUpdateEffect(() => {
		if (context !== "Build") return;
		onMountAnimationMotion.immediate(0);
		task.delay((STRUCTURE_CATEGORIES.indexOf(props.structureCategory) + 1) * 0.025, () => {
			onMountAnimationMotion.spring(1, springs.gentle);
		});
	}, [context]);

	useEffect(() => {
		onClickAnimationMotion.spring(selectedStructureCategory === props.structureCategory ? 1 : 0, springs.slow);
	}, [selectedStructureCategory]);

	return (
		<Button
			onClick={() => {
				store.setBuildMenuStructureCategory(props.structureCategory);
			}}
			anchorPoint={new Vector2(0, 0.5)}
			position={new UDim2(0.25 * STRUCTURE_CATEGORIES.indexOf(props.structureCategory), 0, 0.5, 0)}
			size={new UDim2(0.25, 0, 1, 0)}
		>
			<uistroke
				ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
				Color={lerpBinding(onClickAnimation, colors.grey, colors.lightblue)}
				LineJoinMode={Enum.LineJoinMode.Miter}
			></uistroke>

			<Image
				anchorPoint={new Vector2(0.5, 0.5)}
				position={lerpBinding(
					onMountAnimation,
					new UDim2(0.15, 0, 0.5 - (STRUCTURE_CATEGORIES.indexOf(props.structureCategory) + 1) * 0.6, 0),
					new UDim2(0.15, 0, 0.5, 0),
				)}
				size={new UDim2(0.144, 0, 0.785, 0)}
				image={IMAGES.ui[props.structureCategory]}
				imageTransparency={onMountAnimation.map((value) => 1 - value)}
				imageColor={lerpBinding(onClickAnimation, colors.grey, colors.lightblue)}
			></Image>
			<Image
				anchorPoint={new Vector2(0.5, 0.5)}
				position={new UDim2(0.5, 0, 0.5, 0)}
				size={new UDim2(2, 0, 2, 0)}
				image={IMAGES.ui.Glow}
				imageColor={colors.lightblue}
				imageTransparency={lerpBinding(onClickAnimation, 1, 0.81)}
			></Image>
			<Text
				anchorPoint={new Vector2(0.5, 0.5)}
				position={lerpBinding(
					onMountAnimation,
					new UDim2(0.6, 0, 0.54 - (STRUCTURE_CATEGORIES.indexOf(props.structureCategory) + 1) * 0.6, 0),
					new UDim2(0.6, 0, 0.54, 0),
				)}
				size={new UDim2(0.859, 0, 1, 0)}
				font={fonts.josefinSans.regular}
				textSize={13}
				textTransparency={onMountAnimation.map((value) => 1 - value)}
				textColor={lerpBinding(onClickAnimation, colors.grey, colors.lightblue)}
				text={props.structureCategory}
			></Text>
		</Button>
	);
}
