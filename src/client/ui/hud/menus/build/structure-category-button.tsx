import React, { useEffect } from "@rbxts/react";
import { useStore } from "client/hooks";
import { useSelector } from "@rbxts/react-reflex";
import { useMotion } from "client/hooks";
import { springs } from "client/constants/springs";
import { lerpBinding } from "@rbxts/pretty-react-hooks";
import { Button } from "client/ui/core/button";
import { Image } from "client/ui/core/image";
import { Text } from "client/ui/core/text";
import { fonts } from "client/constants/fonts";
import { STRUCTURE_CATEGORIES, StructureCategory } from "shared/constants/structures";
import { IMAGES } from "shared/assets/images";
import { colors } from "client/constants/colors";
import { selectBuildMenuStructureCategory } from "client/store/menus/build";

export interface StructureCategoryButtonProps {
	structureCategory: StructureCategory;
}

export function StructureCategoryButton(props: StructureCategoryButtonProps) {
	const store = useStore();
	const structureCategory = useSelector(selectBuildMenuStructureCategory);
	const [animation, animationMotion] = useMotion(0);
	useEffect(() => {
		animationMotion.spring(structureCategory === props.structureCategory ? 1 : 0, springs.slow);
	}, [structureCategory]);

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
				Color={lerpBinding(animation, colors.grey, colors.lightblue)}
				LineJoinMode={Enum.LineJoinMode.Miter}
			></uistroke>
			<Image
				anchorPoint={new Vector2(0.5, 0.5)}
				position={new UDim2(0.15, 0, 0.5, 0)}
				size={new UDim2(0.144, 0, 0.785, 0)}
				image={IMAGES.structuresCategories[props.structureCategory]}
				imageColor={lerpBinding(animation, colors.grey, colors.lightblue)}
			></Image>
			<Image
				anchorPoint={new Vector2(0.5, 0.5)}
				position={new UDim2(0.5, 0, 0.5, 0)}
				size={new UDim2(2, 0, 2, 0)}
				image="rbxassetid://137197581459632"
				imageColor={colors.lightblue}
				imageTransparency={lerpBinding(animation, 1, 0.81)}
			></Image>
			<Text
				anchorPoint={new Vector2(0.5, 0.5)}
				position={new UDim2(0.6, 0, 0.54, 0)}
				size={new UDim2(0.859, 0, 1, 0)}
				font={fonts.josefinSans.regular}
				textSize={13}
				textColor={lerpBinding(animation, colors.grey, colors.lightblue)}
				text={props.structureCategory}
			></Text>
		</Button>
	);
}
