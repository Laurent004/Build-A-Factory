import React, { useRef } from "@rbxts/react";
import { STRUCTURE_CATEGORIES, STRUCTURES } from "shared/constants/structures";
import { BuildMenuStructureCategoryButton } from "./structure-category-button";
import { BuildMenuStructureCategory } from "./structure-category";
import { Frame } from "client/ui/core/frame";
import { colors, fonts, springs } from "client/ui/constants";
import { useStore } from "client/hooks";
import { lerpBinding, useMotion, useUpdateEffect } from "@rbxts/pretty-react-hooks";
import { useSelector } from "@rbxts/react-reflex";
import { selectContext, selectContextOpen } from "client/store/context";
import { selectBuildMenuBlueprintEditorOpen, selectBuildMenuStructureInformation } from "client/store/context/build";
import { IMAGES } from "shared/assets/images";
import { Image } from "client/ui/core/image";
import { Button } from "client/ui/core/button";
import { Text } from "client/ui/core/text";
import { ReactiveViewportFrame } from "client/ui/core/reactive-viewport-frame";
import { BuildMenuBlueprintEditor } from "./blueprint-editor";
import { useRem } from "client/hooks/use-rem";
import { Object } from "@rbxts/luau-polyfill";

export function BuildMenu() {
	const store = useStore();
	const rem = useRem();
	const context = useSelector(selectContext);
	const contextOpen = useSelector(selectContextOpen);
	const blueprintEditorOpen = useSelector(selectBuildMenuBlueprintEditorOpen);
	const structureInformation = useSelector(selectBuildMenuStructureInformation);
	const structureViewportFrameRef = useRef<ViewportFrame>();
	const [onMountAnimation, onMountAnimationMotion] = useMotion(0);
	const [onUpdateAnimation, onUpdateAnimationMotion] = useMotion(0);
	const [onBlurAnimation, onBlurAnimationMotion] = useMotion(0);

	useUpdateEffect(() => {
		if (context !== "Build") return;
		for (const model of structureViewportFrameRef
			.current!.GetDescendants()
			.filter((instance): instance is Model => instance.IsA("Model"))) {
			model.Destroy();
		}
		const newStructureModel = structureInformation.structureModel.Clone();
		newStructureModel.PivotTo(new CFrame(0, 1, 0));
		newStructureModel.Parent = structureViewportFrameRef.current;
		onUpdateAnimationMotion.immediate(0);
		onUpdateAnimationMotion.spring(1, springs.responsive);
	}, [context, structureInformation]);

	useUpdateEffect(() => {
		if (context !== "Build") {
			store.setBuildMenuBuildingStructureModel(undefined);
		}
		onMountAnimationMotion.spring(context === "Build" && contextOpen ? 1 : 0, springs.gentle);
	}, [context, contextOpen]);

	useUpdateEffect(() => {
		onBlurAnimationMotion.spring(blueprintEditorOpen ? 1 : 0, springs.slow);
	}, [blueprintEditorOpen]);

	return (
		<>
			<canvasgroup
				GroupTransparency={onMountAnimation.map((value) => 1 - value)}
				GroupColor3={lerpBinding(onBlurAnimation, colors.white, colors.grey)}
				Active={context === "Build" && contextOpen && !blueprintEditorOpen}
				AnchorPoint={new Vector2(0.5, 0.5)}
				Position={lerpBinding(onMountAnimation, new UDim2(0.5, 0, 0, rem(1267)), new UDim2(0.5, 0, 0.5, 0))}
				Size={lerpBinding(onMountAnimation, new UDim2(0, 0, 0, 0), new UDim2(0, rem(1085), 0, rem(764)))}
				BackgroundColor3={colors.black}
				BorderSizePixel={0}
				Interactable={context === "Build" && contextOpen && !blueprintEditorOpen}
				ZIndex={2}
			>
				<Frame
					anchorPoint={new Vector2(0.5, 0)}
					position={new UDim2(0.5, 0, 0, 0)}
					size={new UDim2(1, 0, 0.082, 0)}
					backgroundTransparency={1}
				>
					<Image
						anchorPoint={new Vector2(0.5, 0.5)}
						position={new UDim2(0.027, 0, 0.465, 0)}
						rotation={lerpBinding(onMountAnimation, 1440, 0)}
						size={new UDim2(0.031, 0, 0.54, 0)}
						image={IMAGES.ui.Build}
					></Image>

					<Text
						anchorPoint={new Vector2(0.5, 0.5)}
						position={lerpBinding(
							onMountAnimation,
							new UDim2(-0.5, 0, 0.5, 0),
							new UDim2(0.202, 0, 0.5, 0),
						)}
						size={new UDim2(0.304, 0, 0.676, 0)}
						font={fonts.josefinSans.medium}
						text={"Build"}
						textSize={24}
						textColor={colors.white}
						textTransparency={onMountAnimation.map((value) => 1 - value)}
						textXAlignment={Enum.TextXAlignment.Left}
						textYAlignment={Enum.TextYAlignment.Center}
					></Text>

					<Button
						anchorPoint={new Vector2(0.5, 0.5)}
						position={new UDim2(0.96, 0, 0.5, 0)}
						size={new UDim2(0.024, 0, 0.42, 0)}
						onClick={() => {
							store.setContext(undefined);
						}}
					>
						<Image
							anchorPoint={new Vector2(0.5, 0.5)}
							position={new UDim2(0.5, 0, 0.5, 0)}
							rotation={lerpBinding(onMountAnimation, 0, 720)}
							size={new UDim2(1, 0, 1, 0)}
							image={IMAGES.ui.Close}
						></Image>
					</Button>
				</Frame>

				<Frame
					anchorPoint={new Vector2(0, 0)}
					position={new UDim2(0, 0, 0.082, 0)}
					size={new UDim2(0.696, 0, 0.052, 0)}
					backgroundTransparency={1}
				>
					<uistroke
						ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
						Color={colors.grey}
						LineJoinMode={Enum.LineJoinMode.Miter}
						Thickness={1}
					></uistroke>
					<uilistlayout
						Padding={new UDim(0, 0)}
						FillDirection={Enum.FillDirection.Horizontal}
						SortOrder={Enum.SortOrder.LayoutOrder}
						HorizontalAlignment={Enum.HorizontalAlignment.Left}
						VerticalAlignment={Enum.VerticalAlignment.Top}
					></uilistlayout>
					{STRUCTURE_CATEGORIES.map((structureCategory) => (
						<BuildMenuStructureCategoryButton
							structureCategory={structureCategory}
						></BuildMenuStructureCategoryButton>
					))}
				</Frame>

				<Frame
					anchorPoint={new Vector2(1, 0)}
					position={new UDim2(1, 0, 0.082, 0)}
					size={new UDim2(0.304, 0, 0.92, 0)}
					backgroundTransparency={1}
				>
					<uistroke
						ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
						Color={colors.grey}
						LineJoinMode={Enum.LineJoinMode.Miter}
						Thickness={1}
					></uistroke>

					<ReactiveViewportFrame
						ref={structureViewportFrameRef}
						ambient={Color3.fromRGB(182, 182, 182)}
						lightColor={Color3.fromRGB(255, 255, 255)}
						lightDirection={new Vector3(-1, 0, -1)}
						anchorPoint={new Vector2(0.5, 0.5)}
						position={lerpBinding(
							onUpdateAnimation,
							new UDim2(0.5, 0, 0.34, 0),
							new UDim2(0.5, 0, 0.25, 0),
						)}
						size={new UDim2(0.621, 0, 0.292, 0)}
						imageTransparency={onUpdateAnimation.map((value) => 1 - value)}
						defaultCameraPitch={-15}
						defaultCameraOffset={new CFrame(0, 0.7, 5.5)}
						hoverCameraPitch={-24}
						hoverCameraOffset={new CFrame(0, 1, 8.5)}
						cameraRotationSpeed={15}
					></ReactiveViewportFrame>

					<Text
						anchorPoint={new Vector2(0.5, 0.5)}
						position={lerpBinding(
							onUpdateAnimation,
							new UDim2(0.5, 0, 0.055, 0),
							new UDim2(0.5, 0, 0.075, 0),
						)}
						size={new UDim2(1, 0, 0.073, 0)}
						font={fonts.josefinSans.medium}
						text={structureInformation.structureModel.Name}
						textSize={25}
						textColor={colors.white}
						textTransparency={onUpdateAnimation.map((value) => 1 - value)}
						textTruncate={Enum.TextTruncate.SplitWord}
						textXAlignment={Enum.TextXAlignment.Center}
						textYAlignment={Enum.TextYAlignment.Center}
					></Text>

					<Text
						anchorPoint={new Vector2(0.5, 0.5)}
						position={lerpBinding(onUpdateAnimation, new UDim2(0.5, 0, 0.38, 0), new UDim2(0.5, 0, 0.4, 0))}
						size={new UDim2(0.319, 0, 0.032, 0)}
						font={fonts.josefinSans.regular}
						text={"Description"}
						textSize={13}
						textColor={colors.white}
						textTransparency={onUpdateAnimation.map((value) => 1 - value)}
						textXAlignment={Enum.TextXAlignment.Center}
						textYAlignment={Enum.TextYAlignment.Center}
					></Text>

					<Frame
						anchorPoint={new Vector2(0.5, 0.5)}
						position={new UDim2(0.5, 0, 0.425, 0)}
						size={lerpBinding(onUpdateAnimation, new UDim2(0.2, 0, 0.002, 0), new UDim2(0.79, 0, 0.002, 0))}
						backgroundColor={colors.grey}
					></Frame>

					<Text
						anchorPoint={new Vector2(0.5, 0.5)}
						position={lerpBinding(
							onUpdateAnimation,
							new UDim2(0.46, 0, 0.495, 0),
							new UDim2(0.5, 0, 0.495, 0),
						)}
						size={new UDim2(0.79, 0, 0.098, 0)}
						font={fonts.josefinSans.regular}
						lineHeight={1.4}
						text={structureInformation.structureDescription}
						textSize={13}
						textColor={colors.white}
						textTransparency={onUpdateAnimation.map((value) => 1 - value)}
						textWrapped={true}
						textXAlignment={Enum.TextXAlignment.Left}
						textYAlignment={Enum.TextYAlignment.Top}
					></Text>

					<Text
						anchorPoint={new Vector2(0.5, 0.5)}
						position={lerpBinding(
							onUpdateAnimation,
							new UDim2(0.5, 0, 0.544, 0),
							new UDim2(0.5, 0, 0.574, 0),
						)}
						size={new UDim2(0.17, 0, 0.032, 0)}
						font={fonts.josefinSans.regular}
						text={"Stats"}
						textSize={13}
						textColor={colors.white}
						textTransparency={onUpdateAnimation.map((value) => 1 - value)}
						textXAlignment={Enum.TextXAlignment.Center}
						textYAlignment={Enum.TextYAlignment.Center}
					></Text>

					<Frame
						anchorPoint={new Vector2(0.5, 0.5)}
						position={new UDim2(0.5, 0, 0.596, 0)}
						size={lerpBinding(onUpdateAnimation, new UDim2(0.2, 0, 0.002, 0), new UDim2(0.79, 0, 0.002, 0))}
						backgroundColor={colors.grey}
					></Frame>

					<Frame
						anchorPoint={new Vector2(0.5, 0.5)}
						position={new UDim2(0.5, 0, 0.75, 0)}
						size={new UDim2(0.79, 0, 0.271, 0)}
						backgroundTransparency={1}
					>
						<uilistlayout
							Padding={new UDim(0, 8)}
							FillDirection={Enum.FillDirection.Vertical}
							SortOrder={Enum.SortOrder.LayoutOrder}
							HorizontalAlignment={Enum.HorizontalAlignment.Left}
							VerticalAlignment={Enum.VerticalAlignment.Top}
						></uilistlayout>

						<Frame
							anchorPoint={new Vector2(0, 0)}
							position={lerpBinding(onUpdateAnimation, new UDim2(1, 0, 0, 0), new UDim2(0, 0, 0, 0))}
							size={new UDim2(1, 0, 0.158, 0)}
							backgroundTransparency={1}
							layoutOrder={0}
						>
							<Text
								anchorPoint={new Vector2(0.5, 0.5)}
								position={new UDim2(0.059, 0, 0.5, 0)}
								size={new UDim2(0.118, 0, 1, 0)}
								font={fonts.josefinSans.light}
								text="$"
								textSize={lerpBinding(onUpdateAnimation, 0, 18)}
								textColor={colors.white}
								textTransparency={onUpdateAnimation.map((value) => 1 - value)}
								textXAlignment={Enum.TextXAlignment.Center}
								textYAlignment={Enum.TextYAlignment.Center}
							></Text>

							<Text
								anchorPoint={new Vector2(1, 0.5)}
								position={lerpBinding(
									onUpdateAnimation,
									new UDim2(1.2, 0, 0.5, 0),
									new UDim2(1, 0, 0.5, 0),
								)}
								size={new UDim2(0.847, 0, 1, 0)}
								font={fonts.josefinSans.regular}
								text={`Cost : $${[
									structureInformation.structureModel.GetAttribute("Id") !== undefined
										? undefined
										: structureInformation.structureModel,
									...structureInformation.structureModel.GetDescendants(),
								]
									.filterUndefined()
									.filter(
										(instance): instance is Model =>
											instance.IsA("Model") && instance.Name in STRUCTURES,
									)
									.reduce(
										(value, structureModel) => (value += STRUCTURES[structureModel.Name].cost),
										0,
									)}`}
								textSize={14}
								textColor={colors.white}
								textTransparency={onUpdateAnimation.map((value) => 1 - value)}
								textXAlignment={Enum.TextXAlignment.Left}
								textYAlignment={Enum.TextYAlignment.Center}
							></Text>
						</Frame>
						{structureInformation.structureModel.GetAttribute("Id") !== undefined
							? undefined
							: Object.entries(STRUCTURES[structureInformation.structureModel.Name].constants).map(
									([key, value]) => {
										if (
											key !== "ThroughputRate" &&
											key !== "FlowRate" &&
											key !== "FluidCapacity" &&
											key !== "PowerConsumption" &&
											key !== "PowerProduction"
										)
											return undefined;
										return (
											<Frame
												anchorPoint={new Vector2(0, 0)}
												position={new UDim2(0, 0, 0, 0)}
												size={new UDim2(1, 0, 0.158, 0)}
												backgroundTransparency={1}
												layoutOrder={
													(key === "ThroughputRate" || key === "FlowRate"
														? 0
														: key === "FluidCapacity"
														? 1
														: key === "PowerConsumption" || key === "PowerProduction"
														? 2
														: 0) + 1
												}
											>
												<Image
													anchorPoint={new Vector2(0.5, 0.5)}
													position={new UDim2(0.059, 0, 0.5, 0)}
													size={lerpBinding(
														onUpdateAnimation,
														new UDim2(0, 0, 0, 0),
														new UDim2(0.118, 0, 1, 0),
													)}
													image={
														key === "ThroughputRate" || key === "FlowRate"
															? "rbxassetid://102476478936490"
															: key === "FluidCapacity"
															? "rbxassetid://118155948895616"
															: "rbxassetid://136540953943718"
													}
													imageTransparency={onUpdateAnimation.map((value) => 1 - value)}
												></Image>

												<Text
													anchorPoint={new Vector2(1, 0.5)}
													position={lerpBinding(
														onUpdateAnimation,
														new UDim2(1.2, 0, 0.5, 0),
														new UDim2(1, 0, 0.5, 0),
													)}
													size={new UDim2(0.847, 0, 1, 0)}
													font={fonts.josefinSans.regular}
													text={
														key === "ThroughputRate"
															? `Throughput Rate : ${value}/Min`
															: key === "FlowRate"
															? `Flow Rate ${value}m³`
															: key === "FluidCapacity"
															? `Fluid Capacity : ${value}m³`
															: `Power ${
																	key === "PowerConsumption"
																		? "Consumption"
																		: "Production"
															  } : ${value}MW`
													}
													textSize={14}
													textColor={colors.white}
													textTransparency={onUpdateAnimation.map((value) => 1 - value)}
													textXAlignment={Enum.TextXAlignment.Left}
													textYAlignment={Enum.TextYAlignment.Center}
												></Text>
											</Frame>
										);
									},
							  )}
					</Frame>
				</Frame>

				{STRUCTURE_CATEGORIES.map((structureCategory) => (
					<BuildMenuStructureCategory structureCategory={structureCategory}></BuildMenuStructureCategory>
				))}
			</canvasgroup>
			<BuildMenuBlueprintEditor></BuildMenuBlueprintEditor>
		</>
	);
}
