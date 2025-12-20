import React, { useRef } from "@rbxts/react";
import { BaseInfoPanel } from "../base";
import { useRem } from "client/hooks";
import FluidExtractorComponent from "client/components/production/fluid-extractor";
import { lerpBinding, useMotion, usePrevious, useUpdateEffect } from "@rbxts/pretty-react-hooks";
import { Frame } from "client/ui/core/frame";
import { colors, fonts, springs } from "client/ui/constants";
import { Text } from "client/ui/core/text";
import { ITEM_RECIPES, ITEMS } from "shared/constants/items";
import { IMAGES } from "shared/assets/images";
import { Image } from "client/ui/core/image";
import { RunService } from "@rbxts/services";
import { InfoPanelFluidInfo } from "../fluid-info";
import { useSelector } from "@rbxts/react-reflex";
import { selectContextStructureModelComponent } from "client/store/context";
import { Object } from "@rbxts/luau-polyfill";

export function FluidExtractorInfoPanel() {
	const rem = useRem();
	const fluidExtractorComponent = useSelector(selectContextStructureModelComponent(FluidExtractorComponent));
	const previousFluidExtractorComponent = usePrevious(fluidExtractorComponent);
	const extractionProgressBarRef = useRef<Frame>();
	const extractionProgressConnectionRef = useRef<RBXScriptConnection>();
	const [onMountAnimation, onMountAnimationMotion] = useMotion(0);

	useUpdateEffect(() => {
		extractionProgressConnectionRef.current?.Disconnect();
		extractionProgressConnectionRef.current = undefined;
		if (
			fluidExtractorComponent !== undefined &&
			fluidExtractorComponent.instance.Name !== previousFluidExtractorComponent?.instance?.Name
		) {
			onMountAnimationMotion.immediate(0);
		}
		onMountAnimationMotion.spring(fluidExtractorComponent !== undefined ? 1 : 0, springs.gentle);
		if (fluidExtractorComponent === undefined) return;
		extractionProgressConnectionRef.current = RunService.Heartbeat.Connect(() => {
			extractionProgressBarRef.current!.Size = new UDim2(
				fluidExtractorComponent.getExtractionProgress(),
				0,
				0.6,
				0,
			);
		});
	}, [fluidExtractorComponent]);

	return (
		<BaseInfoPanel
			active={fluidExtractorComponent !== undefined}
			size={new UDim2(0, rem(351), 0, rem(400))}
			headerSize={new UDim2(1, 0, 0.105, 0)}
			headerIconSize={new UDim2(0.06, 0, 0.5, 0)}
			descriptionPosition={new UDim2(0.459, 0, 0.187, 0)}
			descriptionSize={new UDim2(0.829, 0, 0.083, 0)}
		>
			<Frame
				anchorPoint={new Vector2(0.5, 0.5)}
				position={new UDim2(0.5, 0, 0.43, 0)}
				size={new UDim2(0.915, 0, 0.315, 0)}
				backgroundTransparency={1}
			>
				<Text
					anchorPoint={new Vector2(0, 0)}
					position={lerpBinding(onMountAnimation, new UDim2(-0.25, 0, 0, 0), new UDim2(0, 0, 0, 0))}
					size={new UDim2(0.231, 0, 0.125, 0)}
					font={fonts.josefinSans.medium}
					text={"Recipe :"}
					textSize={19}
					textColor={colors.white}
					textTransparency={onMountAnimation.map((value) => 1 - value)}
					textXAlignment={Enum.TextXAlignment.Left}
					textYAlignment={Enum.TextYAlignment.Top}
				></Text>

				<Text
					anchorPoint={new Vector2(0.5, 0.5)}
					position={lerpBinding(onMountAnimation, new UDim2(0.955, 0, 0.4, 0), new UDim2(0.655, 0, 0.4, 0))}
					size={new UDim2(0.648, 0, 0.161, 0)}
					font={fonts.josefinSans.regular}
					text={
						fluidExtractorComponent !== undefined
							? Object.keys(ITEMS).find(
									(itemName) => fluidExtractorComponent.instance.Name.find(itemName)[0] !== undefined,
							  )!
							: undefined
					}
					textSize={21}
					textColor={colors.white}
					textTransparency={onMountAnimation.map((value) => 1 - value)}
					textXAlignment={Enum.TextXAlignment.Left}
					textYAlignment={Enum.TextYAlignment.Center}
				></Text>

				<Frame
					anchorPoint={new Vector2(0.5, 0.5)}
					position={lerpBinding(onMountAnimation, new UDim2(0.46, 0, 0.59, 0), new UDim2(0.66, 0, 0.59, 0))}
					size={new UDim2(0.657, 0, 0.114, 0)}
					backgroundTransparency={1}
				>
					<Text
						anchorPoint={new Vector2(0, 0.5)}
						position={new UDim2(0, 0, 0.5, 0)}
						size={new UDim2(1, 0, 1, 0)}
						font={fonts.josefinSans.light}
						richText={true}
						text={`<font weight="regular" color="rgb(176,208,255)">${
							fluidExtractorComponent !== undefined
								? math.floor(
										(60 /
											ITEM_RECIPES[
												Object.keys(ITEMS).find(
													(itemName) =>
														fluidExtractorComponent.instance.Name.find(itemName)[0] !==
														undefined,
												)!
											].time) *
											ITEM_RECIPES[
												Object.keys(ITEMS).find(
													(itemName) =>
														fluidExtractorComponent.instance.Name.find(itemName)[0] !==
														undefined,
												)!
											].outputItems[
												Object.keys(ITEMS).find(
													(itemName) =>
														fluidExtractorComponent.instance.Name.find(itemName)[0] !==
														undefined,
												)!
											],
								  )
								: 0
						}m³</font> per minute`}
						textSize={15}
						textColor={Color3.fromRGB(225, 225, 225)}
						textTransparency={onMountAnimation.map((value) => 1 - value)}
						textXAlignment={Enum.TextXAlignment.Left}
						textYAlignment={Enum.TextYAlignment.Center}
					></Text>

					<Image
						anchorPoint={new Vector2(0.5, 0.5)}
						position={new UDim2(0.1, 0, 0.5, 0)}
						size={new UDim2(0.24, 0, 2, 0)}
						image={IMAGES.ui.Glow}
						imageColor={colors.lightblue}
						imageTransparency={lerpBinding(onMountAnimation, 1, 0.8)}
					></Image>
				</Frame>

				<Image
					anchorPoint={new Vector2(0.5, 0.5)}
					position={lerpBinding(onMountAnimation, new UDim2(0.132, 0, 1, 0), new UDim2(0.132, 0, 0.59, 0))}
					size={new UDim2(0.271, 0, 0.698, 0)}
					image={
						fluidExtractorComponent !== undefined
							? ITEMS[
									Object.keys(ITEMS).find(
										(itemName) =>
											fluidExtractorComponent.instance.Name.find(itemName)[0] !== undefined,
									)!
							  ].image
							: ""
					}
					imageTransparency={onMountAnimation.map((value) => 1 - value)}
				></Image>

				<Frame
					anchorPoint={new Vector2(0.5, 0.5)}
					position={new UDim2(0.655, 0, 0.77, 0)}
					size={new UDim2(0.647, 0, 0.056, 0)}
					backgroundColor={Color3.fromRGB(32, 32, 32)}
				>
					<Frame
						ref={extractionProgressBarRef}
						anchorPoint={new Vector2(0, 0.5)}
						position={new UDim2(0, 0, 0.5, 0)}
						size={new UDim2(0, 0, 0.6, 0)}
						backgroundColor={colors.lightblue}
					>
						<Image
							anchorPoint={new Vector2(0.5, 0.5)}
							position={new UDim2(0.5, 0, 0.5, 0)}
							size={new UDim2(1.06, 0, 3.306, 0)}
							image={IMAGES.ui.Glow}
							imageColor={colors.lightblue}
							imageTransparency={0.7}
						></Image>
					</Frame>
				</Frame>
			</Frame>

			<InfoPanelFluidInfo
				position={new UDim2(0.5, 0, 0.797, 0)}
				size={new UDim2(0.91, 0, 0.325, 0)}
			></InfoPanelFluidInfo>
		</BaseInfoPanel>
	);
}
