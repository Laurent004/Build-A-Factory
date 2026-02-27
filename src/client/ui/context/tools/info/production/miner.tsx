import React, { useBinding, useRef } from "@rbxts/react";
import { fonts, colors } from "client/ui/constants";
import { ITEM_RECIPES, ITEMS } from "shared/constants/items";
import { useSelector } from "@rbxts/react-reflex";
import { useUpdateEffect } from "@rbxts/pretty-react-hooks";
import { RunService } from "@rbxts/services";
import MinerComponent from "client/components/production/miner";
import { IMAGES } from "shared/assets/images";
import { InfoPanelRecipeButton } from "./recipe-button";
import { Object } from "@rbxts/luau-polyfill";
import { BaseInfoPanel } from "../base";
import { selectContextStructureAttribute, selectContextStructureComponents } from "client/store/context";
import { Frame, Image, Text } from "client/ui/core";
import { STRUCTURES } from "shared/constants/structures";

export function MinerInfoPanel() {
	const minerComponent = useSelector(selectContextStructureComponents(MinerComponent))[0];
	const recipe = useSelector(selectContextStructureAttribute("Recipe")) as string | undefined;
	const [miningProgress, setMiningProgress] = useBinding<number>(0);
	const connectionRef = useRef<RBXScriptConnection>();

	useUpdateEffect(() => {
		connectionRef.current?.Disconnect();
		connectionRef.current = undefined;
		if (minerComponent === undefined) return;
		connectionRef.current = RunService.Heartbeat.Connect(() => {
			setMiningProgress(minerComponent.getMiningProgress());
		});
	}, [minerComponent]);

	return (
		<BaseInfoPanel active={minerComponent !== undefined} size={UDim2.fromScale(0.183, 0.514)}>
			<Frame Size={UDim2.fromScale(1, 0.44)} BackgroundTransparency={1} LayoutOrder={1}>
				<Text
					Size={UDim2.fromScale(0.5, 0.085)}
					FontFace={fonts.josefinSans.medium}
					Text={"Selected Recipe :"}
					TextSize={19}
					TextXAlignment={Enum.TextXAlignment.Left}
					TextYAlignment={Enum.TextYAlignment.Top}
				></Text>

				<Image
					AnchorPoint={new Vector2(0.5, 0.5)}
					Position={UDim2.fromScale(0.141, 0.403)}
					Size={UDim2.fromScale(0.276, 0.408)}
					Image={
						recipe !== undefined ? ITEMS[Object.keys(ITEM_RECIPES[recipe].outputItems)[0]].image : undefined
					}
				></Image>

				<Text
					AnchorPoint={new Vector2(0.5, 0.5)}
					Position={UDim2.fromScale(0.655, 0.28)}
					Size={UDim2.fromScale(0.648, 0.077)}
					Text={recipe}
					TextSize={21}
					TextXAlignment={Enum.TextXAlignment.Left}
				></Text>

				<Text
					AnchorPoint={new Vector2(0.5, 0.5)}
					Position={UDim2.fromScale(0.66, 0.41)}
					Size={UDim2.fromScale(0.657, 0.08)}
					FontFace={fonts.josefinSans.light}
					RichText={true}
					Text={`<font weight="regular" color="rgb(176,208,255)">${
						recipe !== undefined
							? math.floor(60 / ITEM_RECIPES[recipe].time) *
							  ITEM_RECIPES[recipe].outputItems[Object.keys(ITEM_RECIPES[recipe].outputItems)[0]]
							: 0
					}</font> per minute`}
					TextSize={15}
					TextXAlignment={Enum.TextXAlignment.Left}
				>
					<Image
						AnchorPoint={new Vector2(0.5, 0.5)}
						Position={UDim2.fromScale(0.062, 0.5)}
						Size={UDim2.fromScale(0.2, 1.6)}
						Image={IMAGES.Glow}
						ImageColor3={colors.lightblue}
						ImageTransparency={0.8}
					></Image>
				</Text>

				<Frame
					AnchorPoint={new Vector2(0.5, 0.5)}
					Position={UDim2.fromScale(0.655, 0.51)}
					Size={UDim2.fromScale(0.647, 0.036)}
					BackgroundColor3={Color3.fromRGB(32, 32, 32)}
				>
					<Frame
						AnchorPoint={new Vector2(0, 0.5)}
						Position={UDim2.fromScale(0, 0.5)}
						Size={miningProgress.map((value) => UDim2.fromScale(value, 0.6))}
						BackgroundColor3={colors.lightblue}
					>
						<Image
							AnchorPoint={new Vector2(0.5, 0.5)}
							Position={UDim2.fromScale(0.5, 0.5)}
							Size={UDim2.fromScale(1.06, 3.306)}
							Image={IMAGES.Glow}
							ImageColor3={colors.lightblue}
							ImageTransparency={0.7}
						></Image>
					</Frame>
				</Frame>

				<Frame
					AnchorPoint={new Vector2(0, 1)}
					Position={UDim2.fromScale(0, 1)}
					Size={UDim2.fromScale(1, 0.317)}
					BackgroundTransparency={1}
				>
					<uilistlayout
						FillDirection={Enum.FillDirection.Horizontal}
						SortOrder={Enum.SortOrder.LayoutOrder}
					></uilistlayout>

					<Frame Size={UDim2.fromScale(0.5, 0.5)} BackgroundTransparency={1} LayoutOrder={0}>
						<Image
							AnchorPoint={new Vector2(0, 0.5)}
							Position={UDim2.fromScale(0, 0.5)}
							Size={UDim2.fromScale(0.145, 0.7)}
							Image="rbxassetid://102476478936490"
						></Image>

						<Text
							Size={UDim2.fromScale(1, 1)}
							Text={`Value : $${
								recipe !== undefined
									? Object.entries(ITEM_RECIPES[recipe].outputItems).reduce(
											(value, [itemName, count]) => (value += ITEMS[itemName].value.cash * count),
											0,
									  )
									: 0
							}`}
							TextSize={14}
							TextXAlignment={Enum.TextXAlignment.Left}
						>
							<uipadding PaddingLeft={new UDim(0, 34)}></uipadding>
						</Text>
					</Frame>

					<Frame Size={UDim2.fromScale(0.5, 0.5)} BackgroundTransparency={1} LayoutOrder={1}>
						<Image
							AnchorPoint={new Vector2(0, 0.5)}
							Position={UDim2.fromScale(0, 0.5)}
							Size={UDim2.fromScale(0.145, 0.7)}
							Image="rbxassetid://102476478936490"
						></Image>

						<Text
							Size={UDim2.fromScale(1, 1)}
							Text={`Time : ${recipe !== undefined ? ITEM_RECIPES[recipe].time : 0}s`}
							TextSize={14}
							TextXAlignment={Enum.TextXAlignment.Left}
						>
							<uipadding PaddingLeft={new UDim(0, 34)}></uipadding>
						</Text>
					</Frame>

					<Frame Size={UDim2.fromScale(0.5, 0.5)} BackgroundTransparency={1} LayoutOrder={2}>
						<Image
							AnchorPoint={new Vector2(0, 0.5)}
							Position={UDim2.fromScale(0, 0.5)}
							Size={UDim2.fromScale(0.145, 0.7)}
							Image="rbxassetid://136540953943718"
						></Image>

						<Text
							Size={UDim2.fromScale(1, 1)}
							Text={`Cons. : ${STRUCTURES["Miner"].constants["PowerConsumption"]} MW`}
							TextSize={14}
							TextXAlignment={Enum.TextXAlignment.Left}
						>
							<uipadding PaddingLeft={new UDim(0, 34)}></uipadding>
						</Text>
					</Frame>

					<Frame Size={UDim2.fromScale(0.5, 0.5)} BackgroundTransparency={1} LayoutOrder={3}>
						<Image
							AnchorPoint={new Vector2(0, 0.5)}
							Position={UDim2.fromScale(0, 0.5)}
							Size={UDim2.fromScale(0.145, 0.7)}
							Image="rbxassetid://136540953943718"
						></Image>

						<Text
							Size={UDim2.fromScale(1, 1)}
							Text={`Efficiency : 100%`}
							TextSize={14}
							TextXAlignment={Enum.TextXAlignment.Left}
						>
							<uipadding PaddingLeft={new UDim(0, 34)}></uipadding>
						</Text>
					</Frame>
				</Frame>
			</Frame>

			<Frame Size={UDim2.fromScale(1, 0.41)} BackgroundTransparency={1} LayoutOrder={2}>
				<Text
					Size={UDim2.fromScale(0.28, 0.1)}
					FontFace={fonts.josefinSans.medium}
					Text={"Recipes :"}
					TextSize={20}
					TextXAlignment={Enum.TextXAlignment.Left}
					TextYAlignment={Enum.TextYAlignment.Top}
				></Text>

				<Frame
					AnchorPoint={new Vector2(0, 1)}
					Position={UDim2.fromScale(0, 1)}
					Size={UDim2.fromScale(1, 0.8)}
					BackgroundTransparency={1}
				>
					<uigridlayout
						CellPadding={UDim2.fromScale(0, 0)}
						CellSize={UDim2.fromOffset(80, 80)}
						SortOrder={Enum.SortOrder.LayoutOrder}
					></uigridlayout>

					{Object.entries(ITEM_RECIPES)
						.filter(([, recipeDefinition]) => recipeDefinition.structureName === "Miner")
						.sort(
							([, recipeDefinitionA], [, recipeDefinitionB]) =>
								recipeDefinitionA.index < recipeDefinitionB.index,
						)
						.map(([recipeName], index) => {
							return (
								<InfoPanelRecipeButton
									recipeName={recipeName}
									index={index}
									isSelected={recipe === recipeName}
								></InfoPanelRecipeButton>
							);
						})}
				</Frame>
			</Frame>
		</BaseInfoPanel>
	);
}
