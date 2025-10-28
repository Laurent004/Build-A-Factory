import React, { useRef, useState } from "@rbxts/react";
import { STRUCTURE_CATEGORIES, STRUCTURES } from "shared/constants/structures";
import { StructureCategoryButton } from "./structure-category-button";
import { StructureCategory } from "./structure-category";
import { Frame } from "client/ui/core/frame";
import { colors, fonts, springs } from "client/ui/constants";
import { useStore } from "client/hooks";
import { lerpBinding, useEventListener, useMotion, useUpdateEffect } from "@rbxts/pretty-react-hooks";
import { useSelector } from "@rbxts/react-reflex";
import { selectContext, selectContextOpen } from "client/store/context";
import { selectBuildMenuBlueprintEditorOpen, selectBuildMenuStructureInformation } from "client/store/context/build";
import { IMAGES } from "shared/assets/images";
import { Image } from "client/ui/core/image";
import { Button } from "client/ui/core/button";
import { Text } from "client/ui/core/text";
import { ReactiveViewportFrame } from "client/ui/core/reactive-viewport-frame";
import { Object } from "@rbxts/luau-polyfill";
import { BlueprintEditor } from "./blueprint-editor";
import { useRem } from "client/hooks/use-rem";
import { StructureStat } from "./structure-stat";
import { flatMap } from "shared/utils/array";
import MilestoneService from "client/services/progression/milestone-service";
import { MilestoneData } from "shared/constants/milestones";
import { Events } from "client/network";
import { Players } from "@rbxts/services";

export function BuildMenu() {
	const store = useStore();
	const rem = useRem();

	const context = useSelector(selectContext);
	const contextOpen = useSelector(selectContextOpen);
	const blueprintEditorOpen = useSelector(selectBuildMenuBlueprintEditorOpen);
	const selectedStructureInformation = useSelector(selectBuildMenuStructureInformation);

	const [milestoneData, setMilestoneData] = useState<MilestoneData>();
	const structureViewportFrameRef = useRef<ViewportFrame>();
	const [onMountAnimation, onMountAnimationMotion] = useMotion(0);
	const [onUpdateAnimation, onUpdateAnimationMotion] = useMotion(0);
	const [onBlueprintEditorOpneAnimation, onBlueprintEditorOpenAnimationMotion] = useMotion(0);

	useEventListener(Events.OnPlotInitialization, (player) => {
		if (player !== Players.LocalPlayer) return;
		MilestoneService.getInst().onMilestoneDataUpdate.Connect((milestoneData) => {
			setMilestoneData({ ...milestoneData });
		});
	});

	useUpdateEffect(() => {
		if (context !== "Build") return;
		for (const model of structureViewportFrameRef
			.current!.GetDescendants()
			.filter((instance): instance is Model => instance.IsA("Model"))) {
			model.Destroy();
		}
		const newStructureModel = selectedStructureInformation.structureModel.Clone();
		newStructureModel.PivotTo(new CFrame(0, 1, 0));
		newStructureModel.Parent = structureViewportFrameRef.current;

		onUpdateAnimationMotion.immediate(0);
		onUpdateAnimationMotion.spring(1, springs.responsive);
	}, [context, selectedStructureInformation]);

	useUpdateEffect(() => {
		if (context !== "Build") {
			store.setBuildMenuBuildingStructureModel(undefined);
		}
		onMountAnimationMotion.spring(context === "Build" && contextOpen ? 1 : 0, springs.gentle);
	}, [context, contextOpen]);

	useUpdateEffect(() => {
		onBlueprintEditorOpenAnimationMotion.spring(blueprintEditorOpen ? 1 : 0, springs.slow);
	}, [blueprintEditorOpen]);

	return (
		<>
			<canvasgroup
				GroupTransparency={onMountAnimation.map((value) => 1 - value)}
				GroupColor3={lerpBinding(onBlueprintEditorOpneAnimation, colors.white, colors.grey)}
				AnchorPoint={new Vector2(0.5, 0.5)}
				Position={lerpBinding(onMountAnimation, new UDim2(0.5, 0, 0, rem(1267)), new UDim2(0.5, 0, 0.5, 0))}
				Size={lerpBinding(onMountAnimation, new UDim2(0, 0, 0, 0), new UDim2(0, rem(1085), 0, rem(764)))}
				BackgroundColor3={colors.black}
				BorderSizePixel={0}
				Interactable={context === "Build" && contextOpen && !blueprintEditorOpen}
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
						textSize={24}
						textTransparency={onMountAnimation.map((value) => 1 - value)}
						textColor={colors.white}
						text={"Build"}
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
					anchorPoint={new Vector2(0.5, 0.5)}
					position={new UDim2(0.348, 0, 0.106, 0)}
					size={new UDim2(0.697, 0, 0.052, 0)}
					backgroundTransparency={1}
				>
					<uistroke
						ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
						Color={colors.grey}
						LineJoinMode={Enum.LineJoinMode.Miter}
					></uistroke>
					<uilistlayout
						FillDirection={Enum.FillDirection.Horizontal}
						HorizontalAlignment={Enum.HorizontalAlignment.Left}
						VerticalAlignment={Enum.VerticalAlignment.Top}
					></uilistlayout>
					{STRUCTURE_CATEGORIES.map((structureCategory) => (
						<StructureCategoryButton structureCategory={structureCategory}></StructureCategoryButton>
					))}
				</Frame>

				<Frame
					anchorPoint={new Vector2(0.5, 0.5)}
					position={new UDim2(0.848, 0, 0.54, 0)}
					size={new UDim2(0.304, 0, 0.92, 0)}
					backgroundTransparency={1}
				>
					<uistroke
						ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
						Color={colors.grey}
						LineJoinMode={Enum.LineJoinMode.Miter}
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
						defaultCameraPitch={-15}
						defaultCameraOffset={new CFrame(0, 0.7, 5.5)}
						hoverCameraPitch={-24}
						hoverCameraOffset={new CFrame(0, 1, 8.5)}
						cameraRotationSpeed={15}
						imageTransparency={onUpdateAnimation.map((value) => 1 - value)}
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
						textSize={25}
						textTransparency={onUpdateAnimation.map((value) => 1 - value)}
						textColor={colors.white}
						text={selectedStructureInformation.structureModel.Name}
					></Text>

					<Text
						anchorPoint={new Vector2(0.5, 0.5)}
						position={lerpBinding(onUpdateAnimation, new UDim2(0.5, 0, 0.38, 0), new UDim2(0.5, 0, 0.4, 0))}
						size={new UDim2(0.319, 0, 0.032, 0)}
						font={fonts.josefinSans.regular}
						textSize={13}
						textTransparency={onUpdateAnimation.map((value) => 1 - value)}
						textColor={colors.white}
						text={"Description"}
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
						textSize={13}
						textTransparency={onUpdateAnimation.map((value) => 1 - value)}
						textColor={colors.white}
						text={selectedStructureInformation.structureDescription}
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
						textSize={13}
						textTransparency={onUpdateAnimation.map((value) => 1 - value)}
						textColor={colors.white}
						text={"Stats"}
					></Text>

					<Frame
						anchorPoint={new Vector2(0.5, 0.5)}
						position={new UDim2(0.5, 0, 0.596, 0)}
						size={lerpBinding(onUpdateAnimation, new UDim2(0.2, 0, 0.002, 0), new UDim2(0.79, 0, 0.002, 0))}
						backgroundColor={colors.grey}
					></Frame>

					<Frame
						anchorPoint={new Vector2(0.5, 0.5)}
						position={new UDim2(0.5, 0, 0.696, 0)}
						size={new UDim2(0.79, 0, 0.162, 0)}
						backgroundTransparency={1}
					>
						<uilistlayout
							Padding={new UDim(0, 7)}
							SortOrder={Enum.SortOrder.LayoutOrder}
							HorizontalAlignment={Enum.HorizontalAlignment.Center}
							VerticalAlignment={Enum.VerticalAlignment.Top}
						></uilistlayout>

						{selectedStructureInformation.structureModel.Name in STRUCTURES ? (
							<>
								<StructureStat
									index={0}
									image="rbxassetid://128505692814620"
									text={`Price : $${
										STRUCTURES[selectedStructureInformation.structureModel.Name].price
									}`}
								></StructureStat>

								{Object.entries(
									new Map([
										...Object.entries(
											STRUCTURES[selectedStructureInformation.structureModel.Name].constants,
										),
										...flatMap(
											selectedStructureInformation.structureModel
												.GetChildren()
												.filter(
													(instance): instance is Model =>
														instance.IsA("Model") && instance.Name in STRUCTURES,
												),
											(structureModel) =>
												Object.entries(STRUCTURES[structureModel.Name].constants),
										),
									]),
								).map(([key, value]) => {
									let index: number;
									let image: string;
									let text: string;

									switch (key) {
										case "TransportSpeed":
											index = 1;
											image = IMAGES.ui.Chronometer;
											text = `Items/Min : ${60 * (value as number)}`;
											break;
										case "Slots":
											index = 2;
											image = IMAGES.ui.Items;
											text = `Storage Capacity : ${
												(value as number) *
												(STRUCTURES[selectedStructureInformation.structureModel.Name].constants[
													"SlotStackSize"
												] as number)
											}`;
											break;
										case "PowerConsumption":
											index = 2;
											image = IMAGES.ui.Power;
											text = `Power Consumption : ${value} MW`;
											break;
										case "MaxPowerProduction":
											index = 1;
											image = IMAGES.ui.Power;
											text = `Max Power Production : ${value} MW`;
											break;
										case "MaxConnections":
											index = 1;
											image = IMAGES.ui.Power;
											text = `Max Connections : ${value}`;
											break;
										case "PowerStorageCapacity":
											index = 1;
											image = IMAGES.ui.Power;
											text = `Power Storage Capacity : ${value} MW`;
											break;
										case "PowerTransferRate":
											index = 2;
											image = IMAGES.ui.Power;
											text = `Power Transfer Rate : ${3600 * (value as number)} MWh`;
											break;
										default:
											return undefined;
									}

									return <StructureStat index={index} image={image} text={text}></StructureStat>;
								})}
							</>
						) : undefined}
					</Frame>
				</Frame>

				{STRUCTURE_CATEGORIES.map((structureCategory) => (
					<StructureCategory
						structureCategory={structureCategory}
						milestone={milestoneData !== undefined ? milestoneData.milestone : 0}
					></StructureCategory>
				))}
			</canvasgroup>
			<BlueprintEditor></BlueprintEditor>
		</>
	);
}
