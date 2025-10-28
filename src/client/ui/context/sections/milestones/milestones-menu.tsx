import { Object } from "@rbxts/luau-polyfill";
import { lerpBinding, useEventListener, useMotion, useUpdateEffect } from "@rbxts/pretty-react-hooks";
import React, { useState } from "@rbxts/react";
import { useSelector } from "@rbxts/react-reflex";
import { Players } from "@rbxts/services";
import { useStore } from "client/hooks";
import { useRem } from "client/hooks/use-rem";
import { Events } from "client/network";
import MilestoneService from "client/services/progression/milestone-service";
import { selectContext } from "client/store/context";
import { colors, fonts, springs } from "client/ui/constants";
import { Button } from "client/ui/core/button";
import { Frame } from "client/ui/core/frame";
import { Image } from "client/ui/core/image";
import { Text } from "client/ui/core/text";
import { IMAGES } from "shared/assets/images";
import { ITEMS } from "shared/constants/items";
import { MilestoneData, MILESTONES } from "shared/constants/milestones";
import { STRUCTURES } from "shared/constants/structures";

export function MilestonesMenu() {
	const store = useStore();
	const rem = useRem();

	const context = useSelector(selectContext);
	const [milestoneData, setMilestoneData] = useState<MilestoneData>();

	const [mountAnimation, mountAnimationMotion] = useMotion(0);

	useEventListener(Events.OnPlotInitialization, (player) => {
		if (player !== Players.LocalPlayer) return;
		MilestoneService.getInst().onMilestoneDataUpdate.Connect((milestoneData) => {
			setMilestoneData({ ...milestoneData });
		});
	});

	useUpdateEffect(() => {
		mountAnimationMotion.spring(context === "Milestones" ? 1 : 0, springs.gentle);
	}, [context]);

	return (
		<canvasgroup
			GroupTransparency={mountAnimation.map((value) => 1 - value)}
			AnchorPoint={new Vector2(0.5, 0.5)}
			Position={lerpBinding(mountAnimation, new UDim2(0.5, 0, 0, rem(1267)), new UDim2(0.5, 0, 0.5, 0))}
			Size={lerpBinding(mountAnimation, new UDim2(0, 0, 0, 0), new UDim2(0, rem(1243), 0, rem(880)))}
			BackgroundColor3={colors.black}
			BorderSizePixel={0}
			Interactable={context === "Milestones"}
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
					rotation={lerpBinding(mountAnimation, -1440, 0)}
					size={new UDim2(0.032, 0, 0.56, 0)}
					image={IMAGES.ui.Milestones}
				></Image>

				<Text
					anchorPoint={new Vector2(0.5, 0.5)}
					position={lerpBinding(mountAnimation, new UDim2(-0.5, 0, 0.5, 0), new UDim2(0.1, 0, 0.5, 0))}
					size={new UDim2(0.101, 0, 0.676, 0)}
					font={fonts.josefinSans.medium}
					textSize={24}
					textTransparency={mountAnimation.map((value) => 1 - value)}
					textColor={colors.white}
					text={"Milestones"}
					textXAlignment={Enum.TextXAlignment.Left}
					textYAlignment={Enum.TextYAlignment.Center}
				></Text>

				<Button
					anchorPoint={new Vector2(0.5, 0.5)}
					position={new UDim2(0.959, 0, 0.5, 0)}
					size={new UDim2(0.025, 0, 0.43, 0)}
					onClick={() => {
						store.setContext(undefined);
					}}
				>
					<Image
						anchorPoint={new Vector2(0.5, 0.5)}
						position={new UDim2(0.5, 0, 0.5, 0)}
						rotation={lerpBinding(mountAnimation, 0, 720)}
						size={new UDim2(1, 0, 1, 0)}
						image={IMAGES.ui.Close}
					></Image>
				</Button>

				<uistroke
					ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
					Color={colors.grey}
					LineJoinMode={Enum.LineJoinMode.Miter}
				></uistroke>
			</Frame>

			<scrollingframe
				AnchorPoint={new Vector2(0, 1)}
				Position={new UDim2(0, 0, 1, 0)}
				Size={new UDim2(1, 0, 0.918, 0)}
				BackgroundTransparency={1}
				CanvasSize={new UDim2(16, 0, 0, 0)}
				ScrollBarThickness={0}
				ScrollBarImageTransparency={1}
				ScrollingDirection={Enum.ScrollingDirection.X}
			>
				<Frame
					anchorPoint={new Vector2(0.5, 0.5)}
					position={new UDim2(0.5, 0, 0.225, 0)}
					size={new UDim2(1, 0, 0.387, 0)}
					backgroundTransparency={1}
				>
					<uilistlayout
						Padding={new UDim(0, 80)}
						FillDirection={Enum.FillDirection.Horizontal}
						SortOrder={Enum.SortOrder.LayoutOrder}
						HorizontalAlignment={Enum.HorizontalAlignment.Left}
						VerticalAlignment={Enum.VerticalAlignment.Center}
					></uilistlayout>

					<uipadding PaddingLeft={new UDim(0, 290)} PaddingRight={new UDim(0, 290)}></uipadding>

					{Object.entries(MILESTONES).map(([, milestoneDefinition]) => (
						<>
							<Frame
								size={new UDim2(0.012, 0, 1, 0)}
								backgroundTransparency={1}
								layoutOrder={
									milestoneDefinition.index === 0
										? milestoneDefinition.index
										: milestoneDefinition.index + 1
								}
							>
								<Text
									anchorPoint={new Vector2(0.5, 0)}
									position={new UDim2(0.5, 0, 0, 0)}
									size={new UDim2(1, 0, 0.18, 0)}
									font={fonts.josefinSans.bold}
									textSize={33}
									textColor={colors.white}
									text="Milestone"
									textXAlignment={Enum.TextXAlignment.Center}
									textYAlignment={Enum.TextYAlignment.Center}
								></Text>

								<Text
									anchorPoint={new Vector2(0.5, 0.5)}
									position={new UDim2(0.5, 0, 0.317, 0)}
									size={new UDim2(1, 0, 0.273, 0)}
									font={fonts.josefinSans.bold}
									textSize={100}
									textColor={colors.white}
									text={tostring(milestoneDefinition.index)}
									textXAlignment={Enum.TextXAlignment.Center}
									textYAlignment={Enum.TextYAlignment.Top}
								></Text>

								<Button
									anchorPoint={new Vector2(0.5, 0.5)}
									position={new UDim2(0.5, 0, 0.58, 0)}
									size={new UDim2(0.72, 0, 0.14, 0)}
									visible={
										milestoneData !== undefined &&
										milestoneData.milestone === milestoneDefinition.index - 1 &&
										Object.entries(
											Object.entries(MILESTONES).find(
												([_, milestoneDefinition]) =>
													milestoneDefinition.index === milestoneData.milestone + 1,
											)![1].itemsToDeliver,
										).every(
											([itemName, count]) =>
												milestoneData.deliveredItems[itemName] !== undefined &&
												milestoneData.deliveredItems[itemName] >= count,
										)
									}
									onClick={() => {
										Events.UnlockMilestone(milestoneData!.milestone + 1);
									}}
								>
									<Frame size={new UDim2(1, 0, 1, 0)} backgroundColor={colors.lightblue}>
										<Text
											anchorPoint={new Vector2(0.5, 0.5)}
											position={new UDim2(0.5, 0, 0.5, 0)}
											size={new UDim2(1, 0, 1, 0)}
											zIndex={2}
											font={fonts.josefinSans.medium}
											textSize={21}
											textColor={colors.white}
											text="UNLOCK"
											textXAlignment={Enum.TextXAlignment.Center}
											textYAlignment={Enum.TextYAlignment.Center}
										></Text>
										<uicorner CornerRadius={new UDim(0, 6)}></uicorner>
										<uistroke
											ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
											Color={colors.marineblue}
											LineJoinMode={Enum.LineJoinMode.Round}
											Thickness={1.5}
										></uistroke>
										<Image
											anchorPoint={new Vector2(0.5, 0.5)}
											position={new UDim2(0.5, 0, 0.5, 0)}
											size={new UDim2(2, 0, 2.5, 0)}
											image={IMAGES.ui.Glow}
											imageColor={colors.lightblue}
											imageTransparency={0.7}
										></Image>
									</Frame>
								</Button>

								<Image
									anchorPoint={new Vector2(0.5, 0.5)}
									position={new UDim2(0.5, 0, 0.575, 0)}
									size={new UDim2(0.325, 0, 0.24, 0)}
									image={
										milestoneData !== undefined
											? milestoneData.milestone >= milestoneDefinition.index
												? "rbxassetid://131656817497222"
												: "rbxassetid://108514371974468"
											: undefined
									}
									imageColor={
										milestoneData !== undefined
											? milestoneData.milestone >= milestoneDefinition.index
												? colors.lightgreen
												: Object.entries(
														Object.entries(MILESTONES).find(
															([_, milestoneDefinition]) =>
																milestoneDefinition.index ===
																milestoneData.milestone + 1,
														)![1].itemsToDeliver,
												  ).some(
														([itemName, count]) =>
															milestoneData.deliveredItems[itemName] === undefined ||
															milestoneData.deliveredItems[itemName] < count,
												  )
												? colors.white
												: undefined
											: undefined
									}
									visible={
										milestoneData !== undefined &&
										(milestoneData.milestone !== milestoneDefinition.index - 1 ||
											Object.entries(
												Object.entries(MILESTONES).find(
													([_, milestoneDefinition]) =>
														milestoneDefinition.index === milestoneData.milestone + 1,
												)![1].itemsToDeliver,
											).some(
												([itemName, count]) =>
													milestoneData.deliveredItems[itemName] === undefined ||
													milestoneData.deliveredItems[itemName] < count,
											))
									}
								>
									<Image
										anchorPoint={new Vector2(0.5, 0.5)}
										position={new UDim2(0.5, 0, 0.5, 0)}
										size={new UDim2(2, 0, 2, 0)}
										image={IMAGES.ui.Glow}
										imageColor={
											milestoneData !== undefined
												? milestoneData.milestone >= milestoneDefinition.index
													? colors.lightgreen
													: colors.white
												: undefined
										}
										imageTransparency={0.9}
									></Image>
								</Image>

								<Frame
									anchorPoint={new Vector2(0.5, 1)}
									position={new UDim2(0.5, 0, 1, 0)}
									size={new UDim2(0.006, 0, 0.25, 0)}
									backgroundColor={colors.grey}
								></Frame>
							</Frame>

							{milestoneDefinition.index !== Object.entries(MILESTONES).size() - 1 ? (
								<Frame
									size={new UDim2(0.035, 0, 0.005, 0)}
									backgroundColor={colors.grey}
									layoutOrder={milestoneDefinition.index + 1}
								></Frame>
							) : undefined}
						</>
					))}
				</Frame>

				<Frame
					anchorPoint={new Vector2(0.5, 1)}
					position={new UDim2(0.5, 0, 1, 0)}
					size={new UDim2(1, 0, 0.581, 0)}
					backgroundTransparency={1}
				>
					<uilistlayout
						Padding={new UDim(0, 482)}
						FillDirection={Enum.FillDirection.Horizontal}
						SortOrder={Enum.SortOrder.LayoutOrder}
						HorizontalAlignment={Enum.HorizontalAlignment.Left}
						VerticalAlignment={Enum.VerticalAlignment.Top}
					></uilistlayout>

					<uipadding PaddingLeft={new UDim(0, 107)} PaddingRight={new UDim(0, 107)}></uipadding>

					{Object.entries(MILESTONES).map(([milestoneName, milestoneDefinition]) => (
						<Frame
							size={new UDim2(0.03, 0, 0.862, 0)}
							backgroundTransparency={1}
							layoutOrder={milestoneDefinition.index}
						>
							<uistroke
								ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
								Color={colors.grey}
								LineJoinMode={Enum.LineJoinMode.Miter}
							></uistroke>
							<Text
								anchorPoint={new Vector2(0.5, 0.5)}
								position={new UDim2(0.382, 0, 0.092, 0)}
								size={new UDim2(0.674, 0, 0.086, 0)}
								font={fonts.josefinSans.regular}
								textSize={24}
								textColor={colors.white}
								text={milestoneName}
								textXAlignment={Enum.TextXAlignment.Left}
								textYAlignment={Enum.TextYAlignment.Center}
							></Text>

							<Frame
								anchorPoint={new Vector2(0.5, 0.5)}
								position={new UDim2(0.48, 0, 0.32, 0)}
								size={new UDim2(0.869, 0, 0.316, 0)}
								backgroundTransparency={1}
							>
								<uilistlayout
									Padding={new UDim(0, 12)}
									FillDirection={Enum.FillDirection.Vertical}
									SortOrder={Enum.SortOrder.LayoutOrder}
									Wraps={true}
									HorizontalAlignment={Enum.HorizontalAlignment.Left}
									VerticalAlignment={Enum.VerticalAlignment.Top}
								></uilistlayout>

								{Object.entries(milestoneDefinition.itemsToDeliver)
									.sort(([itemNameA], [itemNameB]) => ITEMS[itemNameA].index < ITEMS[itemNameB].index)
									.map(([itemName, count]) => (
										<Frame size={new UDim2(0.5, 0, 0.25, 0)} backgroundTransparency={1}>
											<Text
												size={new UDim2(1, 0, 0.7, 0)}
												font={fonts.josefinSans.regular}
												textSize={13}
												textColor={colors.white}
												text={`Deliver ${count} ${itemName} (${math.clamp(
													milestoneData !== undefined
														? milestoneData?.milestone === milestoneDefinition.index - 1
															? milestoneData.deliveredItems[itemName] ?? 0
															: milestoneData.milestone < milestoneDefinition.index - 1
															? 0
															: count
														: 0,
													0,
													count,
												)}/${count})`}
												textXAlignment={Enum.TextXAlignment.Left}
												textYAlignment={Enum.TextYAlignment.Center}
											></Text>
											<Frame
												anchorPoint={new Vector2(0, 1)}
												position={new UDim2(0, 0, 1, 0)}
												size={new UDim2(1, 0, 0.2, 0)}
												backgroundColor={Color3.fromRGB(32, 32, 32)}
											>
												<Frame
													anchorPoint={new Vector2(0, 0.5)}
													position={new UDim2(0, 0, 0.5, 0)}
													size={
														new UDim2(
															math.clamp(
																(milestoneData !== undefined
																	? milestoneData?.milestone ===
																	  milestoneDefinition.index - 1
																		? milestoneData.deliveredItems[itemName] ?? 0
																		: milestoneData.milestone <
																		  milestoneDefinition.index - 1
																		? 0
																		: count
																	: 0) / count,
																0,
																1,
															),
															0,
															0.6,
															0,
														)
													}
													backgroundColor={colors.lightblue}
												>
													<Image
														anchorPoint={new Vector2(0.5, 0.5)}
														position={new UDim2(0.5, 0, 0.5, 0)}
														size={new UDim2(1.6, 0, 2.5, 0)}
														image={IMAGES.ui.Glow}
														imageColor={colors.lightblue}
														imageTransparency={0.7}
													></Image>
												</Frame>
											</Frame>
										</Frame>
									))}
							</Frame>
							<Text
								anchorPoint={new Vector2(0.5, 0.5)}
								position={new UDim2(0.135, 0, 0.571, 0)}
								size={new UDim2(0.18, 0, 0.086, 0)}
								font={fonts.josefinSans.regular}
								textSize={20}
								textColor={colors.white}
								text="Rewards"
								textXAlignment={Enum.TextXAlignment.Left}
								textYAlignment={Enum.TextYAlignment.Center}
							></Text>
							<scrollingframe
								AnchorPoint={new Vector2(0.5, 0.5)}
								Position={new UDim2(0.48, 0, 0.79, 0)}
								Size={new UDim2(0.87, 0, 0.316, 0)}
								CanvasSize={new UDim2(0, 0, 2, 0)}
								BackgroundTransparency={1}
								ScrollBarThickness={0}
								ScrollBarImageTransparency={1}
								ScrollingDirection={Enum.ScrollingDirection.Y}
							>
								<uigridlayout
									CellPadding={new UDim2(0, 2, 0, 0)}
									CellSize={new UDim2(0, 94, 0, 94)}
									FillDirection={Enum.FillDirection.Horizontal}
									SortOrder={Enum.SortOrder.LayoutOrder}
									HorizontalAlignment={Enum.HorizontalAlignment.Left}
									VerticalAlignment={Enum.VerticalAlignment.Top}
								></uigridlayout>

								{milestoneDefinition.rewards.map((milestoneReward) => (
									<Frame backgroundTransparency={1}>
										<Image
											anchorPoint={new Vector2(0.5, 0.5)}
											position={new UDim2(0.5, 0, 0.4, 0)}
											size={new UDim2(0.8, 0, 0.8, 0)}
											image={STRUCTURES[milestoneReward].image}
										></Image>

										<Text
											anchorPoint={new Vector2(0.5, 0.5)}
											position={new UDim2(0.5, 0, 0.85, 0)}
											size={new UDim2(1, 0, 0.18, 0)}
											font={fonts.josefinSans.regular}
											textSize={8}
											textColor={colors.white}
											text={milestoneReward}
											textXAlignment={Enum.TextXAlignment.Center}
											textYAlignment={Enum.TextYAlignment.Center}
										></Text>
									</Frame>
								))}
							</scrollingframe>
						</Frame>
					))}
				</Frame>
			</scrollingframe>
		</canvasgroup>
	);
}
