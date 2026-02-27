import React, { useBinding, useMemo, useRef } from "@rbxts/react";
import { BaseInfoPanel } from "../base";
import FluidExtractorComponent from "client/components/production/fluid-extractor";
import { useUpdateEffect } from "@rbxts/pretty-react-hooks";
import { colors, fonts } from "client/ui/constants";
import { ITEM_RECIPES, ITEMS } from "shared/constants/items";
import { IMAGES } from "shared/assets/images";
import { RunService } from "@rbxts/services";
import { useSelector } from "@rbxts/react-reflex";
import { selectContextStructureComponents } from "client/store/context";
import { Frame, Image, Text } from "client/ui/core";
import { Object } from "@rbxts/luau-polyfill";
import { STRUCTURES } from "shared/constants/structures";
import { InfoPanelFluidIndicator } from "../components";
import { round } from "shared/utils/math";

export function FluidExtractorInfoPanel() {
	const fluidExtractorComponent = useSelector(selectContextStructureComponents(FluidExtractorComponent))[0];
	const recipe = useMemo<string | undefined>(() => {
		return Object.entries(ITEM_RECIPES).find(
			([, itemRecipeDefinition]) => itemRecipeDefinition.structureName === fluidExtractorComponent?.instance.Name,
		)?.[0];
	}, [fluidExtractorComponent]);
	const [data, setData] = useBinding<{
		extractionProgress: number;
		volume: number;
	}>({ extractionProgress: 0, volume: 0 });
	const connectionRef = useRef<RBXScriptConnection>();

	useUpdateEffect(() => {
		connectionRef.current?.Disconnect();
		connectionRef.current = undefined;
		if (fluidExtractorComponent === undefined) return;
		connectionRef.current = RunService.Heartbeat.Connect(() => {
			setData({
				extractionProgress: fluidExtractorComponent.getExtractionProgress(),
				volume: fluidExtractorComponent.getFluids().get(Object.keys(ITEM_RECIPES[recipe!].outputItems)[0]) ?? 0,
			});
		});
	}, [fluidExtractorComponent]);

	return (
		<BaseInfoPanel active={fluidExtractorComponent !== undefined} size={UDim2.fromScale(0.183, 0.514)}>
			<Frame Size={UDim2.fromScale(1, 0.44)} BackgroundTransparency={1} LayoutOrder={1}>
				<Text
					Size={UDim2.fromScale(0.232, 0.085)}
					FontFace={fonts.josefinSans.medium}
					Text={"Recipe :"}
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
					}m³</font> per minute`}
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
						Size={data.map((value) => UDim2.fromScale(value.extractionProgress, 0.6))}
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
								fluidExtractorComponent !== undefined
									? STRUCTURES[fluidExtractorComponent.instance.Name].constants["PowerConsumption"]
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

			<Frame Size={UDim2.fromScale(1, 0.415)} BackgroundTransparency={1} LayoutOrder={2}>
				<Text
					Size={UDim2.fromScale(0.231, 0.1)}
					FontFace={fonts.josefinSans.medium}
					Text="Buffer :"
					TextSize={20}
					TextXAlignment={Enum.TextXAlignment.Left}
					TextYAlignment={Enum.TextYAlignment.Top}
				></Text>

				<Frame Position={UDim2.fromScale(0, 0.16)} Size={UDim2.fromScale(1, 0.84)} BackgroundTransparency={1}>
					<InfoPanelFluidIndicator
						fluid={data.map((value) =>
							fluidExtractorComponent !== undefined
								? [Object.keys(ITEM_RECIPES[recipe!].outputItems)[0], value.volume]
								: undefined,
						)}
					></InfoPanelFluidIndicator>

					<Frame
						AnchorPoint={new Vector2(0.5, 0.5)}
						Position={UDim2.fromScale(0.705, 0.23)}
						Size={UDim2.fromScale(0.139, 0.271)}
						BackgroundColor3={Color3.fromRGB(32, 32, 32)}
					>
						<uicorner CornerRadius={new UDim(0, 4)}></uicorner>

						<Image
							AnchorPoint={new Vector2(0.5, 0.5)}
							Position={UDim2.fromScale(0.5, 0.5)}
							Size={UDim2.fromScale(0.7, 0.7)}
							Image={data.map((value) =>
								recipe !== undefined && value.volume > 0
									? ITEMS[Object.keys(ITEM_RECIPES[recipe].outputItems)[0]].image
									: "",
							)}
						></Image>
					</Frame>

					<Text
						AnchorPoint={new Vector2(0.5, 0.5)}
						Position={UDim2.fromScale(0.705, 0.48)}
						Size={UDim2.fromScale(0.35, 1)}
						Text={data.map((value) =>
							recipe !== undefined && value.volume > 0
								? Object.keys(ITEM_RECIPES[recipe].outputItems)[0]
								: "",
						)}
						TextSize={16}
					></Text>

					<Frame
						AnchorPoint={new Vector2(0.5, 0.5)}
						Position={UDim2.fromScale(0.705, 0.568)}
						Size={UDim2.fromScale(0.43, 0.006)}
						BackgroundColor3={colors.grey}
					></Frame>

					<Text
						AnchorPoint={new Vector2(0.5, 0.5)}
						Position={UDim2.fromScale(0.705, 0.75)}
						Size={UDim2.fromScale(0.4, 0.22)}
						LineHeight={1.65}
						RichText={true}
						Text={data.map(
							(value) =>
								`Current Volume : <br></br> <font color="rgb(176,208,255)" weight="regular">${round(
									value.volume,
									2,
								)}m³</font>/${
									fluidExtractorComponent !== undefined
										? STRUCTURES[fluidExtractorComponent.instance.Name].constants["FluidCapacity"]
										: 0
								}m³`,
						)}
						TextSize={13}
					></Text>
				</Frame>
			</Frame>
		</BaseInfoPanel>
	);
}
