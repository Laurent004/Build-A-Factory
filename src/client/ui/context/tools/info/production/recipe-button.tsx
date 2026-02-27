import { lerpBinding, useMotion } from "@rbxts/pretty-react-hooks";
import React, { useEffect } from "@rbxts/react";
import { springs, colors } from "client/ui/constants";
import { ITEM_RECIPES, ITEMS } from "shared/constants/items";
import { IMAGES } from "shared/assets/images";
import { Button, Image, Text } from "client/ui/core";
import { Object } from "@rbxts/luau-polyfill";
import { Events } from "client/network";
import { useSelector } from "@rbxts/react-reflex";
import { selectContextStructureModels } from "client/hooks/store/context";

interface InfoPanelRecipeButtonProps {
	recipeName: string;
	index: number;
	isSelected: boolean;
}

export function InfoPanelRecipeButton({ recipeName, index, isSelected }: InfoPanelRecipeButtonProps) {
	const structuresModels = useSelector(selectContextStructureModels);
	const [clickAnimation, clickAnimationMotion] = useMotion(0);

	useEffect(() => {
		clickAnimationMotion.spring(isSelected ? 1 : 0, springs.gentle);
	}, [isSelected]);

	return (
		<Button
			LayoutOrder={index}
			ZIndex={isSelected ? 1 : 0}
			Event={{
				MouseButton1Click: () => {
					Events.SetStructuresAttribute(
						structuresModels.filter((structureModel) => structureModel.Name === structuresModels[0].Name),
						"Recipe",
						isSelected ? undefined : recipeName,
					);
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
				Position={UDim2.fromScale(0.5, 0.4)}
				Size={UDim2.fromScale(0.8, 0.8)}
				Image={ITEMS[Object.keys(ITEM_RECIPES[recipeName].outputItems)[0]].image}
			></Image>

			<Image
				AnchorPoint={new Vector2(0.5, 0.5)}
				Position={UDim2.fromScale(0.5, 0.5)}
				Size={UDim2.fromScale(1.5, 1.5)}
				Image={IMAGES.Glow}
				ImageColor3={colors.lightblue}
				ImageTransparency={lerpBinding(clickAnimation, 1, 0.8)}
			></Image>

			<Text
				AnchorPoint={new Vector2(0.5, 0.5)}
				Position={UDim2.fromScale(0.5, 0.85)}
				Size={UDim2.fromScale(0.85, 0.12)}
				Text={recipeName}
				TextColor3={lerpBinding(clickAnimation, colors.grey, colors.lightblue)}
				TextScaled={true}
			></Text>
		</Button>
	);
}
