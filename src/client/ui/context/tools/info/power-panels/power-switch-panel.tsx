import React from "@rbxts/react";
import { Text } from "client/ui/core/text";
import { fonts, colors, springs } from "client/ui/constants";
import { Frame } from "client/ui/core/frame";
import { useSelector } from "@rbxts/react-reflex";
import { selectInfoSelectionStructureModel, selectInfoStructureAttribute } from "client/store/context/info";
import { lerpBinding, useMotion, useUpdateEffect } from "@rbxts/pretty-react-hooks";
import { BaseInfoPanel } from "../base-panel";
import { InfoPanelPowerGraph } from "./power-graph";
import { Image } from "client/ui/core/image";
import { IMAGES } from "shared/assets/images";
import { Button } from "client/ui/core/button";
import { store } from "client/store";
import { useRem } from "client/hooks/use-rem";

export function PowerSwitchInfoPanel() {
	const rem = useRem();

	const structureModel = useSelector(selectInfoSelectionStructureModel);
	const on = useSelector(selectInfoStructureAttribute("on"));

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
			structuresNames={["Power Switch"]}
			size={new UDim2(0, rem(407), 0, rem(791))}
			//
			headerSize={new UDim2(1, 0, 0.086, 0)}
			headerIconSize={new UDim2(0.06, 0, 0.36, 0)}
			descriptionPosition={new UDim2(0.457, 0, 0.132, 0)}
			descriptionSize={new UDim2(0.829, 0, 0.047, 0)}
		>
			<Frame
				anchorPoint={new Vector2(0.5, 0.5)}
				position={new UDim2(0.5, 0, 0.362, 0)}
				size={new UDim2(0.915, 0, 0.374, 0)}
				backgroundTransparency={1}
			>
				<Text
					position={lerpBinding(onMountAnimation, new UDim2(-0.25, 0, 0, 0), new UDim2(0, 0, 0, 0))}
					size={new UDim2(0.582, 0, 0.18, 0)}
					font={fonts.josefinSans.medium}
					text={"Power Graph A :"}
					textSize={19}
					textTransparency={onMountAnimation.map((value) => 1 - value)}
					textColor={colors.white}
					textXAlignment={Enum.TextXAlignment.Left}
					textYAlignment={Enum.TextYAlignment.Top}
				></Text>

				<InfoPanelPowerGraph
					powerAttachment={
						structureModel?.Name === "Power Switch"
							? structureModel
									.GetDescendants()
									.find(
										(instance): instance is Attachment =>
											instance.IsA("Attachment") &&
											instance.Name === "PowerAttachment" &&
											instance.GetAttribute("Id") === "A",
									)!
							: undefined
					}
					graphWidth={364}
					graphHeight={146}
					infoIconSize={new UDim2(0.076, 0, 0.49, 0)}
				></InfoPanelPowerGraph>
			</Frame>

			<Frame
				anchorPoint={new Vector2(0.5, 0.5)}
				position={new UDim2(0.326, 0, 0.58, 0)}
				size={new UDim2(0.564, 0, 0.034, 0)}
				backgroundTransparency={1}
			>
				<Text
					anchorPoint={new Vector2(0, 0.5)}
					position={new UDim2(0, 0, 0.5, 0)}
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
						text={"OFF :"}
						textSize={15}
						textColor={colors.grey}
						textXAlignment={Enum.TextXAlignment.Left}
						textYAlignment={Enum.TextYAlignment.Center}
					></Text>

					<Button
						anchorPoint={new Vector2(0.5, 0.5)}
						position={new UDim2(0.5, 0, 0.5, 0)}
						size={new UDim2(0.32, 0, 1, 0)}
						backgroundTransparency={1}
						onClick={() => {
							store.setInfoStructuresAttribute("on", on === true ? false : true);
						}}
					>
						<Frame size={new UDim2(1, 0, 1, 0)} backgroundTransparency={1}>
							<uicorner CornerRadius={new UDim(0, 64)}></uicorner>
							<uistroke
								ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
								Color={lerpBinding(onClickAnimation, colors.grey, colors.lightblue)}
								LineJoinMode={Enum.LineJoinMode.Miter}
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
									imageTransparency={lerpBinding(onClickAnimation, 1, 0.6)}
								></Image>
							</Frame>
						</Frame>
					</Button>

					<Text
						anchorPoint={new Vector2(1, 0.5)}
						position={new UDim2(1, 0, 0.5, 0)}
						size={new UDim2(0.237, 0, 1, 0)}
						font={fonts.josefinSans.medium}
						text={"ON :"}
						textSize={15}
						textColor={lerpBinding(onClickAnimation, colors.grey, colors.lightblue)}
						textXAlignment={Enum.TextXAlignment.Left}
						textYAlignment={Enum.TextYAlignment.Center}
					>
						<Image
							anchorPoint={new Vector2(0.5, 0.5)}
							position={new UDim2(0.5, 0, 0.5, 0)}
							size={new UDim2(1.5, 0, 1.5, 0)}
							image={IMAGES.ui.Glow}
							imageTransparency={lerpBinding(onClickAnimation, 1, 0.8)}
						></Image>
					</Text>
				</Frame>
			</Frame>

			<Frame
				anchorPoint={new Vector2(0.5, 0.5)}
				position={new UDim2(0.5, 0, 0.8, 0)}
				size={new UDim2(0.915, 0, 0.374, 0)}
				backgroundTransparency={1}
			>
				<Text
					position={lerpBinding(onMountAnimation, new UDim2(-0.25, 0, 0, 0), new UDim2(0, 0, 0, 0))}
					size={new UDim2(0.582, 0, 0.18, 0)}
					font={fonts.josefinSans.medium}
					text={"Power Graph B :"}
					textSize={19}
					textTransparency={onMountAnimation.map((value) => 1 - value)}
					textColor={colors.white}
					textXAlignment={Enum.TextXAlignment.Left}
					textYAlignment={Enum.TextYAlignment.Top}
				></Text>

				<InfoPanelPowerGraph
					powerAttachment={
						structureModel?.Name === "Power Switch"
							? structureModel
									.GetDescendants()
									.find(
										(instance): instance is Attachment =>
											instance.IsA("Attachment") &&
											instance.Name === "PowerAttachment" &&
											instance.GetAttribute("Id") === "B",
									)!
							: undefined
					}
					graphWidth={364}
					graphHeight={146}
					infoIconSize={new UDim2(0.076, 0, 0.49, 0)}
				></InfoPanelPowerGraph>
			</Frame>
		</BaseInfoPanel>
	);
}
