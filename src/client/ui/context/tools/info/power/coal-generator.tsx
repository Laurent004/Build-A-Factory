import React, { useBinding, useRef } from "@rbxts/react";
import { BaseInfoPanel } from "../base";
import { Frame, Image, Text } from "client/ui/core";
import { colors, fonts } from "client/ui/constants";
import { ITEMS } from "shared/constants/items";
import { STRUCTURES } from "shared/constants/structures";
import { IMAGES } from "shared/assets/images";
import { useSelectorCreator } from "@rbxts/react-reflex";
import { RunService } from "@rbxts/services";
import { useUpdateEffect } from "@rbxts/pretty-react-hooks";
import { InfoPanelFluidIndicator } from "../components";
import { round } from "shared/utils";
import { selectContextStructureComponents } from "client/hooks/store/context";
import CoalGeneratorComponent from "shared/components/power/coal-generator";

export function CoalGeneratorInfoPanel() {
	const coalGeneratorComponent = useSelectorCreator(selectContextStructureComponents, CoalGeneratorComponent)[0];
	const [data, setData] = useBinding<{
		time: number;
		efficiency: number;
		water: number;
	}>({
		time: 0,
		efficiency: 0,
		water: 0,
	});
	const connectionRef = useRef<RBXScriptConnection>();

	useUpdateEffect(() => {
		connectionRef.current?.Disconnect();
		connectionRef.current = undefined;
		if (coalGeneratorComponent === undefined) return;
		connectionRef.current = RunService.Heartbeat.Connect(() => {
			setData({
				time: coalGeneratorComponent.getTime(),
				efficiency: coalGeneratorComponent.getEfficiency(),
				water: coalGeneratorComponent.getFluids().get("Water") ?? 0,
			});
		});
	}, [coalGeneratorComponent]);

	return (
		<BaseInfoPanel active={coalGeneratorComponent !== undefined} size={UDim2.fromScale(0.183, 0.514)}>
			<Frame Size={UDim2.fromScale(1, 0.439)} BackgroundTransparency={1} LayoutOrder={1}>
				<Text
					Size={UDim2.fromScale(0.16, 0.085)}
					FontFace={fonts.josefinSans.medium}
					Text="Fuel :"
					TextSize={19}
					TextXAlignment={Enum.TextXAlignment.Left}
					TextYAlignment={Enum.TextYAlignment.Top}
				></Text>

				<Image
					AnchorPoint={new Vector2(0.5, 0.5)}
					Position={UDim2.fromScale(0.141, 0.403)}
					Size={UDim2.fromScale(0.276, 0.408)}
					Image={ITEMS["Coal"].image}
				></Image>

				<Text
					AnchorPoint={new Vector2(0.5, 0.5)}
					Position={UDim2.fromScale(0.65, 0.28)}
					Size={UDim2.fromScale(0.648, 0.077)}
					Text={data.map(
						(value) =>
							`Coal (${math.max(
								0,
								math.ceil(
									value.time /
										(ITEMS["Coal"].energy /
											(STRUCTURES["Coal Generator"].constants["PowerProduction"] as number)),
								),
							)} rem.)`,
					)}
					TextSize={21}
					TextTruncate={Enum.TextTruncate.SplitWord}
					TextXAlignment={Enum.TextXAlignment.Left}
				></Text>

				<Text
					AnchorPoint={new Vector2(0.5, 0.5)}
					Position={UDim2.fromScale(0.66, 0.41)}
					Size={UDim2.fromScale(0.647, 0.08)}
					RichText={true}
					Text={`<font weight="regular" color="rgb(176,208,255)">${
						60 /
						(ITEMS["Coal"].energy / (STRUCTURES["Coal Generator"].constants["PowerProduction"] as number))
					}</font> per minute`}
					TextSize={15}
					TextXAlignment={Enum.TextXAlignment.Left}
				></Text>

				<Frame
					AnchorPoint={new Vector2(0.5, 0.5)}
					Position={UDim2.fromScale(0.655, 0.51)}
					Size={UDim2.fromScale(0.647, 0.036)}
					BackgroundColor3={Color3.fromRGB(32, 32, 32)}
				>
					<Frame
						AnchorPoint={new Vector2(0, 0.5)}
						Position={UDim2.fromScale(0, 0.5)}
						Size={data.map((value) =>
							UDim2.fromScale(
								(value.time %
									(ITEMS["Coal"].energy /
										(STRUCTURES["Coal Generator"].constants["PowerProduction"] as number))) /
									(ITEMS["Coal"].energy /
										(STRUCTURES["Coal Generator"].constants["PowerProduction"] as number)),
								0.6,
							),
						)}
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
						Wraps={true}
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
							Text={`Time : ${
								ITEMS["Coal"].energy /
								(STRUCTURES["Coal Generator"].constants["PowerProduction"] as number)
							}s`}
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
							Image="rbxassetid://136540953943718"
						></Image>

						<Text
							Size={UDim2.fromScale(1, 1)}
							Text={`Prod. : ${STRUCTURES["Coal Generator"].constants["PowerProduction"]} MW`}
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
							Text={data.map((value) => `Efficiency : ${math.round(value.efficiency * 100)}%`)}
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
						fluid={data.map((value) => ["Water", value.water])}
					></InfoPanelFluidIndicator>

					<Frame
						AnchorPoint={new Vector2(0.5, 0.5)}
						Position={UDim2.fromScale(0.559, 0.34)}
						Size={UDim2.fromScale(0.145, 0.271)}
						BackgroundColor3={Color3.fromRGB(32, 32, 32)}
					>
						<Image
							AnchorPoint={new Vector2(0.5, 0.5)}
							Position={UDim2.fromScale(0.5, 0.5)}
							Size={UDim2.fromScale(0.7, 0.7)}
							Image={data.map((value) => (value.water > 0 ? ITEMS["Water"].image : ""))}
						></Image>
					</Frame>

					<Text
						AnchorPoint={new Vector2(0.5, 0.5)}
						Position={UDim2.fromScale(0.811, 0.285)}
						Size={UDim2.fromScale(0.288, 0.161)}
						LineHeight={1.2}
						Text={"Water Consumption :"}
						TextSize={12}
						TextWrapped={true}
						TextXAlignment={Enum.TextXAlignment.Left}
					></Text>

					<Text
						AnchorPoint={new Vector2(0.5, 0.5)}
						Position={UDim2.fromScale(0.811, 0.44)}
						Size={UDim2.fromScale(0.288, 0.1)}
						RichText={true}
						Text={`<font weight="regular" color="rgb(176,208,255)">${45}m³</font> per minute`}
						TextSize={11}
						TextXAlignment={Enum.TextXAlignment.Left}
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
									value.water,
									2,
								)}m³</font>/${STRUCTURES["Coal Generator"].constants["FluidCapacity"]}m³`,
						)}
						TextSize={13}
					></Text>
				</Frame>
			</Frame>
		</BaseInfoPanel>
	);
}
