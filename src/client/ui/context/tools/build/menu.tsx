import React, { useEffect, useRef } from "@rbxts/react";
import { STRUCTURE_CATEGORIES } from "shared/constants/structures";
import { BuildMenuStructureCategoryButton } from "./structure-category-button";
import { BuildMenuStructureCategory } from "./structure-category";
import { colors, fonts, springs } from "client/ui/constants";
import { useStore } from "client/hooks";
import { lerpBinding, useMotion, useUpdateEffect } from "@rbxts/pretty-react-hooks";
import { useSelector } from "@rbxts/react-reflex";
import { IMAGES } from "shared/assets/images";
import { BlueprintEditor } from "./blueprint-editor";
import { Button, CanvasGroup, Frame, Image, Text, ViewportFrame } from "client/ui/core";
import { selectContext, selectContextOpen } from "client/hooks/store/context";
import { selectIsBlueprintEditorOpen, selectStructureCategory, selectStructureInfo } from "client/hooks/store/context/tools";

export function BuildMenu() {
	const store = useStore();
	const context = useSelector(selectContext);
	const isContextOpen = useSelector(selectContextOpen);
	const isBlueprintEditorOpen = useSelector(selectIsBlueprintEditorOpen);
	const selectedStructureCategory = useSelector(selectStructureCategory);
	const structureInfo = useSelector(selectStructureInfo);
	const isActive = context === "Build" && isContextOpen && !isBlueprintEditorOpen;
	const viewportFrameRef = useRef<ViewportFrame>();

	const [mountAnimation, mountAnimationMotion] = useMotion(0);
	const [blurAnimation, blurAnimationMotion] = useMotion(0);

	useUpdateEffect(() => {
		if (context !== "Build") {
			store.setBuildingStructureModel(undefined);
			store.setBlueprintEditorOpen(false);
		}
		mountAnimationMotion.spring(context === "Build" && isContextOpen ? 1 : 0, springs.gentle);
		blurAnimationMotion.spring(context === "Build" && isContextOpen && isBlueprintEditorOpen ? 1 : 0, springs.slow);
	}, [context, isContextOpen, isBlueprintEditorOpen]);

	useEffect(() => {
		for (const model of viewportFrameRef
			.current!.GetChildren()
			.filter((instance): instance is Model => instance.IsA("Model"))) {
			model.Destroy();
		}

		if (context !== "Build") return;
		const newStructureModel = structureInfo.structureModel.Clone();
		newStructureModel.PivotTo(new CFrame(0, 1, 0));
		newStructureModel.Parent = viewportFrameRef.current;
	}, [context, structureInfo]);

	return (
		<>
			<CanvasGroup
				GroupTransparency={mountAnimation.map((value) => 1 - value)}
				GroupColor3={lerpBinding(blurAnimation, colors.white, colors.grey)}
				Active={isActive}
				AnchorPoint={new Vector2(0.5, 0.5)}
				Position={UDim2.fromScale(0.5, 0.5)}
				Size={lerpBinding(mountAnimation, UDim2.fromScale(0, 0), UDim2.fromScale(0.565, 0.708))}
				BackgroundColor3={colors.black}
				Interactable={isActive}
				ZIndex={2}
			>
				<uiaspectratioconstraint AspectRatio={1.42}></uiaspectratioconstraint>

				<Frame Size={UDim2.fromScale(1, 0.082)} BackgroundTransparency={1}>
					<Image
						AnchorPoint={new Vector2(0.5, 0.5)}
						Position={UDim2.fromScale(0.027, 0.465)}
						Size={UDim2.fromScale(0.031, 0.54)}
						Image={IMAGES.Build}
					></Image>

					<Text
						AnchorPoint={new Vector2(0.5, 0.5)}
						Position={UDim2.fromScale(0.202, 0.5)}
						Size={UDim2.fromScale(0.304, 0.676)}
						FontFace={fonts.josefinSans.bold}
						Text={"Build"}
						TextSize={24}
						TextXAlignment={Enum.TextXAlignment.Left}
					></Text>

					<Button
						AnchorPoint={new Vector2(0.5, 0.5)}
						Position={UDim2.fromScale(0.96, 0.5)}
						Size={UDim2.fromScale(0.024, 0.42)}
						Event={{
							MouseButton1Click: () => {
								store.setContext(undefined);
							},
						}}
					>
						<Image Size={UDim2.fromScale(1, 1)} Image="rbxassetid://85748466046800"></Image>
					</Button>
				</Frame>

				<Frame
					Position={UDim2.fromScale(0, 0.082)}
					Size={UDim2.fromScale(0.696, 0.052)}
					BackgroundTransparency={1}
				>
					<uilistlayout
						FillDirection={Enum.FillDirection.Horizontal}
						SortOrder={Enum.SortOrder.LayoutOrder}
					></uilistlayout>

					{STRUCTURE_CATEGORIES.map((structureCategory) => (
						<BuildMenuStructureCategoryButton
							structureCategory={structureCategory}
							isSelected={selectedStructureCategory === structureCategory}
						></BuildMenuStructureCategoryButton>
					))}
				</Frame>

				{STRUCTURE_CATEGORIES.map((structureCategory) => (
					<BuildMenuStructureCategory
						structureCategory={structureCategory}
						isVisible={selectedStructureCategory === structureCategory}
					></BuildMenuStructureCategory>
				))}

				<Frame
					Position={UDim2.fromScale(0.696, 0.082)}
					Size={UDim2.fromScale(0.304, 0.92)}
					BackgroundTransparency={1}
					ZIndex={0}
				>
					<uistroke
						ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
						Color={colors.grey}
						LineJoinMode={Enum.LineJoinMode.Miter}
					></uistroke>

					<Text
						AnchorPoint={new Vector2(0.5, 0.5)}
						Position={UDim2.fromScale(0.5, 0.075)}
						Size={UDim2.fromScale(0.8, 0.035)}
						FontFace={fonts.josefinSans.medium}
						Text={structureInfo.structureModel.Name}
						TextScaled={true}
					></Text>

					<ViewportFrame
						ref={viewportFrameRef}
						Ambient={Color3.fromRGB(182, 182, 182)}
						LightColor={colors.white}
						LightDirection={new Vector3(-1, 0, -1)}
						AnchorPoint={new Vector2(0.5, 0.5)}
						Position={UDim2.fromScale(0.5, 0.243)}
						Size={UDim2.fromScale(0.567, 0.266)}
						cameraRotationSpeed={15}
						defaultCameraPitch={-15}
						defaultCameraOffset={new CFrame(0, 0.7, 5.5)}
						hoverCameraPitch={-24}
						hoverCameraOffset={new CFrame(0, 1, 8.5)}
					></ViewportFrame>

					<Text
						AnchorPoint={new Vector2(0.5, 0.5)}
						Position={UDim2.fromScale(0.5, 0.4)}
						Size={UDim2.fromScale(0.24, 0.028)}
						Text={"Description"}
						TextSize={13}
					></Text>

					<Frame
						AnchorPoint={new Vector2(0.5, 0.5)}
						Position={UDim2.fromScale(0.5, 0.425)}
						Size={UDim2.fromScale(0.79, 0.002)}
						BackgroundColor3={colors.grey}
					></Frame>

					<Text
						AnchorPoint={new Vector2(0.5, 0.5)}
						Position={UDim2.fromScale(0.5, 0.48)}
						Size={UDim2.fromScale(0.79, 0.07)}
						FontFace={fonts.josefinSans.italic}
						LineHeight={1.4}
						Text={structureInfo.structureDescription}
						TextSize={13}
						TextWrapped={true}
						TextXAlignment={Enum.TextXAlignment.Left}
						TextYAlignment={Enum.TextYAlignment.Top}
					></Text>

					<Text
						AnchorPoint={new Vector2(0.5, 0.5)}
						Position={UDim2.fromScale(0.5, 0.574)}
						Size={UDim2.fromScale(0.11, 0.02)}
						Text={"Stats"}
						TextSize={13}
					></Text>

					<Frame
						AnchorPoint={new Vector2(0.5, 0.5)}
						Position={UDim2.fromScale(0.5, 0.596)}
						Size={UDim2.fromScale(0.79, 0.002)}
						BackgroundColor3={colors.grey}
					></Frame>

					<Frame
						AnchorPoint={new Vector2(0.5, 0.5)}
						Position={UDim2.fromScale(0.5, 0.75)}
						Size={UDim2.fromScale(0.79, 0.271)}
						BackgroundTransparency={1}
					>
						<uilistlayout Padding={new UDim(0, 8)} SortOrder={Enum.SortOrder.LayoutOrder}></uilistlayout>
					</Frame>
				</Frame>
			</CanvasGroup>
			<BlueprintEditor></BlueprintEditor>
		</>
	);
}
