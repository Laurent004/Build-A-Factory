import React from "@rbxts/react";
import { Text } from "client/ui/core/text";
import { fonts, colors, springs } from "client/ui/constants";
import { Frame } from "client/ui/core/frame";
import { useSelector } from "@rbxts/react-reflex";
import { selectInfoSelectionStructureModel } from "client/store/context/info";
import { lerpBinding, useMotion, useUpdateEffect } from "@rbxts/pretty-react-hooks";
import { BaseInfoPanel } from "../base-panel";
import { InfoPanelPowerGraph } from "./power-graph";
import { useRem } from "client/hooks/use-rem";

export function PowerPoleInfoPanel() {
	const rem = useRem();

	const structureModel = useSelector(selectInfoSelectionStructureModel);

	const [onMountAnimation, onMountAnimationMotion] = useMotion(0);

	useUpdateEffect(() => {
		onMountAnimationMotion.spring(structureModel?.Name === "Power Pole" ? 1 : 0, springs.gentle);
	}, [structureModel]);

	return (
		<BaseInfoPanel
			structuresNames={["Power Pole"]}
			size={new UDim2(0, rem(407), 0, rem(490))}
			//
			headerSize={new UDim2(1, 0, 0.086, 0)}
			headerIconSize={new UDim2(0.057, 0, 0.56, 0)}
			descriptionPosition={new UDim2(0.459, 0, 0.16, 0)}
			descriptionSize={new UDim2(0.829, 0, 0.076, 0)}
		>
			<Frame
				anchorPoint={new Vector2(0.5, 0.5)}
				position={new UDim2(0.5, 0, 0.597, 0)}
				size={new UDim2(0.915, 0, 0.734, 0)}
				backgroundTransparency={1}
			>
				<Text
					position={lerpBinding(onMountAnimation, new UDim2(-0.25, 0, 0, 0), new UDim2(0, 0, 0, 0))}
					size={new UDim2(0.424, 0, 0.062, 0)}
					font={fonts.josefinSans.medium}
					text={"Power Graph :"}
					textSize={19}
					textTransparency={onMountAnimation.map((value) => 1 - value)}
					textColor={colors.white}
					textXAlignment={Enum.TextXAlignment.Left}
					textYAlignment={Enum.TextYAlignment.Top}
				></Text>

				<InfoPanelPowerGraph
					powerAttachment={
						structureModel?.Name === "Power Pole"
							? structureModel
									.GetDescendants()
									.find(
										(instance): instance is Attachment =>
											instance.IsA("Attachment") && instance.Name === "PowerAttachment",
									)!
							: undefined
					}
					graphWidth={371}
					graphHeight={207}
					infoIconSize={new UDim2(0.076, 0, 0.395, 0)}
				></InfoPanelPowerGraph>
			</Frame>
		</BaseInfoPanel>
	);
}
