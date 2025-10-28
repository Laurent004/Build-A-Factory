import React, { useRef, useState } from "@rbxts/react";
import { Text } from "client/ui/core/text";
import { fonts, colors, springs } from "client/ui/constants";
import { Frame } from "client/ui/core/frame";
import { Image } from "client/ui/core/image";
import { BaseInfoPanel } from "../base-panel";
import { ITEM_RECIPES, ITEMS } from "shared/constants/items";
import { useSelector } from "@rbxts/react-reflex";
import { selectInfoStructureAttribute, selectInfoSelectionStructureModel } from "client/store/context/info";
import { lerpBinding, useUpdateEffect, useMotion } from "@rbxts/pretty-react-hooks";
import { Dependency } from "@flamework/core";
import { Components } from "@flamework/components";
import { RunService } from "@rbxts/services";
import MinerComponent from "client/components/transporters/miner";
import { IMAGES } from "shared/assets/images";
import { InfoPanelItemButton } from "./item-button";
import { useRem } from "client/hooks/use-rem";

export function MinerInfoPanel() {
	const rem = useRem();

	const components = Dependency<Components>();

	const structureModel = useSelector(selectInfoSelectionStructureModel);
	const selectedItem = useSelector(selectInfoStructureAttribute("SelectedItem")) as string | undefined;

	const [minerComponent, setMinerComponent] = useState<MinerComponent>();
	const miningProgressBarRef = useRef<Frame>();
	const miningProgressConnectionRef = useRef<RBXScriptConnection>();
	const [onMountAnimation, onMountAnimationMotion] = useMotion(0);

	useUpdateEffect(() => {
		miningProgressConnectionRef.current?.Disconnect();
		miningProgressConnectionRef.current = undefined;

		setMinerComponent(
			structureModel !== undefined ? components.getComponent<MinerComponent>(structureModel) : undefined,
		);
	}, [structureModel]);

	useUpdateEffect(() => {
		onMountAnimationMotion.spring(minerComponent !== undefined ? 1 : 0, springs.gentle);
		if (minerComponent === undefined) return;
		miningProgressConnectionRef.current = RunService.Heartbeat.Connect(() => {
			miningProgressBarRef.current!.Size = new UDim2(minerComponent.getMiningProgress(), 0, 0.6, 0);
		});
	}, [minerComponent]);

	return (
		<BaseInfoPanel
			structuresNames={["Miner"]}
			size={new UDim2(0, rem(351), 0, rem(489))}
			headerSize={new UDim2(1, 0, 0.086, 0)}
			headerIconSize={new UDim2(0.06, 0, 0.5, 0)}
			descriptionPosition={new UDim2(0.459, 0, 0.152, 0)}
			descriptionSize={new UDim2(0.829, 0, 0.076, 0)}
		>
			<Frame
				anchorPoint={new Vector2(0.5, 0.5)}
				position={new UDim2(0.5, 0, 0.357, 0)}
				size={new UDim2(0.915, 0, 0.266, 0)}
				backgroundTransparency={1}
			>
				<Text
					position={lerpBinding(onMountAnimation, new UDim2(-0.25, 0, 0, 0), new UDim2(0, 0, 0, 0))}
					size={new UDim2(0.582, 0, 0.18, 0)}
					font={fonts.josefinSans.medium}
					text={"Selected Item :"}
					textSize={19}
					textTransparency={onMountAnimation.map((value) => 1 - value)}
					textColor={colors.white}
					textXAlignment={Enum.TextXAlignment.Left}
					textYAlignment={Enum.TextYAlignment.Top}
				></Text>

				<Text
					anchorPoint={new Vector2(0.5, 0.5)}
					position={lerpBinding(
						onMountAnimation,
						new UDim2(0.955, 0, 0.439, 0),
						new UDim2(0.655, 0, 0.439, 0),
					)}
					size={new UDim2(0.648, 0, 0.184, 0)}
					font={fonts.josefinSans.regular}
					text={selectedItem}
					textSize={21}
					textTransparency={onMountAnimation.map((value) => 1 - value)}
					textColor={colors.white}
					textXAlignment={Enum.TextXAlignment.Left}
					textYAlignment={Enum.TextYAlignment.Center}
				></Text>

				<Frame
					anchorPoint={new Vector2(0.5, 0.5)}
					position={lerpBinding(onMountAnimation, new UDim2(0.46, 0, 0.65, 0), new UDim2(0.66, 0, 0.65, 0))}
					size={new UDim2(0.657, 0, 0.13, 0)}
					backgroundTransparency={1}
				>
					<Text
						anchorPoint={new Vector2(0, 0.5)}
						position={new UDim2(0, 0, 0.5, 0)}
						size={new UDim2(1, 0, 1, 0)}
						font={fonts.josefinSans.light}
						text={`<font weight="regular" color="rgb(176,208,255)">${
							selectedItem !== undefined &&
							ITEM_RECIPES.find(
								(itemRecipe) =>
									itemRecipe.structureName === "Miner" && itemRecipe.outputItem === selectedItem,
							) !== undefined
								? math.floor(
										60 /
											ITEM_RECIPES.find(
												(itemRecipe) =>
													itemRecipe.structureName === "Miner" &&
													itemRecipe.outputItem === selectedItem,
											)!.time,
								  )
								: 0
						}</font> per minute`}
						textSize={15}
						textTransparency={onMountAnimation.map((value) => 1 - value)}
						textColor={Color3.fromRGB(225, 225, 225)}
						richText={true}
						textXAlignment={Enum.TextXAlignment.Left}
						textYAlignment={Enum.TextYAlignment.Center}
					></Text>

					<Image
						anchorPoint={new Vector2(0.5, 0.5)}
						position={new UDim2(0.037, 0, 0.5, 0)}
						size={new UDim2(0.171, 0, 1.447, 0)}
						image={IMAGES.ui.Glow}
						imageColor={colors.lightblue}
						imageTransparency={lerpBinding(onMountAnimation, 1, 0.8)}
					></Image>
				</Frame>

				<Image
					anchorPoint={new Vector2(0.5, 0.5)}
					position={lerpBinding(onMountAnimation, new UDim2(0.141, 0, 1, 0), new UDim2(0.141, 0, 0.63, 0))}
					size={new UDim2(0.276, 0, 0.679, 0)}
					image={selectedItem !== undefined ? ITEMS[selectedItem].image : ""}
					imageTransparency={onMountAnimation.map((value) => 1 - value)}
				></Image>

				<Frame
					anchorPoint={new Vector2(0.5, 0.5)}
					position={new UDim2(0.655, 0, 0.829, 0)}
					size={new UDim2(0.647, 0, 0.064, 0)}
					backgroundColor={Color3.fromRGB(32, 32, 32)}
				>
					<Frame
						ref={miningProgressBarRef}
						anchorPoint={new Vector2(0, 0.5)}
						position={new UDim2(0, 0, 0.5, 0)}
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

			<Frame
				anchorPoint={new Vector2(0.5, 0.5)}
				position={new UDim2(0.5, 0, 0.746, 0)}
				size={new UDim2(0.91, 0, 0.489, 0)}
				backgroundTransparency={1}
			>
				<Text
					position={lerpBinding(onMountAnimation, new UDim2(-0.3, 0, 0, 0), new UDim2(0, 0, 0, 0))}
					size={new UDim2(0.299, 0, 0.102, 0)}
					font={fonts.josefinSans.medium}
					text={"Items :"}
					textSize={20}
					textTransparency={onMountAnimation.map((value) => 1 - value)}
					textColor={colors.white}
					textXAlignment={Enum.TextXAlignment.Left}
					textYAlignment={Enum.TextYAlignment.Top}
				></Text>

				<scrollingframe
					AnchorPoint={new Vector2(0.5, 0.5)}
					Position={new UDim2(0.5, 0, 0.77, 0)}
					Size={new UDim2(1, 0, 1.255, 0)}
					BackgroundTransparency={1}
					CanvasSize={new UDim2(0, 0, 2, 0)}
					ScrollBarThickness={0}
					ScrollBarImageTransparency={1}
					ScrollingDirection={Enum.ScrollingDirection.Y}
				>
					<uigridlayout
						CellPadding={new UDim2(0, 3, 0, 3)}
						CellSize={new UDim2(0, 76, 0, 76)}
						HorizontalAlignment={Enum.HorizontalAlignment.Left}
						VerticalAlignment={Enum.VerticalAlignment.Top}
					></uigridlayout>

					<uipadding PaddingLeft={new UDim(0, 1)} PaddingTop={new UDim(0, 1)}></uipadding>

					{minerComponent !== undefined
						? ITEM_RECIPES.filter((itemRecipe) => itemRecipe.structureName === "Miner").map(
								(itemRecipe, itemIndex) => {
									return (
										<InfoPanelItemButton
											itemName={itemRecipe.outputItem}
											index={itemIndex}
										></InfoPanelItemButton>
									);
								},
						  )
						: undefined}
				</scrollingframe>
			</Frame>
		</BaseInfoPanel>
	);
}
