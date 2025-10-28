import React, { useState } from "@rbxts/react";
import { useStore } from "client/hooks";
import { Text } from "client/ui/core/text";
import { Image } from "client/ui/core/image";
import { fonts, springs } from "client/ui/constants";
import { STRUCTURES } from "shared/constants/structures";
import { colors } from "client/ui/constants";
import { Button } from "client/ui/core/button";
import { lerpBinding, useEventListener, useMotion, useUpdate, useUpdateEffect } from "@rbxts/pretty-react-hooks";
import { Frame } from "client/ui/core/frame";
import { IMAGES } from "shared/assets/images";
import { Object } from "@rbxts/luau-polyfill";
import { MILESTONES } from "shared/constants/milestones";
import { useSelector } from "@rbxts/react-reflex";
import { selectContext } from "client/store/context";
import { selectBuildMenuStructureCategory } from "client/store/context/build";
import { MarketplaceService, Players } from "@rbxts/services";

export interface StructureButtonProps {
	index: number;
	structureSubCategory: string;
	structureModel: Model;
	structureDescription: string;
	milestone: number;
	searchText: string;
}

export function StructureButton(props: StructureButtonProps) {
	const store = useStore();

	const context = useSelector(selectContext);
	const selectedStructureCategory = useSelector(selectBuildMenuStructureCategory);

	const isUnlocked =
		!(props.structureModel.Name in STRUCTURES) ||
		Object.entries(MILESTONES).find(([_, milestone]) => milestone.rewards.includes(props.structureModel.Name)) ===
			undefined ||
		props.milestone >=
			Object.entries(MILESTONES).find(([_, milestone]) =>
				milestone.rewards.includes(props.structureModel.Name),
			)![1].index;
	const [isPurchased, setIsPurchased] = useState<boolean>(
		!(props.structureModel.Name in STRUCTURES) ||
			STRUCTURES[props.structureModel.Name].gamepass === undefined ||
			MarketplaceService.UserOwnsGamePassAsync(
				Players.LocalPlayer.UserId,
				STRUCTURES[props.structureModel.Name].gamepass!,
			),
	);

	const [onMountAnimation, onMountAnimationMotion] = useMotion(0);
	const [onHoverAnimation, onHoverAnimationMotion] = useMotion(0);

	useEventListener(MarketplaceService.PromptGamePassPurchaseFinished, (player, gamepass) => {
		if (player !== Players.LocalPlayer || gamepass !== STRUCTURES[props.structureModel.Name].gamepass) return;
		setIsPurchased(true);
	});

	useUpdateEffect(() => {
		if (
			context !== "Build" ||
			selectedStructureCategory !==
				(props.structureModel.Name in STRUCTURES ? STRUCTURES[props.structureModel.Name].category : "Blueprint")
		)
			return;
		onMountAnimationMotion.immediate(0);
		task.delay((props.index + 1) * 0.055, () => {
			onMountAnimationMotion.spring(1, springs.responsive);
		});
	}, [context, selectedStructureCategory]);

	return (
		<Button
			onMouseEnter={() => {
				onHoverAnimationMotion.spring(1, springs.responsive);
			}}
			onMouseLeave={() => {
				onHoverAnimationMotion.spring(0, springs.responsive);
			}}
			onClick={() => {
				store.setBuildMenuStructureInformation({
					structureModel: props.structureModel,
					structureDescription: props.structureDescription,
				});
			}}
			onDoubleClick={() => {
				if (!isUnlocked || !isPurchased) return;
				store.setBuildMenuBuildingStructureModel(props.structureModel);
				store.setContextOpen(false);
			}}
			visible={
				string.find(string.lower(props.structureModel.Name), string.lower(props.searchText), 1, true)[0] !==
					undefined ||
				string.find(string.lower(props.structureSubCategory), string.lower(props.searchText), 1, true)[0] !==
					undefined
			}
			layoutOrder={props.index}
		>
			<Frame
				anchorPoint={new Vector2(0.5, 0.5)}
				position={lerpBinding(
					onMountAnimation,
					new UDim2(0.5, 0, 0.5 + (props.index + 1) * 0.14, 0),
					new UDim2(0.5, 0, 0.5, 0),
				)}
				size={new UDim2(1, 0, 1, 0)}
				backgroundTransparency={1}
			>
				<Image
					anchorPoint={new Vector2(0.5, 0.5)}
					position={new UDim2(0.5, 0, 0.4, 0)}
					size={lerpBinding(onHoverAnimation, new UDim2(0.8, 0, 0.8, 0), new UDim2(0.87, 0, 0.87, 0))}
					image={
						props.structureModel.Name in STRUCTURES
							? STRUCTURES[props.structureModel.Name].image
							: IMAGES.ui["Iron Plate"]
					}
					imageTransparency={onMountAnimation.map((value) => 1 - value)}
					imageColor={isUnlocked && isPurchased ? colors.white : Color3.fromRGB(122, 122, 122)}
				></Image>

				<Text
					anchorPoint={new Vector2(0.5, 0.5)}
					position={new UDim2(0.5, 0, 0.85, 0)}
					size={new UDim2(1, 0, 0.18, 0)}
					font={fonts.josefinSans.regular}
					textSize={13}
					textTransparency={onMountAnimation.map((value) => 1 - value)}
					textColor={isUnlocked && isPurchased ? colors.white : Color3.fromRGB(122, 122, 122)}
					text={props.structureModel.Name}
				></Text>

				{props.structureModel.Name in STRUCTURES ? (
					<Image
						anchorPoint={new Vector2(1, 0)}
						position={new UDim2(1, 0, 0, 0)}
						size={new UDim2(0.16, 0, 0.16, 0)}
						image="rbxassetid://105817330245525"
						imageColor={colors.white}
						imageTransparency={onMountAnimation.map((value) => 1 - value)}
						visible={!isUnlocked || !isPurchased}
					></Image>
				) : (
					<Button
						anchorPoint={new Vector2(1, 0)}
						position={new UDim2(1, 0, 0, 0)}
						size={new UDim2(0.16, 0, 0.16, 0)}
						backgroundTransparency={1}
						onClick={() => {
							store.setBuildMenuStructureInformation({
								structureModel: props.structureModel,
								structureDescription: props.structureDescription,
							});
							store.setBuildMenuBlueprintEditorOpen(true);
						}}
					>
						<Image
							anchorPoint={new Vector2(0.5, 0.5)}
							position={lerpBinding(
								onHoverAnimation,
								new UDim2(0.5, 0, 0.78, 0),
								new UDim2(0.5, 0, 0.5, 0),
							)}
							size={new UDim2(1, 0, 1, 0)}
							image={IMAGES.ui.Pencil}
							imageTransparency={onHoverAnimation.map((value) => 1 - value)}
						></Image>
					</Button>
				)}
			</Frame>
		</Button>
	);
}
