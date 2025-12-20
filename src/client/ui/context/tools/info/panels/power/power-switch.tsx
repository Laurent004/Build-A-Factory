import React from "@rbxts/react";
import { Text } from "client/ui/core/text";
import { fonts, colors, springs } from "client/ui/constants";
import { Frame } from "client/ui/core/frame";
import { useSelector } from "@rbxts/react-reflex";
import { lerpBinding, useMotion, useUpdateEffect } from "@rbxts/pretty-react-hooks";
import { InfoPanelPowerGraph } from "./power-graph";
import { Image } from "client/ui/core/image";
import { IMAGES } from "shared/assets/images";
import { Button } from "client/ui/core/button";
import { store } from "client/store";
import { useRem } from "client/hooks/use-rem";
import { BaseInfoPanel } from "../base";
import { selectContextStructureModelAttribute, selectContextStructureModels } from "client/store/context";

export function PowerSwitchInfoPanel() {
	const rem = useRem();
	const structureModel = useSelector(selectContextStructureModels)[0];
	const on = useSelector(selectContextStructureModelAttribute("On"));
	const [onMountAnimation, onMountAnimationMotion] = useMotion(0);
	const [onClickAnimation, onClickAnimationMotion] = useMotion(0);

	useUpdateEffect(() => {
		onMountAnimationMotion.spring(structureModel?.Name === "Power Switch" ? 1 : 0, springs.gentle);
	}, [structureModel]);

	useUpdateEffect(() => {
		onClickAnimationMotion.spring(on === true ? 1 : 0, springs.gentle);
	}, [on]);

	return (
		<BaseInfoPanel
			active={structureModel?.Name === "Power Switch"}
			size={new UDim2(0, rem(407), 0, rem(741))}
			headerSize={new UDim2(1, 0, 0.06, 0)}
			headerIconSize={new UDim2(0.06, 0, 0.54, 0)}
			descriptionPosition={new UDim2(0.457, 0, 0.104, 0)}
			descriptionSize={new UDim2(0.829, 0, 0.045, 0)}
		>
			<Frame
				anchorPoint={new Vector2(0.5, 0.5)}
				position={new UDim2(0.5, 0, 0.332, 0)}
				size={new UDim2(0.915, 0, 0.366, 0)}
				backgroundTransparency={1}
			>
				<Text
					anchorPoint={new Vector2(0, 0)}
					position={lerpBinding(onMountAnimation, new UDim2(-0.25, 0, 0, 0), new UDim2(0, 0, 0, 0))}
					size={new UDim2(0.582, 0, 0.18, 0)}
					font={fonts.josefinSans.medium}
					text={"Power Graph (Red) :"}
					textSize={19}
					textColor={colors.white}
					textTransparency={onMountAnimation.map((value) => 1 - value)}
					textXAlignment={Enum.TextXAlignment.Left}
					textYAlignment={Enum.TextYAlignment.Top}
				></Text>

				<InfoPanelPowerGraph
					attachment={
						structureModel?.Name === "Power Switch"
							? structureModel
									.GetDescendants()
									.find(
										(instance): instance is Attachment =>
											instance.IsA("Attachment") &&
											instance.Name === "PowerAttachment" &&
											instance.Parent?.Name === "Red",
									)!
							: undefined
					}
					graphWidth={370}
					graphHeight={163}
					infoIconSize={new UDim2(0.076, 0, 0.51, 0)}
				></InfoPanelPowerGraph>
			</Frame>

			<Frame
				anchorPoint={new Vector2(0.5, 0.5)}
				position={new UDim2(0.326, 0, 0.564, 0)}
				size={new UDim2(0.564, 0, 0.038, 0)}
				backgroundTransparency={1}
			>
				<Text
					anchorPoint={new Vector2(0, 0.5)}
					position={lerpBinding(onMountAnimation, new UDim2(0.35, 0, 0.5, 0), new UDim2(0, 0, 0.5, 0))}
					size={new UDim2(0.329, 0, 1, 0)}
					font={fonts.josefinSans.medium}
					text={"Switch :"}
					textSize={19}
					textColor={colors.white}
					textXAlignment={Enum.TextXAlignment.Left}
					textYAlignment={Enum.TextYAlignment.Center}
				></Text>

				<Frame
					anchorPoint={new Vector2(1, 0.5)}
					position={new UDim2(1, 0, 0.5, 0)}
					size={new UDim2(0.623, 0, 1, 0)}
					backgroundTransparency={1}
				>
					<Text
						anchorPoint={new Vector2(0, 0.5)}
						position={new UDim2(0, 0, 0.5, 0)}
						size={new UDim2(0.237, 0, 1, 0)}
						font={fonts.josefinSans.medium}
						text={"OFF"}
						textSize={15}
						textColor={colors.grey}
						textXAlignment={Enum.TextXAlignment.Center}
						textYAlignment={Enum.TextYAlignment.Center}
					></Text>

					<Button
						anchorPoint={new Vector2(0.5, 0.5)}
						position={new UDim2(0.5, 0, 0.5, 0)}
						size={new UDim2(0.31, 0, 0.85, 0)}
						backgroundTransparency={1}
						onClick={() => {
							store.setContextStructuresModelsAttribute("On", on === true ? false : true);
						}}
					>
						<Frame
							anchorPoint={new Vector2(0, 0)}
							position={new UDim2(0, 0, 0, 0)}
							size={new UDim2(1, 0, 1, 0)}
							backgroundTransparency={1}
						>
							<uicorner CornerRadius={new UDim(0, 64)}></uicorner>
							<uistroke
								ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
								Color={lerpBinding(onClickAnimation, colors.grey, colors.lightblue)}
								LineJoinMode={Enum.LineJoinMode.Round}
								Thickness={1.5}
							></uistroke>

							<Frame
								anchorPoint={new Vector2(0.5, 0.5)}
								position={lerpBinding(
									onClickAnimation,
									new UDim2(0.282, 0, 0.5, 0),
									new UDim2(0.718, 0, 0.5, 0),
								)}
								size={new UDim2(0.32, 0, 0.624, 0)}
								backgroundColor={lerpBinding(onClickAnimation, colors.grey, colors.lightblue)}
							>
								<uicorner CornerRadius={new UDim(0, 64)}></uicorner>

								<Image
									anchorPoint={new Vector2(0.5, 0.5)}
									position={new UDim2(0.5, 0, 0.5, 0)}
									size={new UDim2(2.5, 0, 2.5, 0)}
									image={IMAGES.ui.Glow}
									imageColor={colors.lightblue}
									imageTransparency={lerpBinding(onClickAnimation, 1, 0.8)}
								></Image>
							</Frame>
						</Frame>
					</Button>

					<Text
						anchorPoint={new Vector2(1, 0.5)}
						position={new UDim2(1, 0, 0.5, 0)}
						size={new UDim2(0.237, 0, 1, 0)}
						font={fonts.josefinSans.medium}
						text={"ON"}
						textSize={15}
						textColor={lerpBinding(onClickAnimation, colors.grey, colors.lightblue)}
						textXAlignment={Enum.TextXAlignment.Center}
						textYAlignment={Enum.TextYAlignment.Center}
					>
						<Image
							anchorPoint={new Vector2(0.5, 0.5)}
							position={new UDim2(0.41, 0, 0.5, 0)}
							size={new UDim2(1.5, 0, 1.5, 0)}
							image={IMAGES.ui.Glow}
							imageTransparency={lerpBinding(onClickAnimation, 1, 0.9)}
							imageColor={colors.lightblue}
						></Image>
					</Text>
				</Frame>
			</Frame>

			<Frame
				anchorPoint={new Vector2(0.5, 0.5)}
				position={new UDim2(0.5, 0, 0.796, 0)}
				size={new UDim2(0.915, 0, 0.366, 0)}
				backgroundTransparency={1}
			>
				<Text
					anchorPoint={new Vector2(0, 0)}
					position={lerpBinding(onMountAnimation, new UDim2(-0.25, 0, 0, 0), new UDim2(0, 0, 0, 0))}
					size={new UDim2(0.582, 0, 0.18, 0)}
					font={fonts.josefinSans.medium}
					text={"Power Graph (Blue) :"}
					textSize={19}
					textColor={colors.white}
					textTransparency={onMountAnimation.map((value) => 1 - value)}
					textXAlignment={Enum.TextXAlignment.Left}
					textYAlignment={Enum.TextYAlignment.Top}
				></Text>

				<InfoPanelPowerGraph
					attachment={
						structureModel?.Name === "Power Switch"
							? structureModel
									.GetDescendants()
									.find(
										(instance): instance is Attachment =>
											instance.IsA("Attachment") &&
											instance.Name === "PowerAttachment" &&
											instance.Parent?.Name === "Blue",
									)!
							: undefined
					}
					graphWidth={370}
					graphHeight={163}
					infoIconSize={new UDim2(0.076, 0, 0.51, 0)}
				></InfoPanelPowerGraph>
			</Frame>
		</BaseInfoPanel>
	);
}
