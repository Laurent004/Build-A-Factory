import React from "@rbxts/react";
import { useStore } from "client/hooks";
import { Text } from "client/ui/core/text";
import { Image } from "client/ui/core/image";
import { fonts, springs } from "client/ui/constants";
import { STRUCTURES } from "shared/constants/structures";
import { colors } from "client/ui/constants";
import { Button } from "client/ui/core/button";
import { lerpBinding, useEventListener, useMotion, useUpdate, useUpdateEffect } from "@rbxts/pretty-react-hooks";
import { Frame } from "client/ui/core/frame";
import { useSelector } from "@rbxts/react-reflex";
import { selectContext, selectContextOpen } from "client/store/context";
import { selectBuildMenuStructureCategory } from "client/store/context/build";
import { MarketplaceService, Players } from "@rbxts/services";

export interface BuildMenuStructureButtonProps {
	index: number;
	structureSubCategory: string;
	structureModel: Model;
	structureImage: string;
	structureDescription: string;
	searchText: string;
}

export function BuildMenuStructureButton(props: BuildMenuStructureButtonProps) {
	const store = useStore();
	const context = useSelector(selectContext);
	const contextOpen = useSelector(selectContextOpen);
	const structureCategory = useSelector(selectBuildMenuStructureCategory);
	const isPurchased =
		props.structureModel.GetAttribute("Id") !== undefined ||
		STRUCTURES[props.structureModel.Name].gamepass === undefined ||
		MarketplaceService.UserOwnsGamePassAsync(
			Players.LocalPlayer.UserId,
			STRUCTURES[props.structureModel.Name].gamepass!,
		);
	const [onMountAnimation, onMountAnimationMotion] = useMotion(0);
	const [onHoverAnimation, onHoverAnimationMotion] = useMotion(0);

	useUpdateEffect(() => {
		if (
			context === "Build" &&
			contextOpen &&
			structureCategory ===
				(props.structureModel.Name in STRUCTURES
					? STRUCTURES[props.structureModel.Name].category
					: "Blueprints")
		) {
			onMountAnimationMotion.immediate(0);
			task.delay((props.index + 1) * 0.055, () => {
				onMountAnimationMotion.spring(1, springs.responsive);
			});
		} else {
			onMountAnimationMotion.spring(0, springs.responsive);
		}
	}, [context, structureCategory]);

	return (
		<Button
			anchorPoint={new Vector2(0, 0)}
			position={new UDim2(0, 0, 0, 0)}
			size={new UDim2(0, 0, 0, 0)}
			layoutOrder={props.index}
			visible={
				string.find(string.lower(props.structureModel.Name), string.lower(props.searchText), 1, true)[0] !==
					undefined ||
				string.find(string.lower(props.structureSubCategory), string.lower(props.searchText), 1, true)[0] !==
					undefined
			}
			onMouseEnter={() => {
				onHoverAnimationMotion.spring(1, springs.responsive);
			}}
			onMouseLeave={() => {
				onHoverAnimationMotion.spring(0, springs.responsive);
			}}
			onClick={() => {
				store.setBuildMenuStructureInformation({
					structureModel: props.structureModel,
					structureImage: props.structureImage,
					structureDescription: props.structureDescription,
				});
			}}
			onDoubleClick={() => {
				if (!isPurchased) {
					MarketplaceService.PromptGamePassPurchase(
						Players.LocalPlayer,
						STRUCTURES[props.structureModel.Name].gamepass!,
					);
					return;
				}
				store.setBuildMenuBuildingStructureModel(props.structureModel);
				store.setContextOpen(false);
			}}
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
					size={lerpBinding(onHoverAnimation, new UDim2(0.8, 0, 0.8, 0), new UDim2(0.88, 0, 0.88, 0))}
					image={props.structureImage}
					imageColor={isPurchased ? colors.white : Color3.fromRGB(122, 122, 122)}
					imageTransparency={onMountAnimation.map((value) => 1 - value)}
				></Image>

				<Text
					anchorPoint={new Vector2(0.5, 0.5)}
					position={new UDim2(0.5, 0, 0.85, 0)}
					size={new UDim2(1, 0, 0.18, 0)}
					font={fonts.josefinSans.regular}
					text={props.structureModel.Name}
					textSize={13}
					textColor={isPurchased ? colors.white : Color3.fromRGB(122, 122, 122)}
					textTransparency={onMountAnimation.map((value) => 1 - value)}
					textTruncate={Enum.TextTruncate.SplitWord}
					textXAlignment={Enum.TextXAlignment.Center}
					textYAlignment={Enum.TextYAlignment.Center}
				></Text>

				{props.structureModel.GetAttribute("Id") !== undefined ? (
					<Button
						anchorPoint={new Vector2(1, 0)}
						position={new UDim2(1, 0, 0, 0)}
						size={new UDim2(0.16, 0, 0.16, 0)}
						backgroundTransparency={1}
						onClick={() => {
							store.setBuildMenuStructureInformation({
								structureModel: props.structureModel,
								structureImage: props.structureImage,
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
							image="rbxassetid://106059788567013"
							imageTransparency={onHoverAnimation.map((value) => 1 - value)}
						></Image>
					</Button>
				) : (
					<Image
						anchorPoint={new Vector2(1, 0)}
						position={new UDim2(1, 0, 0, 0)}
						size={new UDim2(0.16, 0, 0.16, 0)}
						visible={!isPurchased}
						image="rbxassetid://105817330245525"
						imageColor={colors.white}
						imageTransparency={onMountAnimation.map((value) => 1 - value)}
					></Image>
				)}
			</Frame>
		</Button>
	);
}
