import React, { useEffect } from "@rbxts/react";
import { useStore } from "client/hooks";
import { springs } from "client/ui/constants";
import { useMotion, lerpBinding } from "@rbxts/pretty-react-hooks";
import { Button } from "client/ui/core/button";
import { Image } from "client/ui/core/image";
import { Text } from "client/ui/core/text";
import { fonts, colors } from "client/ui/constants";
import { StructureCategory } from "shared/constants/structures";
import { IMAGES } from "shared/assets/images";
import { useSelector } from "@rbxts/react-reflex";
import { selectBuildMenuStructureCategory } from "client/store/context/build";

export interface BuildMenuStructureCategoryButtonProps {
	structureCategory: StructureCategory;
}

export function BuildMenuStructureCategoryButton(props: BuildMenuStructureCategoryButtonProps) {
	const store = useStore();
	const structureCategory = useSelector(selectBuildMenuStructureCategory);
	const [onClickAnimation, onClickAnimationMotion] = useMotion(0);

	useEffect(() => {
		onClickAnimationMotion.spring(structureCategory === props.structureCategory ? 1 : 0, springs.slow);
	}, [structureCategory]);

	return (
		<Button
			anchorPoint={new Vector2(0, 0)}
			position={new UDim2(0, 0, 0, 0)}
			size={new UDim2(0.25, 0, 1, 0)}
			onClick={() => {
				store.setBuildMenuStructureCategory(props.structureCategory);
			}}
		>
			<uistroke
				ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
				Color={lerpBinding(onClickAnimation, colors.grey, colors.lightblue)}
				LineJoinMode={Enum.LineJoinMode.Miter}
				Thickness={1}
			></uistroke>
			<Image
				anchorPoint={new Vector2(0.5, 0.5)}
				position={new UDim2(0.15, 0, 0.5, 0)}
				size={new UDim2(0.144, 0, 0.785, 0)}
				image={IMAGES.ui[props.structureCategory]}
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
				position={new UDim2(0.6, 0, 0.54, 0)}
				size={new UDim2(0.859, 0, 1, 0)}
				font={fonts.josefinSans.regular}
				text={props.structureCategory}
				textSize={13}
				textColor={lerpBinding(onClickAnimation, colors.grey, colors.lightblue)}
				textXAlignment={Enum.TextXAlignment.Center}
				textYAlignment={Enum.TextYAlignment.Center}
			></Text>
		</Button>
	);
}
