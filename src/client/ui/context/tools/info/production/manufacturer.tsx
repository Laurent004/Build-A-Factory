import React, { useBinding, useRef } from "@rbxts/react";
import { fonts, colors } from "client/ui/constants";
import { Object } from "@rbxts/luau-polyfill";
import { ITEM_RECIPES, ITEMS } from "shared/constants/items";
import { useSelector } from "@rbxts/react-reflex";
import { useUpdateEffect } from "@rbxts/pretty-react-hooks";
import { RunService } from "@rbxts/services";
import { InfoPanelRecipeButton } from "./recipe-button";
import { IMAGES } from "shared/assets/images";
import { BaseInfoPanel } from "../base";
import ManufacturerComponent from "client/components/production/manufacturer";
import { selectContextStructureAttribute, selectContextStructureComponents } from "client/store/context";
import { Frame, Image, ScrollingFrame, Text } from "client/ui/core";
import { STRUCTURES } from "shared/constants/structures";
import { useStore } from "client/hooks";
import { round } from "shared/utils/math";

export function ManufacturerInfoPanel() {
	const store = useStore();
	const manufacturerComponent = useSelector(selectContextStructureComponents(ManufacturerComponent))[0];
	const recipe = useSelector(selectContextStructureAttribute("Recipe")) as string | undefined;
	const [data, setData] = useBinding<{
		productionProgress: number;
		items: Record<string, number>;
	}>({
		productionProgress: 0,
		items: {},
	});
	const connectionRef = useRef<RBXScriptConnection>();

	useUpdateEffect(() => {
		connectionRef.current?.Disconnect();
		connectionRef.current = undefined;
		if (manufacturerComponent === undefined) return;
		connectionRef.current = RunService.Heartbeat.Connect(() => {
			const items: Record<string, number> = {};
			for (const solid of manufacturerComponent.getSolids()) {
				items[solid.name] = (items[solid.name] ?? 0) + 1;
			}
			for (const [fluid, volume] of manufacturerComponent.getFluids()) {
				items[fluid] = volume;
			}
			setData({
				productionProgress: manufacturerComponent.getProductionProgress(),
				items: items,
			});
		});
	}, [manufacturerComponent]);

	return (
		<BaseInfoPanel active={manufacturerComponent !== undefined} size={UDim2.fromScale(0.212, 0.621)}>
			<Frame Size={UDim2.fromScale(1, 0.365)} BackgroundTransparency={1} LayoutOrder={1}>
				<Text
					Size={UDim2.fromScale(0.425, 0.085)}
					FontFace={fonts.josefinSans.medium}
					Text={"Selected Recipe :"}
					TextSize={19}
					TextXAlignment={Enum.TextXAlignment.Left}
					TextYAlignment={Enum.TextYAlignment.Top}
				></Text>

				<Image
					AnchorPoint={new Vector2(0.5, 0.5)}
					Position={UDim2.fromScale(0.127, 0.403)}
					Size={UDim2.fromScale(0.249, 0.426)}
					Image={
						recipe !== undefined ? ITEMS[Object.keys(ITEM_RECIPES[recipe].outputItems)[0]].image : undefined
					}
				></Image>

				<Text
					AnchorPoint={new Vector2(0.5, 0.5)}
					Position={UDim2.fromScale(0.631, 0.28)}
					Size={UDim2.fromScale(0.648, 0.0777)}
					Text={recipe}
					TextSize={21}
					TextXAlignment={Enum.TextXAlignment.Left}
				></Text>

				<Text
					AnchorPoint={new Vector2(0.5, 0.5)}
					Position={UDim2.fromScale(0.636, 0.41)}
					Size={UDim2.fromScale(0.657, 0.08)}
					FontFace={fonts.josefinSans.light}
					RichText={true}
					Text={`<font weight="regular" color="rgb(176,208,255)">${
						recipe !== undefined
							? math.floor(60 / ITEM_RECIPES[recipe].time) *
							  ITEM_RECIPES[recipe].outputItems[Object.keys(ITEM_RECIPES[recipe].outputItems)[0]]
							: 0
					}${recipe !== undefined ? (ITEMS[recipe].model !== undefined ? "" : "m³") : ""}</font> per minute`}
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
					Position={UDim2.fromScale(0.631, 0.51)}
					Size={UDim2.fromScale(0.647, 0.036)}
					BackgroundColor3={Color3.fromRGB(32, 32, 32)}
				>
					<Frame
						AnchorPoint={new Vector2(0, 0.5)}
						Position={UDim2.fromScale(0, 0.5)}
						Size={data.map((value) => UDim2.fromScale(value.productionProgress, 0.6))}
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
							Text={`Cons. : ${
								manufacturerComponent !== undefined
									? STRUCTURES[manufacturerComponent.instance.Name].constants["PowerConsumption"]
									: 0
							} MW`}
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

			<Frame Size={UDim2.fromScale(1, 0.346)} BackgroundTransparency={1} LayoutOrder={2}>
				<Text
					Size={UDim2.fromScale(0.235, 0.1)}
					FontFace={fonts.josefinSans.medium}
					Text={"Recipes :"}
					TextSize={20}
					TextXAlignment={Enum.TextXAlignment.Left}
					TextYAlignment={Enum.TextYAlignment.Top}
				></Text>

				<ScrollingFrame
					AnchorPoint={new Vector2(0.5, 0.5)}
					Position={UDim2.fromScale(0.5, 0.77)}
					Size={UDim2.fromScale(1, 1.255)}
				>
					<uigridlayout
						CellPadding={UDim2.fromScale(0, 0)}
						CellSize={UDim2.fromOffset(75, 75)}
						SortOrder={Enum.SortOrder.LayoutOrder}
					></uigridlayout>

					<uipadding
						PaddingTop={new UDim(0, 1)}
						PaddingLeft={new UDim(0, 1)}
						PaddingBottom={new UDim(0, 1)}
					></uipadding>

					{manufacturerComponent !== undefined
						? Object.entries(ITEM_RECIPES)
								.filter(
									([, recipeDefinition]) =>
										recipeDefinition.structureName === manufacturerComponent.instance.Name,
								)
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
								})
						: undefined}
				</ScrollingFrame>
			</Frame>

			<Frame Size={UDim2.fromScale(1, 0.128)} BackgroundTransparency={1} LayoutOrder={3}>
				<Frame Size={UDim2.fromScale(0.5, 1)} BackgroundTransparency={1}>
					<Text
						Size={UDim2.fromScale(0.4, 0.28)}
						FontFace={fonts.josefinSans.medium}
						Text={"Inputs :"}
						TextSize={20}
						TextXAlignment={Enum.TextXAlignment.Left}
						TextYAlignment={Enum.TextYAlignment.Top}
					></Text>

					<Frame Position={UDim2.fromScale(0, 0.4)} Size={UDim2.fromScale(1, 0.6)} BackgroundTransparency={1}>
						<uilistlayout
							Padding={new UDim(0, 15)}
							FillDirection={Enum.FillDirection.Horizontal}
							SortOrder={Enum.SortOrder.LayoutOrder}
							VerticalAlignment={Enum.VerticalAlignment.Center}
						></uilistlayout>

						{recipe !== undefined
							? Object.entries(ITEM_RECIPES[recipe].inputItems)
									.sort(([itemNameA], [itemNameB]) => ITEMS[itemNameA].index < ITEMS[itemNameB].index)
									.map(([itemName, count]) => (
										<Frame
											Size={UDim2.fromScale(0.16, 0.67)}
											BackgroundColor3={Color3.fromRGB(32, 32, 32)}
											Event={{
												MouseEnter: () => {
													store.setTips([
														itemName,
														`<font weight="regular" color="rgb(176,208,255)">${
															math.floor(60 / ITEM_RECIPES[recipe].time) * count
														}</font> per minute`,
													]);
												},
												MouseLeave: () => {
													store.setTips([]);
												},
											}}
										>
											<Image
												AnchorPoint={new Vector2(0.5, 0.5)}
												Position={UDim2.fromScale(0.5, 0.5)}
												Size={UDim2.fromScale(0.7, 0.7)}
												Image={ITEMS[itemName].image}
											></Image>

											<Text
												Position={UDim2.fromScale(0.17, 0.7)}
												Size={UDim2.fromScale(1.3, 0.6)}
												Text={data.map((value) => `${value.items[itemName] ?? 0}/${count}`)}
												TextSize={14}
												TextXAlignment={Enum.TextXAlignment.Right}
											></Text>
										</Frame>
									))
							: undefined}
					</Frame>
				</Frame>

				<Frame Position={UDim2.fromScale(0.5, 0)} Size={UDim2.fromScale(0.5, 1)} BackgroundTransparency={1}>
					<Text
						Size={UDim2.fromScale(0.51, 0.28)}
						FontFace={fonts.josefinSans.medium}
						Text={"Outputs :"}
						TextSize={20}
						TextXAlignment={Enum.TextXAlignment.Left}
						TextYAlignment={Enum.TextYAlignment.Top}
					></Text>

					<Frame Position={UDim2.fromScale(0, 0.4)} Size={UDim2.fromScale(1, 0.6)} BackgroundTransparency={1}>
						<uilistlayout
							Padding={new UDim(0, 15)}
							FillDirection={Enum.FillDirection.Horizontal}
							SortOrder={Enum.SortOrder.LayoutOrder}
							VerticalAlignment={Enum.VerticalAlignment.Center}
						></uilistlayout>

						{recipe !== undefined
							? Object.entries(ITEM_RECIPES[recipe].outputItems)
									.sort(([itemNameA], [itemNameB]) => ITEMS[itemNameA].index < ITEMS[itemNameB].index)
									.map(([itemName, count]) => (
										<Frame
											Size={UDim2.fromScale(0.16, 0.67)}
											BackgroundColor3={Color3.fromRGB(32, 32, 32)}
											Event={{
												MouseEnter: () => {
													store.setTips([
														itemName,
														`<font weight="regular" color="rgb(176,208,255)">${
															math.floor(60 / ITEM_RECIPES[recipe].time) * count
														}</font> per minute`,
													]);
												},
												MouseLeave: () => {
													store.setTips([]);
												},
											}}
										>
											<Image
												AnchorPoint={new Vector2(0.5, 0.5)}
												Position={UDim2.fromScale(0.5, 0.5)}
												Size={UDim2.fromScale(0.7, 0.7)}
												Image={ITEMS[itemName].image}
											></Image>

											<Text
												Position={UDim2.fromScale(0.17, 0.7)}
												Size={UDim2.fromScale(1.3, 0.6)}
												Text={data.map(
													(value) => `${round(value.items[itemName] ?? 0, 2)}/${count}`,
												)}
												TextSize={14}
												TextXAlignment={Enum.TextXAlignment.Right}
											></Text>
										</Frame>
									))
							: undefined}
					</Frame>
				</Frame>
			</Frame>
		</BaseInfoPanel>
	);
}
