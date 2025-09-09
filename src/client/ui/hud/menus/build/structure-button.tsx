import React from "@rbxts/react";
import { useStore } from "client/hooks";

import { Text } from "client/ui/core/text";
import { Image } from "client/ui/core/image";
import { fonts } from "client/constants/fonts";
import { StructureName, STRUCTURES } from "shared/constants/structures";
import { useSelector } from "@rbxts/react-reflex";
import { selectBuildMenuStructureCategory, selectBuildMenuStructureCategorySearchText } from "client/store/menus/build";
import { colors } from "client/constants/colors";
import { Button } from "client/ui/core/button";

export interface StructureButtonProps {
	structureName: StructureName;
}
export function StructureButton(props: StructureButtonProps) {
	const store = useStore();
	const structureCategorySearchText = useSelector(
		selectBuildMenuStructureCategorySearchText(STRUCTURES[props.structureName].category),
	);

	return (
		<Button
			onClick={() => {
				store.setBuildMenuStructureName(props.structureName);
			}}
			onDoubleClick={() => {
				store.setContextOpen(false);
				store.setBuildMenuBuildingStructureName(props.structureName);
			}}
			visible={
				string.find(
					string.lower(props.structureName),
					string.lower(structureCategorySearchText),
					1,
					true,
				)[0] !== undefined ||
				string.find(
					string.lower(STRUCTURES[props.structureName].subCategory),
					string.lower(structureCategorySearchText),
					1,
					true,
				)[0] !== undefined
			}
			layoutOrder={STRUCTURES[props.structureName].index}
		>
			<Image
				anchorPoint={new Vector2(0.5, 0.5)}
				position={new UDim2(0.5, 0, 0.4, 0)}
				size={new UDim2(0.8, 0, 0.8, 0)}
				image={STRUCTURES[props.structureName].image}
			></Image>
			<Text
				anchorPoint={new Vector2(0.5, 0.5)}
				position={new UDim2(0.5, 0, 0.85, 0)}
				size={new UDim2(1, 0, 0.18, 0)}
				font={fonts.josefinSans.regular}
				textSize={13}
				textColor={colors.white}
				text={props.structureName}
			></Text>
		</Button>
	);
}
