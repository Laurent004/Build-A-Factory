import React from "@rbxts/react";
import { useStore } from "client/hooks";
import { STRUCTURES } from "shared/constants/structures";
import { colors } from "client/ui/constants";
import { MarketplaceService, Players } from "@rbxts/services";
import { Button, Image, Text } from "client/ui/core";

interface BuildMenuStructureButtonProps {
	structureModel: Model;
	structureImage: string;
	structureDescription: string;
	index: number;
	isVisible: boolean;
}

export function BuildMenuStructureButton({
	structureModel,
	structureImage,
	structureDescription,
	index,
	isVisible,
}: BuildMenuStructureButtonProps) {
	const store = useStore();
	const isUnlocked =
		structureModel.GetAttribute("Id") !== undefined ||
		STRUCTURES[structureModel.Name].gamepass === undefined ||
		MarketplaceService.UserOwnsGamePassAsync(Players.LocalPlayer.UserId, STRUCTURES[structureModel.Name].gamepass!);

	return (
		<Button
			LayoutOrder={index}
			Visible={isVisible}
			Event={{
				MouseButton1Click: () => {
					store.setStructureInfo({
						structureImage: structureImage,
						structureDescription: structureDescription,
						structureModel: structureModel,
					});
				},
			}}
			onDoubleClick={() => {
				if (isUnlocked) {
					store.setBuildingStructureModel(structureModel);
					store.setContextOpen(false);
				} else {
					MarketplaceService.PromptGamePassPurchase(
						Players.LocalPlayer,
						STRUCTURES[structureModel.Name].gamepass!,
					);
				}
			}}
		>
			<Image
				AnchorPoint={new Vector2(0.5, 0.5)}
				Position={UDim2.fromScale(0.5, 0.4)}
				Size={UDim2.fromScale(0.8, 0.8)}
				Image={structureImage}
				ImageColor3={isUnlocked ? colors.white : Color3.fromRGB(122, 122, 122)}
			></Image>

			<Text
				AnchorPoint={new Vector2(0.5, 0.5)}
				Position={UDim2.fromScale(0.5, 0.85)}
				Size={UDim2.fromScale(1, 0.18)}
				Text={structureModel.Name}
				TextSize={13}
				TextColor3={isUnlocked ? colors.white : Color3.fromRGB(122, 122, 122)}
				TextTruncate={Enum.TextTruncate.SplitWord}
			></Text>

			{structureModel.GetAttribute("Id") !== undefined ? (
				<Button
					AnchorPoint={new Vector2(1, 0)}
					Position={UDim2.fromScale(1, 0)}
					Size={UDim2.fromScale(0.16, 0.16)}
					BackgroundTransparency={1}
					Event={{
						MouseButton1Click: () => {
							store.setStructureInfo({
								structureImage: structureImage,
								structureDescription: structureDescription,
								structureModel: structureModel,
							});
							store.setBlueprintEditorOpen(true);
						},
					}}
				>
					<Image Size={UDim2.fromScale(1, 1)} Image="rbxassetid://106059788567013"></Image>
				</Button>
			) : (
				<Image
					AnchorPoint={new Vector2(1, 0)}
					Position={UDim2.fromScale(1, 0)}
					Size={UDim2.fromScale(0.16, 0.16)}
					Visible={!isUnlocked}
					Image="rbxassetid://105817330245525"
					ImageColor3={colors.white}
				></Image>
			)}
		</Button>
	);
}
