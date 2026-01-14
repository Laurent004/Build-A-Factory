import React, { useEffect } from "@rbxts/react";
import { useStore } from "client/hooks";
import { springs } from "client/ui/constants";
import { useMotion, lerpBinding } from "@rbxts/pretty-react-hooks";
import { colors } from "client/ui/constants";
import { IMAGES } from "shared/assets/images";
import { STRUCTURE_CATEGORIES } from "shared/constants/structures";
import { Button, Image, Text } from "client/ui/core";

interface BuildMenuStructureCategoryButtonProps {
	structureCategory: string;
	isSelected: boolean;
}

export function BuildMenuStructureCategoryButton({
	structureCategory,
	isSelected,
}: BuildMenuStructureCategoryButtonProps) {
	const store = useStore();
	const [clickAnimation, clickAnimationMotion] = useMotion(0);

	useEffect(() => {
		clickAnimationMotion.spring(isSelected ? 1 : 0, springs.slow);
	}, [isSelected]);

	return (
		<Button
			Size={UDim2.fromScale(0.25, 1)}
			LayoutOrder={STRUCTURE_CATEGORIES.indexOf(structureCategory)}
			ZIndex={isSelected ? 1 : 0}
			Event={{
				MouseButton1Click: () => {
					store.seStructureCategory(structureCategory);
				},
			}}
		>
			<uistroke
				ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
				BorderStrokePosition={Enum.BorderStrokePosition.Center}
				Color={lerpBinding(clickAnimation, colors.grey, colors.lightblue)}
				LineJoinMode={Enum.LineJoinMode.Miter}
			></uistroke>

			<Image
				AnchorPoint={new Vector2(0.5, 0.5)}
				Position={UDim2.fromScale(0.15, 0.5)}
				Size={UDim2.fromScale(0.168, 0.785)}
				Image={IMAGES.ui[structureCategory]}
				ImageColor3={lerpBinding(clickAnimation, colors.grey, colors.lightblue)}
			></Image>

			<Text
				AnchorPoint={new Vector2(0.5, 0.5)}
				Position={UDim2.fromScale(0.6, 0.5)}
				Size={UDim2.fromScale(0.31, 0.42)}
				Text={structureCategory}
				TextSize={13}
				TextColor3={lerpBinding(clickAnimation, colors.grey, colors.lightblue)}
			></Text>

			<Image
				AnchorPoint={new Vector2(0.5, 0.5)}
				Position={UDim2.fromScale(0.5, 0.5)}
				Size={UDim2.fromScale(2, 2)}
				Image={IMAGES.ui.Glow}
				ImageColor3={colors.lightblue}
				ImageTransparency={lerpBinding(clickAnimation, 1, 0.81)}
			></Image>
		</Button>
	);
}
